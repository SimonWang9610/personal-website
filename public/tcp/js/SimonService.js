/*
@params:contentType {'article', 'note'}
@params:content {article, note}
@params:fileType {'video', 'image'}

*/
function SimonServiceProvider(_service) {
	var service = _service;

	this.getLatestArticle = function(type, cb) {
		let apiUrl = '/api/v1/article?type=' + type;
		service.getData(apiUrl, cb);
	};

	this.getSingleArticle = function(id, cb) {
		let apiUrl = '/api/v1/article/' + id;
		service.getData(apiUrl, cb);
	};

	this.getArticles = function(page, type, state, cb) {
		let apiUrl = '/api/v1/article?page=' + page;
		if (state) apiUrl += '&state=' + state;
		if (type) apiUrl += '&type=' + type;
		service.getData(apiUrl, cb);
	};

	/* this.getArticlesByPage = function(type, page, cb) {
		let apiUrl = '/api/v1/article?page=' + page;

		if (type) {
			apiUrl += '&type=' + type;
		}

		service.getData(apiUrl, cb);
	}; */

	this.create = function(content, cb) {
		let apiUrl = '/api/v1/article/create';
		service.postData(apiUrl, content, cb);
	};

	this.edit = function(payload, cb) {
		let apiUrl = '/api/v1/article/create/';

		if (payload.article.Guid) apiUrl = '/api/v1/article/edit/' + payload.article.Guid;

		service.postData(apiUrl, payload, cb);
	};

	// this.save = function(contentType, content, cb) {
	// 	let apiUrl = '/api/v1/' + contentType + '/' + content.Guid;
	// 	service.postData(apiUrl)
	// }

	this.deleteArticle = function(id, cb) {
		let apiUrl = '/api/v1/article/' + id;
		service.deleteData(apiUrl, cb);
	};

	this.changeAsset = function(fileType, fileId, asset, cb) {
		let apiUrl = '/api/v1/valut/' + fileType + '/' + fileId;
		service.postData(apiUrl, asset, cb);
	};

	this.deleteAsset = function(assetUrl, cb) {
		service.deleteData(assetUrl, cb);
	};

	this.getComments = function(contentId, cb) {
		let apiUrl = '/api/v1/comments/' + contentId;
		service.getData(apiUrl, cb);
	};

	this.addComment = function(payload, cb) {
		let apiUrl = '/api/v1/comments/add';
		service.postData(apiUrl, payload, cb);
	};

	this.deleteComment = function(id, cb) {
		let apiUrl = '/api/v1/comments/delete' + id;
	};

	this.getLikes = function(contentId, cb) {
		let apiUrl = '/api/v1/likes/' + contentId;
		service.getData(apiUrl, cb);
	};

	this.addLike = function(id, cb) {
		let apiUrl = '/api/v1/likes/' + id;
		service.postData(apiUrl, cb);
	};

	this.increaseViewsCount = function(contentId, cb) {
		let apiUrl = '/api/v1/article/view/' + contentId;
		let payload = {
			Count: 1
		};
		service.postData(apiUrl, payload, cb);
	};

	this.getAdmin = function(payload, cb) {
		let apiUrl = '/api/v1/admin';
		service.postData(apiUrl, payload, cb);
	};
}
