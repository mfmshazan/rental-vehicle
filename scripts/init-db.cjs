const fs = require("node:fs");
const path = require("node:path");
require("@next/env").loadEnvConfig(process.cwd());
const url = process.env.RENTAL_DATABASE_URL;
if (!url || !url.startsWith("file:")) {
  console.error(
    "Set RENTAL_DATABASE_URL in .env to a SQLite file, for example file:./roam.db.",
  );
  process.exit(1);
}
const filename = path.resolve(process.cwd(), "prisma", url.slice(5));
fs.mkdirSync(path.dirname(filename), { recursive: true });
// Opening in append mode creates a missing file without truncating an existing database.
fs.closeSync(fs.openSync(filename, "a"));
