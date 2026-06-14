import express from "express";
import Company from "../models/Company.js";

const router = express.Router();

/* ADD COMPANY */
router.post("/", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET ALL COMPANIES */
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* DELETE COMPANY */
router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;