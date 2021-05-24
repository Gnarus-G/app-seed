#!/usr/bin/env node
const chalk = require("chalk");
const Listr = require("listr");
const { promptForScope, promptForTemplate, copyTemplate } = require("./lib");

const APP_NAME = "app-seed";

const argv = require('yargs/yargs')(process.argv.slice(2))
  .usage(`${chalk.blue(APP_NAME)} ${chalk.green("<dir>")}`)
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

(async () => {

  const opts = await promptForScope()
    .then(promptForTemplate)

  await new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplate(opts, TARGET_DIR)
    }
  ]).run();

  console.log(chalk.blue("DONE"))

})().catch(err => console.log(`err`, err))