const query = require('./query');

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

query.createTable(commentTable);

Comment.prototype.add = async function() {
    let insertQuery = 'INSERT INTO comments (user, body, date) VALUES (?, ?, ?)';
    let values = [this.user, this.body, this.date];
    return query.edit(insertQuery, values);
};

Comment.getComments = function() {
    let selectQuery = 'SELECT * FROM comments ORDER BY date DESC';
    return query.getRecords(selectQuery);
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
    let deleteQuery = 'DELETE FROM comments WHERE id=?';
    return query.edit(deleteQuery, [id]);
};

Comment.count = async function() {
    let counter = await Comment.getComments();
    return counter.length;
};

module.exports = Comment;