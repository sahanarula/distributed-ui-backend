/**
 * DeviceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllDevices: async (req, res) => {
    const allDevices = await Device.find({ owner: req.user.id }).populate('owner');
    res.json(allDevices);
  },

  deleteDevice: async (req, res) => {
    console.log(req.param("id"));
    const deletedDevices = await Device.destroy({ owner: req.user.id, id: req.param("id") }).fetch();
    console.log(deletedDevices);
    deletedDevices ? res.json(deletedDevices) : res.status(402).json({ code: "NOT_DELETED" });
  }
};

