import Listr from "listr";
import { promptForScope, promptForTemplate, copyTemplate, installNpmDeps, intializeGit } from "./utils";

export type Options = {
    git: boolean,
    install: boolean,
}

const appSeed = async (argv: Options, targetDir: string) => {

    const scope = await promptForScope();
    const template = await promptForTemplate(scope);

    const tasks = new Listr([
        {
            title: "Copy project files",
            task: () => copyTemplate(scope, template, targetDir)
        },
        {
            title: "Git init",
            task: () => intializeGit(targetDir),
            enabled: () => argv.git
        },
        {
            title: "NPM install",
            task: () => installNpmDeps(targetDir),
            enabled: () => argv.install
        },
    ]);

    await tasks.run();
}

export default appSeed;