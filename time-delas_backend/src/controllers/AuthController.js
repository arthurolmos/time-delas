const User = require("../models/User");
const path = require("path");
const createDir = require("../utils/createDir");

module.exports = {
  //Jest test created and functioning
  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found!");

      if (!user.compareHash(password)) throw new Error("Password incorrect!");

      const jwt = user.generateToken(user._id);

      return res.status(200).json({ user: user, jwt: jwt });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  //Jest test created and functioning
  async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) throw new Error("Email already registered!");

      user = await User.create({
        email,
        password,
        firstName,
        lastName,
      });

      const dir = path.resolve(
        __dirname,
        "..",
        "..",
        "tmp",
        "uploads",
        "users",
        user._id.toString()
      );
      createDir(dir);

      await user.updateOne({
        profilePicture: null,
        storageFolder: `/pictures/${user._id}`,
      });

      const jwt = user.generateToken(user._id);

      return res.status(201).json({ user: user, jwt: jwt });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  //TODO: Jest test
  async recoverPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Email not found!" });

      //TODO: send email recovering password...

      return res.status(200).json(user);
    } catch (err) {
      return res.status(401).json({ name: err.name, message: err.message });
    }
  },

  //TODO: Jest test created, needs to implement
  signOut(req, res) {
    try {
      console.log(req.user);
      //TODO: Create a blacklist for tokens using REDIS...

      return res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
      return res.status(401).json({ name: err.name, message: err.message });
    }
  },
};
