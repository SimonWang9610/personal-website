const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const Article = require('../lib/articles');
const PERPAGE = 5;

//handle /articles
router.get('/', async (req, res, next) => {
    let rows = await Article.getArticles();
    let total = rows.length;
    rows = rows.slice(0, PERPAGE);
    console.log(rows);
    fs.readFile(path.join(__dirname, '../public', '/pages/articles.html'), 'utf8', (err, html) => {
        res.json({
            html: html,
            rows: rows,
            page: 1,
            total: total,
            number: Math.ceil(total / PERPAGE),
            admin: res.locals.admin,
        });
    });
});

//add a new article in database
//redirect to /articles
router.post('/', async (req, res, next) => {
    console.log(req.body);
    await new Article(req.body).add().then(() => {
        res.redirect('/articles');
    }).catch(err =>  next(err));
});

//handle /articles/:page?
router.get('/:page?', async (req, res, next) => {
    let page = req.params.page;
    await Article.getRange((page - 1) * PERPAGE, page * PERPAGE).then(rows => {
        res.json({
            rows: rows,
            admin: res.locals.admin,
        });
    }).catch(err =>  next(err));
});

//handle /articles/display/:id? to display single article in $('#contents')
router.get('/display/:id?', async (req, res, next) => {
    let id = req.params.id;
    await Article.getArticleById(id).then(article => {
        res.json({
            article: article[0],
            admin: res.locals.admin,
        });
    }).catch(err => next(err));
});

//delete one existed article
router.get('/delete/:id?', async (req, res, next) => {
    let id = req.params.id;
    await Article.delete(id).then(() => {
        res.redirect('/articles');
    }).catch(err =>  next(err));
});



//handle /articles/edit/:id? to modify the exitsted article in database 
//(need admin permission) 
router.get('/edit/:id?', async (req, res, next) => {
    let id = req.params.id;
    await Article.getArticleById(id).then(article => {
        res.json({
            article: article,
            admin: res.locals.admin,
        });
    });
});

//update the edited article in database
//redirect to /articles
router.post('/edit/:id?', async (req, res, next) => {
    let id = req.params.id;
    let editedArticle = req.body;
    await Article.edit(id, editedArticle).then(() => {
        res.redirect('/articles');
    }).catch(err => next(err));
});

module.exports = router;