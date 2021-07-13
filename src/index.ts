#!/usr/bin/env node
import { blue, green } from "chalk";
import yargs from "yargs";
import appSeed, { Options } from "./app-seed";

const APP_NAME = "@gnarus-g/app-seed";

const argv = yargs(process.argv.slice(2))
    .usage(`${blue(APP_NAME)} ${green("<dir>")}`)
    .option("git", {
        alias: "g",
        type: "boolean",
        default: true,
        description: "Initialize git"
    })
    .option("install", {
        alias: "i",
        type: "boolean",
        default: true,
        description: "Install npm dependencies"
    })
    .check((argv, _) => {
        if (!argv._[0])
            throw new Error("Please specify the target directory; for example:\n" +
                `${blue(APP_NAME)} ${green("my-app")}\n`);

        return true;
    })
    .argv;

const TARGET_DIR = (argv as any)._[0];

appSeed(argv as Options, TARGET_DIR)
    .then(() => console.log(blue("    DONE")))
    .catch(err => console.log(`err`, err));
