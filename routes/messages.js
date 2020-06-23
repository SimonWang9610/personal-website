const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const Comment = require('../lib/comment');
const PERPAGE = 5;

router.get('/', async (req, res, next) => {
    let rows = await Comment.getComments();
    let total = rows.length;
    console.log(total);
    rows = rows.slice(0, PERPAGE);
    fs.readFile(path.join(__dirname, '../public', '/pages/messages.html'), 'utf8', (err, html) => {
        res.json({
            html: html,
            rows: rows,
            page: 1,
            number: Math.ceil(total / PERPAGE),
        });
    });
    // res.sendFile(path.join(__dirname, '../public', '/pages/messages.html'));
});

router.get('/:page?', async (req, res, next) => {
    let page = req.params.page;
    let rows = await Comment.getRange((page - 1) * PERPAGE, page * PERPAGE);
    console.log(rows);
    res.json({
        rows: rows,
    })
});

module.exports = router;