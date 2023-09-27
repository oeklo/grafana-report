# Grafana report mailer

UNSTABLE

script that renders grafana dashboards to PDF and emails them.

## Configuration

Environment variables:

- REPORT_URLS - semicolon-separated list of dashboard URLs. Script will append &kiosk to each of them before opening
- GRAFANA_USERNAME - normal username with view rights in grafana
- GRAFANA_PASSWORD - password
- MAIL_HOST - hostname of the SMTP server
- MAIL_USERNAME - login in SMTP server
- MAIL_PASSWORD - password in SMTP server
- MAIL_FROM - sender in format '"name" <email>'
- MAIL_TO - colon separated list of recipients
