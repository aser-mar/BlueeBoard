const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Company = require("../models/Company");

// CREATE COMPANY MANAGER
const createCompanyManager = async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

    if (!company) {
      return res.status(400).json({ message: "company is required" });
    }

    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "companyManager",
      company,
    });

    res.status(201).json({
      message: "Manager created successfully",
      manager,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMPANY MANAGERS
const getCompanyManagers = async (req, res) => {
  try {
    const managers = await User.find({
      role: "companyManager",
    })
      .populate("company")
      .select("-password");
      
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMPANY MANAGER
const deleteCompanyManager = async (req, res) => {
  try {
    const manager = await User.findById(req.params.id);

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    if (manager.role !== "companyManager") {
      return res.status(400).json({ message: "Can only delete company managers" });
    }

    await manager.deleteOne();

    res.json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyManagerById = async (req, res) => {
  try {

    const manager = await User.findById(req.params.id)
      .populate("company")
      .select("-password");

    if (!manager) {
      return res.status(404).json({
        message: "Manager not found",
      });
    }

    if (manager.role !== "companyManager") {
      return res.status(400).json({
        message: "Invalid manager",
      });
    }

    res.json(manager);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCompanyManager = async (req, res) => {
  try {

    const manager = await User.findById(req.params.id);

    if (!manager) {
      return res.status(404).json({
        message: "Manager not found",
      });
    }

    if (manager.role !== "companyManager") {
      return res.status(400).json({
        message: "Invalid manager",
      });
    }

    const { name, email, password, company } = req.body;

    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: manager._id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    manager.name = name;
    manager.email = email;
    manager.company = company;

    if (password) {
      manager.password = await bcrypt.hash(password, 10);
    }

    await manager.save();

    res.json({
      message: "Manager updated successfully",
      manager,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCompanyManager,
  getCompanyManagers,
  deleteCompanyManager,
  getCompanyManagerById,
  updateCompanyManager,
};