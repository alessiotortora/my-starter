#!/usr/bin/env bun
import { join } from "node:path";

const NAME_PATTERN = /^[a-z][a-z0-9-]{1,48}[a-z0-9]$/;
const OLD = "my-starter";
const TARGETS = ["package.json", "docker-compose.yml", "README.md"];

const newName = process.argv[2];
if (!newName) {
  console.error("Usage: bun scripts/rename.ts <new-name>");
  process.exit(1);
}
if (!NAME_PATTERN.test(newName)) {
  console.error(
    `Invalid name "${newName}". Must be lowercase letters, digits, and hyphens (3–50 chars, can't start/end with hyphen).`
  );
  process.exit(1);
}
if (newName === OLD) {
  console.error(`Name is already "${OLD}". Nothing to do.`);
  process.exit(0);
}

const root = join(import.meta.dir, "..");
let touched = 0;

for (const name of TARGETS) {
  const path = join(root, name);
  const content = await Bun.file(path).text();
  if (!content.includes(OLD)) {
    console.log(`  ${name}: (no matches)`);
    continue;
  }
  const count = content.split(OLD).length - 1;
  await Bun.write(path, content.replaceAll(OLD, newName));
  console.log(
    `  ${name}: ${count} occurrence${count === 1 ? "" : "s"} replaced`
  );
  touched++;
}

if (touched === 0) {
  console.log(`\nNo files matched "${OLD}". Already renamed?`);
  process.exit(0);
}

console.log(
  `\nRenamed "${OLD}" → "${newName}" in ${touched} file${touched === 1 ? "" : "s"}.\n\nFollow-up:\n  bun install       # regenerate bun.lock with the new root name\n  bun db:down       # stop the old container\n  bun db:up         # recreate it under the new name`
);
