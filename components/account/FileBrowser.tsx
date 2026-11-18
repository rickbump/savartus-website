"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { formatBytes, formatDate } from "@/lib/account/format";

type Status = "cache" | "disc" | "restoring" | "restored";
type FileEntry = { key: string; name: string; size: number; modified: string | null; status: Status; restoredUntil?: string | null };
type Folder = { key: string; name: string };
type Upload = { name: string; progress: number; error?: string; done?: boolean };
type Picked = { file: File; path: string };

// Turns a path from the browser or typed by a person into folder/sub/file
// form: forward slashes, no leading slash, "C:" becomes "C", and no empty,
// "." or ".." parts.
function cleanPath(path: string) {
  return path
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => part.trim().replace(/^([A-Za-z]):$/, "$1"))
    .filter((part) => part && part !== "." && part !== "..")
    .join("/");
}

// Files chosen with the file or folder picker; the folder picker gives each
// file's path from the chosen folder down (webkitRelativePath).
function pickedFromInput(list: FileList) {
  return Array.from(list).map((file) => ({ file, path: cleanPath(file.webkitRelativePath || file.name) }));
}

// Files dropped on the page, walking into dropped folders so their structure
// is kept. Browsers never reveal the drive or the path above the dropped item.
async function pickedFromDrop(transfer: DataTransfer): Promise<Picked[]> {
  const entries = Array.from(transfer.items)
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry));
  if (!entries.length) return Array.from(transfer.files).map((file) => ({ file, path: cleanPath(file.name) }));

  const picked: Picked[] = [];
  async function walk(entry: FileSystemEntry, parent: string): Promise<void> {
    const path = parent ? `${parent}/${entry.name}` : entry.name;
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject));
      picked.push({ file, path: cleanPath(path) });
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      // readEntries returns at most ~100 entries per call.
      for (;;) {
        const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
        if (!batch.length) break;
        for (const child of batch) await walk(child, path);
      }
    }
  }
  for (const entry of entries) await walk(entry, "");
  return picked;
}

const statusText: Record<Status, string> = {
  cache: "Being written to disc",
  disc: "On disc",
  restoring: "Restoring from disc…",
  restored: "Ready to download",
};

// Single PUT to the signed link, with progress.
function put(url: string, file: File, contentType: string, onProgress: (fraction: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", contentType);
    request.upload.onprogress = (event) => event.lengthComputable && onProgress(event.loaded / event.total);
    request.onload = () => (request.status >= 200 && request.status < 300 ? resolve() : reject(new Error(`Upload failed (${request.status})`)));
    request.onerror = () => reject(new Error("Upload failed: the connection to the library was interrupted."));
    request.send(file);
  });
}

