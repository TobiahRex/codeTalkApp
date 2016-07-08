'use strict';

require('dotenv').load();
const PORT        = process.env.PORT || 3001
const mongoose    = require('mongoose');
const moment      = require('moment');
const JWT         = require('jsonwebtoken');
const Request     = require('request');
const QS          = require('querystring');
const BCRYPT      = require('bcryptjs');
const JWT_SECRET  = process.env.JWT_SECRET;
const ObjectId    = mongoose.Schema.Types.ObjectId;
const Mail        = require('./mail');
const deepPopulate= require('mongoose-deep-populate')(mongoose);

let commentSchema = new mongoose.Schema({
  UserId    :   {
    type    :   ObjectId,
    ref     :   'User'
  },
  CommentDate :   {
    type      :     Date
  },
  Body        :   {
    type      :    String
  },
  Likes       :   [commentLikeSchema],
  Replies     :   [replySchema]
});

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
