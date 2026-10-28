import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LockKeyhole, Mail } from "lucide-react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { acceptAuth } = useAuth();
  const navigate = useNavigate();
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const { data } = await api.post("/auth/login", form); acceptAuth(data); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Could not connect to server. Is the backend running?"); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-art"><div className="art-logo"><BookOpen/> AttendEase</div><div className="art-copy"><span className="pill">SMART CAMPUS TOOL</span><h1>Every class.<br/>Every student.<br/><em>One simple place.</em></h1><p>Manage students and daily attendance in a clear, organized workspace.</p></div><div className="art-foot">A simpler way to stay on track.</div></div><div className="auth-panel"><form className="auth-form" onSubmit={submit}><div className="mobile-brand"><BookOpen/> AttendEase</div><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p className="muted">Enter your details to continue.</p>{error && <div className="alert">{error}</div>}<label>Email address</label><div className="input-wrap"><Mail size={18}/><input type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" required/></div><label>Password</label><div className="input-wrap"><LockKeyhole size={18}/><input type="password" name="password" value={form.password} onChange={change} placeholder="At least 8 characters" required/></div><button className="primary-btn full" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <span>→</span></button><p className="auth-switch">New to AttendEase? <Link to="/register">Create an account</Link></p><p className="security-note">Your account data is stored in your connected database.</p></form></div></div>;
}
