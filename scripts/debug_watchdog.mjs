import { createWatchdog } from "../server/lib/file_watch/watchdog.js";
import { createRuntimeParams } from "../server/lib/utils/runtime_params.js";
import { FILE_WATCH_CONFIG_PATH, PROJECT_ROOT } from "../server/config.js";

async function main() {
  const runtimeParams = await createRuntimeParams(PROJECT_ROOT, {
    env: process.env,
    overrides: {}
  });

  const watchdog = createWatchdog({
    configPath: FILE_WATCH_CONFIG_PATH,
    projectRoot: PROJECT_ROOT,
    runtimeParams
  });

  await watchdog.start();

  const pathIndex = watchdog.getIndex("path_index") || {};
  const userIndex = watchdog.getIndex("user_index");
  const adminRecord = userIndex?.getUser ? userIndex.getUser("admin") : null;

  const output = {
    CUSTOMWARE_PATH: runtimeParams.get("CUSTOMWARE_PATH", ""),
    CUSTOMWARE_WATCHDOG: runtimeParams.get("CUSTOMWARE_WATCHDOG", ""),
    pathIndexCount: Object.keys(pathIndex).length,
    seesAdminDir: Object.prototype.hasOwnProperty.call(pathIndex, "/app/L2/admin/"),
    seesAdminUserYaml: Object.prototype.hasOwnProperty.call(pathIndex, "/app/L2/admin/user.yaml"),
    seesAdminPasswordPath: Object.prototype.hasOwnProperty.call(pathIndex, "/app/L2/admin/meta/password.json"),
    seesAdminLoginsPath: Object.prototype.hasOwnProperty.call(pathIndex, "/app/L2/admin/meta/logins.json"),
    userIndexHasAdmin: Boolean(adminRecord),
    adminRecord
  };

  console.log(JSON.stringify(output, null, 2));

  watchdog.stop();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

