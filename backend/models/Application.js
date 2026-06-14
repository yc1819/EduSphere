import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    cgpa: {
      type: Number,
      default: null,
    },

    passingYear: {
      type: Number,
      default: null,
    },

    resume: {
      type: String,
      default: null,
    },

    /* ⭐ APPLICATION STATUS */

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Selected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);