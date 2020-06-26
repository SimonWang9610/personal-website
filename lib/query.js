const config = require('config');
const mysql = require('mysql');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '961002',
        database: 'scheduler'
    }
);


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
