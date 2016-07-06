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
  let fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
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
        User.findOne({ facebook: profile.id }, (err, existingUser)=>{
          if (existingUser) return res.status(409).send({ ERROR: 'There is already a Facebook account that belongs to you.' });

          let token = req.header('Authorization').split(' ')[1];
          let payload = jwt.decode(token, JWT_SECRET);
          User.findById(payload.sub, (err, user)=> {
            if (!user) return res.status(400).send({ ERROR: 'User not found' });

            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(() =>{
              let token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            let token = createJWT(existingUser);
            return res.send({ token: token });
          }
          let user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            let token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

module.exports = router;
