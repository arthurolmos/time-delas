const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const Schema = mongoose.Schema;
const { friendSchema } = require("./Friend");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },

    storageFolder: {
      type: String,
      default: null,
    },

    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 8);
});

userSchema
  .virtual("fullName")
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (v) {
    const firstName = v.substring(0, v.indexOf(" "));
    const lastName = v.substring(v.indexOf(" ") + 1);
    this.set({ firstName, lastName });
  });

userSchema.methods = {
  async compareHash(password) {
    console.log(password, this.password);
    return await bcrypt.compare(password, this.password);
  },

  generateToken(_id) {
    const payload = {
      sub: _id,
      iat: Date.now(),
    };

    const signedToken = jwt.sign(payload, jwtConfig.privateKey, {
      expiresIn: jwtConfig.jwtExpiration,
      algorithm: "RS256",
    });

    return {
      token: "Bearer " + signedToken,
      expiresIn: jwtConfig.jwtExpiration,
    };
  },
};

module.exports = mongoose.model("User", userSchema);
