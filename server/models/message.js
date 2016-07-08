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
let messageSchema = new mongoose.Schema({
  UserId :  {
    type    :     ObjectId,
    ref     :     'User'
  },
  MessageDate : {
    type    :   Date,
    default :   Date.now
  },
  Body      :   {
    type: String
  },
  Replies   : [replySchema]
});

messageSchema.statics.addMessage = (reqBody ,cb) => {
  if(!reqBody.user) return err({ERROR : 'No message found in res. object.'});
  User.findById(reqBody.user, (err1, dbUser)=> {
    User.findById(reqBody.person, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let newMessage = new Message({
        UserId      : dbPerson._id,
        MessageDate : Date.now(),
        Body        : reqBody.message
      });
      newMessage.save((err, dbMessage)=>{ if(err) return cb(err);
        dbUser.rMessages.push(dbMessage._id);
        dbPerson.wMessages.push(dbMessage._id);

        dbPerson.save((err1, savedPerson)=> {
          dbUser.save((err2, savedUser)=> {
            err2 ? cb(err2) : cb(null, {savedPerson, savedUser});
          });
        });
      });
    });
  });
};


let Message = mongoose.model('Message', messageSchema);
module.exports = Message;
