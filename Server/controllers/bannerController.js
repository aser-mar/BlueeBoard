const Banner =
require("../models/Banner");
const { deleteImage } = require("../utils/cloudinaryHelper");

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
  product,
} = req.body;

const existingPosition = await Banner.findOne({
  position,
});

if (existingPosition) {
  return res.status(400).json({
    message: "This position is already used",
  });
}

const banner =
  await Banner.create({
    title,
    image: {
      url: image.url,
      public_id: image.public_id,
    },
    link,
    company,
    position,
    isActive,
    product,
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
  .populate("product")
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
  )
  .populate("product");

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

if (req.body.image) {

  if (banner.image?.public_id) {

    await deleteImage(
      banner.image.public_id
    );

  }

  banner.image = {
    url: req.body.image.url,
    public_id: req.body.image.public_id,
  };

}

if (req.body.position != null) {
  const existingPosition = await Banner.findOne({
    position: req.body.position,
  });

  if (
    existingPosition &&
    existingPosition._id.toString() !== banner._id.toString()
  ) {
    return res.status(400).json({
      message: "This position is already used",
    });
  }
}

banner.link =
  req.body.link ||
  banner.link;

banner.company =
  req.body.company ||
  banner.company;

banner.product =
  req.body.product ||
  banner.product;

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

if (banner.image?.public_id) {
    await deleteImage(banner.image.public_id);
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