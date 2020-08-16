const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postCommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

module.exports = mongoose.model("PostComment", postCommentSchema);
module.exports.postCommentSchema = postCommentSchema;
