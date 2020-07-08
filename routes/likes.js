
const router = require('express').Router();
const articleLogic = require('../logics/article-logic');
const Utils = require('../utils/Utils');

router.get('/:id', async (req, res, next) => {
	let articleGuid = req.params.id;

	try {
		let likes = await articleLogic.getLikeCounts(articleGuid); //the number of likes
		return res.status(200).json(likes);
	} catch(err) {
		return Utils(res, false, 'NotFoundLikes');
	}
});


router.post('/:id', async (req, res, next) => {
	let articleGuid = req.params.id;

	try {
		let rowsAffected = await likeLogic.increaseLikeCounts(articleGuid);
		if (rowsAffected) {
			return Utils.resp(res, true, 'LikeAdded');
		} else {
			return Utils.resp(res, false, 'AleadyLiked');
		}
	} catch(err) {
		return res.status(500).json({
			message: 'Internal Error'
		});
	}
});

module.exports = router;