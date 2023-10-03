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
        to: process.env.MAIL_TO?.split(':')!,
    }
    type MailKeys = keyof typeof mail;
    const doMail = Object
        .keys(mail)
        .map((key) => mail[key as MailKeys])
        .map(key => !!key).reduce((prev, curr) => prev && curr, true);

    const browser = await getBrowser();
    const reports: Record<string, Buffer> = {};
    try {
        // using Promise.all breaks output
        for (const [index, url] of urls.entries()) {
            console.log('Getting report', index);
            reports[url] = await getReport({
                url: url + '&kiosk',
                browser,
                basicAuth,
                viewportHeight: 4000,
                outPath: doMail ? undefined : `./report-${index + 1}.pdf`,
            });
        }
    } finally {
        await browser.close();
    }
    if (doMail) {
        console.log('Emailing reports.');
        await sendMail({
            reports,
            ...mail,
        });
    }
    console.log('Done.')
})();
