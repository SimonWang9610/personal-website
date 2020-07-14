const router = require('express').Router();
const config = require('config');
const articleLogic = require('../logics/article-logic');
const pagination = require('../middleware/pagination');
const Utils = require('../utils/Utils');

// redirect to new page 'article-editor.html'
router.get('/', pagination(), async (req, res, next) => {
	let type = req.query.type;
	let offset = req.query.offset;
	let from = req.query.from;
	let state = req.query.state;

	try {
		let articles = null;

		if (type === 'latest') {
			articles = await articleLogic.getLatestArticle();
		} else {
			let total = null;
			articles = await articleLogic.getArticles(type, from, offset);

			// if not from index 0, pagination does not change
			// therefore no need to query count
			// after first loading page, currentState is aet as 0;
			if (!from && state) {
				let count = await articleLogic.count(type);
				total = Math.ceil(count / config.pagination.perPage);
				articles.push(total);
			}
		}

		return res.status(200).json(articles);
	} catch (err) {
		return res.status(500).json(err);
	}
});

router.get('/:id', async (req, res, next) => {
	let articleGuid = req.params.id;
	try {
		let article = await articleLogic.getSingleArticle(articleGuid);

		console.log(article);

		if (article) {
			return res.status(200).json(article);
		} else {
			return Utils.resp(res, false, 'NotFoundArticle');
		}
	} catch (err) {
		console.log(err);
		return res.json(err);
	}
});

// router.get('/latest', async (req, res, next) => {

// 	console.log(req.headers);
// 	console.log(req.body);
// 	console.log(req.params);

// 	try {
// 		let article = await articleLogic.getLatestArticle();
// 		console.log(article);
// 		return res.statu(200).json(article);
// 	} catch(err) {
// 		console.log(err);
// 		return res.status(401).json(err);
// 	}
// });

//save the edited article
router.post('/edit/:id', (req, res, next) => {
	let articleGuid = req.params.id;
	let article = req.body;
	article.Guid = articleGuid;
	console.log(article);
	return articleLogic
		.editArticle(article)
		.then((rowsAffected) => {
			if (rowsAffected) {
				return Utils.resp(res, true, 'ArticleEdited');
			} else {
				return Utils.resp(res, false, 'FailedEditArticle');
			}
		})
		.catch((err) => {
			console.log(err);
			return res.json(err);
		});
});

// create a new article
router.post('/create', (req, res, next) => {
	let newArticle = req.body;
	console.log(newArticle);
	return articleLogic.createArticle(newArticle).then((rowsAffected) => {
		if (rowsAffected) {
			return Utils.resp(res, true, 'ArticleCreated!');
		} else {
			return Utils.resp(res, false, 'FailedCreateArticle');
		}
	});
});

router.post('/view/:id', async (req, res, next) => {
	let articleGuid = req.params.id;

	try {
		await articleLogic.increaseViewsCount(articleGuid).then((rowsAffected) => {
			return Utils.resp(res, true, 'OK');
		});
	} catch (err) {
		return Utils.resp(res, false, 'FailedIncreaseViewsCount');
	}
});

router.delete('/:id', (req, res, next) => {
	let articleGuid = req.params.id;
	return articleLogic.deleteArticle(articleGuid).then((rowsAffected) => {
		if (rowsAffected) {
			return Utils.resp(res, true, 'ArticleDeleted');
		} else {
			return Utils.resp(res, false, 'FailedDeleteArticle');
		}
	});
});

module.exports = router;
