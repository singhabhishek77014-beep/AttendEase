import React from "react";
import { useState } from "react";
import api from "../api.js";
import { Mail, MessageSquare, Send } from "lucide-react";
export default function Contact() {
  const [form,setForm]=useState({name:"",email:"",message:""}); const [sent,setSent]=useState(false);
  const [error,setError] = useState(""); const [busy,setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setSent(false); setError(""); setBusy(true);
    try {
      await api.post("/contact", form);
      setSent(true); setForm({name:"",email:"",message:""});
    } catch(err) {
      setError(err.response?.data?.message || "Could not save message. Check that the backend is running.");
    } finally { setBusy(false); }
  }
  return <div className="stack-lg"><div className="welcome-row"><div><span className="eyebrow">GET IN TOUCH</span><h1>Contact</h1><p className="muted">Share a question or feedback about this project.</p></div></div><div className="contact-grid"><section className="panel contact-info"><div className="contact-illustration"><MessageSquare size={28}/></div><h2>We value your feedback</h2><p className="muted">Messages submitted here are saved in MongoDB under your account.</p><div className="contact-detail"><span className="feature-icon"><Mail/></span><div><strong>Project support</strong><small>Configure a real contact email before deployment.</small></div></div><div className="note-box">Messages are stored in MongoDB. This form does not send an email automatically.</div></section><section className="panel"><h3>Send a message</h3><p className="muted">All fields are required.</p>{sent && <div className="success-alert">Message saved to MongoDB successfully. No email was sent.</div>}{error && <div className="alert">{error}</div>}<form className="contact-form" onSubmit={submit}><div className="field"><label>Your name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="Full name"/></div><div className="field"><label>Email address</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="you@example.com"/></div><div className="field"><label>Message</label><textarea rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required placeholder="How can we help?"/></div><button className="primary-btn" type="submit" disabled={busy}><Send size={16}/> {busy ? "Saving…" : "Submit message"}</button></form></section></div></div>;
}
