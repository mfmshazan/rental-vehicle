const path = require("node:path");
const { execFileSync } = require("node:child_process");

// A separate database from the app's own DATABASE_URL so tests never touch real
// data. Override with DATABASE_URL_TEST to point at a Neon test branch in CI.
const TEST_DATABASE_URL =
  process.env.DATABASE_URL_TEST ||
  "postgresql://postgres:postgres@localhost:5432/roam_test?schema=public";

module.exports = async function setup() {
  const root = path.resolve(__dirname, "..");
  const prismaCli = path.join(root, "node_modules", "prisma", "build", "index.js");
  const env = {
    ...process.env,
    DATABASE_URL: TEST_DATABASE_URL,
    DIRECT_URL: TEST_DATABASE_URL,
  };
  // Drop + recreate the schema and re-apply every migration for a clean run.
  execFileSync(
    process.execPath,
    [prismaCli, "migrate", "reset", "--force", "--skip-generate"],
    { cwd: root, env, stdio: "pipe" },
  );
  execFileSync(process.execPath, ["prisma/seed.cjs"], {
    cwd: root,
    env,
    stdio: "pipe",
  });
};

module.exports.TEST_DATABASE_URL = TEST_DATABASE_URL;
