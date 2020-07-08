module.exports = function(count, perpage) {
    perpage = perpage || 10;
    return function(req, res, next) {
        let page = Math.max(parseInt(req.params.page || '1', 10), 1) - 1;

        count().then(total => {
            req.page = req.locals.page = {
                number: page,
                perpage: perpage,
                from: page * perpage,
                to: page * perpage + perpage - 1,
                count: Math.ceil(total / perpage)
            };
            next();
        }).catch(err => next(err));
    }
}