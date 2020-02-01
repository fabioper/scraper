import axios from 'axios'
import fs from 'fs-extra'
import path from 'path'
import slug from 'slug'
import { Resource } from './Resource'

export class FileResource extends Resource {
    name: string;
    path: string;

    constructor(name: string, path: string) {
        super()
        this.name = name
        this.path = path
    }

    async download(dest: string, format: string): Promise<void> {
        const request = await axios.get(this.path, { responseType: 'arraybuffer' })
        const data = await request.data
        console.log(`Downloading => ${this.name}\nat: ${dest}\n\n`)
        await fs.writeFile(path.resolve(dest, this.name), data)
    }
}
