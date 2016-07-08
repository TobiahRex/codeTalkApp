'use strict';

const express      = require('express');
const router       = express.Router();
const Message      = require('../models/message');
const mongoose     = require('mongoose');

router.route('/')
.get((req, res)=> Message.find({}).exec(res.handle))
.delete((req, res)=> Message.remove({}, res.handle));

router.post('/:user/new/:person', (req, res)=> {
  let reqBody = {
    user : req.params.user,
    person : req.params.person,
    message : req.body.message
  };
  Message.addMessage(reqBody, res.handle);
});

router.get('/populate', (req, res)=> Message.populateAll(res.handle))

module.exports = router;
