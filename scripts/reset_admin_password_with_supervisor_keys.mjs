import fs from "node:fs";

import { createRuntimeParams } from "../server/lib/utils/runtime_params.js";
import { setUserPassword } from "../server/lib/auth/user_manage.js";

function loadSupervisorKeys() {
  const parsed = JSON.parse(fs.readFileSync("/app/supervisor/auth/auth_keys.json", "utf8"));
  return {
    passwordSealKey: String(parsed?.password_seal_key || "").trim(),
    sessionHmacKey: String(parsed?.session_hmac_key || "").trim()
  };
}

async function main() {
  const { passwordSealKey, sessionHmacKey } = loadSupervisorKeys();

  if (!passwordSealKey || !sessionHmacKey) {
    throw new Error("Missing supervisor auth keys in /app/supervisor/auth/auth_keys.json");
  }

  process.env.SPACE_AUTH_PASSWORD_SEAL_KEY = passwordSealKey;
  process.env.SPACE_AUTH_SESSION_HMAC_KEY = sessionHmacKey;

  const runtimeParams = await createRuntimeParams("/app", { env: process.env, overrides: {} });

  setUserPassword("/app", "admin", "RAFAatlas", {
    runtimeParams
  });

  console.log("OK: reset admin password using supervisor auth keys.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

