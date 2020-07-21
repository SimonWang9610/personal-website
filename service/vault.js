const _ = require('loadsh');
const Promise = require('bluebird');
const config = require('config');
const moment = require('moment');
const Utils = require('../utils/Utils');
const Files = require('../utils/Files');

module.exports.upload = function(fqfn, isVideo) {
	let extension = Utils.getExtName(fqfn);
	let contentType = MimeType.getContentType(fqfn);
	let fileId = Utils.uuid();
	let newFilename = fileId + '.' + extension;
	let folder = null;
	let location = null;
	let poster = null;
	let path = null;

	if (isVideo) {
		folder = '/videos/' + getFileUploadSubFolder(); // create sub-folder based on date
		location = config.storage.vault.video + folder + '/' + newFilename;
		poster = config.storage.vault.video + folder + '/' + fileId + '.jpg'; //create the first frame picture
		path = folder + '/' + newFilename;
	} else {
		folder = '/images/' + getFileUploadSubFolder();
		location = config.storage.vault.image + folder + '/' + newFilename;
		path = folder + '/' + newFilename;
	}

	let tempPath = config.storage.vault.root + folder;
	let dstPath = tempPath + '/' + newFilename;

	return Files.mkdir(tempPath)
		.then((result) => {
			return Files.copyFile(fqfn, dstPath);
		})
		.then((result) => {
			return {
				location: location,
				poster: poster,
				path: path
			};
		});
};

module.exports.deleteObject = function(obj, isVideo) {
	let path = config.storage.vault.root + obj.FilePath;
	return Files.deleteFile(path);
};

module.exports.getObjectName = function(url) {
	let pos = url.lastIndexOf('/');

	if (pos != -1) {
		return url.substring(pos);
	} else {
		return url;
	}
};

module.exports.saveImages = function(articleGuid, files) {
	let operations = [];
	let filenames = Object.keys(files);

	filenames.forEach((filename) => {
		if (MimeType.isImageFile(filename)) {
			operations.push(saveImage(articleGuid, files[filename]));
		}
	});

	if (operations.length) {
		return Promise.all(operations).then((results) => {
			return results;
		});
	} else {
		return Promise.resolve(true);
	}
};

module.exports.saveVideos = function(articleGuid, files) {
	let operations = [];
	let filenames = Object.keys(files);

	filenames.forEach((filename) => {
		if (MimeType.isVideoFile(filename)) {
			operations.push(saveVideo(articleGuid, files[filename]));
		}
	});

	if (operations.length) {
		return Promise.all(operations).then((results) => {
			return results;
		});
	} else {
		return Promise.resolve(true);
	}
};

function saveImage(filename) {}

function saveVideo(filename) {}


// Question: why use FacesUrl&ThumbnailUrl to delete files?
module.exports.deleteImage = function(image) {
	return module.exports.deleteObject(image, false).then((result) => {
		return image.DownloadUrl;
	});
};

module.exports.deleteVideo = function(video) {};

function getFileUploadSubFolder() {
	return moment().format('YYYYMMDD');
}
