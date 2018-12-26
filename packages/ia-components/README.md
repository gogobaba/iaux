This is a repo for Archive.org components.

Some are for production, but others are for prototyping.

This repo is installed into the archive.org codebase, and components are selectively used (not all are inculded).


### Troubleshooting

#### Yarn
- Can't run `yarn` commands inside of this directory
  - temporarily remove the `iajs` dependency inside of [package.json](./package.json) then run your `yarn` command.