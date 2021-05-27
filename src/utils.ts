import { readdir } from "fs";
import inquirer from "inquirer";
import ncp from "ncp";
import execa from "execa";
import { join } from "path";
import { promisify } from "util";

const readDir = promisify(readdir);
const copy = promisify(ncp);

export async function promptForScope() {
    const { scope } = await inquirer.prompt([
        {
            type: "list",
            name: 'scope',
            message: "Select a scope/environment for this project.",
            choices: await getScopes()
        }
    ])
    return scope;
}

export async function promptForTemplate(scope: string) {
    const { template } = await inquirer.prompt([
        {
            type: "list",
            name: 'template',
            message: "Select a project template.",
            choices: await getTemplates(scope)
        }
    ])
    return template;
}

export async function copyTemplate(scope: string, template: string, target: string) {
    const source = join(templateDir(), scope, template)
    return copy(source, target, {
        clobber: false
    });
}

export async function intializeGit(target: string) {
    await execa("git", ["init", target]);
    process.chdir(target);
    await execa("git", ["add", "."]);
    await execa("git", ["commit", "-am", "Initial commit"]);
}

export async function installNpmDeps(targetDir: string) {
    await execa("mkdir", ["-p", targetDir + "/node_modules"])
    await execa("npm", ["i", "--prefix", targetDir]);
}

async function getScopes() {
    return readDir(templateDir());
}

async function getTemplates(scope: string) {
    const templates = join(templateDir(), scope);
    return readDir(templates);
}

function templateDir() {
    return join(__dirname, "../templates");
}