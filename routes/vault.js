const router = require('express').Router();
const fileLogic = require('../logics/file-logic');
const fs = require('fs-extra');
const MimeType = require('../utils/MimeType');
const path = require('path');
const Utils = require('../utils/Utils');

router.get('/temp/:filename', (req, res, next) => {
	let filePath = path.join(__dirname, '../vault/temp', req.params.filename);
	streamFile(res, filePath);
});

router.get('/images/:folder/:filename', (req, res, next) => {
	let folder = req.params.folder;
	let filename = req.params.filename;

	let filePath = path.join(__dirname, '../vault/images', folder, filename);
	fs
		.pathExists(filePath)
		.then((exists) => {
			if (exists) {
				streamFile(res, filePath);
			} else {
				let url = '/api/v1/vault/temp/' + filename;
				console.log('redirecting');
				res.redirect(url);
			}
		})
		.catch((err) => {
			res.end(err);
		});
});

router.delete('/images/:folder/:filename', (req, res, next) => {
	let folder = req.params.folder;
	let filename = req.params.filename;

	let filePath = path.join(__dirname, '../vault/images', folder, filename);
	let tempPath = path.join(__dirname, '../vault/temp', filename);
	return fs
		.remove(filePath)
		.then(() => {
			console.log('removed from vault/images', filename);
			return fs.remove(tempPath).then(() => {
				console.log('remove from vault/temp', filename);
				return Utils.resp(res, true, 'RemoveFiles');
			});
		})
		.catch((err) => {
			console.log(err);
			return Utils.resp(res, false, 'FailedRemoveFile');
		});
});

router.delete('/empty', (req, res, next) => {
	let folder = path.join(__dirname, '../vault', 'temp');
	fs
		.emptyDir(folder)
		.then(() => {
			return Utils.resp(res, true, 'EmptyDir');
		})
		.catch((err) => {
			console.log(err);
			return Utils.resp(res, false, 'FailedEmptyDir');
		});
});
function streamFile(res, filePath) {
	fs
		.pathExists(filePath)
		.then((exists) => {
			if (exists) {
				let contentType = MimeType.getContentType(filePath);

				res.writeHead(200, { 'Content-Type': contentType });
				fs.createReadStream(filePath).pipe(res);
			} else {
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.end('404 Not Found');
			}
		})
		.catch((err) => {
			res.end(err);
		});
}

module.exports = router;
