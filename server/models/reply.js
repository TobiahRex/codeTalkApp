'use strict';

require('dotenv').load();
const mongoose    = require('mongoose');
const ObjectId    = mongoose.Schema.Types.ObjectId;
const User        = require('./user');
const Message     = require('./message');
const Comment     = require('./comment');

let replyLikeSchema = new mongoose.Schema({
  UserId      :   {
    type      :   ObjectId,
    ref       :   'User'
  },
  likeDate    :   {
    type      :   Date,
    default   :   Date.now
  }
});
let replySchema = new mongoose.Schema({
  UserId      :   {
    type      :   ObjectId,
    ref       :   'User'
  },
  Body        :   {
    type      :   String
  },
  ReplyDate   :   {
    type      :   Date
  },
  Likes       :   [replyLikeSchema] // reply likes
});


replySchema.statics.addReply_Message = (reqBody ,cb) => {
  if(!reqBody.msgId) return err({ERROR : 'No Message found in res. object.'});
  Message.findById(reqBody.msgId, (err1, dbMessage)=>{
    User.findById(reqBody.personId, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newReply = new Reply({
        UserId      : dbPerson._id,
        ReplyDate   : Date.now(),
        Body        : reqBody.reply
      });

      newReply.save((err, dbReply)=>{ if(err) return cb(err);
        dbMessage.Replies.push(dbReply._id);
        dbMessage.save((err2, savedMessage)=> {
          err2 ? cb(err2) : cb(null, savedMessage);
        });
      });
    });
  });
};

replySchema.statics.addReply_Comment = (reqBody ,cb) => {
  if(!reqBody.comId) return err({ERROR : 'No Comment found in res. object.'});
  Comment.findById(reqBody.comId, (err1, dbComment)=>{
    User.findById(reqBody.personId, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newReply = new Reply({
        UserId      : dbPerson._id,
        ReplyDate   : Date.now(),
        Body        : reqBody.reply
      });

      newReply.save((err, dbReply)=>{ if(err) return cb(err);
        dbComment.Replies.push(dbReply._id);
        dbComment.save((err2, savedComment)=> {
          err2 ? cb(err2) : cb(null, savedComment);
        });
      });
    });
  });
};

replySchema.statics.addLike_CommentReply = (reqBody, cb) => {
  if(!reqBody.comReplyId) return cb({ERROR : 'No Reply ID in res. object.'});
  Comment.findById(reqBody.comReplyId, (err1, dbComment)=>{
    User.findById(reqBody.personId, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newLike = {Userid : dbPerson._id};

      dbComment.Likes.push(newLike);
      dbComment.save((err, savedComment)=>{
        err ? cb(err) : cb(null, savedComment);
      });
    });
  });
};

replySchema.statics.addLike_MessageReply = (reqBody, cb) => {
  if(!reqBody.msgReplyId) return cb({ERROR : 'No Reply ID in res. object.'});
  Message.findById(reqBody.msgReplyId, (err1, dbMessage)=>{
    User.findById(reqBody.personId, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newLike = { Userid : dbPerson._id};
      
      dbMessage.Likes.push(newLike);
      dbMessage.save((err, savedMessage)=>{
        err ? cb(err) : cb(null, savedMessage);
      });
    });
  });
};



let Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;
