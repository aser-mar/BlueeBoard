const express =
require("express");

const {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} = require(
  "../controllers/bannerController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);
const {
  bannerValidators,
} = require("../middleware/validators/bannerValidators");

const router =
express.Router();

router
.route("/")
.post(
  protect,
  adminOnly,
  bannerValidators,
  createBanner
)
.get(getBanners);

router
.route("/:id")
.get(getBannerById)
.put(
  protect,
  adminOnly,
  bannerValidators,
  updateBanner
)
.delete(
  protect,
  adminOnly,
  deleteBanner
);

module.exports =
router;