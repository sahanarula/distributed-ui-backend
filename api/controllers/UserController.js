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
    var createdUser = await User.findOrCreate({ email }, { email, password });
    var createdLocation = await Location.findOrCreate({ name: "Default", owner: createdUser.id }, { name: "Default", isDefault: true, configurations: [], owner: createdUser.id });
    await User.update({ id: createdUser.id }, { proximity: createdLocation.id });
    const isPasswordMatched = await bcrypt.compare(password, createdUser.password);
    if (!isPasswordMatched) {
      res.status(401).json({code: "WRONG_CREDENTIALS"})
      return;
    }
    const createdDevice = await Device.findOrCreate({ type, owner: createdUser.id }, { type, owner: createdUser.id });
    const token = jwt.sign({user: createdUser.id}, sails.config.custom.jwtSecret, {expiresIn: sails.config.custom.jwtExpires});
    return res.json({token});
  },

  isAuthenticated: async function (req, res) {
    res.ok();
  },

  getProximity: async function (req, res) {
    console.log("getting proximity now");
    if (!req.isSocket && !req.param("override")) {
      return res.badRequest('Only a client socket can subscribe to proximity.  But you look like an HTTP request to me.');
    }

    User.findOne({ id: req.user.id }).exec(async function(err, currentUser){
      if (err) {
        console.log("found an error");
        return res.serverError(err);
      }

      // Now we'll subscribe our client socket to each of these records.
      await User.subscribe(req, [currentUser.id]);

      var proximity = await Location.findOne({ owner: currentUser.id, id: currentUser.proximity });
      return res.json(proximity);
    });
  },

  setProximity: async function (req, res) {
    var foundLocation = await Location.findOne({ owner: req.user.id, name: req.body.location });
    var updatedProximityUser = await User.update({ id: req.user.id }, { proximity: foundLocation.id }).fetch();
    User.publish([req.user.id], {
      verb: "updated",
      data: foundLocation
    });
    res.json(foundLocation);
  }

};

