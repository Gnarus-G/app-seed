const Listr = require("listr");
const { promptForScope, promptForTemplate, copyTemplate, installNpmDeps } = require(".");

const appSeed = async (argv, target) => {

    const scope = await promptForScope();
    const template = await promptForTemplate(scope);

    const tasks = new Listr([
        {
            title: "Copy project files",
            task: () => copyTemplate({ scope, template, target })
        },
        {
            title: "NPM install",
            task: () => installNpmDeps(target),
            enabled: () => argv.install
        },
        {
            title: "Git init",
            task: () => intializeGit(target),
            enabled: () => argv.git
        },
    ]);

    await tasks.run();
}

module.exports = appSeed;