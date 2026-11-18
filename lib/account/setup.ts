import { accountName, type Account } from "@/lib/preservation/accounts";
import * as cloutility from "@/lib/preservation/cloutility";
import { seal } from "./crypto";
import { addMember, ensureUser, logActivity, saveS3Details } from "./store";

// Connects a provisioned space to the account space: records its bucket and S3
// user, issues and stores an S3 secret, and makes the subscriber its admin.
// Safe to repeat; each part is skipped once done.
export async function connectSpace(account: Account) {
  if (!account.cloutility_bunit_id || !account.cloutility_orain_user_id || !account.cloutility_consumer_id) {
    throw new Error("The space isn't fully provisioned in Cloutility yet");
  }
  const bunitId = account.cloutility_bunit_id;

  if (!account.bucket_name) {
    const bucket = await cloutility.getOrainBucket(bunitId, account.cloutility_consumer_id);
    const bucketName = cloutility.field<string>(bucket, "name");
    if (!bucketName) throw new Error("Cloutility has no bucket for this space");
    await saveS3Details(account.id, { bucketName });
  }
  if (!account.s3_access_key) {
    const accessKey = await cloutility.orainUserName(bunitId, account.cloutility_orain_user_id);
    if (!accessKey) throw new Error("Cloutility returned no S3 user name");
    await saveS3Details(account.id, { accessKey });
  }
  if (!account.s3_secret_enc) {
    const secret = await cloutility.renewS3Secret(bunitId, account.cloutility_orain_user_id);
    await saveS3Details(account.id, { secretSealed: seal(secret) });
  }

  const user = await ensureUser(account.email, account.name);
  if (await addMember(account.id, user.id, "admin", null)) {
    await logActivity(account.id, null, "space created", `${accountName(account)}; ${account.email} is the admin`);
  }
  return user;
}

// Issues a new S3 secret for the space. Software using the old one stops
// working. Returns the new secret so it can be shown to the admin once.
export async function renewSpaceSecret(account: Account, byUserId: string) {
  if (!account.cloutility_bunit_id || !account.cloutility_orain_user_id) throw new Error("The space has no S3 user");
  const secret = await cloutility.renewS3Secret(account.cloutility_bunit_id, account.cloutility_orain_user_id);
  await saveS3Details(account.id, { secretSealed: seal(secret) });
  await logActivity(account.id, byUserId, "S3 secret renewed");
  return secret;
}
