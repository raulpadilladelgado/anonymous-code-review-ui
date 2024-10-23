"use server"

import os from "os";
import fs from "fs";
import path from "path";
import {SimpleGitClonerRepository} from "@/src/backend/simpleGitClonerRepository";
import {RepoCloner} from "@/src/backend/repoCloner";
import {Octokit} from "octokit";
import simpleGit from "simple-git";

export async function cloneRandomRepositoryServerAction() {
    console.log("HElllooo")
    await cloneRandomRepository(new RepoCloner(new SimpleGitClonerRepository()));
}

export async function cloneRandomRepository(repoCloner: RepoCloner) {
    const tmpDir = os.tmpdir();
    const repos = [
        "https://github.com/octocat/Hello-World",
        "https://github.com/raulpadilladelgado/botlinera",
        "https://github.com/raulpadilladelgado/toolify"
    ];

    const repoUrl = repos[Math.floor(Math.random() * repos.length)];
    const repoName = path.basename(repoUrl, ".git");
    const repoPath = path.join(tmpDir, repoName);

    if (fs.existsSync(repoPath)) {
        fs.rmSync(repoPath, {recursive: true, force: true});
        console.log(`Existing repository directory for ${repoName} removed.`);
    }

    console.log(`Cloning repository ${repoUrl}...`);
    await repoCloner.clone(repoUrl, repoPath);
    console.log(`Repository cloned to: ${repoPath}`);

    const gitDir = path.join(repoPath, ".git");
    if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, {recursive: true, force: true});
        console.log(`\`.git\` directory removed for ${repoName}.`);
    } else {
        console.log(`\`.git\` directory does not exist for ${repoName}.`);
    }

    const newRepoUrl = await crearRepoEnOrg(repoName);
    if (newRepoUrl) {
        await subirCodigo(repoPath, newRepoUrl);
        const newRepoDevUrl = newRepoUrl.replace('.com', '.dev').replace('.git', '');
        console.log(`Redirigiendo a: ${newRepoDevUrl}`);
        return newRepoDevUrl;
    }
}

async function crearRepoEnOrg(repoName: string) {
    const octokit = new Octokit({
        auth: '<token>', // Sustituye con tu PAT
    });
    try {
        const response = await octokit.rest.repos.createInOrg({
            org: 'anonymous-code-review',
            name: repoName,
            private: false,  // O puedes usar false si quieres que sea público
            description: 'Descripción del repositorio',
        });
        console.log('Repositorio creado con éxito:', response.data);
        return response.data.clone_url;
    } catch (error) {
        console.error('Error al crear el repositorio:', error);
    }
}

async function subirCodigo(repoPath: string, newRepoUrl: string) {
    const git = simpleGit(repoPath);
    try {
        await git.init();
        await git.checkoutLocalBranch("main");
        await git.addConfig("user.email", "anonymous@codereview.com");
        await git.addConfig("user.name", "Anonymous Code Review");
        await git.add(".");
        await git.commit("Initial commit");
        await git.addRemote("origin", `https://<token>@${newRepoUrl.replace('https://', '')}`);
        await git.push("origin", "main", {"--set-upstream": null});
        console.log('Código subido con éxito al nuevo repositorio.');
    } catch (error) {
        console.error('Error al subir el código al nuevo repositorio:', error);
    }
}
