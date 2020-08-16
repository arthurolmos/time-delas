const Category = require("../models/Category");

module.exports = {
  async index(req, res) {
    try {
      const categories = await Category.find({});

      return res.status(200).json(categories);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async query(req, res) {
    try {
      const { categoryId } = req.params;

      const category = await Category.findById(categoryId);

      return res.status(200).json(category);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async store(req, res) {
    try {
      const { title } = req.body;

      const verify = await Category.findOne({ title });
      if (verify) throw new Error("Category with same title already exists!");

      const category = await Category.create({ title });

      return res.status(201).json(category);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { categoryId } = req.params;
      const { title } = req.body;

      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Category not found!");

      const verify = await Category.findOne({ title });
      if (verify) throw new Error("Category with same title already exists!");

      category.title = title;
      await category.save();

      return res.status(200).json(category);
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const { categoryId } = req.params;

      await Category.deleteOne({ _id: categoryId });

      return res.status(200).json({ result: "Deleted succesfully!" });
    } catch (err) {
      return res.status(400).json({ name: err.name, message: err.message });
    }
  },
};
