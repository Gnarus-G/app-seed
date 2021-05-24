#!/usr/bin/env node
const chalk = require("chalk");
const execa = require("execa");
const Listr = require("listr");
const { promptForScope, promptForTemplate, copyTemplate } = require("./lib");

const APP_NAME = "app-seed";

const argv = require('yargs/yargs')(process.argv.slice(2))
  .usage(`${chalk.blue(APP_NAME)} ${chalk.green("<dir>")}`)
  .option("git", {
    alias: "g",
    type: "boolean",
    default: true,
    description: "Do initialize git"
  })
  .check((argv, _) => {
    if (!argv._[0])
      throw new Error(
        "Please specify the target directory; for example:\n" +
        `${chalk.blue(APP_NAME)} ${chalk.green("my-app")}\n`
      );
    else
      return true;
  })
  .argv

const TARGET_DIR = argv._[0];

console.log(`argv`, argv);

(async () => {

  const opts = await promptForScope()
    .then(promptForTemplate)

  await new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplate(opts, TARGET_DIR)
    },
    {
      title: "Git init",
      task: () => intializeGit(TARGET_DIR),
      enabled: () => argv.git
    }
  ]).run();

  console.log(chalk.blue("DONE"))

})().catch(err => console.log(`err`, err))

async function intializeGit(target) {
  await execa("git", ["init", target]);
  await execa("git", ["add", target]);
  await execa("git", ["commit", "-am", "Initial commit"]);
}