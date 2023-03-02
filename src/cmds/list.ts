import minimist from "minimist";
import { cyan, red } from "kolorist";
import { redmine } from "../state";
import { Project } from "../types";
import { formatProjectName, sortProjectsFunc } from "../utils";
import { update } from "./update";
import { selectIssue } from "../selects";
import prompts from "prompts";

export async function list(argv: minimist.ParsedArgs) {
  let message = "Pick an issue";
  let project_ids: [undefined] | Array<number> = [undefined];

  if (argv._?.[0]) {
    // search projects
    const name = argv._?.[0];
    let res = await redmine().projects({ name, limit: 20 });
    if (res.data.projects.length === 0)
      res = await redmine().projects({ name: "~" + name, limit: 20 });

    const projects: Project[] = res.data.projects;

    project_ids = projects.map(({ id }) => id);

    if (projects.length > 0)
      message +=
        ` on project${projects.length > 1 ? "s" : ""} ` +
        projects.map(({ name }: Project) => cyan(name)).join(", ");
    else {
      console.log(red(`No Projects found with name ${cyan(name)}`));
      const res = await redmine().projects({
        limit: 40,
      });
      res.data.projects.sort(sortProjectsFunc);
      console.info(
        "Available projects: " +
          res.data.projects
            .map((project: Project) => cyan(formatProjectName(project)))
            .join(", ")
      );
    }
  }
  const issue = await selectIssue(message, project_ids);

  if (!issue) return;

  console.log(`
Subject: ${issue.subject}
Tracker: ${issue.tracker.name}
Status: ${issue.status.name}
Author: ${issue.author.name}
Priority: ${issue.priority?.name || issue.priority}
Start date: ${issue.start_date}
Due date: ${issue.due_date}
`);
  if (issue.description) {
    console.log("=d=e=s=c=r=i=pt=i=o=n=\n");
    console.log(issue.description);
    console.log("\n======================");
  }

  const response = await prompts({
    type: "select",
    name: "value",
    message: "What you want to do with the issue?",
    choices: [
      {
        title: "Update",
        description: "(Status, add a Note)",
        value: () => update(issue.id),
      },
      { title: "Exit", value: () => process.exit() },
    ],
  });
  response.value?.();
}
