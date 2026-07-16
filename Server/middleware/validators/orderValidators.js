const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

const orderValidators = [
  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Customer name must be between 2 and 120 characters"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 5, max: 20 })
    .withMessage("Phone must be between 5 and 20 characters"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),
  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash", "card"])
    .withMessage("Payment method must be either cash or card"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),
  body("items.*.product")
    .notEmpty()
    .withMessage("Each item must include a product"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each item quantity must be a positive integer"),
  handleValidationErrors,
];

module.exports = {
  orderValidators,
  handleValidationErrors,
};
