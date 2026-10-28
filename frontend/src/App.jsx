import React from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { BookOpen, ClipboardCheck, Home, Info, LogOut, Mail, Users } from "lucide-react";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import AttendancePage from "./pages/Attendance.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading your account…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    ["/", "Home", Home], ["/students", "Students", Users],
    ["/attendance", "Attendance", ClipboardCheck], ["/about", "About", Info], ["/contact", "Contact", Mail]
  ];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><BookOpen size={22}/></div><div><strong>AttendEase</strong><small>Student Portal</small></div></div>
      <div className="nav-label">MENU</div>
      <nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="user-chip"><div className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div><div className="user-text"><strong>{user?.name}</strong><small>{user?.email}</small></div></div><button className="logout" onClick={() => { logout(); navigate("/login"); }}><LogOut size={17}/> Logout</button></div>
    </aside>
    <main className="main-area"><header className="topbar"><div><span className="eyebrow">STUDENT MANAGEMENT</span><h2>Attendance Workspace</h2></div><div className="top-user"><span className="online-dot"></span> Signed in as {user?.name}</div></header><div className="page-content">{children}</div><footer>AttendEase · Student Online Attendance Management System</footer></main>
  </div>;
}

function PrivatePage({ children }) { return <Protected><Layout>{children}</Layout></Protected>; }

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace/> : <Login/>}/>
    <Route path="/register" element={user ? <Navigate to="/" replace/> : <Register/>}/>
    <Route path="/" element={<PrivatePage><Dashboard/></PrivatePage>}/>
    <Route path="/students" element={<PrivatePage><Students/></PrivatePage>}/>
    <Route path="/attendance" element={<PrivatePage><AttendancePage/></PrivatePage>}/>
    <Route path="/about" element={<PrivatePage><About/></PrivatePage>}/>
    <Route path="/contact" element={<PrivatePage><Contact/></PrivatePage>}/>
    <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace/>}/>
  </Routes>;
}
