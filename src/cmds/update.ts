import prompts from "prompts";
import { red } from "kolorist";
import minimist from "minimist";
import { selectIssue, selectIssueStatus } from "../selects";
import { redmine, state } from "../state";
import { getIssue, onState } from "../utils";

export async function reject(argv: minimist.ParsedArgs) {
  return updateStatus(argv, "reject");
}
export async function fix(argv: minimist.ParsedArgs) {
  return updateStatus(argv, "fix");
}

export async function updateStatus(argv: minimist.ParsedArgs, type: string) {
  let id, notes;
  if (argv._.length) {
    if (argv._[0].startsWith("#"))
      id = parseInt(argv._.shift()!.replace("#", ""));
    if (argv._.length) notes = argv._.join(" ");
  }

  let status_id = state.statuses![type];
  return await update(id, status_id, notes, true);
}

export async function update(
  id?: number,
  status_id?: number,
  notes?: string,
  onlyNeededPrompts = false
) {
  let issue;
  if (!id) {
    issue = await selectIssue();
    if (!issue) return console.warn(red(`No issues selected`));
    id = issue.id;
  } else issue = await getIssue(id);

  if (!status_id) {
    const status = await selectIssueStatus(undefined, issue.status.id);
    status_id = status?.id;
  }

  if (!onlyNeededPrompts) {
    // Todo add prompt for notes
    let response = await prompts({
      type: "text",
      name: "value",
      message: `Add a note to the ticket`,
      initial: notes,
      onState,
    });
    notes = response.value?.trim();
  }

  if (!notes && status_id == issue.status.id) return; // Nothing has changed

  await redmine().update_issue(id, {
    issue: {
      status_id,
      notes,
    },
  });
}
