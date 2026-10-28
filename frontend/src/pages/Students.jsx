import React from "react";
import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Users, X } from "lucide-react";
import api from "../api.js";

const empty = { name: "", rollNo: "", course: "", email: "" };
export default function Students() {
  const [students, setStudents] = useState([]); const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false); const [search, setSearch] = useState("");
  const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [busy, setBusy] = useState(false);
  async function load() { try { const {data} = await api.get("/students"); setStudents(data.students); } catch(err) { setError(err.response?.data?.message || "Could not load students."); } }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault(); setError(""); setSuccess(""); setBusy(true);
    try { await api.post("/students", form); setForm(empty); setShowForm(false); setSuccess("Student added and saved to MongoDB."); await load(); }
    catch(err) { setError(err.response?.data?.message || "Could not save student."); }
    finally { setBusy(false); }
  }
  async function remove(id, name) {
    if (!window.confirm(`Delete ${name} and their attendance records?`)) return;
    try { await api.delete(`/students/${id}`); setSuccess("Student deleted."); await load(); }
    catch(err) { setError(err.response?.data?.message || "Could not delete student."); }
  }
  const filtered = students.filter(s => `${s.name} ${s.rollNo} ${s.course} ${s.email}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="stack-lg"><div className="welcome-row"><div><span className="eyebrow">DIRECTORY</span><h1>Students</h1><p className="muted">Add, search and manage your student records.</p></div><button className="primary-btn" onClick={()=>{setShowForm(!showForm);setError("");}}>{showForm?<X size={18}/>:<Plus size={18}/>} {showForm?"Close form":"Add student"}</button></div>
    {error && <div className="alert">{error}</div>}{success && <div className="success-alert">{success}</div>}
    {showForm && <section className="panel"><div className="panel-heading"><div><h3>Add a student</h3><p className="muted">Fields marked * are required.</p></div></div><form className="student-form" onSubmit={submit}><div className="field"><label>Student name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Aditi Sharma" maxLength="100" required/></div><div className="field"><label>Roll number *</label><input value={form.rollNo} onChange={e=>setForm({...form,rollNo:e.target.value})} placeholder="e.g. MCA001" required/></div><div className="field"><label>Course / Class *</label><input value={form.course} onChange={e=>setForm({...form,course:e.target.value})} placeholder="e.g. MCA Semester 3" maxLength="100" required/></div><div className="field"><label>Email (optional)</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="student@example.com"/></div><div className="form-actions"><button className="primary-btn" disabled={busy}>{busy?"Saving…":"Save student"}</button></div></form></section>}
    <section className="panel"><div className="panel-heading"><div><h3>All students <span className="count-badge">{students.length}</span></h3><p className="muted">Total student records in your account</p></div><div className="search-wrap"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search students…"/></div></div>{filtered.length ? <div className="table-wrap"><table><thead><tr><th>Student</th><th>Roll No.</th><th>Course</th><th>Email</th><th>Action</th></tr></thead><tbody>{filtered.map(s=><tr key={s._id}><td className="student-cell"><span className="mini-avatar">{s.name[0]?.toUpperCase()}</span><strong>{s.name}</strong></td><td>{s.rollNo}</td><td>{s.course}</td><td>{s.email || "—"}</td><td><button className="icon-btn danger" title="Delete student" onClick={()=>remove(s._id,s.name)}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div>:<div className="empty-state"><div className="empty-icon"><Users/></div><strong>{search?"No matching students":"No students added yet"}</strong><p>{search?"Try another search term.":"Add your first student to begin taking attendance."}</p>{!search && <button className="primary-btn compact" onClick={()=>setShowForm(true)}><Plus size={16}/> Add first student</button>}</div>}</section>
  </div>;
}
