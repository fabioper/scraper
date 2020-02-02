import puppeteer, { LaunchOptions, Page } from 'puppeteer'
import url from 'url'
import { FileSearcher } from './FileSearcher'
import { FileResource } from './FileResource'
import chalk from 'chalk'

type SearcherOptions = { wrapper: string; name: string; path: string; attr: string }

export class Browser {
    private readonly options: LaunchOptions;
    private readonly baseUrl: string;
    private browser: puppeteer.Browser;
    private page: Page;

    constructor(baseUrl: string, options?: LaunchOptions) {
        this.baseUrl = baseUrl
        this.options = options
    }

    public async initialize(): Promise<void> {
        this.browser = await puppeteer.launch(this.options)
        this.page = await this.browser.newPage()
    }

    public async navigate(path: string): Promise<void> {
        console.log(`\n\nNavigating to: ${chalk.cyanBright(path)}`)
        await this.page.goto(`${this.baseUrl}${path}`)
    }

    public async paginate(nextSelector: string, cb: Function): Promise<void> {
        const nextElement = await this.page.$(nextSelector)
        const currentPage = url.parse(this.page.url()).pathname
        console.log(`\n\nNavigating to: ${chalk.green(currentPage)}`)

        await cb(this.page)

        if (!nextElement) { return }

        await Promise.all([
            this.page.waitForNavigation(),
            (async (): Promise<void> => {
                await nextElement.click()
            })()
        ])

        await this.paginate(nextSelector, cb)
    }

    public searchForResourcesUsing(options: SearcherOptions): Promise<FileResource[]> {
        const searcher = new FileSearcher(this.page, options)
        return searcher.find()
    }

    public async close(): Promise<void> {
        await this.browser.close()
    }
}
