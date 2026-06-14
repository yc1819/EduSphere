import express from "express";
import Application from "../models/Application.js";
import multer from "multer";

const router = express.Router();

/* ================= FILE UPLOAD ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* =====================================================
   APPLY FOR JOB
===================================================== */

router.post("/", upload.single("resume"), async (req, res) => {
  try {

    const {
      job,
      name,
      email,
      cgpa,
      passingYear
    } = req.body;

    /* ===== PREVENT DUPLICATE APPLICATION ===== */

    const existing = await Application.findOne({
      job,
      studentEmail: email,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = new Application({
      job,
      studentName: name,
      studentEmail: email,
      cgpa,
      passingYear,
      resume: req.file ? req.file.filename : null,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   GET ALL APPLICATIONS (ADMIN)
===================================================== */

router.get("/", async (req, res) => {
  try {

    const applications = await Application.find()
      .populate({
        path: "job",
        select: "role company",
        populate: {
          path: "company",
          select: "name location",
        },
      })
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   GET APPLICATIONS BY JOB
===================================================== */

router.get("/job/:jobId", async (req, res) => {
  try {

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("job", "role");

    res.json(applications);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   UPDATE APPLICATION STATUS (ADMIN)
===================================================== */

router.put("/:id/status", async (req, res) => {
  try {

    const { status } = req.body;

    const updatedApplication =
      await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.json(updatedApplication);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =====================================================
   DELETE APPLICATION
===================================================== */

router.delete("/:id", async (req, res) => {
  try {

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      message: "Application deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;