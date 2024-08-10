import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["Transport", "Academic", "Discipline", "Student Affairs"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    comment: {
      type: String,
      default: null,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

issueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
