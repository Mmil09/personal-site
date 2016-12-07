var config = require('../config');
var mailgun = require('mailgun-js')({apiKey: config.mailgun.privateApiKey, domain: config.mailgun.domain});
var myEmail = 'michael@michael-j-miller.com';
var fromEmail = 'messages@mail.michael-j-miller.com';

module.exports.renderIndex = function(req, res) {
	return res.render('index', {
		recaptchaSiteKey: config.recaptcha.siteKey,
		myEmail: myEmail,
	});
}

module.exports.sendMessage = function(req, res) {
	console.log(req.body);

	var data = req.body;
	var gCaptcha = data['g-recaptcha-response']

	if (!gCaptcha || gCaptcha.length === 0) {
		return res.status(400).send({
			message: "Please complete recaptcha"
		})
	}

	var email = data.email;
	var message = data.message;

	//TODO: also validate
	if (!email || email.length === 0) {
		return res.status(400).send({
			message: "Please provide an email address"
		})	
	}

	if (!message || message.length === 0) {
		return res.status(400).send({
			message: "Please provide a message"
		})			
	}

	var mailgunEmail = createMailgunEmailFromData(data);

	mailgun.messages().send(mailgunEmail, function (error, body) {
		if (error) {
			console.log('Error sending email: ', error);
			return res.status(400)
		}

	  return res.status(200).send('hello')
	});
	
}

function createMailgunEmailFromData(data) {
	var email = {
	  from: fromEmail,
	  to: myEmail,
	  subject: data.subject,
	};

	email.text = 'from: ' + data.name + ' <' + data.email + '> via michael-j-miller.com' + '>\n';
	email.text +='message: \n\n' + data.message;

	return email;
}

