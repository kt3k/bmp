import { green } from "@std/fmt/colors";
import type { VersionInfo } from "./models.ts";

export async function performCommit(info: VersionInfo) {
  console.log("====> Executing git commands");
  console.log(green(`git add .`));
  const p0 = new Deno.Command("git", {
    args: ["add", "."],
    stdout: "inherit",
    stderr: "inherit",
  });
  await p0.output();
  const m = info.getCommitMessage();
  console.log(green(`git commit -m "${m}"`));
  const p1 = new Deno.Command("git", {
    args: ["commit", "-m", m],
    stdout: "inherit",
    stderr: "inherit",
  });
  await p1.output();
  const t = info.getTag();
  console.log(green(`git tag ${t}`));
  const p2 = new Deno.Command("git", {
    args: ["tag", t],
    stdout: "inherit",
    stderr: "inherit",
  });
  await p2.output();
}
