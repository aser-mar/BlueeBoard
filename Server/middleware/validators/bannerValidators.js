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

const bannerValidators = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Title must be between 2 and 120 characters"),
  body("image")
    .notEmpty()
    .withMessage("Image is required")
    .isObject()
    .withMessage("Image must be an object"),
   body("image.url")
    .notEmpty()
    .withMessage("Image URL is required"),
  body("link")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Link must be a string")
    .isLength({ max: 500 })
    .withMessage("Link cannot exceed 500 characters"),
  body("position")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Position must be greater than 0"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
  body("company")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid company"),
  body("product")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid product"),    
  handleValidationErrors,
];

module.exports = {
  bannerValidators,
  handleValidationErrors,
};