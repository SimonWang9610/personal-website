const fileModel = require('../models/file-model');
const fs = require('fs-extra');
const Utils = require('../utils/Utils');
const MimeType = require('../utils/MimeType');
const path = require('path');

module.exports.saveFiles = function(articleGuid, files) {
	if (files.urls.length) {
		var ids = [];
		var downloadUrls = [];
		var contentTypes = [];

		files.urls.forEach(async (url, index) => {
			let { sourcePath, destFolder, destPath, filename } = splitFileUrl(url);
			let { downloadUrl, id } = formatUrl(destPath, filename);
			console.log('module.exports.saveFiles -> downloadUrl', downloadUrl);
			downloadUrls.push(downloadUrl);
			ids.push(id);
			contentTypes.push(MimeType.getContentType(filename));

			await fs.ensureDir(destFolder);
			await fs.move(sourcePath, destPath);
		});
		console.log(downloadUrls);

		return fileModel.saveFiles(ids, downloadUrls, files.oldNames, contentTypes, articleGuid);
	} else {
		let affectedRows = 0;
		return affectedRows;
	}
};
/* try {
			await fs.ensureDir(destFolder);
			await fs.move(sourcePath, destPath);
			let contentType = MimeType.getContentType(filename);
			let affectedRows = await fileModel.saveFiles(
				id,
				downloadUrl,
				files.oldNames[index],
				contentType,
				articleGuid
			);
			console.log('module.exports.saveFiles -> affectedRows', affectedRows);
		} catch (err) {
			throw err;
		}
	});
	return Promise.resolve(); */

module.exports.deleteFile = function(fileGuid) {
	return fileModel.deleteFile(fileGuid);
};

function splitFileUrl(url) {
	let pos = url.indexOf('vault');
	let namePos = url.lastIndexOf('/');
	let filename = url.substring(namePos + 1);
	console.log('splitFileUrl -> filename', filename);

	let destFolder = path.join(__dirname, '../', url.substring(pos, namePos));
	console.log('splitFileUrl -> destFolder', destFolder);

	let sourcePath = path.join(__dirname, '../', 'vault/temp', filename);
	console.log('splitFileUrl -> sourcePath', sourcePath);

	let destPath = path.join(__dirname, '../', url.substring(pos));
	console.log('splitFileUrl -> destPath', destPath);

	return { sourcePath, destFolder, destPath, filename };
}

function formatUrl(destPath, filename) {
	let pos = destPath.indexOf('vault');
	let extPos = filename.lastIndexOf('.');
	let downloadUrl = destPath.substring(pos - 1);
	let id = filename.substring(0, extPos);
	return { downloadUrl, id };
}
