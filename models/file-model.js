const query = require('../models/query');
const Strings = require('../utils/String');

// module.exports.saveFiles = function(id, downloadUrl, oldName, contentType, articleGuid) {
// 	let sql = 'INSERT INTO t_file SET ?';
// 	let params = createParams(id, downloadUrl, oldName, contentType, articleGuid);
// 	/* console.log('module.exports.saveFiles -> articleGuid', articleGuid);
// 	console.log('module.exports.saveFiles -> contentTypes', contentTypes);
// 	console.log('module.exports.saveFiles -> oldNames', oldNames);
// 	console.log('module.exports.saveFiles -> downloadUrls', downloadUrls);
// 	console.log('module.exports.saveFiles -> ids', ids); */
// 	console.log('module.exports.saveFiles -> params', params);

// 	return query
// 		.execute({
// 			statement: sql,
// 			params: params
// 		})
// 		.then((affectedRows) => {
// 			return affectedRows;
// 		});
// };

module.exports.saveFiles = function(ids, downloadUrls, oldNames, contentTypes, articleGuid) {
	let sql = 'INSERT INTO t_file SET ?';
	let params = createParams(ids, downloadUrls, oldNames, contentTypes, articleGuid);
	console.log('module.exports.saveFiles -> params', params);

	return query
		.execute({
			statement: sql,
			params: params
		})
		.then((affectedRows) => {
			return affectedRows;
		});
};

module.exports.deleteFile = function(id) {
	let sql = 'DELETE FROM t_file WHERE Guid=?';
	return query
		.execute({
			statement: sql,
			params: [ id ]
		})
		.then((affectedRows) => {
			return affectedRows;
		});
};

function createParams(ids, urls, names, contentTypes, articleGuid) {
	let params = [];
	urls.forEach((url, index) => {
		let date = Strings.formatDate();
		let row = {
			Guid: ids[index],
			DownloadUrl: url,
			OriginalName: names[index],
			ContentType: contentTypes[index],
			CreationDate: date,
			ArticleGuid: articleGuid
		};
		params.push(row);
	});
	return params;
}

// function createParams(id, downloadUrl, name, contentType, articleGuid) {
// 	let params = {};
// 	params.Guid = id;
// 	params.DownloadUrl = downloadUrl;
// 	params.OriginalName = name;
// 	params.ContentType = contentType;
// 	params.CreationDate = Strings.formatDate();
// 	params.ArticleGuid = articleGuid;
// }
