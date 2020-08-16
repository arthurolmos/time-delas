/* eslint-disable no-undef */
const User = require("../models/User");

module.exports = {
  async index(req, res) {
    try {
      const users = await User.find();

      return res.status(200).json(users);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async query(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(
        userId
        // { teams: { $slice: -6 } }
      );
      if (!user) throw new Error("User not found!");

      await user.populate("teams").execPopulate();

      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { userId } = req.params;
      // const authUser = req.user;

      // if (authUser._id != userId) throw new Error( "Unauthorized!";

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      const {
        firstName = null,
        lastName = null,
        profilePicture = null,
      } = req.body;

      user.firstName = firstName ? firstName : user.firstName;
      user.lastName = lastName ? lastName : user.lastName;
      user.profilePicture = profilePicture
        ? profilePicture
        : user.profilePicture;

      await user.save();
      await user.populate("teams").execPopulate();

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async deleteAll(req, res) {
    try {
      await User.deleteMany();

      return res.status(200).send("All users deleted!");
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
