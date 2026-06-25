import { loadAuthKeys } from "../server/lib/auth/keys_manage.js";
import { createRuntimeParams } from "../server/lib/utils/runtime_params.js";
import { setUserPassword } from "../server/lib/auth/user_manage.js";

async function main() {
  loadAuthKeys("/app");

  const runtimeParams = await createRuntimeParams("/app", { env: process.env, overrides: {} });

  setUserPassword("/app", "admin", "RAFAatlas", {
    runtimeParams
  });

  console.log("OK: reset admin password using server auth keys.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
