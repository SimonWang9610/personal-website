const query = require('./query');

function Reply(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
};

//comment: user/body/date

let replyTable = 'CREATE TABLE IF NOT EXISTS replies (' + 'id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
                    + 'user VARCHAR(255) NOT NULL, '
                    + 'others VARCHAR(255) NOT NULL, '
                    + 'body VARCHAR(255), '
                    + 'date TIMESTAMP NOT NULL)';

query.createTable(replyTable);

Reply.prototype.add = async function() {
    let insertQuery = 'INSERT INTO replies (user, body, date) VALUES (?, ?, ?)';
    let values = [this.user, this.body, this.date];
    return query.edit(insertQuery, values);
};

Reply.getReplies = function(user) {
    let selectQuery = 'SELECT * FROM replies WHERE user=? ORDER BY date DESC';
    return query.getRecords(selectQuery, [user]);
};
Reply.getRange = async function(from, to) {
    let rows = await Reply.getReplies();

    let pageRows =[]
    for (let i = from; i < to; i++) {
        if (!rows[i]) break;
        pageRows.push(rows[i]);
    }
    return pageRows;
};

Reply.delete = async function(id) {
    let deleteQuery = 'DELETE FROM replies WHERE id=' + id;
    return query.edit(deleteQuery);
};

Reply.count = async function(user) {
    let counter = await Reply.getReplies(user);
    return counter.length;
};

module.exports = Reply;