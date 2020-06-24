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

router.get('/:page?', async (req, res, next) => {
    let page = req.params.page;
    let rows = await Comment.getRange((page - 1) * PERPAGE, page * PERPAGE);
    res.json({
        rows: rows,
        admin: res.locals.admin,
    });
});

router.get('/delete/:id?', async (req, res, next) => {
    let id = req.params.id
    let result = await Comment.delete(id);
    console.log(result);
    console.log(`Deleted ${id}`);
    res.redirect('/messages');
});

router.get('/reply/:user?', async (req, res, next) => {
    let user = req.params.user;
    let replies = await Reply.getReplies(user);
    replies.then(replies => {
        res.json({
            replies: replies,
        });
    });
});

router.post('/', async (req, res,next) => {
    let comment = new Comment(req.body);
    comment.add().then(() => {
        res.redirect('/messages');
    }).catch(err => next(err));
});


module.exports = router;