import { red, green } from "kolorist";
import prompts from "prompts";
import { selectIssueStatus } from "./selects";
import { state, redmine, writeState } from "./state";
import { onState } from "./utils";

export async function preCheck() {
  let needCheck = false;
  if (!state.url) {
    let response = await prompts({
      type: "text",
      name: "value",
      message: `The base url of redmine`,
      onState,
    });
    if (!response.value) {
      console.log(red("No url, no remine :("));
      process.exit();
    }
    state.url = response.value.trim();
    needCheck = true;
  }
  if (!state.apiKey) {
    let response = await prompts({
      type: "text",
      name: "value",
      message: `The Api Key of your user`,
      onState,
    });
    if (!response.value) {
      console.log(red("No Key, no remine :("));
      process.exit();
    }
    state.apiKey = response.value.trim();
    needCheck = true;
  }

  if (needCheck) {
    process.stdout.write("Checking the connection ");
    let interval = setInterval(() => process.stdout.write("."), 20);
    try {
      await redmine().issues({ limit: 1 });
    } catch (e) {
      process.stdout.write("\n");
      // console.error(e);
      console.log(red("There was an error connecting to redmine"));
      process.exit();
    }
    process.stdout.write("\n");
    clearInterval(interval);
    await writeState();
    console.log(green("✅ Successfully connected to redmine."));
  }

  if (!state.statuses) {
    let status = await selectIssueStatus(
      "First run: Select the status which fixes an issue"
    );
    const fix = status?.id;

    status = await selectIssueStatus(
      "First run: Select the status which rejects an issue"
    );
    const reject = status?.id;

    if (!fix || !reject) {
      console.warn(`fix and reset statuses must be selected`);
      await preCheck();
    } else {
      // TODO
      state.statuses = { fix, reject };
      writeState();
    }
  }
}
