"use strict;"

const config = {
	mailgun: {
		privateApiKey: process.env.MAILGUN_PRIVATE_API_KEY,
		publicApiKey: process.env.MAILGUN_PUBLIC_API_KEY,
		domain: process.env.MAILGUN_DOMAIN,
	},
	recaptcha: {
		siteKey: process.env.RECAPTCHA_SITE_KEY,
		secretkey: process.env.RECAPTCHA_SECRET_KEY,
	},
}

module.exports = config;

