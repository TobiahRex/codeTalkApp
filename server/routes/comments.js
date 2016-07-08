'use strict';

const express      = require('express');
const router       = express.Router();
const Comment      = require('../models/comment');
const mongoose     = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

router.route('/')
.get((req, res)=> Comment.find({}, res.handle))
.delete((req, res)=> Comment.remove({}, res.handle));

router.post('/:user/new/:person', (req, res)=> {
  let reqBody = {
    user : req.params.user,
    person : req.params.person,
    comment : req.body.comment
  };
  Comment.addComment(reqBody, res.handle);
});

module.exports = router;
