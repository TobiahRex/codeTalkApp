'use strict';

var express = require('express');
var router = express.Router();

router.use('/users', require('./users'));
router.use('/comments', require('./comments'));
router.use('/messages', require('./messages'));
router.use('/replies', require('./replies'));

router.use('/oauth', require('./oauth'));
router.use('/crud', require('./cruds'));

module.exports = router;
