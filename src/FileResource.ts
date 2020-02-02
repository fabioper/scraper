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

    async download(dest: string): Promise<void> {
        try {
            console.log(`Downloading: ${chalk.cyan(this.name)} at: ${chalk.dim(dest)}`)
            const request = await axios.get(this.path, { responseType: 'arraybuffer' })
            const data = await request.data
            await fs.writeFile(path.resolve(dest, this.name), data)
            console.log(`${chalk.green('✓')} File ${chalk.cyan(this.name)} sucessfully downloaded.`)
        } catch(e) {
            console.error(e)
        }
    }
}
