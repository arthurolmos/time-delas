const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Friend is a feature disabled by now, may be implemented in the future...
const friendSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

friendSchema.virtual("mutualFriends");

module.exports = mongoose.model("Friend", friendSchema);
module.exports.friendSchema = friendSchema;
