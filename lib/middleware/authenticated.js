const auth = require('../admin');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
    let admin = req.query.admin;

    if (admin) {
        
        let rows = await auth.getAdmin();

        if (!rows.length) {
            await auth.addAdmin();
            rows = await auth.getAdmin();
        }

        let hash = await bcrypt.hash(admin, rows[0].salt);
        if (hash === rows[0].secret) {
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
