/**
 * FragmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllFragments: async (req, res) => {
    const allFragments = await Fragment.find({ owner: req.user.id }).populate('owner');
    res.json(allFragments);
  },
  updateFragment: async (req, res) => {
    const updatedFragment = await Fragment.update({ owner: req.user.id, id: req.param("id") }, { ...req.body }).fetch();
    res.json(updatedFragment);
  },
  createFragment: async (req, res) => {
    const createdFragment = await Fragment.create({ owner: req.user.id, ...req.body }).fetch();
    res.json(createdFragment);
  },
  removeFragment: async (req, res) => {
    const deletedFragments = await Fragment.destroy({ owner: req.user.id, id: req.param("id") }).fetch();
    console.log(deletedFragments);
    deletedFragments ? res.json(deletedFragments) : res.status(402).json({ code: "NOT_DELETED" });
  }
};

