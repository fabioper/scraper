import fs from 'fs-extra'
import path from 'path'
import { Resource } from './Resource'

export class FolderResource extends Resource {
    private _path: string;
    
    constructor(name: string) {
        super(name)
        this.append = this.append.bind(this)
    }

    get path(): string {
        return this._path;
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

        return resource
    }

    private async appendFolder(resource: FolderResource) {
        try {
            await resource.ensureItWasCreated(path.resolve(this.path, resource.name))
        } catch(e) {
            console.error(e)
        }
    }
}
