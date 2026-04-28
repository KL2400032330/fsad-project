import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { api } from "../utils/api";
import "../styles/layout.css";

const menuItems = [
  { label: "Overview", value: "overview", icon: "📊" },
  { label: "Students", value: "students", icon: "👥" },
  { label: "Post Jobs", value: "jobs", icon: "💼" },
  { label: "Applications", value: "applications", icon: "📋" },
  { label: "Work Hours", value: "hours", icon: "⏱️" },
  { label: "Feedback", value: "feedback", icon: "💬" },
];

function fmt(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const [overview, setOverview] = useState({});
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hours, setHours] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // forms
  const [stuForm, setStuForm] = useState({ username: "", password: "", name: "", email: "" });
  const [jobForm, setJobForm] = useState({ title: "", description: "" });
  const [fbForm, setFbForm] = useState({ student: "", message: "" });

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  const load = useCallback(async () => {
    try {
      if (section === "overview") setOverview(await api.get("/admin/overview"));
      if (section === "students") setStudents(await api.get("/admin/students"));
      if (section === "jobs") setJobs(await api.get("/admin/jobs"));
      if (section === "applications") setApplications(await api.get("/admin/applications"));
      if (section === "hours") {
        setStudents(await api.get("/admin/students"));
        setHours(await api.get("/admin/hours"));
      }
      if (section === "feedback") {
        setStudents(await api.get("/admin/students"));
        setFeedback(await api.get("/admin/feedback"));
      }
    } catch (e) {
      flash("error", e.message);
    }
  }, [section]);

  useEffect(() => { load(); }, [load]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // --- STUDENTS ---
  const addStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/students", stuForm);
      flash("success", "Student added successfully");
      setStuForm({ username: "", password: "", name: "", email: "" });
      setStudents(await api.get("/admin/students"));
    } catch (e) { flash("error", e.message); }
  };

  const removeStudent = async (username) => {
    if (!confirm(`Remove student "${username}"?`)) return;
    try {
      await api.delete(`/admin/students/${username}`);
      flash("success", "Student removed");
      setStudents(await api.get("/admin/students"));
    } catch (e) { flash("error", e.message); }
  };

  // --- JOBS ---
  const postJob = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/jobs", jobForm);
      flash("success", "Job posted");
      setJobForm({ title: "", description: "" });
      setJobs(await api.get("/admin/jobs"));
    } catch (e) { flash("error", e.message); }
  };

  const deleteJob = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      flash("success", "Job deleted");
      setJobs(await api.get("/admin/jobs"));
    } catch (e) { flash("error", e.message); }
  };

  // --- APPLICATIONS ---
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/applications/${id}`, { status });
      setApplications(await api.get("/admin/applications"));
    } catch (e) { flash("error", e.message); }
  };

  // --- FEEDBACK ---
  const giveFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/feedback", fbForm);
      flash("success", "Feedback sent");
      setFbForm({ student: "", message: "" });
      setFeedback(await api.get("/admin/feedback"));
    } catch (e) { flash("error", e.message); }
  };

  const deleteFeedback = async (id) => {
    try {
      await api.delete(`/admin/feedback/${id}`);
      setFeedback(await api.get("/admin/feedback"));
    } catch (e) { flash("error", e.message); }
  };

  return (
    <div className="layout">
      <Sidebar menuItems={menuItems} section={section} setSection={setSection} logout={logout} title="Admin Panel" />

      <div className="content">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {/* OVERVIEW */}
        {section === "overview" && (
          <>
            <div className="page-header">
              <h2>Dashboard Overview</h2>
              <p>Welcome back, Admin. Here's what's happening today.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{overview.students ?? 0}</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-value">{overview.jobs ?? 0}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{overview.applications ?? 0}</div>
                <div className="stat-label">Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{overview.pending ?? 0}</div>
                <div className="stat-label">Pending Review</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{overview.totalHours ?? 0}</div>
                <div className="stat-label">Total Hours Logged</div>
              </div>
            </div>
          </>
        )}

        {/* STUDENTS */}
        {section === "students" && (
          <>
            <div className="page-header">
              <h2>Manage Students</h2>
              <p>Add or remove student accounts</p>
            </div>
            <div className="card">
              <h3>Add New Student</h3>
              <form onSubmit={addStudent}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Username *</label>
                    <input placeholder="e.g. john_doe" value={stuForm.username}
                      onChange={e => setStuForm({ ...stuForm, username: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input type="password" placeholder="Set password" value={stuForm.password}
                      onChange={e => setStuForm({ ...stuForm, password: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input placeholder="e.g. John Doe" value={stuForm.name}
                      onChange={e => setStuForm({ ...stuForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="student@school.edu" value={stuForm.email}
                      onChange={e => setStuForm({ ...stuForm, email: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-primary">+ Add Student</button>
              </form>
            </div>

            <div className="card">
              <h3>Registered Students ({students.length})</h3>
              {students.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">👥</div><p>No students yet</p></div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Username</th><th>Full Name</th><th>Email</th><th>Joined</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s._id}>
                          <td><strong>{s.username}</strong></td>
                          <td>{s.name || "—"}</td>
                          <td>{s.email || "—"}</td>
                          <td>{fmt(s.createdAt)}</td>
                          <td>
                            <button className="btn-danger" onClick={() => removeStudent(s.username)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* JOBS */}
        {section === "jobs" && (
          <>
            <div className="page-header">
              <h2>Job Postings</h2>
              <p>Post and manage available work-study positions</p>
            </div>
            <div className="card">
              <h3>Post New Job</h3>
              <form onSubmit={postJob}>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label>Job Title *</label>
                  <input placeholder="e.g. Library Assistant" value={jobForm.title}
                    onChange={e => setJobForm({ ...jobForm, title: e.target.value })} required />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label>Description</label>
                  <textarea rows={3} placeholder="Describe the role and responsibilities..."
                    value={jobForm.description}
                    onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                    style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-primary">📢 Post Job</button>
              </form>
            </div>

            <div className="card">
              <h3>Active Jobs ({jobs.length})</h3>
              {jobs.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">💼</div><p>No jobs posted yet</p></div>
              ) : (
                jobs.map(j => (
                  <div className="job-card" key={j._id}>
                    <div className="job-card-info">
                      <h4>{j.title}</h4>
                      <p>{j.description || "No description"}</p>
                      <p style={{ marginTop: 4, fontSize: 12 }}>Posted {fmt(j.postedAt)}</p>
                    </div>
                    <div className="job-card-actions">
                      <button className="btn-danger" onClick={() => deleteJob(j._id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* APPLICATIONS */}
        {section === "applications" && (
          <>
            <div className="page-header">
              <h2>Job Applications</h2>
              <p>Review and manage student applications</p>
            </div>
            <div className="card">
              <h3>All Applications ({applications.length})</h3>
              {applications.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📋</div><p>No applications yet</p></div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Student</th><th>Job</th><th>Reason</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id}>
                          <td><strong>{app.student}</strong></td>
                          <td>{app.job}</td>
                          <td style={{ maxWidth: 200 }}>{app.reason}</td>
                          <td>{fmt(app.appliedAt)}</td>
                          <td>
                            <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                          </td>
                          <td>
                            {app.status === "Pending" && (
                              <div style={{ display: "flex", gap: 6 }}>
                                <button className="btn-success" onClick={() => updateStatus(app._id, "Approved")}>✓</button>
                                <button className="btn-danger" onClick={() => updateStatus(app._id, "Rejected")}>✗</button>
                              </div>
                            )}
                            {app.status !== "Pending" && (
                              <span style={{ fontSize: 12, color: "var(--text2)" }}>Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* HOURS */}
        {section === "hours" && (
          <>
            <div className="page-header">
              <h2>Work Hours</h2>
              <p>View hours logged by each student</p>
            </div>
            {students.length === 0 ? (
              <div className="card"><div className="empty-state"><div className="empty-icon">⏱️</div><p>No students registered</p></div></div>
            ) : (
              students.map(s => {
                const sHours = hours.filter(h => h.student === s.username);
                const total = sHours.reduce((sum, h) => sum + h.hours, 0);
                return (
                  <div className="card" key={s._id}>
                    <h3>{s.name || s.username} — <span style={{ color: "var(--primary)" }}>{total} hrs total</span></h3>
                    {sHours.length === 0 ? (
                      <p style={{ color: "var(--text2)", fontSize: 14 }}>No hours logged yet</p>
                    ) : (
                      sHours.map(h => (
                        <div className="hours-entry" key={h._id}>
                          <div>
                            <div className="hrs-val">{h.hours} hrs</div>
                            <div className="hrs-desc">{h.description || "No description"}</div>
                          </div>
                          <div className="hrs-date">{fmt(h.date)}</div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* FEEDBACK */}
        {section === "feedback" && (
          <>
            <div className="page-header">
              <h2>Student Feedback</h2>
              <p>Send feedback to students about their performance</p>
            </div>
            <div className="card">
              <h3>Send Feedback</h3>
              <form onSubmit={giveFeedback}>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label>Select Student *</label>
                  <select value={fbForm.student}
                    onChange={e => setFbForm({ ...fbForm, student: e.target.value })} required>
                    <option value="">-- Choose a student --</option>
                    {students.map(s => (
                      <option key={s._id} value={s.username}>{s.name || s.username}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label>Feedback Message *</label>
                  <textarea rows={4} placeholder="Write your feedback here..."
                    value={fbForm.message}
                    onChange={e => setFbForm({ ...fbForm, message: e.target.value })}
                    required style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-primary">💬 Send Feedback</button>
              </form>
            </div>

            <div className="card">
              <h3>Sent Feedback ({feedback.length})</h3>
              {feedback.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">💬</div><p>No feedback sent yet</p></div>
              ) : (
                feedback.map(f => (
                  <div className="feedback-card" key={f._id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="fb-student">👤 {f.student}</div>
                        <div className="fb-msg">{f.message}</div>
                        <div className="fb-date">{fmt(f.createdAt)}</div>
                      </div>
                      <button className="btn-danger" style={{ padding: "5px 12px", fontSize: 12 }}
                        onClick={() => deleteFeedback(f._id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
