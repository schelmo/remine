import { cyan } from "kolorist";

export async function help() {
  console.log(`
Usage:
# list issues optionally filtered by an project name
${cyan("list")} [project name]
# reject or fixes an issue with an opionally comment
${cyan("reject|fix")} [#issueId] [comment]
# creates a new issue
${cyan("create")} [subject] [${cyan("on")} project] [description]
# show this help
${cyan("help")}
`);
}
