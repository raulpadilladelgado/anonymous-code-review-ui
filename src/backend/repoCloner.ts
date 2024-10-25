import {RepositoryManager} from "@/src/backend/repositoryManager";

export class RepoCloner {
    constructor(private readonly cloner: RepositoryManager) {
    }

    async clone(url: string, path: string) {
        await this.cloner.clone(url, path);
    }
}