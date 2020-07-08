
// encapsulate ajax request as Object
function AjaxServiceProvider(opts) {
	var self = this;

	function createHeaders() {
		var headers = {};
		var token = SimonStorage.get('token');

		if (token) {
			headers['apikey'] = token;
		}
		return headers;
	}

	function sendData(method, url, payload, callback) {
		if (typeof payload == 'function') {
			callback = payload;
			payload = null;
		}

		let req = {
			type: method,
			url: url,
			headers: createHeaders(),
			contentType: 'application/json',
			dataType: 'json'
		}

		if (payload) {
			req.data = JSON.stringify(payload);
		}

		$.ajax(req)
		.done(function(data) {
			callback(null, data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
            callback({
                success: false,
                message: jqXHR.responseJSON ? jqXHR.responseJSON : jqXHR.statusText,
                status: jqXHR.status
        	});
        });
	}

	this.getData = function(url, callback) {
		$.ajax({
			type: 'GET',
			cache: false,
			url: url,
			headers: createHeaders(),
			contentType: 'application/json',
			dataType: 'json'
		}).done(function(data) {
			callback(null, data);
		}).fail(function(jqXHR, textStatus, errorThrown) {
            callback({
                success: false,
                message: jqXHR.responseJSON ? jqXHR.responseJSON : jqXHR.statusText,
                status: jqXHR.status
        	});
        });
	}

	this.postData = function(url, payload, callback) {
		sendData('POST', url, payload, callback);
	}

	this.deleteData = function(url, payload, callback) {
		sendData('DELETE', url, payload, callback);
	}

}