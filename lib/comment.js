const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '961002',
    database: 'scheduler'
});

function Comment(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
};

//comment: user/body/date

let commentTable = 'CREATE TABLE IF NOT EXISTS comments (' + 'id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
                    + 'user VARCHAR(255) NOT NULL, '
                    + 'body VARCHAR(255), '
                    + 'date TIMESTAMP NOT NULL)';

db.query(commentTable, (err) => {
    if (err) throw err;
});

Comment.prototype.add = async function() {
    db.query(
        'INSERT INTO comments (user, body, date) VALUES (?, ?, ?)',
        [this.user, this.body, thist.date],
        (err) => {
            if (err) throw err;
        }
    );
    return;
}

Comment.getComments = function() {
    let queryStr = 'SELECT * FROM comments ORDER BY date DESC';
    
    return new Promise((resolve, reject) => {
        db.query(queryStr, (err, results) => {
            if (err) return reject(err);
            return resolve(results)
        });
    });
};

Comment.getRange = async function(from, to) {
    let rows = await Comment.getComments();

    let pageRows =[]
    for (let i = from; i < to; i++) {
        if (!rows[i]) break;
        pageRows.push(rows[i]);
    }
    return pageRows;
};

Comment.delete = async function(id) {
    db.query(
        'DELETE FROM comments WHERE id=?',
        [id], (err) => {
            if (err) throw err;
        }
    );
    return;
};

Comment.count = async function() {
    let counter = await Comment.getComments();
    return counter.length;
}


module.exports = Comment;