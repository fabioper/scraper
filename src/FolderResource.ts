import fs from 'fs-extra'
import path from 'path'
import { Resource } from './Resource'
import { FileResource } from './FileResource'
import { FileSearcher } from './FileSearcher'

export class FolderResource extends Resource {
    name: string;
    private _path: string;

    constructor(name: string) {
        super()
        this.name = name
        this.append = this.append.bind(this)
    }

    get path(): string {
        return this._path
    }

    public async ensureItWasCreated(dir?: string): Promise<FolderResource> {
        this._path = dir || path.resolve(__dirname, '..', 'dest', this.name)

        try {
            await fs.ensureDir(path.resolve(this.path))
            return this
        } catch(e) {
            console.error(e)
        }
    }

    public async append(resource: Resource): Promise<Resource> {
        if (resource instanceof FolderResource) {
            await this.appendFolder(resource)
        }

        if (resource instanceof FileResource) {
            await resource.download(this.path)
        }

        return resource
    }

    public async searchForResourcesUsing(searcher: FileSearcher): Promise<FileResource[]> {
        return searcher.find()
    }

    private async appendFolder(resource: FolderResource) {
        try {
            await resource.ensureItWasCreated(path.resolve(this.path, resource.name))
        } catch(e) {
            console.error(e)
        }
    }
}