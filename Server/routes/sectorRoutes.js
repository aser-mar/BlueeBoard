const express = require("express");

const {
  createSector,
  getSectors,
  updateSector,
  deleteSector,
} = require("../controllers/sectorController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  sectorValidators,
} = require("../middleware/validators/sectorValidators");

const router = express.Router();

// PUBLIC
router.get(
  "/",
  getSectors
);

// ADMIN
router.post(
  "/",
  protect,
  adminOnly,
  sectorValidators,
  createSector
);

router.put(
  "/:id",
  protect,
  adminOnly,
  sectorValidators,
  updateSector
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteSector
);

module.exports = router;
