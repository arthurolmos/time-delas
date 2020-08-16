const User = require("../models/User");
const Transaction = require("mongoose-transactions");

module.exports = {
  async query(req, res) {
    try {
      const { id } = req.query;
      const { target } = req.query;

      const friends = await User.findById(id);

      return res.status(200).json(friends);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async store(req, res) {
    const transaction = new Transaction();

    try {
      const { friendId } = req.params;
      console.log(friendId);

      const user = await User.findById(req.user._id);
      if (!user) throw new Error("User not found!");

      const friend = await User.findById(friendId);
      if (!friend) throw new Error("Friend not found!");

      if (user.friends.find((friend) => friendId == friend.user))
        throw new Error("Already friends!");

      user.friends.push({ user: friendId });
      transaction.update(
        "User",
        user._id,
        { friends: user.friends },
        { useFindAndModify: true }
      );

      await user
        .populate({
          path: "friends",
          populate: {
            path: "user",
            model: "User",
            select: ["firstName", "lastName", "profilePicture"],
          },
        })
        .execPopulate();

      friend.friends.push({ user: user._id });
      transaction.update(
        "User",
        friendId,
        { friends: friend.friends },
        { useFindAndModify: true }
      );

      await friend
        .populate({
          path: "friends",
          populate: {
            path: "user",
            model: "User",
            select: ["firstName", "lastName", "profilePicture"],
          },
        })
        .execPopulate();

      await transaction.run();

      return res.status(201).json(user);
    } catch (err) {
      await transaction.rollback().catch(console.error);
      transaction.clean();
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async delete(req, res) {
    const transaction = new Transaction();

    try {
      const { friendId } = req.params;
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      const friend = await User.findById(friendId);
      if (!friend) throw new Error("Friend not found!");

      const userIndex = user.friends.findIndex(
        (item) => item.friend === friendId
      );
      if (userIndex > -1) {
        user.friends.splice(userIndex, 1);
      }

      const friendIndex = friend.friends.findIndex(
        (item) => item.friend === userId
      );
      if (friendIndex > -1) {
        friend.friends.splice(friendIndex, 1);
      }

      transaction.update(
        "User",
        userId,
        { friends: user.friends },
        { useFindAndModify: true }
      );

      transaction.update(
        "User",
        friendId,
        { friends: friend.friends },
        { useFindAndModify: true }
      );

      await transaction.run();

      return res.status(200).json(user);
    } catch (err) {
      await transaction.rollback().catch(console.error);
      transaction.clean();
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
