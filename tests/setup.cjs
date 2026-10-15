const { DatabaseSync } = require("node:sqlite");
const { readFileSync, readdirSync, rmSync } = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

module.exports = async function setup() {
  const root = path.resolve(__dirname, "..");
  const filename = path.join(root, "prisma", "roam-test.db");
  // This test database is separate from the application's roam.db.
  rmSync(filename, { force: true });
  const database = new DatabaseSync(filename);
  const migrations = path.join(root, "prisma", "migrations");
  for (const directory of readdirSync(migrations)
    .filter((name) => /^\d+_/.test(name))
    .sort()) {
    database.exec(
      readFileSync(path.join(migrations, directory, "migration.sql"), "utf8"),
    );
  }
  database.close();
  execFileSync(process.execPath, ["prisma/seed.cjs"], {
    cwd: root,
    env: { ...process.env, RENTAL_DATABASE_URL: "file:./roam-test.db" },
    stdio: "pipe",
  });
};
