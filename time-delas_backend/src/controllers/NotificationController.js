const User = require("../models/User");
const Team = require("../models/Team");
const UserNotification = require("../models/UserNotification");

module.exports = {
  async index(req, res) {},
  async create({ targetId, type }) {
    try {
      const team = await Team.findById(targetId);
      if (!team) throw new Error("Team not found!");

      const membersId = team.members.map((member) => member._id);
      console.log("MEMBERS ID", membersId);

      // const notifications = await UserNotification.find({ userId: { $in: membersId }})
      // console.log('NOTIFICATIONS', notifications)

      for (id of membersId) {
        const userNotification = await UserNotification.find({ userId: id });

        if (!userNotification) {
          const userNotification = await UserNotification.create({
            userId: id,
            notifications: [
              {
                notificationType: "NewPost",
                onModel: "Post",
                content: "New post created",
                isRead: false,
              },
            ],
          });

          console.log("USER NOTIFICATION", userNotification);
        } else {
          userNotification.notifications.push({
            notificationType: "NewPost",
            onModel: "Post",
            content: "New post created",
            isRead: false,
          });

          await userNotification.save();
        }
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  },
  async update(req, res) {},
  async destroy(req, res) {},
};
