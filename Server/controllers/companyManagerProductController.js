const Product = require("../models/Product");
const Category = require("../models/Category");
const { deleteImage } = require("../utils/cloudinaryHelper");

const getMyCompanyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      company: req.user.company,
    })
      .populate("category")
      .populate("company");

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyCompanyProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("company");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.company._id.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createMyCompanyProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      stock,
      category,
    } = req.body;

    const categoryExists = await Category.findOne({
      _id: category,
      companies: req.user.company,
    });

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category for this company",
      });
    }

    const existingProduct = await Product.findOne({
      company: req.user.company,
      name: name.trim(),
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "A product with this name already exists",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images,
      stock,
      category,
      company: req.user.company,
      placement: "normal",
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMyCompanyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Delete old images if new images are sent
if (
  req.body.images &&
  req.body.images.length > 0
) {

  if (
    product.images &&
    product.images.length > 0
  ) {

    for (const image of product.images) {

      if (image.public_id) {

        await deleteImage(
          image.public_id
        );

      }

    }

  }

  product.images =
    req.body.images;

}

if (req.body.category) {

  const categoryExists = await Category.findOne({
    _id: req.body.category,
    companies: req.user.company,
  });

  if (!categoryExists) {
    return res.status(400).json({
      message: "Invalid category for this company",
    });
  }
}

if (req.body.name) {
  const existingProduct = await Product.findOne({
    company: req.user.company,
    name: req.body.name.trim(),
  });

  if (
    existingProduct &&
    existingProduct._id.toString() !== product._id.toString()
  ) {
    return res.status(400).json({
      message: "A product with this name already exists",
    });
  }
}

product.name =
  req.body.name ||
  product.name;

product.description =
  req.body.description ||
  product.description;

product.price =
  req.body.price ??
  product.price;

product.stock =
  req.body.stock ??
  product.stock;

product.category =
  req.body.category ||
  product.category;

product.company =
  req.user.company;

await product.save();

res.json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteMyCompanyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (
      product.images &&
      product.images.length > 0
    ) {

      for (const image of product.images) {

        if (image.public_id) {

          await deleteImage(
            image.public_id
          );

        }

      }

    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyCompanyProducts,
  getMyCompanyProductById,
  createMyCompanyProduct,
  updateMyCompanyProduct,
  deleteMyCompanyProduct,
};