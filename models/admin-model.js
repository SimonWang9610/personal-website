process.env.NODE_CONFIG_DIR = '../config'

const _ = require('loadsh');
const query = require('../models/query');
const Strings = require('../utils/String');
const config = require('config');
const Utils = require('../utils/Utils');

module.exports.validateCredentials = function(key) {

	let sql = 'SELECT * FROM t_admin';
	return query.execute({
		statement: sql
	}).then(rs => {
		if (_.isEmpty(rs)) {
			return [];
		} else {
			let validateKey = Utils.createHashPassword(key, rs[0].SaltKey, config.password.hashAlgorithm);
			if (validateKey === rs[0].Password) {
				delete rs[0].SaltKey;
				delete rs[0].Password;
				return rs[0];
			} else {
				return [];
			}
		}
	});
};

module.exports.updateLastLogin = function(id) {
	let params = [];
	params.push(Strings.formatDate());
	params.push(id);

	let sql = 'UPDATE t_admin SET LastLogin=? WHERE Guid=?';
	return query.execute({
		statement: sql,
		params: params 
	}).then(rs => {
		if (rs.affectedRows === 1) {
			return rs.affectedRows;
		} else {
			throw new Error(rs.message);
		}
	});
};

module.exports.createAdmin = function(id) {
	let params = createParams(id);

	let sql = 'INSERT INTO t_admin SET ?';

	return query.execute({
		statement: sql,
		params: params
	}).then(rs => {
		if (rs.affectedRows === 1) {
			return rs.affectedRows;
		} else {
			throw new Error(rs.message);
		}
	});
}


function createParams(id) {
	let params = {};

	let SaltKey = Utils.createSaltKey(config.password.saltKeyLength);
	let hashPassword = Utils.createHashPassword(config.admin.key, SaltKey, config.password.hashAlgorithm);
	params.Guid = id;
	params.SaltKey = SaltKey;
	params.Password = hashPassword;
	console.log(params);
	return params;
}