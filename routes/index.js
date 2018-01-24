var express = require('express')
var router = express.Router();

router.use('/priceData', require('./priceData'));

router.use('/twitterData', require('./twitterData'));

module.exports = router;