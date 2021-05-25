# bmp v0.0.1

> Bump version, no hassle

# Install

```sh
deno install --allow-read=. --allow-write=. https://deno.land/x/bmp@0.0.1/cli.ts
```

This installs `bmp` command.

# Usage

Hit the command in a repository you want to mange version numbers with `bmp`.

```
bmp init
```

This creates config file like the below:

.bmp.yml

```yaml
version: 0.0.0
commit: 'chore: bump version to %.%.%'
files:
  README.md: v%.%.%
```

- `version` is the current version of your repository.
- `commit` is the commit message which is used when you hit command `bmp -c`.
- `files` is the map of files and version number expression in that file.

# LICENSE

MIT
