const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const Utils = require('../utils/Utils');
const adminLogic = require('../logics/admin-logic');

router.post('/', async (req, res, next) => {
	let payload = req.body;

	try {
		let admin = await adminLogic.validateCredentials(payload.adminKey);
		if (admin.Guid) {
			let affectedRows = await adminLogic.updateLastLogin(admin.Guid);
			return createJWT(admin, res);
		} else {
			console.log('Invalid admin key');
			return Utils.resp(res, false, 'InvalidAdminKey');
		}
	} catch (err) {
		console.log(err);
		return res.json(err);
	}
});

function createJWT(admin, res) {
	let options = {};

	options.expiresIn = config.jwt.expiresInMinutes;
	options.audience = config.jwt.audience;
	options.issuer = config.jwt.issuer;

	let message = {
		Guid: admin.Guid,
		LastLogin: admin.LastLogin
	};

	let secretBase64 = Buffer.from(config.jwt.secret).toString('base64');

	let token = jwt.sign(message, secretBase64, options);

	let result = {
		success: true,
		message: 'LoginSuccess',
		token: token
	};

	return res.status(200).json(result);
}

module.exports = router;
