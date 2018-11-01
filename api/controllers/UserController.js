/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');


module.exports = {

  connect: async (req, res) => {
    const { email, password, device: type } = req.body;
    const createdUser = await User.findOrCreate({ email }, { email, password });
    const isPasswordMatched = await bcrypt.compare(password, createdUser.password);
    if (!isPasswordMatched) {
      res.status(401).json({code: "WRONG_CREDENTIALS"})
      return;
    }
    const createdDevice = await Device.findOrCreate({ type, owner: createdUser.id }, { type, owner: createdUser.id });
    const token = jwt.sign({user: createdUser.id}, sails.config.custom.jwtSecret, {expiresIn: sails.config.custom.jwtExpires});
    return res.json({token});
  },

  // login: async function (req, res) {
  //   var foundUser = await User.findOne({ email: req.param('email') });
  //   var isPasswordMatched = await bcrypt.compare(req.param('password'), foundUser.password);
  //   if (isPasswordMatched) {
  //     var token = jwt.sign({user: foundUser.id}, sails.config.custom.jwtSecret, {expiresIn: sails.config.custom.jwtExpires});
  //     return res.ok(token);
  //   }
  // },

  isAuthenticated: async function (req, res) {
    res.ok();
  }

};

