var express = require('express')
var router = express.Router();

router.use('/priceData', require('./priceData'));

module.exports = router;