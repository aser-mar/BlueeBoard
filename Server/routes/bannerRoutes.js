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

const router =
express.Router();

router
.route("/")
.post(
  protect,
  adminOnly,
  createBanner
)
.get(getBanners);

router
.route("/:id")
.get(getBannerById)
.put(
  protect,
  adminOnly,
  updateBanner
)
.delete(
  protect,
  adminOnly,
  deleteBanner
);

module.exports =
router;