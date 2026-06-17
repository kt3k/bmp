import { green } from "@std/fmt/colors";
import type { VersionInfo } from "./models.ts";

type GitRunner = (args: string[]) => Promise<void>;

export interface PerformCommitOptions {
  tag?: boolean;
  runGit?: GitRunner;
}

async function runGitCommand(args: string[]) {
  const p = new Deno.Command("git", {
    args,
    stdout: "inherit",
    stderr: "inherit",
  });
  await p.output();
}

export async function performCommit(
  info: VersionInfo,
  { tag = true, runGit = runGitCommand }: PerformCommitOptions = {},
) {
  console.log("====> Executing git commands");
  console.log(green(`git add .`));
  await runGit(["add", "."]);
  const m = info.getCommitMessage();
  console.log(green(`git commit -m "${m}"`));
  await runGit(["commit", "-m", m]);
  if (!tag) {
    return;
  }
  const t = info.getTag();
  console.log(green(`git tag ${t}`));
  await runGit(["tag", t]);
}
