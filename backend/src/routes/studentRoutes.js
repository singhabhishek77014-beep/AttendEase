import { Router } from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import auth from "../middleware/auth.js";

const router = Router();
router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json({ students });
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, rollNo, course, email = "" } = req.body;
    if (!name?.trim() || !rollNo?.trim() || !course?.trim())
      return res.status(400).json({ message: "Name, roll number and course are required." });
    const student = await Student.create({
      owner: req.userId, name: name.trim(), rollNo: rollNo.trim(),
      course: course.trim(), email: email.trim()
    });
    res.status(201).json({ student });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "This roll number already exists." });
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid student ID." });
    const student = await Student.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!student) return res.status(404).json({ message: "Student not found." });
    await Attendance.deleteMany({ student: student._id, owner: req.userId });
    res.json({ message: "Student and attendance records deleted." });
  } catch (err) { next(err); }
});

export default router;
