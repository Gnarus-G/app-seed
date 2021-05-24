#!/usr/bin/env node
const chalk = require("chalk");
const appSeed = require("./lib/app-seed");

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

appSeed(argv, argv._[0])
  .then(() => console.log(chalk.blue("    DONE")))
  .catch(err => console.log(`err`, err));
