const Sector = require("../models/Sector");

// GET ALL SECTORS
const getSectors = async (req, res) => {
  try {
    const sectors = await Sector.find().sort({ createdAt: -1 });
    res.status(200).json(sectors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE SECTOR
const createSector = async (req, res) => {
  try {
    const { name } = req.body;
    const cleanName = name.trim();

    const exist = await Sector.findOne({
      name: { $regex: `^${cleanName}$`, $options: "i" },
    });

    if (exist) {
      return res.status(400).json({ message: "Sector already exists" });
    }

    const sector = await Sector.create({ name: cleanName });
    res.status(201).json(sector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SECTOR
const updateSector = async (req, res) => {
  try {
    const { name } = req.body;
    const sector = await Sector.findById(req.params.id);

    if (!sector) {
      return res.status(404).json({ message: "Sector not found" });
    }

    sector.name = name.trim();
    await sector.save();
    res.status(200).json(sector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SECTOR
const deleteSector = async (req, res) => {
  try {
    const sector = await Sector.findById(req.params.id);

    if (!sector) {
      return res.status(404).json({ message: "Sector not found" });
    }

    await sector.deleteOne();
    res.status(200).json({ message: "Sector deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSectors,
  createSector,
  updateSector,
  deleteSector,
};
