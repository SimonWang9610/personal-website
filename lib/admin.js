const query = require('./query');
const bcrypt = require('bcrypt');


let adminTable = 'CREATE TABLE IF NOT EXISTS admin (id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
            + 'secret VARCHAR(255) NOT NULL, salt VARCHAR(255))';

query.createTable(adminTable);


module.exports.getAdmin = async function () {
    let queryStr = 'SELECT * FROM admin WHERE id=1';
    let row = await query.getRecords(queryStr);
    return row;
};

async function keyToHash() {
    let row = await module.exports.getAdmin();
    console.log(row[0]);
    let salt = await bcrypt.genSalt(12);

    let hash = await bcrypt.hash(row[0].secret, salt);

    let updateQuery = 'UPDATE admin SET secret=?, salt=? WHERE id=1';
    query.edit(updateQuery, [hash, salt]);
}


