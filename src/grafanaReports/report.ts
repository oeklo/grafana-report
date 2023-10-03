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
        headless: 'new',
        // headless: false,
        // devtools: true
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

    // Increase timeout from the default of 30 seconds to 120 seconds, to allow for slow-loading panels
    page.setDefaultNavigationTimeout(120000);

    // Increasing the deviceScaleFactor gets a higher-resolution image. The width should be set to
    // the same value as in page.pdf() below. The height is not important
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
    await page.goto(url, {waitUntil: 'networkidle0'});


    // Hide all panel description (top-left "i") pop-up handles and, all panel resize handles
    // Annoyingly, it seems you can't concatenate the two object collections into one
    await page.evaluate(() => {
        let infoCorners = document.getElementsByClassName('panel-info-corner');
        for (const el of infoCorners) {
            (el as HTMLElement).hidden = true;
        }
        let resizeHandles = document.getElementsByClassName('react-resizable-handle');
        for (const el of resizeHandles) {
            (el as HTMLElement).hidden = true;
        }
    });

    // Get the height of the main canvas, and add a margin
    var height_px = await page.evaluate(() => {
        return document.getElementsByClassName('react-grid-layout')[0].getBoundingClientRect().bottom;
    }) + 20;

    return await page.pdf({
        path: outPath,
        width: width_px + 'px',
        height: height_px + 'px',
        //    format: 'Letter', <-- see note above for generating "paper-sized" outputs
        // format: 'a4',
        // scale: .5,
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
