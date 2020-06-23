const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res, next) => {
    fs.readFile(path.join(__dirname, '../public', '/pages/daily.html'), 'utf8', (err, html) => {
        res.json({
            html: html,
        });
    });
});

module.exports = router;