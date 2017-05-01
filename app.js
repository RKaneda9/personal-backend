'use strict';

let express     = require('express'),
    parser      = require('body-parser'),
    constants   = require('./helpers/constants'),
    compression = require('compression'),
    app         = express();

app.use(compression());
app.use(parser.json());
app.use(express.static(__dirname + '/public'));

app.use('/contact', require('./controllers/contact'));
app.use(            require('./controllers/index'));

app.listen(constants.port, function () {
    console.log(`Application started. Listening on port ${constants.port}.`);
});