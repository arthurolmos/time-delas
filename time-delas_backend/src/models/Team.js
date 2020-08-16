const mongoose = require("mongoose");
const { teamMemberSchema } = require("./TeamMember");
const { postSchema } = require("./Post");
const socketIOHelper = require("../helpers/socketio");

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    about: {
      type: String,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },

    storageFolder: {
      type: String,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    members: [teamMemberSchema],

    // posts: [postSchema],

    // events: {
    //     type: [Events],
    //     required: true,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

module.exports = mongoose.model("Team", teamSchema);
module.exports.teamSchema = teamSchema;
