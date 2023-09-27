import * as nodemailer from 'nodemailer';

const comment = "Please see attachments.";
const htmlTemplate = (urls: string[]) => `<span>Links to grafana dashboards:<br>${urls.map((url, idx) => `<a href="${url}">Report ${idx + 1}</a><br>`).join('\n')}${comment}.</span>`
const textTemplate = (urls: string[]) => `Links to grafana dashboards:\r\n${urls.join('\r\n')}\r\n${comment}\r\n`;

interface SendMailArgs {
    reports: Record<string, Buffer>
    from: string
    to: string[]
    host: string
    username: string
    password: string
}

export async function sendMail({reports, from, to, host, username, password}: SendMailArgs) {
    const transporter = nodemailer.createTransport({
        host,
        port: 465,
        secure: true,
        auth: {
            user: username,
            pass: password,
        },
    });
    const info = await transporter.sendMail({
        from,
        to,
        subject: "Grafana reports",
        text: textTemplate(Object.keys(reports)),
        html: htmlTemplate(Object.keys(reports)),
        attachments: Object.keys(reports).map((url, idx) => ({
            filename: `report-${idx + 1}.pdf`,
            content: reports[url],
        })),
    });

    console.log("Message sent:", info);
}
