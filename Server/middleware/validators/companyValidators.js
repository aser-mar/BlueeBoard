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

const companyValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters"),
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  handleValidationErrors,
];

module.exports = {
  companyValidators,
  handleValidationErrors,
};
