const Picture = require("../models/Picture");

module.exports = {
  async index(req, res) {
    try {
      const pictures = await Picture.find();

      return res.status(201).json(pictures);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async store(req, res) {
    try {
      // const { id } = req.params;
      const { originalname: name, size, filename: key, path: url } = req.file;
      console.log("HERE", req.file);

      const picture = await Picture.create({
        name,
        size,
        key,
        url,
      });

      return res.status(200).json(picture);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
