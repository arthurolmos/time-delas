const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Team", "Post"],
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
module.exports.notificationSchema = notificationSchema;
