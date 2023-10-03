# Email Grafana PDF Reports

Generate pdf reports for grafana dashboards using nodejs and puppeteer, and email them over SMTP.

This is a fork of
[kartik468/grafana-generate-pdf-nodejs](https://github.com/kartik468/grafana-generate-pdf-nodejs)
originally based on [this gist](https://gist.github.com/svet-b/1ad0656cd3ce0e1a633e16eb20f66425)

## Usage

This project is mainly intended for use in kubernetes cronJob.

### Environment variables

- REPORT_URLS - semicolon-separated list of dashboard URLs. Script will append &kiosk to each of them before opening
- GRAFANA_USERNAME - normal (not service) username with view rights in grafana
- GRAFANA_PASSWORD - grafana password
- MAIL_HOST - hostname of the SMTP server
- MAIL_USERNAME - login in SMTP server
- MAIL_PASSWORD - password in SMTP server
- MAIL_FROM - sender in format '"name" <email>'
- MAIL_TO - colon separated list of recipients

If all MAIL_* variables are present, the reports will be emailed, otherwise they're written to the current directory as 'report-n.pdf'. This is intended for debugging purposes.
