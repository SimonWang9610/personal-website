const auth = require('../admin');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
    let admin = req.query.admin;

    if (admin) {
        if (!rows.length) await auth.addAdmin();
        let row = await auth.getAdmin();
        let hash = await bcrypt.hash(admin, row[0].salt);
        if (hash === row[0].secret) {
            req.session.admin = true;
        }
    }

    // if (admin) {
    //     let rows = await auth.getAdmin();

    //     if (!rows.length) await auth.addAdmin();
        
    //     for (let i = 0; i < rows.length; i++) {
    //         let hash = await bcrypt.hash(admin, rows[i].salt);
    //         if (hash == rows[i].secret) {
    //             req.session.admin = true;
    //             break;
    //         }
    //     }
    // }

    if (req.session.admin) {
        res.admin = res.locals.admin = true;
    } else {
        res.admin = res.locals.admin = false;
    }
    next();
};
