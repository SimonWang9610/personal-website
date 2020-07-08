
const router = require('express').Router();
const dot = require('dot');
const articleLogic = require('../logics/article-logic');
const noteLogic = require('../logics/note-logic');
const Files = require('../utils/Files');
const Utils = require('../utils/Utils');

// query all articles
router.get('/article', async (req, res, next) => {

	try {
		let articles = await articleLogic.getArticles();
		return res.status(200).json(articles);
	} catch(err) {
		return res.status(500).json({
			message: 'Internal Error'
		});
	}
});

// redirect to article.html to display single article
router.get('/article/:id', async (req, res, next) => {
	let articleGuid = req.params.id;

	try {
		let filePath = 'config/templates/article.html';
		let contentType = 'text/html';
		let data = Files.readFile(filePath);
		let templateParams = {
			Navbar: await Utils.createNavbar(),
			Banner: await Utils.createBanner(),
			Footer: await Utils.createFooter(),
			articleGuid: articleGuid 
		}

		let htmlTemplate = data.toString();
		let templateFn = dot.template(htmlTemplate);
		let html = templateFn(templateParams);
		res.writeHead(200, {'Content-Type': contentType});
		res.end(html);
	} catch(err) {
		res.end(err);
	}
});

router.get('/article/single/:id', async (req, res, next) => {
	let articleGuid = req.params.id;

	let article = await articleLogic.getSingleArticle(articleGuid);
	return res.status(200).json(article);
	
});

router.get('/note', async (req, res, next) => {

	try {
		let notes = await noteLogic.getNotes();
		return res.status(200).json(notes);
	} catch(err) {
		return res.status(500).json({
			message: 'Internal Error'
		});
	}
});


router.get('/note/:id', async (req, res, next) => {
	let noteGuid = req.params.id;

	try {
		let filePath = 'config/templates/note.html';
		let contentType = 'text/html';
		let data = Files.readFile(filePath);
		let templateParams = {
			Navbar: await Utils.createNavbar(),
			Banner: await Utils.createBanner(),
			Footer: await Utils.createFooter(),
			noteGuid: noteGuid 
		}

		let htmlTemplate = data.toString();
		let templateFn = dot.template(htmlTemplate);
		let html = templateFn(templateParams);
		res.writeHead(200, {'Content-Type': contentType});
		res.end(html);
	} catch(err) {
		res.end(err);
	}
});

router.get('/note/single/:id', async (req, res, next) => {
	let noteGuid = req.params.id;

	let note = await noteLogic.getSingleNote(noteGuid);
	return res.status(200).json(note);
	
});

module.exports = router;