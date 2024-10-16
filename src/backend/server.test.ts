import { describe, it, expect, vi } from "vitest";
import {cloneRandomRepository} from "@/src/backend/server";

import {ClonerRepository} from "@/src/backend/clonerRepository";
import {RepoCloner} from "@/src/backend/repoCloner";

class MockClonerRepository implements ClonerRepository {
    clone = vi.fn().mockResolvedValue(undefined);
}

describe("Server should", () => {
    it("clone random repository given a list", async () => {
        const mockCloner = new MockClonerRepository();
        const repoCloner = new RepoCloner(mockCloner);

        await cloneRandomRepository(repoCloner);

        expect(mockCloner.clone).toHaveBeenCalled();
    });
});