"use server"

import os from "os";
import fs from "fs";
import path from "path";
import {SimpleGitClonerRepository} from "@/src/backend/simpleGitClonerRepository";
import {RepoCloner} from "@/src/backend/repoCloner";

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
}

