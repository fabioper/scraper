import fs from 'fs-extra'
import path from 'path'
import { Resource } from './Resource'
import { FileResource } from './FileResource'
import chalk from 'chalk'

export class FolderResource extends Resource {
    private readonly name: string;
    private path: string;

    constructor(name: string) {
        super()
        this.name = name
    }

    public async ensureItWasCreated(dir?: string): Promise<FolderResource> {
        this.path = dir || path.resolve(__dirname, '..', this.name)

        console.log(`Creating a new folder at: ${chalk.dim(this.path)}`)

        try {
            await fs.ensureDir(path.resolve(this.path))
            console.log(`${chalk.green('✓')} Folder ${chalk.cyan(this.name)} successfully created.\n\n`)
            return this
        } catch(e) {
            console.error(e)
        }
    }

    public async appendTo(resource: FolderResource): Promise<FolderResource> {
        await this.ensureItWasCreated(path.resolve(resource.path, this.name))
        return this
    }

    public async downloadResources(resources: FileResource[]): Promise<FolderResource> {
        for (const resource of resources) {
            try {
                await resource.download(this.path)
            } catch (e) {
                console.error(chalk.red(e.message))
            }
        }

        return this
    }
}
