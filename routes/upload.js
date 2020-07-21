process.env.NODE_CONFIG_DIR = '../config/';
const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const config = require('config');
const path = require('path');
const moment = require('moment');
const Utils = require('../utils/Utils');
const fileLogic = require('../logics/file-logic');
const MimeType = require('../utils/MimeType');

const upload = multer({
	dest: '../uploads'
});

router.post('/article', upload.array('files[]', 5), (req, res, next) => {
	processFileForArticle(req, res);
});

// router.post('/article/:id', uploader.array('files[]', 5), (req, res, next) => {
// 	processFileForExistArticle(req, res);
// });

async function processFileForArticle(req, res) {
	if (req.files.length > 0) {
		let file = req.files[0];

		file.OriginalName = formatFileName(file.originalname);

		let sourcePath = file.path;

		let tempPath = path.join(__dirname, '../vault/temp');

		await fs.ensureDir(tempPath).then(() => {
			let { newFileName, url } = createUrl(file.OriginalName);
			file.url = url;
			file.name = newFileName;
		});

		let destPath = path.join(tempPath, file.name);
		// store file in local temp directory
		fs
			.copy(sourcePath, destPath)
			.then(() => {
				sendResponse(true, 'Image Uploaded', file, res);
			})
			.catch((err) => {
				res.json(err);
			});
	} else {
		sendResponse(false, 'Bad Request', null, res);
	}
}

function sendResponse(success, message, file, res) {
	return res.status(200).json({
		success: success,
		message: message,
		file: file
	});
}

function formatFileName(filename) {
	let pos = filename.lastIndexOf('.');
	let ext = pos != -1 ? filename.substring(pos + 1) : null;
	if (ext) {
		ext = ext.toLowerCase();
		return filename.substring(0, pos) + '.' + ext;
	}
	return filename;
}

function createUrl(filename) {
	let fileId = Utils.uuid();
	let newFileName = fileId + '.' + Utils.getExtName(filename);
	let url = createFileUrl(newFileName, true);
	return { newFileName, url };
}

// function createImageColumns(filename) {
// 	let fileId = Utils.uuid();
// 	let extension = Utils.getExtName(filename);
// 	let newFileName = fileId + '.' + extension;
// 	let url = createFileUrl(newFileName, true);
// 	let type = MimeType.getContentType(newFileName);
// 	return { fileId, newFileName, url, type };
// }

function createFileUrl(name, isImage) {
	let folder = null;
	let url = '/api/v1';
	if (isImage) {
		folder = '/images/' + getFileUploadSubFolder();
		url += '/vault' + folder + '/' + name;
	}
	return url;
}

function getFileUploadSubFolder() {
	return moment().format('YYYYMMDD');
}

module.exports = router;
