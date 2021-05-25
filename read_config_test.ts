import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { AppError, readConfig, Version, VersionInfo } from "./read_config.ts";

Deno.test("readConfig - throws when the config file is not found", async () => {
  await assertThrowsAsync(
    async () => {
      await readConfig({ file: "somedir/.bmp.yml" });
    },
    AppError,
    "Error: The config file 'somedir/.bmp.yml' not found",
  );
});

Deno.test("readConfig - throws when the config file has syntax error", async () => {
  await assertThrowsAsync(
    async () => {
      await readConfig({
        file: "testdata/.bmp.yml.broken",
      });
    },
    AppError,
    "end of the stream or a document separator is expected at line 2, column 6:",
  );
});

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
  assertEquals(v.minor, 2);
  assertEquals(v.patch, 3);
  assertEquals(v.preid, undefined);
  v = v.bumpMinor();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 3);
  assertEquals(v.patch, 3);
  assertEquals(v.preid, undefined);
  v = v.bumpPatch();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 3);
  assertEquals(v.patch, 4);
  assertEquals(v.preid, undefined);
  v = v.setPreid("alpha.1");
  assertEquals(v.major, 2);
  assertEquals(v.minor, 3);
  assertEquals(v.patch, 4);
  assertEquals(v.preid, "alpha.1");
  v = v.release();
  assertEquals(v.major, 2);
  assertEquals(v.minor, 3);
  assertEquals(v.patch, 4);
  assertEquals(v.preid, undefined);
});

Deno.test("VersionInfo.create", async () => {
  await assertThrowsAsync(
    async () => {
      VersionInfo.create({});
    },
    AppError,
    "Error: version property is not given in the config file",
  );
});

Deno.test("VersionInfo - toYaml", async () => {
  const info = VersionInfo.create({
    version: "1.2.3",
    commit: "chore: bump to %.%.%",
    files: {
      "README.md": ["v%.%.%", "@%.%.%"],
      "main.ts": [`"%.%.%"`],
    }
  });
  assertEquals(info.toYaml(), `version: 1.2.3
commit: 'chore: bump to %.%.%'
files:
  README.md:
    - v%.%.%
    - '@%.%.%'
  main.ts: '"%.%.%"'
`);
});
