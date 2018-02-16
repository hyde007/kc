var express = require('express')
var router = express.Router();

router.use('/priceData', require('./priceData'));

router.use('/twitterData', require('./twitterData'));

router.use('/genericData', require('./genericData'));

router.use('/', require('./direct'));

module.exports = router;