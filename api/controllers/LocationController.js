/**
 * LocationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllLocations: async (req, res) => {
    const allLocations = await Location.find({ owner: req.user.id }).populate('owner');
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
    console.log(deletedLocations);
    deletedLocations ? res.json(deletedLocations) : res.status(402).message({ code: "NOT_DELETED" });
  }
};

