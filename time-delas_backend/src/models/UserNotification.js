const mongoose = require("mongoose");
const { notificationSchema } = require("./Notification");

const Schema = mongoose.Schema;

const userNotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notifications: [notificationSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

module.exports = mongoose.model("UserNotification", userNotificationSchema);
module.exports.userNotificationSchema = userNotificationSchema;
