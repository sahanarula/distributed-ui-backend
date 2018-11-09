/**
 * ConfigurationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  createConfiguration: async (req, res) => {
    const initialSearch = await Configuration.findOne({ owner: req.user.id, device: req.body.device, location: req.body.location });
    if (initialSearch) {
      res.status(401).json({ code: 'ALREADY_EXISTS' });
      return;
    }
    const config = await Configuration.create({ owner: req.user.id, ...req.body }).fetch();
    const createdConfig = await Configuration.findOne({ owner: req.user.id, id: config.id }).populate('device');
    console.log(createdConfig);
    res.json(createdConfig);
  }

};

