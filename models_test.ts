import {
  assert,
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { green } from "https://deno.land/std@0.161.0/fmt/colors.ts";

import { AppError, Version, VersionInfo } from "./models.ts";

Deno.test("Version.parse - parses version number", () => {
  let v = Version.parse("1.2.3");
  assertEquals(v.major, 1);
  assertEquals(v.minor, 2);
  assertEquals(v.patch, 3);
  assertEquals(v.preid, undefined);

  v = Version.parse("2.3.4-alpha.1");
  assertEquals(v.major, 2);
  assertEquals(v.minor, 3);
  assertEquals(v.patch, 4);
  assertEquals(v.preid, "alpha.1");
});

Deno.test("Version - updates version number", () => {
  let v = Version.parse("1.2.3");
  v = v.bumpMajor();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 0);
  assertEquals(v.patch, 0);
  assertEquals(v.preid, undefined);
  v = v.bumpMinor();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 1);
  assertEquals(v.patch, 0);
  assertEquals(v.preid, undefined);
  v = v.bumpPatch();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 1);
  assertEquals(v.patch, 1);
  assertEquals(v.preid, undefined);
  v = v.setPreid("alpha.1");
  assertEquals(v.major, 2);
  assertEquals(v.minor, 1);
  assertEquals(v.patch, 1);
  assertEquals(v.preid, "alpha.1");
  v = v.release();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 1);
  assertEquals(v.patch, 1);
  assertEquals(v.preid, undefined);
});

Deno.test("VersionInfo.create", async () => {
  await assertRejects(
    async () => {
      VersionInfo.create({});
    },
    AppError,
    "Error: version property is not given in the config file",
  );
});

Deno.test("VersionInfo - toObject", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: bump to %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });
  assertEquals(info.toObject(), {
    version: "1.2.3",
    commit: 'chore: bump to %.%.%',
    files: {
      "README.md": ["v%.%.%", '@%.%.%'],
      "main.ts": '"%.%.%"'
    }
  });
});

Deno.test("VersionInfo.isUpdated()", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: bump to %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });
  assert(!info.isUpdated());
  info.major();
  assert(info.isUpdated());
});

Deno.test("VersionInfo.toString()", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: bump to %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });
  assertEquals(info.toString().trim(), `
Current version: ${green("1.2.3")}
Commit message: ${green("chore: bump to 1.2.3")}
Version patterns:
  README.md: ${green("v1.2.3")}
  README.md: ${green("@1.2.3")}
  main.ts: ${green('"1.2.3"')}
`.trim());
});

Deno.test("VersionInfo.getTag()", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: bump to %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });

  assertEquals(info.getTag(), "v1.2.3")
});

Deno.test("VersionInfo.getCommitMessage()", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: hey %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });

  assertEquals(info.getCommitMessage(), "chore: hey 1.2.3")
});


Deno.test("VersionInfo.bumpSummary()", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: hey %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });

  info.minor();

  assertEquals(info.bumpSummary(), `
Updating version:
  ${green("1.2.3 => 1.3.0")}
Version patterns:
  README.md: ${green("v1.2.3 => v1.3.0")}
  README.md: ${green("@1.2.3 => @1.3.0")}
  main.ts: ${green('"1.2.3" => "1.3.0"')}
  `.trim());
});
