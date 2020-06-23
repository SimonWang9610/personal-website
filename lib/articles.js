const query = require('./query');

function Article(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
};

let articleTable = 'CREATE TABLE IF NOT EXISTS articles ('
    + 'id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
    + 'title VARCHAR(255) NOT NULL, '
    + 'body VARCHAR(255) NOT NULL, '
    + 'date TIMESTAMP NOT NULL)';

query.createTable(articleTable);

Article.prototype.add = async function() {
    let insertQuery = 'INSERT INTO articles (title, body, date) VALUES (?, ?, ?)';
    let values = [this.title, this.body, this.date];
    return query.edit(insertQuery, values);
}

Article.prototype.edit = async function(id) {
    let updateQuery = 'UPDATE articles SET title=?, body=?, date=? WHERE id=?'
    let values = [this.title, this.body, this.date, id];
    return query.edit(updateQuery, values);
};

Article.delete = async function(id) {
    let deleteQuery = 'DELETE FROM articles WHERE id=' + id;
    return query.edit(deleteQuery);
};

Article.getArticles = function() {
    let selectQuery = 'SELECT * FROM articles ORDER BY date DESC';
    return query.getRecords(selectQuery);
};


