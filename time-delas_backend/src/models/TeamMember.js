const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roles: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

module.exports = mongoose.model("TeamMemberComment", teamMemberSchema);
module.exports.teamMemberSchema = teamMemberSchema;
