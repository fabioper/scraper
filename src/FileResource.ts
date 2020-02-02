import axios from 'axios'
import fs from 'fs-extra'
import path from 'path'
import { Resource } from './Resource'
import chalk from 'chalk'

export class FileResource extends Resource {
    name: string;
    path: string;

    constructor(name: string, path: string) {
        super()
        this.name = name
        this.path = path
    }

    async dispatchDownload(filepath: string): Promise<void> {
        try {
            const request = await axios.get(this.path, { responseType: 'arraybuffer' })
            const data = await request.data
            await fs.writeFile(filepath, data)
        } catch(e) {
            console.error(e)
        }
    }

    public async download(dest: string): Promise<void> {
        const filepath = path.resolve(dest, this.name)
        if (await this.fileExists(filepath)) {
            return console.log('File already exists. Skipping...')
        }

        console.log(`Downloading: ${chalk.cyan(this.name)} at: ${chalk.dim(dest)}`)
        await this.dispatchDownload(filepath)
        console.log(`${chalk.green('✓')} File ${chalk.cyan(this.name)} sucessfully downloaded.`)
    }

    private fileExists(filepath: string): Promise<boolean> {
        return fs.pathExists(filepath)
    }
}
