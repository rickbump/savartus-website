import {
  createRequestServices,
  parseSpecificationRequest,
  SpecificationRequestError,
  submitSpecificationRequest,
} from "@/lib/specification-requests";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "This request must come from this website." }, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return Response.json({ error: "Please submit the form as JSON." }, { status: 415 });
  }

  let stage = "reading form";
  try {
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 4096) {
          await reader.cancel();
          return Response.json({ error: "The request is too large." }, { status: 413 });
        }
        chunks.push(value);
      }
    }
    const body = Buffer.concat(chunks).toString("utf8");

    let data: unknown;
    try {
      data = JSON.parse(body);
    } catch {
      return Response.json({ error: "The form could not be read. Please try again." }, { status: 400 });
    }

    if (data && typeof data === "object" && "website" in data && data.website) {
      return Response.json({ error: "The request could not be accepted." }, { status: 400 });
    }

    const details = parseSpecificationRequest(data);
    stage = "configuring services";
    const services = createRequestServices();
    stage = "saving request and emailing link";
    await submitSpecificationRequest(details, services);
    return Response.json({ success: true }, { status: 202 });
  } catch (error) {
    if (error instanceof SpecificationRequestError) {
      return Response.json(
        { error: error.message },
        {
          status: error.status,
          headers: error.retryAfter ? { "Retry-After": String(error.retryAfter) } : undefined,
        },
      );
    }

    // Provider errors can contain personal information; only log safe diagnostics.
    console.error("Specification request failed", {
      stage,
      type: error instanceof Error ? error.name : "UnknownError",
      status: typeof error === "object" && error !== null && "statusCode" in error
        ? error.statusCode
        : undefined,
    });
    return Response.json(
      { error: "We couldn't email your link right now. Please try again shortly, or contact info@savartus.com." },
      { status: 503 },
    );
  }
}
