import {ClonerRepository} from "@/src/backend/clonerRepository";

export class RepoCloner {
    constructor(private readonly cloner: ClonerRepository) {
    }

    async clone(url: string, path: string) {
        await this.cloner.clone(url, path);
    }
}