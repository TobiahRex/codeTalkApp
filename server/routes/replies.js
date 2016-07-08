'use strict';

const express      = require('express');
const router       = express.Router();
const Reply        = require('../models/reply');
const mongoose     = require('mongoose');

router.route('/')
.get((req, res)=> Reply.find({}).exec(res.handle))
.delete((req, res)=> Reply.remove({}, res.handle));

router.post('/:msgId/message/:person', (req, res)=> {
  let reqBody = {
    msgId     : req.params.msgId,
    personId  : req.params.person,
    reply     : req.body.reply
  };
  Reply.addReply_Message(reqBody, res.handle);
});
router.post('/:commentId/comment/:person', (req, res)=> {
  let reqBody = {
    comId     : req.params.commentId,
    personId  : req.params.person,
    reply     : req.body.reply
  };
  Reply.addReply_Comment(reqBody, res.handle);
});

router.post('/:msgId/message_like/:person', (req, res)=> {
  let reqBody = {
    msgId     : req.params.msgId,
    personId  : req.params.person,
    reply     : req.body.reply
  };
  Reply.addLike_MessageReply(reqBody, res.handle);
});
router.post('/:commentId/comment_like/:person', (req, res)=> {
  let reqBody = {
    comId     : req.params.commentId,
    personId  : req.params.person,
    reply     : req.body.reply
  };
  Reply.addLike_CommentReply(reqBody, res.handle);
});

router.get('/populate', (req, res)=> Reply.find({}).populate('UserId').exec(res.handle));

module.exports = router;
