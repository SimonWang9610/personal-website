const router = require('express').Router();
const Utils = require('../utils/Utils');
const fs = require('fs');
const defaultBannerFile = '/public/tcp/assets/default-banner.png';

router.get('/', (req, res, next) => {
	// let filePath = req.params.filePath;

	// fs.readFile(filePath, function(err, data) {
	// 	console.log('Starting stream banner');
	// 	streamFile(defaultBannerFile, res);

	// });
	streamFile(defaultBannerFile, res);
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
