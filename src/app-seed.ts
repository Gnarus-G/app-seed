import Listr from "listr";
import { promptForScope, promptForTemplate, copyTemplate, installNpmDeps, intializeGit } from "./utils";

type Options = {
    git: boolean,
    install: boolean,
}

const appSeed = async (argv: Options, target: string) => {

    const scope = await promptForScope();
    const template = await promptForTemplate(scope);

    const tasks = new Listr([
        {
            title: "Copy project files",
            task: () => copyTemplate(scope, template, target)
        },
        {
            title: "Git init",
            task: () => intializeGit(target),
            enabled: () => argv.git
        },
        {
            title: "NPM install",
            task: () => installNpmDeps(target),
            enabled: () => argv.install
        },
    ]);

    await tasks.run();
}

export default appSeed;