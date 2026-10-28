import React from "react";
import { useEffect, useState } from "react";
import { ClipboardCheck, Users, UserCheck, UserX, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api.js";

const todayString = () => {
  const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
export default function Dashboard() {
  const [date, setDate] = useState(todayString());
  const [summary, setSummary] = useState({ totalStudents: 0, present: 0, absent: 0, notMarked: 0 });
  const [records, setRecords] = useState([]); const [error, setError] = useState("");
  async function load() {
    try {
      setError("");
      const [s, a] = await Promise.all([api.get("/attendance/summary", { params: { date } }), api.get("/attendance", { params: { date } })]);
      setSummary(s.data); setRecords(a.data.records);
    } catch (err) { setError(err.response?.data?.message || "Could not load dashboard."); }
  }
  useEffect(() => { load(); }, [date]);
  return <div className="stack-lg">
    <div className="welcome-row"><div><span className="eyebrow">OVERVIEW</span><h1>Good to see you 👋</h1><p className="muted">Here is your attendance snapshot for the selected day.</p></div><div className="date-control"><label htmlFor="dash-date">Attendance date</label><input id="dash-date" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div></div>
    {error && <div className="alert">{error}</div>}
    <div className="stats-grid">
      <Stat title="Total Students" value={summary.totalStudents} icon={Users} tone="blue" note="Registered records"/>
      <Stat title="Present Today" value={summary.present} icon={UserCheck} tone="green" note="Marked present"/>
      <Stat title="Absent Today" value={summary.absent} icon={UserX} tone="red" note="Marked absent"/>
      <Stat title="Not Marked" value={summary.notMarked} icon={ClipboardCheck} tone="amber" note="Awaiting attendance"/>
    </div>
    <div className="content-grid"><section className="panel"><div className="panel-heading"><div><h3>Attendance activity</h3><p className="muted">Saved records for {date}</p></div><Link className="text-link" to="/attendance">Take attendance <ArrowUpRight size={16}/></Link></div>{records.length ? <div className="table-wrap"><table><thead><tr><th>Student</th><th>Roll No.</th><th>Course</th><th>Status</th></tr></thead><tbody>{records.map(r=><tr key={r._id}><td className="student-cell"><span className="mini-avatar">{r.student?.name?.[0] || "S"}</span>{r.student?.name || "Student"}</td><td>{r.student?.rollNo}</td><td>{r.student?.course}</td><td><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></td></tr>)}</tbody></table></div> : <div className="empty-state"><div className="empty-icon"><ClipboardCheck/></div><strong>No attendance marked yet</strong><p>Mark students present or absent to see the activity here.</p><Link className="primary-btn compact" to="/attendance">Mark attendance</Link></div>}</section>
    <section className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p className="muted">Common tasks</p></div></div><Link to="/students" className="action-card"><span className="action-icon blue"><Users/></span><span><strong>Manage students</strong><small>Add and review student records</small></span><ArrowUpRight className="action-arrow"/></Link><Link to="/attendance" className="action-card"><span className="action-icon green"><ClipboardCheck/></span><span><strong>Take attendance</strong><small>Record today's presence</small></span><ArrowUpRight className="action-arrow"/></Link><div className="tip-box"><strong>Attendance tip</strong><p>Choose the correct date before marking attendance. Each student has one saved status per date.</p></div></section></div>
  </div>;
}
function Stat({ title, value, icon: Icon, tone, note }) { return <div className="stat-card"><div className="stat-top"><span>{title}</span><span className={`stat-icon ${tone}`}><Icon size={19}/></span></div><div className="stat-number">{value}</div><div className="stat-note">{note}</div></div>; }
