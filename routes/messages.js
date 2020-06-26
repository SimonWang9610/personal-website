const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const Comment = require('../lib/comment');
const Reply = require('../lib/replies');
const PERPAGE = 5;

router.get('/', async (req, res, next) => {
    let rows = await Comment.getComments();
    let total = rows.length;
    rows = rows.slice(0, PERPAGE);

    fs.readFile(path.join(__dirname, '../public', '/pages/messages.html'), 'utf8', (err, html) => {
        if (err) return next(err);
        res.json({
            html: html,
            rows: rows,
            page: 1,
            total: total,
            number: Math.ceil(total / PERPAGE),
            admin: res.locals.admin,
        });
    });
    // res.sendFile(path.join(__dirname, '../public', '/pages/messages.html'));
});

router.post('/', async (req, res,next) => {
    console.log(req.body);
    new Comment(req.body).add().then(() => {
        res.redirect('/messages');
    }).catch(err => next(err));
});

router.get('/:page?', async (req, res, next) => {
    let page = req.params.page;
    console.log(page);
    await Comment.getRange((page - 1) * PERPAGE, page * PERPAGE).then(rows => {
        res.json({
            rows: rows,
            admin: res.locals.admin,
        });
    });
});

router.get('/delete/:id?', async (req, res, next) => {
    let id = req.params.id
    await Comment.delete(id).then(() => {
        console.log(`Deleted ${id}`);
        res.redirect('/messages');
    }).catch(err => next(err));
});

router.get('/reply/:user?', async (req, res, next) => {
    let user = req.params.user;
    await Reply.getReplies(user).then(replies => {
        res.json({
            replies: replies,
        });
    }).catch(err => next(err));
});


module.exports = router;