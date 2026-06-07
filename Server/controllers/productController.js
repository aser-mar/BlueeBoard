const Product = require("../models/Product");

// GET ALL PRODUCTS (FILTER + SEARCH)
const getProducts = async (req, res) => {
  try {
    const {
      companyId,
      categoryId,
      search,
    } = req.query;

    let filter = {};

    if (companyId) {
      filter.company = companyId;
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const products =
      await Product.find(filter)
        .populate("category")
        .populate("company");

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// ⭐ FEATURED PRODUCTS
const getFeaturedProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find({
          placement: {
            $in: [
              "featured",
              "sponsored",
            ],
          },
        })
          .populate("category")
          .populate("company")
          .limit(8);

      res.json(products);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

// GET PRODUCT BY ID
const getProductById =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        )
          .populate("category")
          .populate("company");

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json(product);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

// CREATE PRODUCT
const createProduct =
  async (req, res) => {

    try {

      const {
        name,
        description,
        price,
        images,
        stock,
        category,
        company,
        placement,
      } = req.body;

      const product =
        await Product.create({
          name,
          description,
          price,
          images,
          stock,
          category,
          company,
          placement:
            placement ||
            "normal",
        });

      res.status(201).json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

// UPDATE PRODUCT
const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json(product);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
};