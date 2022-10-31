# bmp v0.1.0

> Version up. No hassles.

`bmp` is a command line tool for updating the version number in source files.

# Motivation

It's common to have the version number of the library written in multiple places
in a repository, e.g. meta files, documetation, source code, etc.

If the version number of the library written more than 1 place, updating these
numbers in every release is very boring, very much error prone chore. `bmp`
helps that situation with simple config file `.bmp.yml` which can track every
occurence of the version number in a repository and updates every occurence
consistently when you want to update it.

# Install

```sh
deno install --allow-read=. --allow-write=. --allow-run=git -qf https://deno.land/x/bmp@v0.1.0/cli.ts
```

This installs `bmp` command.

# Usage

Hit the command in a repository you want to mangae version numbers with `bmp`.

```sh
bmp -i # or bump --init
```

This creates a config file like the below:

`.bmp.yml`

```yaml
version: 0.0.0
commit: 'chore: bump version to %.%.%'
files:
  README.md: v%.%.%
```

- `version` is the current version of your repository. You need to update this
  to the actuall current version number.
- `commit` is the commit message which is used when you perform the command
  `bmp -c`, which commits with appropriate commit message, and cut the tag. This
  field is optional, and you can delete this if you don't want to use committing
  feature.
- `files` contains the version number patterns in files. For example, if your
  README.md file contains `my-library v1.2.3`, then you need to set this
  property to `README.md: my-library v%.%.%`. (As you can see `%.%.%` part
  represents the version number) `bmp` doesn't parse your files. So you can list
  any files with any syntax.

Then you need to modify this file to fit the reality of your repository. It
might be something like the below, for example:

```yaml
version: 0.4.3
commit: 'chore: bump version to v%.%.%'
files:
  README.md:
    - v%.%.%
    - my-lib@%.%.%
  main.ts: 'const version = "%.%.%";'
```

Then hit the command `bmp` (no options). This validates the occurencies of the
patterns in each file. If the config has any error, you'll see the error. If the
config finds every pattern in every file, you'll see the output like the below:

```
Current version: 0.4.3
Commit message: chore: bump to 0.4.3
Version patterns:
  README.md: v0.0.2
  README.md: my-lib@0.0.2
  main.ts: const version = "0.4.3";
```

Now you are all set. You can bump the versoin by the commands `bmp -j` (major),
`bmp -m` (minor), `bmp -p` (patch). The tool also supports `preid` (like
`alpha.1` or `beta.2`). See `bmp -h` output for more details.

# Example commands

## `bmp -i`

Creates .bmp.yml file with placeholders.

## `bmp`

Checks and validates the config file.

## `bmp -p`

Bump the patch version and updates every version occurrences based on .bmp.yml
config.

`bmp -m` for minor version bump, `bmp -j` for major version bump.

## `bmp -c`

Commits the current change in the git repository with the commit message
specified in .bmp.yml config and cut the tag.

## `bmp -pc`

Patch version up, commits the change, and cut the tag.

Also `bmp -mc` for minor, `bmp -jc` for major.

# LICENSE

MIT
