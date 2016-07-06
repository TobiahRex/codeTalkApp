'use strict';

require('dotenv').load();

const express         = require('express');
const router          = express.Router();
const JWT             = require('jsonwebtoken');
const npmRequest      = require('request');
const QS              = require('querystring');
const JWT_SECRET      = process.env.JWT_SECRET;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
const User            = require('../models/user');

router.post('/facebook', (req, res) =>{
  let fields = ['id', 'email', 'first_name', 'last_name', 'gender', 'link', 'name', 'picture', 'cover'];
  let accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  let graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  let params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  npmRequest.get({
    url   : accessTokenUrl,
    qs    : params,
    json  : true
  }, (err, response, accessToken)=>{
    if (response.statusCode !== 200) return res.status(400).send({ ERROR: accessToken.error.message });
    console.log('accessToken RECEIVED: \n', accessToken);
    // Step 2. Retrieve profile information about the current user with the "accessToken"
    npmRequest.get({
      url   : graphApiUrl,
      qs    : accessToken,
      json  : true
    }, (err, response, profile)=>{
      if (response.statusCode !== 200) return res.status(400).send({ ERROR: profile.error.message });
      console.log('FACEBOOK PROFILE: \n', profile);
      if (req.header('Authorization')) {
        User.findOne({ facebookId: profile.id }, (err, existingUser)=>{
          if (existingUser) return res.status(409).send({ ERROR: 'There is already a Facebook account that belongs to you.' });
          console.log('EXISTING USER: \n', existingUser);
          let token = req.header('Authorization').split(' ')[1];
          let payload = JWT.verify(token, JWT_SECRET);
          User.findById(payload.sub, (err, dbUser)=> {
            console.log('dbUSER: \n', dbUser);
            if (!dbUser) return res.status(400).send({ ERROR: 'User not found' });

            dbuser.Email              = profile.email,
            dbUser.FirstName          = profile.first_name,
            dbUser.LastName           = profile.last_name,
            dbUser.Social.facebookId  = profile.id;
            dbUser.Social.facebookLink= profile.link;
            dbUser.Avatar             = dbUser.Avatar || profile.picture.data.url;
            dbUser.CoverPhoto         = profile.cover.source;
            dbUser.Username           = dbUser.Username || profile.name;

            dbUser.save((err, savedUser) =>{
              if(err) return res.status(400).send({ERROR : `Could not save user | Details : ${err}`});
              let token = dbUser.createToken();
              res.send({token});
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebookId: profile.id }, function(err, existingUser) {
          if (existingUser) {
            let token = existingUser.createToken();
            return res.send({token});
          }

          let newUser = new User({
            Email               : profile.email,
            FirstName           : profile.first_name,
            LastName            : profile.last_name,
            Social.facebookLink : profile.link,
            Social.facebookId   : profile.id,
            Avatar              : profile.picture.data.url,
            CoverPhoto          : profile.cover.source,
            Username            : profile.name;
          });

          newUser.save((err, savedUser)=>{
            if(err) return res.status(400).send({ERROR : `Could not save newUser | Details : ${err}`});
            let token = savedUser.createToken();
            console.log('new SAVED USER: \n', savedUser);
            res.send({token});
          });
        });
      }
    });
  });
});

module.exports = router;
