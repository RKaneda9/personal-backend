let logService = require('../services/logger'),
    constants  = require('../helpers/constants').logging,
    utils      = require('../helpers/utils'),
    fs         = require('fs'),
    parser     = require('body-parser');

let methods = {
    get:    "GET",
    post:   "POST",
    put:    "PUT",
    delete: "DELETE"
};

let port  = constants.port ? `:${constants.port}` : '';
let flush = 200;

// ensuring that all file paths exist.
utils.foreach(constants.filePaths, function (path) {
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

    let json = res.json,
        send = res.send;

    req.log  = logService.newSession();

    res.json = data => {
        json.call(res, data);

        setTimeout(() => {

            req.log.info('Response: ', res.statusCode, data);
            logService.flush(req.log);

        }, flush);
    };

    res.send = data => {
        send.call(res, data);

        setTimeout(() => {

            req.log.info('Response: ', res.statusCode, data);
            logService.flush(req.log);

        }, flush);
    };

    res.error = (msg, e) => {
        send.call(res, msg);

        setTimeout(() => {

            req.log.error(msg, e);
            logService.flush(req.log);

        }, flush);
    };

    req.log.debug(`${req.protocol}://${req.hostname}${port}${req.path}`, req.method, {
        ip:      req.ip,
        headers: { partner_id: req.get("partner_id") },
        body:    req.body,
        query:   req.query,
        xhr:     req.xhr,
        route:   req.route
    });

    next();
};
