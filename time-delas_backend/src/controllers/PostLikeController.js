const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  async index(req, res) {
    // try {
    //   ...
    //   return res.status(400).json();
    // } catch (err) {
    //   return res.status(400).json({ name: err.name, message: err.message });
    // }
  },

  async query(req, res) {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      await post
        .populate("likes", ["firstName", "lastName", "profilePicture"])
        .execPopulate();

      return res.status(200).json(post.likes);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async store(req, res) {
    try {
      const { postId } = req.params;
      const { userId } = req.body;

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      //Checks if user already liked the post
      const index = post.likes.findIndex((like) => like == userId);
      if (index > -1) throw new Error("Post already liked!");

      post.likes.push(userId);

      await post.save();

      await post
        .populate("postedBy", [
          "firstName",
          "lastName",
          "fullName",
          "profilePicture",
        ])
        .populate("likes", ["firstName", "lastName", "profilePicture"])
        .execPopulate();

      return res.status(201).json(post);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { postId } = req.params;
      const { userId } = req.body;

      console.log(postId, userId);

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found!");

      const index = post.likes.findIndex((like) => like == userId);
      if (index < 0) throw new Error("Like not found!");

      console.log("INDEX", index);
      post.likes.splice(index, 1);

      await post.save();

      await post
        .populate("postedBy", [
          "firstName",
          "lastName",
          "fullName",
          "profilePicture",
        ])
        .populate("likes", ["firstName", "lastName", "profilePicture"])
        .execPopulate();

      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
