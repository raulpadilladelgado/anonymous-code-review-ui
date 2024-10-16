export interface ClonerRepository {
    clone(url: string, path: string): Promise<void>;
}