let express = require('express'),
    cors    = require('cors'),
    logging = require('../middleware/logging'),
    status  = require('../helpers/status-codes'),
    log     = require('../helpers/logger'),
    router  = express.Router();

router.use(cors()); // https://github.com/expressjs/cors
router.use(logging);

router.get('/ping', async (req, res) => {
    res.status(status.success.ok).send('Still here!');
});

router.get('/log', async (req, res) => {
    
});

module.exports = router;
