const { readdir } = require("fs");
const inquirer = require("inquirer");
const ncp = require("ncp");
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
    return { template, scope };
}

async function copyTemplate({ scope, template }, targetDir) {
    const source = join(process.cwd(), TEMPLATES_ROOT, scope, template)
    return copy(source, targetDir, {
        clobber: false
    });
}

module.exports = {
    promptForScope,
    promptForTemplate,
    copyTemplate
}