'use strict';

require('dotenv').load();

const express         = require('express');
const router          = express.Router();
const JWT             = require('jsonwebtoken');
const Request         = require('request');
const QS              = require('querystring');
const JWT_SECRET      = process.env.JWT_SECRET;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
const User            = require('../models/user');

router.post('/facebook', (req, res) =>{
  let fields = ['id', 'email', 'first_name', 'last_name', 'bio', 'work', 'birthday', 'about', 'devices', 'gender', 'hometown', 'link', 'name'];
  let accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  let graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  let params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({
    url   : accessTokenUrl,
    qs    : params,
    json  : true
  }, (err, response, accessToken)=>{
    if (response.statusCode !== 200) return res.status(500).send({ ERROR: accessToken.error.message });

    // Step 2. Retrieve profile information about the current user with the "accessToken"
    request.get({
      url   : graphApiUrl,
      qs    : accessToken,
      json  : true
    }, (err, response, profile)=>{
      if (response.statusCode !== 200) return res.status(500).send({ ERROR: profile.error.message });

      if (req.header('Authorization')) {
        User.findOne({ facebookId: profile.id }, (err, existingUser)=>{
          if (existingUser) return res.status(409).send({ ERROR: 'There is already a Facebook account that belongs to you.' });

          let token = req.header('Authorization').split(' ')[1];
          let payload = JWT.verify(token, JWT_SECRET);
          User.findById(payload.sub, (err, dbUser)=> {
            if (!dbUser) return res.status(400).send({ ERROR: 'User not found' });

            dbUser.Social.facebookId = profile.id;
            dbUser.Avatar = dbUser.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            dbUser.Username = dbUser.Username || profile.name;
            dbUser.save(() =>{
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
          let user = new User();
          user.Social.facebookId = profile.id;
          user.Avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.Username = profile.name;
          user.save((err, savedUser)=>{
            if(err) return res.status(400).send({ERROR : `Could not save user | Details : ${err}`});
            let token = savedUser.createToken();
            res.send({token});
          });
        });
      }
    });
  });
});

module.exports = router;
