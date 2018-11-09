/**
 * LocationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllLocations: async (req, res) => {
    let allLocations = await Location.find({ owner: req.user.id }).populate('owner');
    allLocations = await Promise.all(allLocations.map(async location => {
      const configurations = await Configuration.find({ owner: req.user.id, location: location.id }).populate('device');
      return {
        ...location,
        configurations
      };
    }));
    res.json(allLocations);
  },
  updateLocation: async (req, res) => {
    const updatedLocation = await Location.update({ owner: req.user.id, id: req.param("id") }, { ...req.body }).fetch();
    res.json(updatedLocation);
  },
  createLocation: async (req, res) => {
    const createdLocation = await Location.create({ owner: req.user.id, ...req.body }).fetch();
    res.json(createdLocation);
  },
  removeLocation: async (req, res) => {
    const deletedLocations = await Location.destroy({ owner: req.user.id, id: req.param("id") }).fetch();
    Configuration.destroy({ owner: req.user.id, location: deletedLocations[0].id });
    console.log(deletedLocations);
    deletedLocations ? res.json(deletedLocations) : res.status(402).json({ code: "NOT_DELETED" });
  }
};

