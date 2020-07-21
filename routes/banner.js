const router = require('express').Router();
const Utils = require('../utils/Utils');
const path = require('path');
const fs = require('fs-extra');
const defaultBannerFile = path.join(__dirname, '../public/tcp/assets/default-banner.png');
// make sure the file path is correct

router.get('/', (req, res, next) => {
	/* fs.readFile(defaultBannerFile).then((data) => {
		console.log(data);
	}); */

	streamFile(defaultBannerFile, res);
	/* console.log(req);
	console.log('start streaming!');
	streamFile(defaultBannerFile, res); */
});

function streamFile(filePath, res) {
	fs.exists(filePath, function(exists) {
		if (exists) {
			console.log(exists);
			let contentType = 'image/png';
			res.writeHead(200, { 'Content-Type': contentType });
			fs.createReadStream(filePath).pipe(res);
		}
	});
}

module.exports = router;
