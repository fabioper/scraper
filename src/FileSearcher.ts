import { FileResource } from './FileResource'
import { Page, ElementHandle } from 'puppeteer'
import slug from 'slug'
import path from 'path'

type FilesProperties = {
    name: string;
    path: string;
}

export class FileSearcher {
    selector: { wrapper: string; name: string; path: string; attr: string };
    page: Page;

    constructor(page: Page, options: { wrapper: string; name: string; path: string; attr: string }) {
        this.selector = options
        this.page = page
    }

    public async find(): Promise<FileResource[]> {
        console.log('Searching for files...')
        const wrappers = await this.page.$$(`${this.selector.wrapper}`)
        const files = []

        for (const wrapper of wrappers) {
            const { name, path } = await this.extractNameAndPath(wrapper)

            files.push(new FileResource(
                this.parseFilename(name, path),
                path
            ))
        }

        console.log(`∷ ${wrappers.length} resources were found.\n\n`)
        return files
    }

    private async extractNameAndPath(wrapper: ElementHandle): Promise<FilesProperties> {
        const elements = await this.findElements(wrapper)
        const name = await elements.name.evaluate(this.extractTextContent)
        const path = await elements.path.evaluate(this.extractPath, this.selector.attr)
        return { name, path }
    }

    private extractPath(node: Element, attr: string): string {
        return node[attr]
    }

    private extractTextContent(node: Element): string {
        return node.textContent.trim()
    }

    private parseFilename(filename: string, filepath: string): string {
        return slug(filename) + path.extname(filepath)
    }

    private async findElements(wrapper: ElementHandle<Element>): Promise<{ name: ElementHandle; path: ElementHandle }> {
        const name = await wrapper.$(this.selector.name)
        const path = await wrapper.$(this.selector.path)
        return { name, path }
    }
}
