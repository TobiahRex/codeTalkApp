'use strict';

var express = require('express');
var router = express.Router();

router.use('/crud', require('./cruds'));
router.use('/user', require('./users'));

module.exports = router;