export function FileBrowser({ spaceId }: { spaceId: string }) {
  const api = `/api/account/${spaceId}/files`;
  const [prefix, setPrefix] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [search, setSearch] = useState<string | null>(null);
  const [searchNote, setSearchNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // React has no prop for the folder picker attribute.
    folderInput.current?.setAttribute("webkitdirectory", "");
  }, []);

  const load = useCallback(
    async (options: { prefix?: string; token?: string; query?: string | null } = {}) => {
      setLoading(true);
      setError(null);
      const query = options.query !== undefined ? options.query : null;
      const params = new URLSearchParams(
        query ? { q: query } : { prefix: options.prefix ?? "", ...(options.token ? { token: options.token } : {}) },
      );
      try {
        const response = await fetch(`${api}?${params}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Files couldn't be loaded.");
        if (query) {
          setFolders([]);
          setFiles(data.files);
          setNextToken(undefined);
          setSearchNote(
            data.limited ? "Showing the first 200 matches." : data.complete ? null : "This space is very large; only part of it was searched.",
          );
        } else {
          setFolders((current) => (options.token ? [...current, ...data.folders] : data.folders));
          setFiles((current) => (options.token ? [...current, ...data.files] : data.files));
          setNextToken(data.nextToken);
          setSearchNote(null);
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Files couldn't be loaded.");
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  useEffect(() => {
    // Initial load of the top folder (subsequent loads come from user actions).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load({ prefix: "" });
  }, [load]);

  function openFolder(next: string) {
    setSearch(null);
    setPrefix(next);
    setMessage(null);
    void load({ prefix: next });
  }

  function refresh() {
    void (search ? load({ query: search }) : load({ prefix }));
  }

  async function act(action: "download" | "restore", file: FileEntry) {
    setError(null);
    setMessage(null);
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, key: file.key }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "That didn't work. Please try again.");
      return;
    }
    if (action === "download") {
      window.location.assign(data.url);
    } else {
      setMessage(`Restoring ${file.name} from disc. This usually takes a few minutes; refresh to check.`);
      setFiles((current) => current.map((item) => (item.key === file.key ? { ...item, status: data.status } : item)));
    }
  }

  async function uploadAll(chosen: Picked[]) {
    chosen = chosen.filter((item) => item.path);
    if (!chosen.length) return;
    setError(null);
    setMessage(null);
    setUploads(chosen.map((item) => ({ name: item.path, progress: 0 })));
    const update = (index: number, change: Partial<Upload>) =>
      setUploads((current) => current.map((item, i) => (i === index ? { ...item, ...change } : item)));

    async function uploadOne(item: Picked, index: number) {
      const key = `${prefix}${item.path}`;
      try {
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "upload", key, size: item.file.size, contentType: item.file.type || "application/octet-stream" }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Upload couldn't start.");
        await put(data.url, item.file, data.contentType, (progress) => update(index, { progress }));
        await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "uploaded", key }) });
        update(index, { progress: 1, done: true });
      } catch (caught) {
        update(index, { error: caught instanceof Error ? caught.message : "Upload failed." });
      }
    }

    // Three at a time, so a folder of many small files moves quickly.
    let next = 0;
    await Promise.all(
      Array.from({ length: Math.min(3, chosen.length) }, async () => {
        while (next < chosen.length) {
          const index = next++;
          await uploadOne(chosen[index], index);
        }
      }),
    );
    void load({ prefix });
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    if (!query) return clearSearch();
    setSearch(query);
    void load({ query });
  }

  function clearSearch() {
    setSearch(null);
    void load({ prefix });
  }

  function newFolder() {
    const typed = window.prompt("Folder name, or a path such as C/Projects/2024");
    const name = typed ? cleanPath(typed) : "";
    if (!name) return;
    // S3 has no empty folders: the folder appears once a file is uploaded into it.
    openFolder(`${prefix}${name}/`);
    setMessage(`Folder “${name}” is ready. Upload files into it; it's kept once it has a file.`);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (!search) void pickedFromDrop(event.dataTransfer).then(uploadAll);
  }

  const crumbs = prefix.split("/").filter(Boolean);

  return (
    <div
      className={`account-files ${dragging ? "is-dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!search) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="account-files-toolbar">
        <form onSubmit={onSearch} className="account-search" role="search">
          <input name="q" type="search" placeholder="Search file names" defaultValue={search ?? ""} aria-label="Search file names" />
          <button type="submit" className="button button-secondary">
            Search
          </button>
        </form>
        <div className="account-files-actions">
          <button type="button" className="button button-secondary" onClick={refresh}>
            Refresh
          </button>
          {!search && (
            <>
              <button type="button" className="button button-secondary" onClick={newFolder}>
                New folder
              </button>
              <button type="button" className="button button-primary" onClick={() => fileInput.current?.click()}>
                Upload files
              </button>
            </>
          )}
        </div>
      </div>

      {search ? (
        <p className="account-crumbs">
          Results for “{search}” · <button type="button" className="account-link-button" onClick={clearSearch}>Back to folders</button>
          {searchNote && <span className="account-muted"> · {searchNote}</span>}
        </p>
      ) : (
        <p className="account-crumbs">
          <button type="button" className="account-link-button" onClick={() => openFolder("")}>
            All files
          </button>
          {crumbs.map((part, index) => (
            <span key={index}>
              {" / "}
              <button type="button" className="account-link-button" onClick={() => openFolder(`${crumbs.slice(0, index + 1).join("/")}/`)}>
                {part}
              </button>
            </span>
          ))}
        </p>
      )}

      {!search && (
        <div className={`account-dropzone ${dragging ? "is-active" : ""}`}>
          <p>
            <strong>Drop files or folders here</strong> to upload them to{" "}
            <strong>{prefix ? prefix.slice(0, -1) : "All files"}</strong>.
          </p>
          <p className="account-small">
            <button type="button" className="account-link-button" onClick={() => fileInput.current?.click()}>
              Choose files
            </button>{" "}
            or{" "}
            <button type="button" className="account-link-button" onClick={() => folderInput.current?.click()}>
              choose a folder
            </button>
          </p>
          <div className="account-path-note">
            <p>
              <strong>Check the folder before you upload. Files can&apos;t be moved or renamed afterward.</strong>{" "}
              Preserved files are written once to optical disc, so the path a file is saved under is
              permanent. It&apos;s how you and your team will find the file and tell it apart from
              others for years. Uploading again to a different folder stores, and bills, a second copy.
            </p>
            <p>
              <strong>What path is saved:</strong> the folder you&apos;re in here, plus the path from the
              folder you drop downward. Dropping <code>Projects</code> here saves{" "}
              <code>{prefix}Projects/2024/report.pdf</code>.
            </p>
            <p>
              <strong>Your drive letter and the folders above the one you drop are not saved.</strong>{" "}
              Browsers never share them with websites. To keep the full path, for example{" "}
              <code>C/Users/Rick/Projects/2024/report.pdf</code>, first click <strong>New folder</strong>{" "}
              and type <code>C/Users/Rick</code>, then drop <code>Projects</code> into it.
            </p>
          </div>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) void uploadAll(pickedFromInput(event.target.files));
              event.target.value = "";
            }}
          />
          <input
            ref={folderInput}
            type="file"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) void uploadAll(pickedFromInput(event.target.files));
              event.target.value = "";
            }}
          />
        </div>
      )}

      {error && <p className="preservation-error" role="alert">{error}</p>}
      {message && <p className="account-notice" role="status">{message}</p>}

      {uploads.length > 0 && (
        <p className="account-small">
          {uploads.filter((upload) => upload.done).length} of {uploads.length} uploaded
          {uploads.some((upload) => upload.error) && (
            <span className="account-warning"> · {uploads.filter((upload) => upload.error).length} not uploaded (see below)</span>
          )}
        </p>
      )}
      {uploads.length > 0 && (
        <ul className="account-uploads">
          {/* Large folders: list problems first, then the first 200. */}
          {[...uploads.filter((upload) => upload.error), ...uploads.filter((upload) => !upload.error)].slice(0, 200).map((upload, index) => (
            <li key={index}>
              <span>{upload.name}</span>
              {upload.error ? (
                <span className="account-warning">{upload.error}</span>
              ) : upload.done ? (
                <span>Uploaded</span>
              ) : (
                <progress max={1} value={upload.progress} />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="account-table-wrap">
        <table className="account-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Added</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {folders.map((folder) => (
              <tr key={folder.key}>
                <td colSpan={5}>
                  <button type="button" className="account-folder" onClick={() => openFolder(folder.key)}>
                    📁 {folder.name}
                  </button>
                </td>
              </tr>
            ))}
            {files.map((file) => (
              <tr key={file.key}>
                <td className="account-file-name" title={file.key}>
                  {search ? file.key : file.name}
                </td>
                <td>{formatBytes(file.size)}</td>
                <td>{formatDate(file.modified)}</td>
                <td>
                  <span className={`account-status status-${file.status}`}>{statusText[file.status]}</span>
                  {file.status === "restored" && file.restoredUntil && (
                    <span className="account-muted account-small"> until {formatDate(file.restoredUntil)}</span>
                  )}
                </td>
                <td className="account-row-actions">
                  {file.status === "disc" && (
                    <button type="button" className="account-link-button" onClick={() => act("restore", file)}>
                      Restore
                    </button>
                  )}
                  {(file.status === "cache" || file.status === "restored") && (
                    <button type="button" className="account-link-button" onClick={() => act("download", file)}>
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !folders.length && !files.length && (
              <tr>
                <td colSpan={5} className="account-empty">
                  {search ? "No file names match." : "No files here yet. Drag files onto this page, or click Upload files."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <p className="account-muted">Loading…</p>}
      {nextToken && !loading && (
        <button type="button" className="button button-secondary" onClick={() => load({ prefix, token: nextToken })}>
          Show more
        </button>
      )}
      <p className="account-muted account-small">
        Files are written once and kept unchanged; a file name can&apos;t be reused. New uploads sit in
        the library&apos;s cache until they&apos;re written to disc. Files on disc are restored to the
        cache before downloading.
      </p>
    </div>
  );
}
