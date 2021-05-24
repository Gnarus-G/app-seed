const { readdir } = require("fs");
const inquirer = require("inquirer");
const ncp = require("ncp");
const execa = require("execa");
const { join } = require("path");
const { promisify } = require("util");

const readDir = promisify(readdir);
const copy = promisify(ncp);

const TEMPLATES_ROOT = "templates";

async function getScopes() {
    const scopes = join(process.cwd(), TEMPLATES_ROOT);
    return readDir(scopes);
}

async function getTemplates(scope) {
    const templates = join(process.cwd(), TEMPLATES_ROOT, scope);
    return readDir(templates);
}

async function promptForScope() {
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

async function promptForTemplate(scope) {
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

async function copyTemplate({ scope, template, target}) {
    const source = join(process.cwd(), TEMPLATES_ROOT, scope, template)
    return copy(source, target, {
        clobber: false
    });
}

async function intializeGit(target) {
  await execa("git", ["init", target]);
  await execa("git", ["add", target]);
  await execa("git", ["commit", "-am", "Initial commit"]);
}

async function installNpmDeps(targetDir) {
  await execa("mkdir", ["-p", targetDir + "/node_modules"])
  await execa("npm", ["i", "--prefix", targetDir]);
}

module.exports = {
    promptForScope,
    promptForTemplate,
    copyTemplate,
    intializeGit,
    installNpmDeps
}