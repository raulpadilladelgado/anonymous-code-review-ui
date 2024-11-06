import {RepositoryManager} from "@/src/backend/repositoryManager";
import simpleGit from "simple-git";
import {Octokit} from "octokit";
import {exec} from "node:child_process";

export class GitRepositoryManager implements RepositoryManager {
    async clone(url: string, path: string): Promise<void> {
        exec(`git -v`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al clonar el repositorio: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error al clonar el repositorio: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
        });
        await simpleGit().clone(url, path);
    }

    async createInRemote(repoName: string){
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
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
            throw error;
        }
    }

   async push(repoPath: string, newRepoUrl: string): Promise<void> {
       const git = simpleGit(repoPath);
       try {
           await git.init();
           await git.checkoutLocalBranch("main");
           await git.addConfig("user.email", "anonymous@codereview.com");
           await git.addConfig("user.name", "Anonymous Code Review");
           await git.add(".");
           await git.commit("Initial commit");
           await git.addRemote("origin", `https://${process.env.GITHUB_TOKEN}@${newRepoUrl.replace('https://', '')}`);
           await git.push("origin", "main", {"--set-upstream": null});
           console.log('Código subido con éxito al nuevo repositorio.');
       } catch (error) {
           console.error('Error al subir el código al nuevo repositorio:', error);
       }
    }
}