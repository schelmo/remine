import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import Redmine from "axios-redmine";
import { xdgState } from "xdg-basedir";
import { RMineState } from "./types";

export const state: RMineState = {
  lastProjects: [],
};

let _redmine: Redmine;
export function redmine(): Redmine {
  if (!_redmine) _redmine = new Redmine(state.url, { apiKey: state.apiKey });
  return _redmine;
}

const stateFile = resolve(xdgState as string, "remine", "state.json");

export async function readState() {
  try {
    const contents = await readFile(stateFile);
    Object.assign(state, JSON.parse(contents.toString()));
  } catch (e) {}
}

export async function writeState() {
  await mkdir(dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state));
}
