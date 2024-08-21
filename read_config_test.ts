import { assertRejects } from "@std/assert";
import { readConfig } from "./read_config.ts";
import { AppError } from "./models.ts";

Deno.test("readConfig - throws when the config file is not found", async () => {
  await assertRejects(
    async () => {
      await readConfig({ file: "somedir/.bmp.yml" });
    },
    AppError,
    "Error: The config file 'somedir/.bmp.yml' not found",
  );
});

Deno.test("readConfig - throws when the config file has syntax error", async () => {
  await assertRejects(
    async () => {
      await readConfig({
        file: "testdata/.bmp.yml.broken",
      });
    },
    AppError,
    "end of the stream or a document separator is expected at line 2, column 6:",
  );
});
