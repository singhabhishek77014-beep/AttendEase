import React from "react";
import { useEffect, useState } from "react";
import { CalendarDays, Check, ClipboardCheck, RefreshCw, UserX } from "lucide-react";
import api from "../api.js";

const todayString = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
export default function AttendancePage() {
  const [date,setDate]=useState(todayString()); const [students,setStudents]=useState([]);
  const [statuses,setStatuses]=useState({}); const [summary,setSummary]=useState({present:0,absent:0,totalStudents:0,notMarked:0});
  const [error,setError]=useState(""); const [notice,setNotice]=useState(""); const [loading,setLoading]=useState(true);
  async function load() {
    setLoading(true); setError(""); setNotice("");
    try {
      const [studentRes, attendanceRes, summaryRes] = await Promise.all([
        api.get("/students"), api.get("/attendance",{params:{date}}), api.get("/attendance/summary",{params:{date}})
      ]);
      setStudents(studentRes.data.students); setSummary(summaryRes.data);
      const next={}; attendanceRes.data.records.forEach(r=>{ if(r.student?._id) next[r.student._id]=r.status; });
      setStatuses(next);
    } catch(err) { setError(err.response?.data?.message || "Could not load attendance."); }
    finally { setLoading(false); }
  }
  useEffect(()=>{load();},[date]);
  async function mark(studentId,status) {
    setError(""); setNotice("");
    const old= statuses[studentId];
    setStatuses(prev=>({...prev,[studentId]:status}));
    try { await api.post("/attendance",{studentId,date,status}); setNotice("Attendance saved to MongoDB."); const {data}=await api.get("/attendance/summary",{params:{date}}); setSummary(data); }
    catch(err) { setStatuses(prev=>({...prev,[studentId]:old})); setError(err.response?.data?.message || "Could not save attendance."); }
  }
  const present=Object.values(statuses).filter(s=>s==="Present").length;
  const absent=Object.values(statuses).filter(s=>s==="Absent").length;
  return <div className="stack-lg"><div className="welcome-row"><div><span className="eyebrow">DAILY REGISTER</span><h1>Attendance</h1><p className="muted">Choose a date and mark each student's status.</p></div><div className="date-control"><label htmlFor="attendance-date"><CalendarDays size={15}/> Attendance date</label><input id="attendance-date" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div></div>
    {error && <div className="alert">{error}</div>}{notice && <div className="success-alert">{notice}</div>}
    <div className="attendance-summary"><div><span className="summary-dot green-dot"></span><span>Present</span><strong>{present}</strong></div><div><span className="summary-dot red-dot"></span><span>Absent</span><strong>{absent}</strong></div><div><span className="summary-dot gray-dot"></span><span>Not marked</span><strong>{Math.max(students.length-present-absent,0)}</strong></div><button className="secondary-btn" onClick={load}><RefreshCw size={16}/> Refresh</button></div>
    <section className="panel"><div className="panel-heading"><div><h3>Student register</h3><p className="muted">{students.length} students · {date}</p></div><span className="count-badge">{students.length} total</span></div>
      {loading?<div className="loading">Loading attendance…</div>:students.length===0?<div className="empty-state"><div className="empty-icon"><ClipboardCheck/></div><strong>No students found</strong><p>Add students first, then return here to mark attendance.</p></div>:<div className="table-wrap"><table><thead><tr><th>Student</th><th>Roll No.</th><th>Course</th><th>Mark attendance</th></tr></thead><tbody>{students.map(s=><tr key={s._id}><td className="student-cell"><span className="mini-avatar">{s.name[0]?.toUpperCase()}</span><strong>{s.name}</strong></td><td>{s.rollNo}</td><td>{s.course}</td><td><div className="mark-actions"><button className={`mark-btn present-btn ${statuses[s._id]==="Present"?"selected":""}`} onClick={()=>mark(s._id,"Present")}><Check size={15}/> Present</button><button className={`mark-btn absent-btn ${statuses[s._id]==="Absent"?"selected":""}`} onClick={()=>mark(s._id,"Absent")}><UserX size={15}/> Absent</button></div></td></tr>)}</tbody></table></div>}
    </section><p className="page-hint">Each student's attendance is saved by date. If you change a status, the existing record for that student and date is updated.</p>
  </div>;
}
