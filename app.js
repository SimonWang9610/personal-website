const express = require('express');
const http = require('http');
const i18n = require('i18n');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
// const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const dot = require('dot');
const config = require('config');
// const {expressCspHeader, NONE, SELF} = require('express-csp-header');

const Files = require('./utils/Files');
const Utils = require('./utils/Utils');

const commentRoute = require('./routes/comment');
const adminRoute = require('./routes/admin');
const uploadRoute = require('./routes/upload');
const bannerRoute = require('./routes/banner');
const articleRoute = require('./routes/article');
// const likeRoute = require('./routes/like');
const vaultRoute = require('./routes/vault');

const completeApi = require('./middleware/api.js');
const app = express();

i18n.configure({
	locales: [ 'en', 'zh' ],
	directory: __dirname + '/config/locales',
	queryParameter: 'lang'
});

app.use(i18n.init);

app.use(cors({ allowedHeaders: [ 'apikey' ] }));
app.use(methodOverride());
// app.use(cookieParser('961002'));
// app.use(session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

const dist = path.resolve(__dirname, 'public');
app.use(express.static(dist));

app.use(completeApi);
app.use('/api/v1/banner', bannerRoute);
app.use('/api/v1/admin', adminRoute);
// app.use('/api/v1/banner', bannerRoute);
app.use('/api/v1/article', articleRoute);
app.use('/api/v1/vault', vaultRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/upload', uploadRoute);

app.get('/', async (req, res, next) => {
	console.log('---------------------');

	let title = 'SimonWang';
	let filePath = 'config/templates/index.html';
	let contentType = 'text/html';

	try {
		let data = await Files.readFile(filePath);
		let templateParams = {
			Title: title,
			Navbar: await Utils.createNavbar(),
			Banner: Utils.createBanner(),
			Footer: await Utils.createFooter()
		};

		let htmlTemplate = data.toString();
		let templateFn = dot.template(htmlTemplate);
		let html = templateFn(templateParams);

		res.writeHead(200, { 'Content-Type': contentType });
		res.end(html);
	} catch (err) {
		res.end('Internal server error!');
	}
});

const port = config.http.port;
console.log(port);
const httpServer = http.createServer(app);
httpServer.listen(port, (err) => {
	console.log(`API Gateway is listening on port ${httpServer.address().port}`);
});

// startGateway();

// function startGateway() {
// 	let port  = config.http.port;
// 	let httpServer = http.createServer(app);

// 	setupSecureRoutes();

// 	httpServer.liste(port, (err) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			msg = `API Gateway is listening on port ${httpServer.address().port}`
// 			console.log(msg);
// 		}
// 	});
// }

// function setupSecureRoutes() {

// 	app.use(function(req, res, next) {
// 		res.set({'Cache-Control': 'no-cache, no-store, must-revalidate'});
// 		next();
// 	});

// 	// app.use('/api/v1/admin', adminRoute);
// 	app.use('/api/v1/article', articleRoute);
// 	app.use('/api/v1/note', noteRoute);
// 	app.use('api/v1/uploader', uploadRoute);
// 	app.use('/api/v1/banner', bannerRoute);
// }
