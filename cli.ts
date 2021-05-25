import { parse } from "https://deno.land/std@0.97.0/flags/mod.ts";

const NAME = "bmp";
const VERSION = "0.0.1";

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
  --preid            Sets the pre-release version id (e.g. alpha, beta.1)
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
    info,
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
      "preid",
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
}

Deno.exit(await main(Deno.args));
