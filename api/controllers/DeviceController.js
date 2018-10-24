/**
 * DeviceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  registerDevice: async (req, res) => {
    var deviceType = req.param('deviceType');

    Device.create({
      type: deviceType,
      owner: req.user.id
    }, function (err, registeredDevice) {
      if (err) {
        console.log(err);
        return res.send(500);
      }
      res.json(registeredDevice);
    });
  },

  // connect: async (req, res) => {
  //   var deviceType = req.param()
  // }

};

