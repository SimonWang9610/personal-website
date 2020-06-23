const query = require('./query');

function Plan(obj) {
    for (let key in obj) {
        this[key] = obj[key];
    }
};

let planTable = 'CREATE TABLE IF NOT EXISTS plans ('
    + 'id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
    + 'body VARCHAR(255) NOT NULL, '
    + 'date TIMESTAMP NOT NULL, '
    + 'completed TIMESTAMP)';

query.createTable(planTable);

Plan.prototype.add = async function() {
    let insertQuery = 'INSERT INTO plans (body, date) VALUES (?, ?)';
    let values = [this.body, this.date];
    return query.edit(insertQuery, values);
}

Plan.prototype.edit = async function(completed, id) {
    let updateQuery = 'UPDATE plans SET completed=? WHERE id=?'
    let values = [completed, id];
    return query.edit(updateQuery, values);
};

Plan.delete = async function(id) {
    let deleteQuery = 'DELETE FROM plans WHERE id=' + id;
    return query.edit(deleteQuery);
};

Plan.getPlans = function() {
    let selectQuery = 'SELECT * FROM plans ORDER BY date DESC';
    return query.getRecords(selectQuery);
};


