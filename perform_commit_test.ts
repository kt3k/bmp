import { assertEquals } from "@std/assert";

import { performCommit } from "./perform_commit.ts";
import { VersionInfo } from "./models.ts";

function createVersionInfo() {
  return VersionInfo.create({
    version: "1.2.3",
    commit: "chore: bump to %.%.%",
    files: {
      "README.md": "v%.%.%",
    },
  });
}

Deno.test("performCommit - commits and creates tag by default", async () => {
  const commands: string[][] = [];

  await performCommit(createVersionInfo(), {
    runGit: (args) => {
      commands.push(args);
      return Promise.resolve();
    },
  });

  assertEquals(commands, [
    ["add", "."],
    ["commit", "-m", "chore: bump to 1.2.3"],
    ["tag", "1.2.3"],
  ]);
});

Deno.test("performCommit - skips tag when disabled", async () => {
  const commands: string[][] = [];

  await performCommit(createVersionInfo(), {
    tag: false,
    runGit: (args) => {
      commands.push(args);
      return Promise.resolve();
    },
  });

  assertEquals(commands, [
    ["add", "."],
    ["commit", "-m", "chore: bump to 1.2.3"],
  ]);
});
