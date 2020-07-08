
function Storage(prefix) {

	this.exists = function(name) {
		return this.get(name);
	}

	this.get = function(name) {
		let value = window.localStorage.getItem(prefix + name);
		if (value && value[0] === "{") {
			value = JSON.parse(value);
		}
		return value;
	}

	this.set = function(name, value) {
		try {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			}
			window.localStorage.setItem(prefix + name, value);
		} catch(exception) {
			return false;
		}
		return true;
	}

	this.remove = function(name) {
		window.localStorage.removeItem(prefix + name);
		return true;
	}

	this.clear = function() {
		window.localStorage.clear();
	}
}