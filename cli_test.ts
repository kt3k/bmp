import { assertEquals, assertStringIncludes } from "@std/assert";

const decoder = new TextDecoder();

Deno.test("cli --help", async () => {
  const p = Deno.run({
    cmd: [Deno.execPath(), "run", "cli.ts", "--help"],
    stdout: "piped",
    stderr: "piped",
  });

  const [status, output, _stderrOutput] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);

  assertEquals(status.code, 0);
  assertStringIncludes(decoder.decode(output), "Usage:");
  p.close();
});

Deno.test("cli --version", async () => {
  const p = Deno.run({
    cmd: [Deno.execPath(), "run", "cli.ts", "--version"],
    stdout: "piped",
    stderr: "piped",
  });

  const [status, output, _stderrOutput] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);

  assertEquals(status.code, 0);
  assertStringIncludes(decoder.decode(output), "bmp@");
  p.close();
});
