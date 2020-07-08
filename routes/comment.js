
const router = require('express').Router();
const commentLogic = require('../logics/comment-logic');
const Utils = require('../utils/Utils');

router.get('/:id', async (req, res, next) => {
	let articleGuid = req.params.id;

	try {
		let comments = await commentLogic.getComments(articleGuid);
		return res.status(200).json(comments);
	} catch(err) {
		console.log(err);
		return res.json(err);
	}
});

router.post('/add', (req, res, next) => {
	let comment = req.body;
	return commentLogic.addComment(comment).then(rowsAffected => {
		if (rowsAffected) {
			return Utils.resp(res, true, 'Comment added');
		} else {
			return Utils.resp(res, false, 'FailedToAddComment');
		}
	});
});

router.delete('/:commentGuid', async (req, res, next) => {
	let commentGuid = req.params.commentGuid;

	try {
		await commentLogic.deleteCommet(commentGuid).then(rowsAffected => {
			return Utils.resp(res, true, 'Comment deleted');
		});
	} catch(err) {
		return Utils.resp(res, false, 'Failed to delete comment');
	}
});

module.exports = router;