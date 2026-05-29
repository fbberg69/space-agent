import fs from "node:fs";

import { loadAuthKeys } from "../server/lib/auth/keys_manage.js";
import { openPasswordVerifierRecord } from "../server/lib/auth/passwords.js";

const projectRoot = "/app";
const authKeys = loadAuthKeys(projectRoot);
const passwordPath = "/srv/space/customware/L2/admin/meta/password.json";
const record = JSON.parse(fs.readFileSync(passwordPath, "utf8"));

const opened = openPasswordVerifierRecord(record, authKeys);

console.log(
  JSON.stringify(
    {
      passwordPath,
      authKeys: {
        hasPasswordSealKey: Boolean(authKeys?.passwordSealKey),
        passwordSealKeyLength: authKeys?.passwordSealKey?.length || 0
      },
      opened
    },
    null,
    2
  )
);

