import { green } from "https://deno.land/std@0.161.0/fmt/colors.ts";
import { VersionInfo } from "./models.ts";

export async function performCommit(info: VersionInfo) {
  console.log("====> Executing git commands");
  console.log(green(`git add .`));
  const p0 = Deno.run({ cmd: ["git", "add", "."], });
  await p0.status();
  const m = info.getCommitMessage();
  console.log(green(`git commit -m "${m}"`));
  const p1 = Deno.run({ cmd: ["git", "commit", "-m", m], });
  await p1.status();
  const t = info.getTag();
  console.log(green(`git tag ${t}`));
  const p2 = Deno.run({ cmd: ["git", "tag", t], });
  await p2.status();
}
