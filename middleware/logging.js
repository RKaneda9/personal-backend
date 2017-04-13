let Logger    = require('../models/logging/logger'),
    constants = require('../helpers/constants'),
    utils     = require('../helpers/utils'),
    fs        = require('fs'),
    parser    = require('body-parser');

let methods = {
    get:    "GET",
    post:   "POST",
    put:    "PUT",
    delete: "DELETE"
};

let port = constants.port ? `:${constants.port}` : '';

// ensuring that all file paths exist.
utils.foreach(constants.logging.filePaths, function (path) {
    let pieces   = path.split('/');
    let location = "";

    utils.foreach(pieces, function (piece) {

        // if piece is empty, we've reached the end of the path
        // return early and break out of loop
        if (!piece) { return false; }

        location += location ? `/${piece}` : piece;

        if (!fs.existsSync(location)) {
            fs.mkdirSync(location); 
        }
    });
});

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
