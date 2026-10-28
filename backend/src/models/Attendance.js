import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD, based on user's selected date
  status: { type: String, enum: ["Present", "Absent"], required: true }
}, { timestamps: true });

attendanceSchema.index({ owner: 1, student: 1, date: 1 }, { unique: true });
export default mongoose.model("Attendance", attendanceSchema);
