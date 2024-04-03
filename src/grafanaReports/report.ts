import * as puppeteer from 'puppeteer';

// Set the browser width in pixels. The paper size will be calculated on the basus of 96dpi,
// so 1200 corresponds to 12.5".
// A4 -> 8.268 in -> 795 px
const width_px = 795;
// const width_px = 1200;
// Note that to get an actual paper size, e.g. Letter, you will want to *not* simply set the pixel
// size here, since that would lead to a "mobile-sized" screen (816px), and mess up the rendering.
// Instead, set e.g. double the size here (1632px), and call page.pdf() with format: 'Letter' and
// scale = 0.5.

// Generate authorization header for basic auth

export async function getBrowser(): Promise<puppeteer.Browser> {
    return await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
}

interface GetReportsArgs {
    browser: puppeteer.Browser
    basicAuth: {
        username: string
        password: string
    }
    url: string
    viewportHeight?: number

    // if set, save report to file
    outPath?: string
}

export async function getReport({browser, basicAuth, url, viewportHeight, outPath}: GetReportsArgs): Promise<Buffer> {
    const page = await browser.newPage();

    // Set basic auth headers
    const auth_header = 'Basic ' + Buffer.from(basicAuth.username + ':' + basicAuth.password).toString('base64');
    await page.setExtraHTTPHeaders({'Authorization': auth_header});
    await page.setViewport({
        width: width_px,
        height: viewportHeight ?? 3000,
        // height: 800,
        deviceScaleFactor: 2,
        isMobile: false
    })

    // Wait until all network connections are closed (and none are opened withing 0.5s).
    // In some cases it may be appropriate to change this to {waitUntil: 'networkidle2'},
    // which stops when there are only 2 or fewer connections remaining.
    await page.goto(url, {waitUntil: 'networkidle0', timeout:120000});
    const panel = await page.waitForSelector('.react-grid-layout', {timeout: 120000});

    let height_px = await panel?.evaluate(async (panel) => panel.getBoundingClientRect().bottom);
    if (height_px === undefined)
        throw new Error('Could not calculate height');

    height_px += 20

    console.log('rendering pdf');

    return await page.pdf({
        path: outPath,
        width: width_px + 'px',
        height: height_px + 'px',
        displayHeaderFooter: false,
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        printBackground: true,
    });
}
