'use strict';

const express      = require('express');
const router       = express.Router();
const User         = require('../models/user');
const mongoose     = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

router.post('/register', (req, res) => User.register(req.body, res.handle));

router.route('/login')
.post((req, res)=>
  User.authenticate(req.body, (err, tokenPkg ) => err ? res.status(400).send(err) :
  res.status(200).send({token : tokenPkg.token}))
);

router.post('/logout', (req, res)=> res.clearCookie('accessToken').status(200).send({SUCCESS : `User has been Logged out.`}));

router.get('/profile', User.authorize({Admin : false}), (req, res)=> res.send(req.user));

router.get('/verify/:token', (req, res)=> User.emailVerify(req.params.token, (err, dbUser, result) => err ? res.status(400).send(err) : res.redirect('/#/login')));


router.put('/:id/toggle_admin', User.authorize({Admin : true}), (req, res)=>{
  User.findById(req.params.id, (err, dbUser)=>{
    if(err) return res.status(400).send(err);
    dbuser.Admin = !dbUser.Admin;
    dbUser.save((err, saveUser)=>{
      res.status(err ? 400 : 200).send(err || savedUser);
    });
  });
});

router.put('/:id/make_admin', (req, res)=> User.findByIdAndUpdate(req.params.id, {$set : {Admin : true}}, {new : true}, res.handle));

router.delete('/comments', (req, res)=> {
  User.find({}, (err, dbUsers) =>{
    dbUsers.forEach(user=>{
      user.wComments = [];
      user.rComments = [];

      user.save(err=>{
        res.status(err ? 400 : 200).send(err || {SUCCESS : 'Comments cleared.'});
      });
    });
  });
});

router.route('/')
.get((req, res) => User.getUsers(res.handle))
.delete((req, res)=> User.remove({}, res.handle));

router.route('/:id')
.get((req, res)=> User.getUser(req.params.id, res.handle))
.delete((req, res) => User.removeUser(req.params.id, res.handle))
.put((req, res)=> {
  let userObj = {id : req.params.id, body : req.body};
  User.updateUser(userObj, res.handle);
});

module.exports = router;
