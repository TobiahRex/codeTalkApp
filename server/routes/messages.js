'use strict';

const express      = require('express');
const router       = express.Router();
const Message      = require('../models/comment');
const mongoose     = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

router.route('/')
.get((req, res)=> Message.find({}, res.handle))
.delete((req, res)=> Message.remove({}, res.handle));

router.post('/:user/new/:person', (req, res)=> {
  let reqBody = {
    user : req.params.user,
    person : req.params.person,
    comment : req.body.comment
  };
  Message.addComment(reqBody, res.handle);
});

module.exports = router;
