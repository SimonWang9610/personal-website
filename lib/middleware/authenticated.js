const auth = require('../admin');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
    console.log(req.session.admin);
    let admin = req.query.admin;

    if (admin) {
        let row = await auth.getAdmin();
        let hash = await bcrypt.hash(admin, row[0].salt);
        if (hash === row[0].secret) {
            req.session.admin = true;
        }
    }

    if (req.session.admin) {
        res.admin = res.locals.admin = true;
    } else {
        res.admin = res.locals.admin = false;
    }
    next();
};
