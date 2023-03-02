import minimist from "minimist";
import prompts from "prompts";
import { cyan, red, yellow } from "kolorist";
import { redmine } from "../state";
import { formatProjectName, onState } from "../utils";
import { selectProject, selectTracker } from "../selects";

export async function create(argv: minimist.ParsedArgs) {
  let subject = argv._?.shift();
  let description = argv._?.shift();
  const project = await selectProject();
  if (!project) {
    console.warn(red(`No Projects found`));
    return process.exit();
  }
  if (!subject) {
    let response = await prompts({
      type: "text",
      name: "value",
      message: `Whats the subject/title of the Ticket`,
      onState,
    });
    subject = response.value?.trim();

    response = await prompts({
      type: "text",
      name: "value",
      message: `Whats the description of the Ticket`,
      onState,
    });
    description = response.value?.trim();
  }

  if (!subject?.trim())
    return console.warn(red(`We need at least a subject to create an issue`));

  const tracker = await selectTracker();

  await redmine().create_issue({
    issue: {
      project_id: project.id,
      tracker_id: tracker?.id,
      subject,
      description,
    },
  });

  let trackerText = "";
  if (tracker) trackerText = ` [${tracker?.name}]`;

  let descriptionText = "";
  if (description)
    descriptionText = ` and description '${yellow(description)}'`;

  console.info(
    `Created${trackerText} '${yellow(
      subject
    )}'${descriptionText} on project ${cyan(formatProjectName(project))}`
  );
}
