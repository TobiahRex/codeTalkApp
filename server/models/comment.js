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
const User        = require('./user');
const deepPopulate= require('mongoose-deep-populate')(mongoose);

let commentLikeSchema = new mongoose.Schema({
  likeDate    :   {
    type      :   Date,
    default   :   Date.now
  }
});
let replyLikeSchema = new mongoose.Schema({
  likeDate    :   {
    type      :   Date,
    default   :   Date.now
  }
});
let replySchema = new mongoose.Schema({
  Body        :   {
    type      :   String
  },
  ReplyDate   :   {
    type      :   Date
  },
  Likes       :   [replyLikeSchema] // reply likes
});

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

commentSchema.statics.addComment = (reqBody ,cb) => {
  if(!reqBody.user) return err({ERROR : 'No comment found in res. object.'});
  User.findById(reqBody.user, (err1, dbUser)=> {
    User.findById(reqBody.person, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newComment = new Comment({
        UserId      : dbPerson._id,
        CommentDate : Date.now(),
        Body        : reqBody.comment
      });
      newComment.save((err, dbComment)=>{ if(err) return cb(err);
        console.log('dbComment._id: ', dbComment._id);

        dbPerson.wComments.push(dbComment._id);
        dbUser.rCommments.push(dbComment._id);

        dbPerson.save((err1, savedPerson)=> {
          dbUser.save((err2, savedUser)=> {
            err2 ? cb(err2) : cb(null, {savedPerson, savedUser});
          });
        });
      });
    });
  });
};

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
