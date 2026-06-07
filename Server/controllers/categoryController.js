const Category = require("../models/Category");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {

  try {

    const filter = {};

    if (req.query.company) {
      filter.company = req.query.company;
    }

    const categories =
      await Category.find(filter)
        .populate("company")
        .sort({ createdAt: -1 });

    res.status(200).json(categories);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {

  try {

    const {
      name,
      company,
    } = req.body;

    const exist =
      await Category.findOne({
        name,
        company,
      });

    if (exist) {

      return res.status(400).json({
        message:
          "Category already exists",
      });
    }

    const category =
      await Category.create({
        name,
        company,
      });

    const populatedCategory =
      await Category.findById(
        category._id
      ).populate("company");

    res.status(201).json(
      populatedCategory
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {

  try {

    const { name } =
      req.body;

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404).json({
        message:
          "Category not found",
      });
    }

    category.name = name;

    await category.save();

    const updatedCategory =
      await Category.findById(
        category._id
      ).populate("company");

    res.status(200).json(
      updatedCategory
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {

  try {

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {

      return res.status(404).json({
        message:
          "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message:
        "Category deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};