#!/usr/bin/env node

import minimist from "minimist";
import { readState } from "./state";
import { list, reject, fix, create, help } from "./cmds";
import { preCheck } from "./pre-check";

const argv = minimist(process.argv.slice(2));

export const cmds = { list, reject, fix, create, help };

export let cmd = cmds.list;
if (argv._?.[0] && Object.keys(cmds).includes(argv._[0]))
  // @ts-ignore
  cmd = cmds[argv._.shift()];

(async () => {
  // read the state from file system
  await readState();
  try {
    // some pre checks (url, apiKey, defaults)
    await preCheck();
    // run the actual cmd
    await cmd(argv);
  } catch (e) {
    console.error(e);
  }
})();
