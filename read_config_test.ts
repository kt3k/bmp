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
    "Implicit keys need to be on a single line at line 1, column 1:\n\nasdfa\n^\n",
  );
});
