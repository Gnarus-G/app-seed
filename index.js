#!/usr/bin/env node
const chalk = require("chalk");
const execa = require("execa");
const Listr = require("listr");
const { join } = require("path/posix");
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
  .option("install", {
    alias: "i",
    type: "boolean",
    default: true,
    description: "Install npm dependencies"
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

(async () => {

  const scope = await promptForScope();
  const { template } = await promptForTemplate(scope);

  await new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplate({ scope, template }, TARGET_DIR)
    },
    {
      title: "Git init",
      task: () => intializeGit(TARGET_DIR),
      enabled: () => argv.git
    },
    {
      title: "NPM install",
      task: () => installNpmDeps(TARGET_DIR),
      enabled: () => argv.install
    }
  ]).run();

  console.log(chalk.blue("DONE"))

})().catch(err => console.log(`err`, err))

async function intializeGit(target) {
  await execa("git", ["init", target]);
  await execa("git", ["add", target]);
  await execa("git", ["commit", "-am", "Initial commit"]);
}

async function installNpmDeps(targetDir) {
  await execa("mkdir", ["-p", targetDir + "/node_modules"])
  await execa("npm", ["i", "--prefix", targetDir]);
}

function getTargetDir({ scope, template, target }) {
  return join(process.cwd(), scope, template, target);
}