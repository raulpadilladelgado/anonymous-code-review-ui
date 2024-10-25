import { describe, it, expect, vi } from "vitest";
import {execute} from "@/src/backend/server";

import {RepositoryManager} from "@/src/backend/repositoryManager";
import {RepoCloner} from "@/src/backend/repoCloner";

class MockClonerRepository implements RepositoryManager {
    clone = vi.fn().mockResolvedValue(undefined);
}

describe("Server should", () => {
    it("clone random repository given a list", async () => {
        const mockCloner = new MockClonerRepository();
        const repoCloner = new RepoCloner(mockCloner);

        await execute(repoCloner);

        expect(mockCloner.clone).toHaveBeenCalled();
    });
});