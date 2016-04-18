
var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 4567,
    publicDir = process.argv[2] || __dirname + '/public',
    path = require('path'),
    config = require('./config'),
    controllers = require('./controllers'),
    siteController = controllers.site;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

app.get('/', siteController.renderIndex);
app.post('/send-message', siteController.sendMessage);

app.listen(port, function() {
  console.log("Server listening on port %s", port);
});