let express = require('express'),
    cors    = require('cors'),
    logging = require('../middleware/logging'),
    status  = require('../helpers/status-codes'),
    router  = express.Router();

router.use(cors()); // https://github.com/expressjs/cors
router.use(logging);

router.get('/ping', (req, res) => res.status(status.success.noContent).send());

router.get('/log', (req, res) => res.status(status.success.ok).send());
router.post('/log', (req, res) => res.status(status.success.ok).send());

module.exports = router;
