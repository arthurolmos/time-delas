const Post = require("../models/Post");
const User = require("../models/User");
const Team = require("../models/Team");

module.exports = {
  async index(req, res) {
    try {
      const query = req.query;

      const posts = await Post.find(query)
        .sort({ updatedAt: -1 })
        .populate("postedBy")
        .populate({
          path: "comments.userId",
          model: "User",
          select: ["firstName", "lastName", "fullName", "profilePicture"],
        })
        .exec();

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async query(req, res) {
    try {
      const { id } = req.params;
      const { target } = req.query;

      let posts;
      if (target === "user") {
        posts = await Post.find({ userId: id })
          .sort({ updatedAt: "desc" })
          .populate("userId", [
            "profilePicture",
            "firstName",
            "lastName",
            "fullName",
          ])
          .exec();
      } else if (target === "post") {
        posts = await Post.findById(id)
          .sort({ updatedAt: "desc" })
          .populate("userId", [
            "profilePicture",
            "firstName",
            "lastName",
            "fullName",
          ])
          .exec();
      } else if (target === "feed") {
        const user = await User.findById(id);

        const ids = user.friends.map((item) => {
          return item.friend._id;
        });

        ids.push(id);

        posts = await Post.find({ userId: { $in: ids } })
          .sort({
            updatedAt: "desc",
          })
          .populate("userId", [
            "profilePicture",
            "firstName",
            "lastName",
            "fullName",
          ])
          .exec();
      } else {
        posts = [];
      }

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async store(req, res) {
    try {
      const { postedBy, postedOn, onModel, content } = req.body;

      const post = await Post.create({
        postedBy,
        postedOn,
        onModel,
        content,
        likes: [],
        comments: [],
      });

      const team = await Team.findById(postedOn);
      if (!team) throw new Error("Team not found!");

      const membersId = team.members.map((member) => member._id);
      console.log("TEAM MEMBERS", membersId);

      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      post.content = content;
      await post.save();

      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      await post.delete();

      return res.status(200).json({ result: true });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async destroyAll(req, res) {
    try {
      await Post.deleteMany({});

      return res.status(200).json({ result: true });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
