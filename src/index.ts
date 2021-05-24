#!/usr/bin/env node
import { blue, green } from "chalk";
import appSeed from "./app-seed";

const APP_NAME = "app-seed";

const argv = require('yargs/yargs')(process.argv.slice(2))
  .usage(`${blue(APP_NAME)} ${green("<dir>")}`)
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
      throw new Error( "Please specify the target directory; for example:\n" +
        `${blue(APP_NAME)} ${green("my-app")}\n`);

    return true;
  })
  .argv

appSeed(argv, argv._[0])
  .then(() => console.log(blue("    DONE")))
  .catch(err => console.log(`err`, err));
