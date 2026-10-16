import nextEnv from "@next/env";
import { retrySpecificationContacts } from "../lib/specification-crm.ts";

nextEnv.loadEnvConfig(process.cwd());
try {
  const result = await retrySpecificationContacts();
  console.log("CRM retry results:", result);
  if (result.failed > 0) process.exitCode = 1;
} catch (error) {
  console.error("CRM retry failed. Check database and CRM configuration.", {
    type: error instanceof Error ? error.name : "UnknownError",
  });
  process.exitCode = 1;
}
