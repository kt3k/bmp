# bmp v0.0.5

> Update version without hassle

`bmp` is a command line tool for updating the version number in source files.

# Motivation

It's common to have the version number of the library written in multiple places in a repository, e.g. meta files, documetation, source code, etc.

If the version number of the library written more than 1 place, updating these numbers in every release is very boring, very much error prone chore. `bmp` helps that situation with simple config file `.bmp.yml` which can track every occurence of the version number in a repository and updates every occurence consistently when you want to update it.

# Install

```sh
deno install --allow-read=. --allow-write=. https://deno.land/x/bmp@0.0.5/cli.ts
```

This installs `bmp` command.

# Usage

Hit the command in a repository you want to mange version numbers with `bmp`.

```
bmp --init
```

This creates config file like the below:

.bmp.yml

```yaml
version: 0.0.0
commit: 'chore: bump version to %.%.%'
files:
  README.md: v%.%.%
```

- `version` is the current version of your repository. You need to update this to the actuall current version number.
- `commit` is the commit message which is used when you perform the command `bmp -c`, which commits with appropriate commit message, and cut the tag.
- `files` contains the version number patterns in files. If your README.md file contains `my-library v1.2.3`, then you need to set this property to `README.md: my-library v%.%.%`. (As you can see `%.%.%` part represents the version number)

Then you need to modify this file to fit the reality of your repository. It might be something like the below:

```yaml
version: 0.4.3
commit: 'chore: bump version to v%.%.%'
files:
  README.md:
    - v%.%.%
    - my-lib@%.%.%
  main.ts: 'const version = "%.%.%";'
```

Then hit the command `bmp`. This validates the occurencies of the pattern in each file. If the config has error, you'll see error. If the config finds every pattern in every file, you'll see the output like the below:

```
Current version: 0.4.3
Commit message: chore: bump to 0.4.3
Version patterns:
  README.md: v0.0.2
  README.md: my-lib@0.0.2
  main.ts: const version = "0.4.3";
```

Now you are all set. You can bump versoin by the command `bmp -j` (major), `bmp -m` (minor), `bmp -p` (patch). The tool also supports `preid` (like alpha.1 or beta.2). See `bmp -h` output for more details.

# LICENSE

MIT
