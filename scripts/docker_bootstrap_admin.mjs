import fs from "node:fs";
import path from "node:path";

import { loadAuthKeys } from "../server/lib/auth/keys_manage.js";
import { createUser, setUserPassword } from "../server/lib/auth/user_manage.js";
import { getAppPathRoots } from "../server/lib/customware/layout.js";
import { createRuntimeParams } from "../server/lib/utils/runtime_params.js";

const PROJECT_ROOT = "/app";
const USERNAME = String(process.env.DOCKER_ADMIN_USERNAME || "admin").trim();
const PASSWORD = String(process.env.DOCKER_ADMIN_PASSWORD || "RAFAatlas");

async function main() {
  if (!USERNAME || !PASSWORD) {
    throw new Error("DOCKER_ADMIN_USERNAME and DOCKER_ADMIN_PASSWORD must be non-empty.");
  }

  loadAuthKeys(PROJECT_ROOT);

  const runtimeParams = await createRuntimeParams(PROJECT_ROOT, {
    env: process.env,
    overrides: {}
  });
  const roots = getAppPathRoots(PROJECT_ROOT, runtimeParams);
  const userYamlPath = path.join(roots.l2Dir, USERNAME, "user.yaml");
  const userExists = fs.existsSync(userYamlPath);

  if (!userExists) {
    createUser(PROJECT_ROOT, USERNAME, PASSWORD, {
      fullName: "Admin",
      groups: ["_admin"],
      runtimeParams
    });
    console.log(`OK: created Docker admin user "${USERNAME}".`);
    return;
  }

  setUserPassword(PROJECT_ROOT, USERNAME, PASSWORD, {
    runtimeParams
  });
  console.log(`OK: reset Docker admin password for "${USERNAME}".`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
