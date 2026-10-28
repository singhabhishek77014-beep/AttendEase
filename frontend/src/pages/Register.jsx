import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, UserRound, Mail, LockKeyhole } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const { acceptAuth } = useAuth(); const navigate = useNavigate();
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const { data } = await api.post("/auth/register", form); acceptAuth(data); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Could not connect to server. Is the backend running?"); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-art"><div className="art-logo"><BookOpen/> AttendEase</div><div className="art-copy"><span className="pill">GET STARTED</span><h1>Build better<br/>attendance<br/><em>habits.</em></h1><p>Create your account and start organizing your student records.</p></div><div className="art-foot">Simple setup. Organized records.</div></div><div className="auth-panel"><form className="auth-form" onSubmit={submit}><div className="mobile-brand"><BookOpen/> AttendEase</div><span className="eyebrow">CREATE ACCOUNT</span><h2>Join AttendEase</h2><p className="muted">Fill in the details to get started.</p>{error && <div className="alert">{error}</div>}<label>Full name</label><div className="input-wrap"><UserRound size={18}/><input name="name" value={form.name} onChange={change} placeholder="Your full name" required maxLength="80"/></div><label>Email address</label><div className="input-wrap"><Mail size={18}/><input type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" required/></div><label>Password</label><div className="input-wrap"><LockKeyhole size={18}/><input type="password" name="password" value={form.password} onChange={change} placeholder="At least 8 characters" minLength="8" required/></div><button className="primary-btn full" disabled={busy}>{busy ? "Creating account…" : "Create account"} <span>→</span></button><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></form></div></div>;
}
