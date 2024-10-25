import {RepositoryManager} from "@/src/backend/repositoryManager";
import simpleGit from "simple-git";
import {Octokit} from "octokit";
import {Option} from "@leanmind/monads";

export class GitRepositoryManager implements RepositoryManager {
    async clone(url: string, path: string): Promise<void> {
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
            return Option.of(response.data.clone_url);
        } catch (error) {
            console.error('Error al crear el repositorio:', error);
            return Option.of(null);
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