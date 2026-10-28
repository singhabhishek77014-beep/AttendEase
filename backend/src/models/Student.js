import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  rollNo: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true, default: "" }
}, { timestamps: true });

studentSchema.index({ owner: 1, rollNo: 1 }, { unique: true });
export default mongoose.model("Student", studentSchema);
