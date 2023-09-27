import {getBrowser, getReport} from "./report";
import {sendMail} from "./email";

(async () => {
    const urls = process.env.REPORT_URLS!.split(';')
    const basicAuth = {
        username: process.env.GRAFANA_USERNAME!,
        password: process.env.GRAFANA_PASSWORD!,
    }
    const mail = {
        host: process.env.MAIL_HOST!,
        username: process.env.MAIL_USERNAME!,
        password: process.env.MAIL_PASSWORD!,
        from: process.env.MAIL_FROM!,
        to: process.env.MAIL_TO!.split(':'),
    }

    const browser = await getBrowser();
    try {
        const reports: Record<string, Buffer> = {};
        // using Promise.all breaks output
        for (const url of urls)
            reports[url] = await getReport({
                url: url + '&kiosk',
                browser,
                basicAuth,
                viewportHeight: 4000,
            });
        await sendMail({
            reports,
            ...mail,
        });
    } finally {
        await browser.close();
    }
})();
