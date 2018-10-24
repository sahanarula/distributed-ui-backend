/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');


module.exports = {

  signup: async function (req, res) {
    var createdUser = await User.create(req.allParams()).fetch();
    res.json(createdUser);
  },

  login: async function (req, res) {
    var foundUser = await User.findOne({ email: req.param('email') });
    var isPasswordMatched = await bcrypt.compare(req.param('password'), foundUser.password);
    if (isPasswordMatched) {
      var token = jwt.sign({user: foundUser.id}, sails.config.custom.jwtSecret, {expiresIn: sails.config.custom.jwtExpires});
      return res.ok(token);
    }
  },

  isAuthenticated: async function (req, res) {
    res.ok();
  }

};

