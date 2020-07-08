
const adminModel = require('../models/admin-model');
const Utils = require('../utils/Utils');
const config = require('config');

module.exports.validateCredentials = function(key) {
	return adminModel.validateCredentials(key);
};

module.exports.updateLastLogin = function(id) {
	return adminModel.updateLastLogin(id);
};

function createAdmin() {
	let id = Utils.uuid();
	console.log(id);
	return adminModel.createAdmin(id);
}


// createAdmin();