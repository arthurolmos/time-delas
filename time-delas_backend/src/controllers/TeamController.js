const path = require("path");
const createDir = require("../utils/createDir");
const User = require("../models/User");
const Team = require("../models/Team");
const Transaction = require("mongoose-transactions");

module.exports = {
  async index(req, res) {
    try {
      const teams = await Team.find({})
        .populate("categoryId", "title")
        .populate("owner", [
          "firstName",
          "lastName",
          "fullName",
          "profilePicture",
        ])
        .populate({
          path: "members.userId",
          model: "User",
          select: ["firstName", "lastName", "fullName", "profilePicture"],
        })
        .exec();

      console.log("TEAMS", teams);

      return res.status(200).json(teams);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async query(req, res) {
    try {
      const { teamId } = req.params;

      const team = await Team.findById(teamId);
      if (!team) throw new Error("Team not found!");

      await team
        .populate("categoryId", "title")
        .populate({
          path: "members.userId",
          model: "User",
          select: ["firstName", "lastName", "fullName", "profilePicture"],
        })
        .execPopulate();

      return res.status(200).json(team);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async store(req, res) {
    const transaction = new Transaction();

    try {
      const { name, about, categoryId, owner } = req.body;

      let team = await Team.findOne({ name });
      if (team) throw new Error("Team with same name already registered!");

      team = transaction.insert("Team", {
        name,
        about,
        categoryId,
        owner,
        members: [{ userId: owner, roles: ["owner"] }],
        profilePicture: null,
      });

      const dir = path.resolve(
        __dirname,
        "..",
        "..",
        "tmp",
        "uploads",
        "teams",
        team._id.toString()
      );
      createDir(dir);

      transaction.update("Team", team._id, {
        storageFolder: `/pictures/${team._id}`,
      });

      const user = await User.findById(owner);
      if (!user) throw new Error("User not found!");

      user.teams.push(team._id);
      transaction.update("User", user._id, { teams: user.teams });

      await transaction.run();

      return res.status(201).json(team);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { teamId } = req.params;
      const {
        name = null,
        about = null,
        categoryId = null,
        profilePicture = null,
      } = req.body;

      const team = await Team.findById(teamId);
      if (!team) throw new Error("Team not found!");

      const validName = await Team.findOne({ name, _id: { $ne: teamId } });
      if (validName) throw new Error("Team with same name already registered!");
      console.log("validName", validName);

      team.name = name ? name : team.name;
      team.about = about ? about : team.about;
      team.categoryId = categoryId ? categoryId : team.categoryId;
      team.profilePicture = profilePicture
        ? profilePicture
        : team.profilePicture;

      await team.save();

      return res.status(200).json(team);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const { teamId } = req.params;

      const team = await Team.findById(teamId);
      if (!team) throw new Error("Team not found!");

      await team.deleteOne();

      return res.status(200).json({ result: "Deleted succesfully!" });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async destroyAll(req, res) {
    try {
      await Team.deleteMany({});

      return res.status(200).json({ result: "Deleted succesfully!" });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
