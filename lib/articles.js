const query = require('./query');

function Article(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
};

let articleTable = 'CREATE TABLE IF NOT EXISTS articles ('
    + 'id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
    + 'title VARCHAR(255) NOT NULL, '
    + 'body TINYTEXT NOT NULL, '
    + 'date TIMESTAMP NOT NULL)';

query.createTable(articleTable);

Article.prototype.add = async function() {
    let insertQuery = 'INSERT INTO articles (title, body, date) VALUES (?, ?, ?)';
    let values = [this.title, this.body, this.date];
    return query.edit(insertQuery, values);
}

Article.edit = async function(id, data) {
    let updateQuery = 'UPDATE articles SET title=?, body=?, date=? WHERE id=?'
    let values = [data.title, data.body, data.date, id];
    return query.edit(updateQuery, values);
};

Article.delete = async function(id) {
    let deleteQuery = 'DELETE FROM articles WHERE id=?';
    return query.edit(deleteQuery, [id]);
};

Article.getArticles = async function() {
    let selectQuery = 'SELECT id, title FROM articles ORDER BY date DESC';
    return query.getRecords(selectQuery);
};

Article.getRange = async function(from, to) {
    let rows = await Article.getArticles();

    let pageRows = [];

    for (let i = from; i <= to; i++) {
        if (!rows[i]) break;
        pageRows.push(rows[i]);
    }
    return pageRows;
};

Article.getArticleById = async function(id) {
    let selectQuery = 'SELECT * FROM articles WHERE id=' + id;
    return query.getRecords(selectQuery);
};

module.exports = Article;