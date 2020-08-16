const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const User = require("../models/User");
const { update } = require("./PostController");

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
    // try {
    //   ...
    //   return res.status(200).json();
    // } catch (err) {
    //   return res.status(400).json({ name: err.name, message: err.message });
    // }
  },

  async store(req, res) {
    try {
      const { postId } = req.params;
      const { comment, userId } = req.body;

      console.log(userId, comment);

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      post.comments.push({ userId, comment });
      console.log(post.comments);

      await post.save();

      await post
        .populate({
          path: "comments.userId",
          model: "User",
          select: ["firstName", "lastName", "fullName", "profilePicture"],
        })
        .execPopulate();

      return res.status(201).json(post);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { postId } = req.params;
      const { commentId, userId, comment } = req.body;

      const post = await Post.findById(postId);
      if (!post) throw new Error("Comment not found!");

      const postComment = await post.comments.id(commentId);
      if (postComment.userId != userId)
        throw new Error("User not owner of comment!");
      postComment.set({ comment });

      await post.save();

      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
