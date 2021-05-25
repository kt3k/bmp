import {
  parse,
  stringify,
} from "https://deno.land/std@0.97.0/encoding/yaml.ts";

export class AppError extends Error {}

class FilePattern {
  constructor(
    public path: string,
    public patterns: string[],
  ) {}

  async validate() {
    try {
      const file = await Deno.open(this.path);
      file.close();
    } catch (e) {
      if (e.name === "NotFound") {
        throw new AppError(`Error: The file ${this.path} not found`);
      }
    }
    for (const pattern of this.patterns) {
      if (!pattern.includes("%.%.%")) {
        throw new AppError(
          `Error: The pattern '${pattern}' doesn't include '%.%.%'`,
        );
      }
    }
  }

  async replace(from: string, to: string) {
    let contents = await Deno.readTextFile(this.path);
    for (const pattern of this.patterns) {
      const beforeString = pattern.replaceAll("%.%.%", from);
      const afterString = pattern.replaceAll("%.%.%", to);
      contents.replaceAll(beforeString, afterString);
    }
    await Deno.writeTextFile(this.path, contents);
  }
}

export class Version {
  static parse(v: string) {
    // TODO(kt3k): Implement more strict parse rules.
    const m = v.match(/(\d+).(\d+).(\d+)(-(.+))?/);
    if (!m) {
      throw new AppError(`Error: Invalid version number: ${v}`);
    }
    return new Version(
      +m[1]!,
      +m[2]!,
      +m[3]!,
      m[5],
    );
  }

  constructor(
    public major: number,
    public minor: number,
    public patch: number,
    public preid: string | undefined,
  ) {
  }

  bumpMajor(): Version {
    return new Version(
      this.major + 1,
      this.minor,
      this.patch,
      undefined,
    );
  }

  bumpMinor(): Version {
    return new Version(
      this.major,
      this.minor + 1,
      this.patch,
      undefined,
    );
  }

  bumpPatch(): Version {
    return new Version(
      this.major,
      this.minor,
      this.patch + 1,
      undefined,
    );
  }

  setPreid(preid: string): Version {
    return new Version(
      this.major,
      this.minor,
      this.patch,
      preid,
    );
  }

  release(): Version {
    return new Version(
      this.major,
      this.minor,
      this.patch,
      undefined,
    );
  }

  toString() {
    const { major, minor, patch, preid } = this;
    if (preid) {
      return `${major}.${minor}.${patch}-${preid}`;
    }
    return `${major}.${minor}.${patch}`;
  }
}

export type VersionInfoInput = {
  version?: string;
  commit?: string;
  files?: Record<string, Array<string> | string>;
};

export class VersionInfo {
  static create({ version, commit, files }: VersionInfoInput) {
    if (!version) {
      throw new AppError(
        "Error: version property is not given in the config file",
      );
    }
    if (!files) {
      throw new AppError(
        "Error: files property is not given in the config file",
      );
    }
    const v = Version.parse(version);
    const filePatterns: FilePattern[] = [];
    for (const [path, value] of Object.entries(files)) {
      const patterns: string[] = [];
      if (typeof value === "string") {
        patterns.push(value);
      } else if (Array.isArray(value)) {
        for (const val of value) {
          if (typeof val === "string") {
            patterns.push(val);
          } else {
            throw new Error(
              `Error: Wrong type for file pattern: ${typeof val} (${val}) is given`,
            );
          }
        }
      } else {
        throw new Error(
          `Error: Wrong type for file pattern: ${typeof value} (${value}) is given`,
        );
      }
      filePatterns.push(new FilePattern(path, patterns));
    }
    return new VersionInfo(v, commit, filePatterns);
  }

  updateVersion: Version;
  constructor(
    public currentVersion: Version,
    public commit: string | undefined,
    public filePatterns: FilePattern[],
  ) {
    this.updateVersion = currentVersion;
  }

  async validate() {
    for (const filePattern of this.filePatterns) {
      await filePattern.validate();
    }
  }

  major() {
    this.updateVersion = this.currentVersion.bumpMajor();
  }

  minor() {
    this.updateVersion = this.currentVersion.bumpMinor();
  }

  patch() {
    this.updateVersion = this.currentVersion.bumpPatch();
  }

  preid(preid: string) {
    this.updateVersion = this.currentVersion.setPreid(preid);
  }

  release() {
    this.updateVersion = this.currentVersion.release();
  }

  toObject() {
    const data = {
      version: this.updateVersion.toString(),
    } as any;
    if (this.commit) {
      data.commit = this.commit;
    }
    const files: Record<string, string | string[]> = {};
    for (const { path, patterns } of this.filePatterns) {
      if (patterns.length === 1) {
        files[path] = patterns[0];
      } else {
        files[path] = patterns;
      }
    }
    data.files = files;
    return data;
  }

  async replaceVersionsInFiles() {
    for (const filePattern of this.filePatterns) {
      await filePattern.replace(
        this.currentVersion.toString(),
        this.updateVersion.toString(),
      );
    }
  }
}
