import puppeteer, { LaunchOptions, Page } from 'puppeteer'
import { FileSearcher } from './FileSearcher'
import { FileResource } from './FileResource'

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

    public async redirect(path: string): Promise<void> {
        await this.page.goto(`${this.baseUrl}${path}`)
    }

    public async navigate(nextSelector: string, cb: Function): Promise<void> {
        const nextElement = await this.page.$(nextSelector)

        if (!nextElement) { return }

        await cb(this.page)

        await Promise.all([
            this.page.waitForNavigation(),
            (async (): Promise<void> => {
                await nextElement.click()
            })()
        ])

        await this.navigate(nextSelector, cb)
    }

    public searchForResourcesUsing(options: SearcherOptions): Promise<FileResource[]> {
        const searcher = new FileSearcher(this.page, options)
        return searcher.find()
    }

    public async close(): Promise<void> {
        await this.browser.close()
    }
}
