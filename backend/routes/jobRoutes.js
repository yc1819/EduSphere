import express from "express";
import multer from "multer";
import Job from "../models/Job.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================================================
   CREATE JOB
========================================================= */

router.post("/", upload.single("jdFile"), async (req, res) => {
  try {
    const {
      company,
      role,
      jobType,
      ctc,
      stipend,
      openings,
      minCGPA,
      eligibleCourses,
      batch,
      skills,
      description,
      deadline,
    } = req.body;

    const job = new Job({
      company,
      role,
      jobType,
      ctc,
      stipend,
      openings,
      minCGPA,
      batch,
      skills,
      description,
      deadline,
      jdFile: req.file ? req.file.filename : null,
      eligibleCourses: eligibleCourses
        ? JSON.parse(eligibleCourses)
        : [],
    });

    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate("company", "name location");

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   UPDATE JOB
========================================================= */

router.put("/:id", upload.single("jdFile"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      eligibleCourses: req.body.eligibleCourses
        ? JSON.parse(req.body.eligibleCourses)
        : [],
    };

    if (req.file) {
      updateData.jdFile = req.file.filename;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("company", "name location");

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   GET JOBS FOR STUDENTS (ONLY ACTIVE)
========================================================= */

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isFilled: false })
      .populate("company", "name location");

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   GET ALL JOBS FOR ADMIN
========================================================= */

router.get("/admin/all", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name location");

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   DELETE JOB
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;