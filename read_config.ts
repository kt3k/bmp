import { parse } from "@std/yaml/parse";

import { AppError, VersionInfo, type VersionInfoInput } from "./models.ts";

type ReadConfigOptions = {
  file?: string;
};

export async function readConfig(
  opts: ReadConfigOptions = {},
): Promise<VersionInfo> {
  let yaml;
  const filename = opts.file ?? ".bmp.yml";
  try {
    yaml = await Deno.readTextFile(filename);
  } catch (e) {
    if (e instanceof Error && e.name === "NotFound") {
      throw new AppError(`Error: The config file '${filename}' not found`);
    }
    throw e;
  }

  let data: VersionInfoInput;
  try {
    data = parse(yaml) as VersionInfoInput;
  } catch (e) {
    if (e instanceof Error) {
      throw new AppError(e.message);
    } else {
      throw new AppError(String(e));
    }
  }

  const info = VersionInfo.create(data, filename);
  await info.validate();
  return info;
}
