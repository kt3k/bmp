import {
  parse,
  stringify,
} from "https://deno.land/std@0.97.0/encoding/yaml.ts";

import { AppError, VersionInfo, VersionInfoInput } from "./models.ts";

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
    if (e.name === "NotFound") {
      throw new AppError(`Error: The config file '${filename}' not found`);
    }
    throw e;
  }

  let data: VersionInfoInput;
  try {
    data = parse(yaml) as VersionInfoInput;
  } catch (e) {
    throw new AppError(e.message);
  }

  const info = VersionInfo.create(data, filename);
  await info.validate();
  return info;
}
