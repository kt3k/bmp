import { assertEquals, assertStringIncludes } from "@std/assert";

const decoder = new TextDecoder();

Deno.test("cli --help", async () => {
  const p = new Deno.Command(Deno.execPath(), {
    args: ["run", "cli.ts", "--help"],
  });

  const { code, stdout } = await p.output();

  assertEquals(code, 0);
  assertStringIncludes(decoder.decode(stdout), "Usage:");
});

Deno.test("cli --version", async () => {
  const p = new Deno.Command(Deno.execPath(), {
    args: ["run", "cli.ts", "--version"],
  });

  const { code, stdout } = await p.output();

  assertEquals(code, 0);
  assertStringIncludes(decoder.decode(stdout), "bmp@");
});
