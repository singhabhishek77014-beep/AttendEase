import { Router } from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import auth from "../middleware/auth.js";

const router = Router();
router.use(auth);

function validDate(date) {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

router.get("/", async (req, res, next) => {
  try {
    const date = req.query.date;
    if (!validDate(date)) return res.status(400).json({ message: "Provide date as YYYY-MM-DD." });
    const records = await Attendance.find({ owner: req.userId, date }).populate("student", "name rollNo course").sort({ createdAt: 1 });
    res.json({ records });
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { studentId, date, status } = req.body;
    if (!mongoose.isValidObjectId(studentId) || !validDate(date) || !["Present", "Absent"].includes(status))
      return res.status(400).json({ message: "Student, valid date and status (Present/Absent) are required." });

    const student = await Student.findOne({ _id: studentId, owner: req.userId });
    if (!student) return res.status(404).json({ message: "Student not found." });

    const record = await Attendance.findOneAndUpdate(
      { owner: req.userId, student: studentId, date },
      { $set: { status } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate("student", "name rollNo course");
    res.json({ record });
  } catch (err) { next(err); }
});

router.get("/summary", async (req, res, next) => {
  try {
    const date = req.query.date;
    if (!validDate(date)) return res.status(400).json({ message: "Provide date as YYYY-MM-DD." });
    const totalStudents = await Student.countDocuments({ owner: req.userId });
    const records = await Attendance.find({ owner: req.userId, date });
    const present = records.filter(r => r.status === "Present").length;
    const absent = records.filter(r => r.status === "Absent").length;
    res.json({ totalStudents, present, absent, notMarked: Math.max(totalStudents - records.length, 0), date });
  } catch (err) { next(err); }
});

export default router;
