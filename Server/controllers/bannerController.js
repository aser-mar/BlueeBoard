const Banner =
require("../models/Banner");

const createBanner =
async (req, res) => {

  try {

    const {
      title,
      image,
      link,
      company,
      position,
      isActive,
    } = req.body;

    const banner =
      await Banner.create({
        title,
        image,
        link,
        company,
        position,
        isActive,
      });

    res.status(201).json(
      banner
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getBanners =
async (req, res) => {

  try {

    const banners =
      await Banner.find()
      .populate("company")
      .sort({
        position: 1,
      });

    res.json(banners);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getBannerById =
async (req, res) => {

  try {

    const banner =
      await Banner.findById(
        req.params.id
      );

    if (!banner) {

      return res
      .status(404)
      .json({
        message:
          "Banner not found",
      });
    }

    res.json(banner);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const updateBanner =
async (req, res) => {

  try {

    const banner =
      await Banner.findById(
        req.params.id
      );

    if (!banner) {

      return res
      .status(404)
      .json({
        message:
          "Banner not found",
      });
    }

    banner.title =
      req.body.title ||
      banner.title;

    banner.image =
      req.body.image ||
      banner.image;

    banner.link =
      req.body.link ||
      banner.link;

    banner.company =
      req.body.company ||
      banner.company;

    banner.position =
      req.body.position ||
      banner.position;

    banner.isActive =
      req.body.isActive;

    const updatedBanner =
      await banner.save();

    res.json(
      updatedBanner
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const deleteBanner =
async (req, res) => {

  try {

    const banner =
      await Banner.findById(
        req.params.id
      );

    if (!banner) {

      return res
      .status(404)
      .json({
        message:
          "Banner not found",
      });
    }

    await banner.deleteOne();

    res.json({
      message:
        "Banner deleted",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};