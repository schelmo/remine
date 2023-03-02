import prompts from "prompts";
import type { Issue, IssueStatus, Project, Tracker } from "./types";
import { state, redmine, writeState } from "./state";
import {
  formatProjectName,
  getIssueStatuses,
  getTrackers,
  onState,
  sortByUpdatedOn,
  sortProjectsFunc,
} from "./utils";
import { yellow, cyan } from "kolorist";

export async function selectIssue(
  message?: string,
  project_ids?: [undefined] | number[]
): Promise<Issue | void> {
  project_ids = project_ids ?? [undefined];
  const response = await prompts({
    type: "autocomplete",
    name: "value",
    message: message || "Pick an issue",
    onState,
    choices: Array(100).fill({ title: "loading" }),
    suggest: async (input: string) => {
      try {
        const issues = [];
        for (let project_id of project_ids!) {
          const res = await redmine().issues({
            limit: 10,
            project_id,
            subject: input.trim().length > 2 ? `~${input.trim()}` : undefined,
          });
          issues.push(...res.data.issues);
        }
        return issues.sort(sortByUpdatedOn).map((issue) => {
          const title = `#${issue.id} – [${yellow(issue.tracker.name)}] ${
            issue.subject
          } [${cyan(formatProjectName(issue.project))}]`;
          return { title, value: issue };
        });
      } catch (e) {
        console.error(e);
        process.exit();
      }
    },
  });
  return response.value;
}

export async function selectProject(
  putToState = true
): Promise<Project | undefined> {
  const response = await prompts({
    type: "autocomplete",
    name: "value",
    message: "Select a project",
    limit: 15,
    onState,
    choices: Array(100).fill({ title: "loading" }),
    suggest: async (input: string) => {
      try {
        const {
          data: { projects },
        }: { data: { projects: Project[] } } = await redmine().projects({
          limit: 20,
          name: "~" + input,
        });
        return projects.sort(sortProjectsFunc).map((project) => {
          const title = `${formatProjectName(project)}`;
          return { title, value: project };
        });
      } catch (e) {
        console.error(e);
        process.exit();
      }
    },
  });
  const project = response.value;
  if (project && putToState) {
    const idx = state.lastProjects.indexOf(project.id);
    if (idx > -1) state.lastProjects.splice(idx, 1);
    state.lastProjects.push(project.id);
    writeState();
  }
  return project;
}

export async function selectTracker(
  message?: string,
  initial_id?: number
): Promise<Tracker | undefined> {
  const trackers = await getTrackers();
  const initial = trackers.find(({ id }) => id == initial_id);
  const choices = trackers.map((tracker) => ({
    title: tracker.name,
    value: tracker,
  }));
  const response = await prompts({
    type: "autocomplete",
    name: "value",
    message: message || "Which Tracker",
    limit: 10,
    onState,
    choices,
    initial,
  });
  return response.value;
}
export async function selectIssueStatus(
  message?: string,
  initial_id?: number
): Promise<IssueStatus | undefined> {
  const statuses = await getIssueStatuses();
  const initial = statuses.find(({ id }) => id == initial_id);
  const choices = statuses.map((status) => ({
    title: status.name,
    value: status,
  }));
  const response = await prompts({
    type: "autocomplete",
    name: "value",
    message: message || "Select the Issue Status",
    limit: 10,
    onState,
    initial,
    choices,
  });
  return response.value;
}
