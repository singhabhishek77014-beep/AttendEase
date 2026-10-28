import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";
import auth from "../middleware/auth.js";

const router = Router();
router.use(auth);

router.post("/", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim())
      return res.status(400).json({ message: "Name, email and message are required." });
    const saved = await ContactMessage.create({
      owner: req.userId, name: name.trim(), email: email.trim().toLowerCase(), message: message.trim()
    });
    res.status(201).json({ message: "Contact message saved successfully.", contact: saved });
  } catch (err) { next(err); }
});

router.get("/", async (req, res, next) => {
  try {
    const messages = await ContactMessage.find({ owner: req.userId }).sort({ createdAt: -1 }).limit(100);
    res.json({ messages });
  } catch (err) { next(err); }
});

export default router;
