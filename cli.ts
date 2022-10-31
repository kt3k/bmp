import { parse } from "https://deno.land/std@0.161.0/flags/mod.ts";
import { red } from "https://deno.land/std@0.161.0/fmt/colors.ts";
import { readConfig } from "./read_config.ts";
import { performCommit } from "./perform_commit.ts";
import { AppError, VersionInfo } from "./models.ts";

const NAME = "bmp";
const VERSION = "0.0.7";

function usage() {
  console.log(`
Usage: bmp [options]

Options:
  -i, --init         Initializes the config file.
  --info             Shows the version information.
  -c, --commit       Commits changes with commit message (requires git command)
  -p, --patch        Bumps patch (0.0.1) level
  -m, --minor        Bumps minor (0.1.0) level
  -j, --major        Bumps major (1.0.0) level
  --preid <label>    Sets the pre-release version id (e.g. alpha, beta.1)
  -r, --release      Removes the pre-release version id
  -h, --help         Shows this help and exit
  -v, --version      Shows the version of this command and exit
`);
}

type CliArgs = {
  info: boolean;
  init: boolean;
  commit: boolean;
  patch: boolean;
  minor: boolean;
  major: boolean;
  preid: string;
  release: boolean;
  help: boolean;
  version: boolean;
};

export async function main(args: string[]) {
  const {
    init,
    info: _isInfo,
    commit,
    patch,
    minor,
    major,
    preid,
    release,
    help,
    version,
  } = parse(args, {
    boolean: [
      "version",
      "help",
      "commit",
      "major",
      "minor",
      "patch",
      "release",
      "info",
      "init",
    ],
    string: ["preid"],
    alias: {
      v: "version",
      h: "help",
      c: "commit",
      j: "major",
      m: "minor",
      p: "patch",
      i: "init",
    },
  });

  if (version) {
    console.log(`${NAME}@${VERSION}`);
    return 0;
  }

  if (help) {
    usage();
    return 0;
  }

  let versionInfo: VersionInfo;
  if (init) {
    try {
      const f = await Deno.open(".bmp.yml");
      console.log(red("Error: .bmp.yml file already exists"));
      f.close();
      return 1;
    } catch (e) {
      if (e.name === "NotFound") {
        console.log("Creating .bmp.yml file");
        await VersionInfo.createDefault().save();
        console.log("Done");
        return 0;
      }
      throw e;
    }
  }

  try {
    versionInfo = await readConfig();
  } catch (e) {
    if (e instanceof AppError) {
      console.log(red(e.message));
      return 1;
    }
    throw e;
  }

  if (major) {
    versionInfo.major();
  } else if (minor) {
    versionInfo.minor();
  } else if (patch) {
    versionInfo.patch();
  } else if (preid) {
    versionInfo.preid(preid);
  } else if (release) {
    versionInfo.release();
  }

  if (versionInfo.isUpdated()) {
    console.log(versionInfo.bumpSummary());
    await versionInfo.performUpdate();
  }

  if (commit) {
    await performCommit(versionInfo);
  } else if (!versionInfo.isUpdated()) {
    console.log(versionInfo.toString());
  }
  return 0;
}

Deno.exit(await main(Deno.args));
