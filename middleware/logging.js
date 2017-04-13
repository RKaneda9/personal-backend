let Logger    = require('../models/logging/logger'),
    constants = require('../helpers/constants'),
    parser    = require('body-parser');

let methods = {
    get:    "GET",
    post:   "POST",
    put:    "PUT",
    delete: "DELETE"
};

let port = constants.port ? `:${constants.port}` : '';

module.exports = (req, res, next) => {

    let log = Logger.newSession();

    log.debug(`${req.protocol}://${req.hostname}${port}${req.path}`, req.method, {
        ip:    req.ip,
        body:  req.body,
        query: req.query,
        xhr:   req.xhr,
        route: req.route
    });

    req.log = log;
    next();
};
