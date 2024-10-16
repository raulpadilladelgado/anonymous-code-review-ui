import {ClonerRepository} from "@/src/backend/clonerRepository";
import simpleGit from "simple-git";

export class SimpleGitClonerRepository implements ClonerRepository {
    async clone(url: string, path: string): Promise<void> {
        await simpleGit().clone(url, path);
    }
}