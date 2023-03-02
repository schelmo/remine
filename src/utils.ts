import { redmine, state } from "./state";
import type { Project, Issue, IssueStatus, Tracker } from "./types";

export function formatProjectName(project: Project) {
  if (!project.parent) return project.name;
  const names = [project.name];
  const check = (p: Project) => {
    if (!p.parent) return;
    names.unshift(p.parent.name);
    check(p.parent);
  };
  check(project);
  return names.join("›");
}

export function sortByUpdatedOn(a: Project | Issue, b: Project | Issue) {
  return new Date(a.updated_on) > new Date(b.updated_on) ? -1 : 1;
}

export function sortProjectsFunc(a: Project, b: Project) {
  const indexA = state.lastProjects.indexOf(a.id);
  const indexB = state.lastProjects.indexOf(b.id);
  if (indexA > -1 || indexB > -1) return indexB - indexA;
  return sortByUpdatedOn(a, b);
}

let issueStatuses: IssueStatus[];
export async function getIssueStatuses(): Promise<IssueStatus[]> {
  if (issueStatuses) return issueStatuses;
  const res = await redmine().issue_statuses();
  issueStatuses = res.data.issue_statuses;
  return issueStatuses;
}

let trackers: Tracker[];
export async function getTrackers(): Promise<Tracker[]> {
  if (trackers) return trackers;
  const res = await redmine().trackers();
  trackers = res.data.trackers;
  return trackers;
}

export async function getIssue(id: number): Promise<Issue> {
  const res = await redmine().get_issue_by_id(parseInt(String(id)));
  return res.data.issue;
}

export function enableTerminalCursor() {
  process.stdout.write("\x1B[?25h");
}

export function onState(state: { aborted: boolean }) {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    enableTerminalCursor();
    process.stdout.write("\n");
    process.exit(1);
  }
}
