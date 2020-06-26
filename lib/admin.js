const query = require('./query');
const bcrypt = require('bcrypt');


let adminTable = 'CREATE TABLE IF NOT EXISTS admin (id INT(5) NOT NULL PRIMARY KEY AUTO_INCREMENT, '
            + 'secret VARCHAR(255) NOT NULL, salt VARCHAR(255))';

query.createTable(adminTable);


let createAdmin = 'INSERT INTO admin SET secret=?';

//convert the new admin secret to hash, used to authentication
let keyToHash = async function () {
    let row = await module.exports.getAdmin();
    let salt = await bcrypt.genSalt(12);

    let hash = await bcrypt.hash(row[0].secret, salt);

    let updateQuery = 'UPDATE admin SET secret=?, salt=? WHERE id=?';
    query.edit(updateQuery, [hash, salt, row[0].id]);
}


module.exports.getAdmin = async function () {
    let queryStr = 'SELECT * FROM admin';
    let row = await query.getRecords(queryStr);
    return row;
};

module.exports.addAdmin = async function() {
    // let admin = await module.exports.getAdmin();

    // if (!admin.length) {
    //     await query.edit(createAdmin, ['961002']);
    //     await keyToHash();
    // }
    await query.edit(createAdmin, ['961002']);
    await keyToHash();
    return;
}
