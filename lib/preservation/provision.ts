import * as cloutility from "./cloutility";
import {
  accountById,
  accountName,
  claimForProvisioning,
  markActive,
  markFailed,
  MAX_PROVISIONING_ATTEMPTS,
  saveStep,
  type Account,
} from "./accounts";
import { cloutilityConfig, tierCloutilitySubscription } from "./config";
import { setPasswordUrl } from "@/lib/account/emails";
import { connectSpace } from "@/lib/account/setup";
import { createSigninToken, hasPassword, WELCOME_LINK_MINUTES } from "@/lib/account/store";
import { sendStaffAlert, sendWelcomeEmail } from "./notify";
import { findTier } from "./tiers";

// A failure a retry cannot fix; the account waits for staff.
class HoldForStaff extends Error {}

// Names and references carry the account ID so a retried step can find what an
// earlier, interrupted run already created instead of creating a duplicate.
function shortId(account: Account) {
  return account.id.slice(0, 8);
}

function businessUnitName(account: Account) {
  return `${accountName(account)} (${shortId(account)})`;
}

// Written to the contract's ErpReference; Cloutility includes it on every
// billing-data line, which is how usage is matched back to this account.
export function erpReference(account: Pick<Account, "id">) {
  return `savartus-${account.id}`;
}

// S3 names: lowercase letters, digits and hyphens.
function s3Name(account: Account) {
  return `pres-${shortId(account)}`;
}

// Runs every provisioning step not yet recorded for the account. Safe to call
// repeatedly: completed steps are skipped and each create checks for an
// existing object first.
export async function provisionAccount(accountId: string) {
  const account = await claimForProvisioning(accountId);
  if (!account) return "skipped" as const;

  try {
    const config = cloutilityConfig();
    const tier = findTier(account.tier);
    if (!tier) throw new Error(`Unknown tier ${account.tier}`);
    const startDate = (account.paid_at ? new Date(account.paid_at) : new Date()).toISOString().slice(0, 10);
    const reference = erpReference(account);
    const contract = async () => ({
      erpReference: reference,
      subscriptionId: tierCloutilitySubscription(tier),
      billingCycleId: await cloutility.monthlyBillingCycleId(),
      currency: await cloutility.subscriptionCurrency(config.parentBunitId, tierCloutilitySubscription(tier)),
      startDate,
    });

    // 1. Business unit for the customer under the self-service parent, created
    //    with its contract (tier subscription + our ERP reference).
    let bunitId = account.cloutility_bunit_id;
    if (!bunitId) {
      const name = businessUnitName(account);
      bunitId = (await cloutility.findChildBusinessUnit(config.parentBunitId, name)) ?? null;
      if (!bunitId) {
        const parent = await cloutility.getBusinessUnit(config.parentBunitId);
        bunitId = await cloutility.createChildBusinessUnit(config.parentBunitId, {
          name,
          timeZone: cloutility.field(parent, "timeZone"),
          ...(await contract()),
        });
      }
      await saveStep(account.id, "cloutility_bunit_id", bunitId);
    }

    // 2. Confirm the contract carries our ERP reference (creating it if a unit
    //    somehow exists without one).
    if (!account.cloutility_contract_erp_reference) {
      const existing = await cloutility.getContractErpReference(bunitId);
      if (!existing) await cloutility.createContract(bunitId, await contract());
      else if (existing !== reference) {
        throw new Error(`Business unit ${bunitId} has an unexpected contract reference ${existing}`);
      }
      await saveStep(account.id, "cloutility_contract_erp_reference", reference);
    }

    // 3. (No Cloutility portal login: customers sign in to the Savartus
    //    account space instead; see step 7.)

    // 4. S3 Optical user (holds the S3 access key and secret).
    let orainUserId = account.cloutility_orain_user_id;
    if (!orainUserId) {
      const userName = s3Name(account);
      orainUserId =
        (await cloutility.findOrainUser(bunitId, userName)) ??
        (await cloutility.createOrainUser(bunitId, { name: accountName(account), userName, email: account.email }));
      await saveStep(account.id, "cloutility_orain_user_id", orainUserId);
    }

    // 5. Consumption unit the bucket's storage is reported and billed on.
    let consumerId = account.cloutility_consumer_id;
    if (!consumerId) {
      consumerId =
        (await cloutility.findConsumer(bunitId, account.id)) ??
        (await cloutility.createConsumer(bunitId, {
          name: `Optical preservation (${shortId(account)})`,
          externalReference: account.id,
          billingStartDate: startDate,
        }));
      await saveStep(account.id, "cloutility_consumer_id", consumerId);
    }

    // 6. Bucket from the preservation preset (burn mode, disc type, RAID).
    let bucketName: string | undefined;
    if (!account.cloutility_bucket_created) {
      const existing = await cloutility.getOrainBucket(bunitId, consumerId);
      bucketName = cloutility.field<string>(existing, "name");
      if (!existing) {
        bucketName = (await cloutility.suggestedBucketName(bunitId, consumerId)) ?? s3Name(account);
        await cloutility.createOrainBucket(bunitId, consumerId, { name: bucketName, orainUserId });
      }
      await saveStep(account.id, "cloutility_bucket_created", true);
    }

    // 7. Account space: record the bucket and S3 user, issue the S3 secret,
    //    and make the subscriber the space's admin.
    const admin = await connectSpace((await accountById(account.id))!);

    await markActive(account.id);
    // New customers choose a password from the welcome email (link valid 7 days).
    const token = (await hasPassword(admin.id)) ? undefined : await createSigninToken(admin.id, WELCOME_LINK_MINUTES);
    await sendWelcomeEmail(account, token ? setPasswordUrl(token) : undefined);
    return "active" as const;
  } catch (error) {
    const hold = error instanceof HoldForStaff;
    const message = error instanceof Error ? error.message : "Unknown provisioning error";
    // Messages are built from status codes and Cloutility's developerMessage,
    // not customer data; serverStack names the failing Cloutility code line.
    console.error("Preservation provisioning failed", {
      accountId,
      message,
      serverStack: error instanceof cloutility.CloutilityError ? error.serverStack : undefined,
    });
    const attempts = await markFailed(account.id, message, { hold });

    // Alert staff on the first failure, when an account is held, and when
    // automatic retries run out; not on every retry in between.
    if (hold || attempts === 1 || attempts === MAX_PROVISIONING_ATTEMPTS) {
      await sendStaffAlert(account, hold ? "Signup held for staff" : "Provisioning failed", [
        `Error: ${message}`,
        `Attempts: ${attempts ?? "?"} of ${MAX_PROVISIONING_ATTEMPTS}`,
        hold || attempts === MAX_PROVISIONING_ATTEMPTS
          ? "Automatic retries have stopped. Fix the cause, then set provisioning_attempts = 0 to resume."
          : "The retry job will try again automatically.",
      ]);
    }
    return "failed" as const;
  }
}
