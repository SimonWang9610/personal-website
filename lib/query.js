const config = require('../config/default.json');
const mysql = require('mysql');

const db = mysql.createConnection(config.development.db);


module.exports.createTable = function(statement) {
    db.query(statement,  (err) => {
        if (err) throw err;
    });
};

module.exports.getRecords = function(statement) {
    return new Promise((resolve, reject) => {
        db.query(statement, (err, results) => {
            if (err) return reject(err);
            return resolve(results)
        });
    });
};

module.exports.edit = function(statement, values) {
 
    return new Promise((resolve, reject) => {
        db.query(
            statement,
            values,
            (err) => {
                if (err) return reject(err);
                return resolve();
            }
        );
    });
};
