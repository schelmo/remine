import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import Redmine from "axios-redmine";
import { xdgState } from "xdg-basedir";
import { RMineState } from "./types";

let _redmine: Redmine;

const stateFile = resolve(xdgState as string, "rmine", "state.json");
export const state: RMineState = {
  lastProjects: [],
};

export function redmine(): Redmine {
  if (!_redmine) _redmine = new Redmine(state.url, { apiKey: state.apiKey });
  return _redmine;
}

export async function readState() {
  try {
    await stat(stateFile);
    const contents = await readFile(stateFile);
    Object.assign(state, JSON.parse(contents.toString()));
  } catch (e) {}
}

export async function writeState() {
  await mkdir(dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state));
}
