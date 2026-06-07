const Company =
  require("../models/Company");

const createCompany =
  async (req, res) => {

    try {

      const {
        name,
        description,
        logo,
      } = req.body;

      const company =
        await Company.create({
          name,
          description,
          logo,
        });

      res.status(201).json(
        company
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

const getCompanies =
  async (req, res) => {

    try {

      const companies =
        await Company.find();

      res.status(200).json(
        companies
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

const getCompanyById =
  async (req, res) => {

    try {

      const company =
        await Company.findById(
          req.params.id
        );

      if (!company) {
        return res.status(404).json({
          message:
            "Company not found",
        });
      }

      res.status(200).json(
        company
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

const deleteCompany =
  async (req, res) => {

    try {

      const company =
        await Company.findById(
          req.params.id
        );

      if (!company) {
        return res.status(404).json({
          message:
            "Company not found",
        });
      }

      await company.deleteOne();

      res.json({
        message:
          "Company deleted",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

const updateCompany =
  async (req, res) => {

    try {

      const company =
        await Company.findById(
          req.params.id
        );

      if (!company) {
        return res.status(404).json({
          message:
            "Company not found",
        });
      }

      company.name =
        req.body.name ||
        company.name;

      company.description =
        req.body.description ||
        company.description;

      company.logo =
        req.body.logo ||
        company.logo;

      const updatedCompany =
        await company.save();

      res.json(
        updatedCompany
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  deleteCompany,
  updateCompany,
};