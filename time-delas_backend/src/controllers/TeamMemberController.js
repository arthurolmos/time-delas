const User = require("../models/User");
const Team = require("../models/Team");
const Transaction = require("mongoose-transactions");
const socketIOHelper = require("../helpers/socketio");

module.exports = {
  async store(req, res) {
    const transaction = new Transaction();

    try {
      const { teamId } = req.params;
      const { userId, roles } = req.body;

      const team = await Team.findById(teamId);
      if (!team) throw new Error("Team not found!");

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      const index = team.members.findIndex((member) => member.userId == userId);
      if (index > -1) throw new Error("User already in team!");

      team.members.push({ userId, roles });
      transaction.update(
        "Team",
        team._id,
        { members: team.members },
        { useFindAndModify: true }
      );

      await team
        .populate({
          path: "members.userId",
          model: "User",
          select: ["firstName", "lastName", "profilePicture"],
        })
        .execPopulate();

      user.teams.push(team._id);
      transaction.update(
        "User",
        user._id,
        { teams: user.teams },
        { useFindAndModify: true }
      );

      await user.populate("teams", ["name", "profilePicture"]).execPopulate();

      await transaction.run();

      return res.status(201).json({ team, user });
    } catch (err) {
      console.log({ name: err.name, message: err.message });
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { teamId } = req.params;
      const { userId, roles } = req.body;

      const team = await Team.findById(teamId);
      if (!team) throw new Error("Team not found!");

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      const index = team.members.findIndex((member) => member.userId == userId);
      if (index < 0) throw new Error("User not in team!");

      team.members[index].roles = roles;
      await team.save();

      return res.status(200).json({ user, team });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async destroy(req, res) {
    const transaction = new Transaction();

    try {
      const { teamId } = req.params;
      const { userId } = req.body;

      const team = await Team.findById(teamId);
      if (!team) throw new Error("Team not found!");

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      const index = team.members.findIndex((member) => member.userId == userId);
      // if (index < 0) throw new Error("User not in team!");

      team.members.splice(index, 1);
      transaction.update(
        "Team",
        team._id,
        { members: team.members },
        { useFindAndModify: true }
      );

      await team
        .populate({
          path: "members.userId",
          model: "User",
          select: ["firstName", "lastName", "fullName", "profilePicture"],
        })
        .execPopulate();

      const teamIndex = user.teams.findIndex((team) => team._id == teamId);
      // if (teamIndex < 0) throw new Error("User don't belong to team!");

      user.teams.splice(teamIndex, 1);
      transaction.update(
        "User",
        user._id,
        { teams: user.teams },
        { useFindAndModify: true }
      );

      await user.populate("teams", ["name", "profilePicture"]).execPopulate();

      await transaction.run();

      return res.status(200).json({ user, team });
    } catch (err) {
      console.log({ name: err.name, message: err.message });
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
