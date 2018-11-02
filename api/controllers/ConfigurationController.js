/**
 * ConfigurationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  createConfiguration: async (req, res) => {
    const { locationId, ...rest } = req.body;
    const createdConfig = await Configuration.create({ owner: req.user.id, location: locationId, ...rest }).fetch()
    res.json(createdConfig);
  }

};

