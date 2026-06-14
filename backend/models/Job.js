import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    /* ================= COMPANY RELATION ================= */
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    /* ================= JOB DETAILS ================= */
    role: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Internship"],
      required: true,
    },

    ctc: {
      type: String,
      default: null,
    },

    stipend: {
      type: String,
      default: null,
    },

    openings: {
      type: Number,
      default: 1,
    },

    filledCount: {
      type: Number,
      default: 0,
    },

    /* ================= ELIGIBILITY ================= */
    minCGPA: {
      type: Number,
      default: 0,
    },

    eligibleCourses: {
      type: [String],
      default: [],
    },

    batch: {
      type: String,
      default: null,
    },

    skills: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
    },

    /* ================= DOCUMENT ================= */
    jdFile: {
      type: String,
      default: null,
    },

    deadline: {
      type: Date,
      required: true,
    },

    /* ================= STATUS ================= */
    isFilled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ================= AUTO UPDATE isFilled ================= */

jobSchema.pre("save", function () {
  this.isFilled = this.filledCount >= this.openings;
});

export default mongoose.model("Job", jobSchema);