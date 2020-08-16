const mongoose = require("mongoose");
const { postCommentSchema } = require("./PostComment");
const NotificationController = require("../controllers/NotificationController");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //Target of the post: Event or Team
    postedOn: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },

    onModel: {
      type: String,
      required: true,
      enum: ["Team"],
    },

    content: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [postCommentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

postSchema.post("save", function (doc) {
  console.log("POST", doc);

  NotificationController.create({
    targetId: "5f1f651e8b7004de14ac5257",
    type: "NewPost",
  });
});

module.exports = mongoose.model("Post", postSchema);
module.exports.postSchema = postSchema;
