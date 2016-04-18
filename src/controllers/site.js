var config = require('../config');
var mailgun = require('mailgun-js')({apiKey: config.mailgun.privateApiKey, domain: config.mailgun.domain});
var myEmail = 'mmil09@gmail.com'

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

	var data = {
	  from: data.name + '<' + data.email + '>',
	  to: myEmail,
	  subject: data.subject,
	  text: data.message,
	};

	mailgun.messages().send(data, function (error, body) {
		if (error) {
			console.log('Error sending email: ', error);
			return res.status(400)
		}

	  console.log(body);
	  return res.status(200).send('hello')
	});

	
}