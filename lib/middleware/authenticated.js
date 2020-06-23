const SECRET = 'password';

module.exports = (req, res, next) => {
    console.log(req.session);
    let admin = req.query.admin;

    // if (auth === SECRET) {
    //     req.session.admin = true;
    //     req.user = res.locals.user = 'admin';
    //     next();
    // } else {
    //     req.session.admin = false;
    //     req.user = res.locals.user = auth;
    //     next();
    // }
    // if (req.session.admin) {
    //     res.admin = res.locals.admin = true;
    //     next();
    // }

    // if (admin == SECRET) {
    //     req.session.admin = true;
    //     res.admin = res.locals.admin = true;
    //     next();
    // } else {
    //     res.admin = res.locals.admin = false;
    //     req.session.admin = false;
    //     next();
    //}
    if (admin === SECRET || req.session.admin) {
        res.admin = res.locals.admin = true;
        req.session.admin = true;
        next();
    } else {
        res.admin = res.locals.admin = false;
        req.session
        next();
    };
};