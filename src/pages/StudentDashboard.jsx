import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { jobStore, applicationStore, hoursStore, feedbackStore, authStore } from "../utils/storage";
import "../styles/layout.css";

const menuItems = [
  { label: "Apply for Jobs", value: "jobs", icon: "💼" },
  { label: "Log Hours", value: "hours", icon: "⏱️" },
  { label: "My Applications", value: "applications", icon: "📋" },
  { label: "My Feedback", value: "feedback", icon: "💬" },
];

function fmt(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function StudentDashboard() {
  const username = localStorage.getItem("username") || "Student";
  const [section, setSection] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [hours, setHours] = useState([]);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [reasons, setReasons] = useState({});
  const [hoursForm, setHoursForm] = useState({ hours: "", description: "" });

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  const reload = () => {
    setJobs(jobStore.getAll());
    setApplications(applicationStore.getByStudent(username));
    setHours(hoursStore.getByStudent(username));
    setFeedback(feedbackStore.getByStudent(username));
  };

  useEffect(() => { reload(); }, [section]);

  const logout = () => { authStore.logout(); window.location.href = "/"; };

  const apply = (job) => {
    const reason = reasons[job._id] || "";
    if (!reason.trim()) { flash("error", "Please enter a reason for applying."); return; }
    try {
      applicationStore.add({ student: username, job: job.title, jobId: job._id, reason });
      flash("success", `Applied for "${job.title}" successfully!`);
      setReasons(r => ({ ...r, [job._id]: "" }));
      reload();
    } catch (e) { flash("error", e.message); }
  };

  const logHours = (e) => {
    e.preventDefault();
    if (!hoursForm.hours || hoursForm.hours <= 0) { flash("error", "Enter valid hours."); return; }
    hoursStore.add({ student: username, hours: hoursForm.hours, description: hoursForm.description });
    flash("success", "Hours logged successfully!");
    setHoursForm({ hours: "", description: "" });
    reload();
  };

  const alreadyApplied = (jobId) => applications.some(a => a.jobId === jobId);
  const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);

  return (
    <div className="layout">
      <Sidebar menuItems={menuItems} section={section} setSection={setSection} logout={logout} title="Student Portal" />

      <div className="content">
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {/* APPLY JOBS */}
        {section === "jobs" && (
          <>
            <div className="page-header"><h2>Available Jobs</h2><p>Browse and apply for work-study positions, {username}</p></div>
            <div className="card">
              <h3>Open Positions ({jobs.length})</h3>
              {jobs.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">💼</div><p>No jobs available right now</p></div>
              ) : jobs.map(job => {
                const applied = alreadyApplied(job._id);
                return (
                  <div className="job-card" key={job._id} style={{ flexDirection: "column", alignItems: "stretch" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: applied ? 0 : 12 }}>
                      <div className="job-card-info"><h4>{job.title}</h4><p>{job.description || "No description provided"}</p><p style={{ marginTop: 4, fontSize: 12 }}>Posted {fmt(job.postedAt)}</p></div>
                      {applied && <span className="badge badge-approved">Applied ✓</span>}
                    </div>
                    {!applied && (
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                          <label>Why should you get this job?</label>
                          <input placeholder="Write your reason here..." value={reasons[job._id] || ""} onChange={e => setReasons(r => ({ ...r, [job._id]: e.target.value }))} />
                        </div>
                        <button className="btn-primary" style={{ flexShrink: 0 }} onClick={() => apply(job)}>Apply</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* LOG HOURS */}
        {section === "hours" && (
          <>
            <div className="page-header"><h2>Log Work Hours</h2><p>Record the hours you've worked</p></div>
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 400 }}>
              <div className="stat-card"><div className="stat-icon">⏱️</div><div className="stat-value">{totalHours}</div><div className="stat-label">Total Hours</div></div>
              <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-value">{hours.length}</div><div className="stat-label">Entries</div></div>
            </div>
            <div className="card">
              <h3>Add Hours Entry</h3>
              <form onSubmit={logHours}>
                <div className="form-grid">
                  <div className="form-group"><label>Hours Worked *</label><input type="number" min="0.5" step="0.5" placeholder="e.g. 4" value={hoursForm.hours} onChange={e => setHoursForm({ ...hoursForm, hours: e.target.value })} required /></div>
                  <div className="form-group"><label>Description</label><input placeholder="What did you work on?" value={hoursForm.description} onChange={e => setHoursForm({ ...hoursForm, description: e.target.value })} /></div>
                </div>
                <button type="submit" className="btn-primary">⏱️ Log Hours</button>
              </form>
            </div>
            <div className="card">
              <h3>Hours History</h3>
              {hours.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">⏱️</div><p>No hours logged yet</p></div>
              ) : hours.map(h => (
                <div className="hours-entry" key={h._id}>
                  <div><div className="hrs-val">{h.hours} hrs</div><div className="hrs-desc">{h.description || "No description"}</div></div>
                  <div className="hrs-date">{fmt(h.date)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MY APPLICATIONS */}
        {section === "applications" && (
          <>
            <div className="page-header"><h2>My Applications</h2><p>Track the status of your job applications</p></div>
            <div className="card">
              <h3>Application History ({applications.length})</h3>
              {applications.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📋</div><p>You haven't applied for any jobs yet</p></div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Job Title</th><th>Reason</th><th>Applied On</th><th>Status</th></tr></thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id}>
                          <td><strong>{app.job}</strong></td>
                          <td style={{ maxWidth: 220 }}>{app.reason}</td>
                          <td>{fmt(app.appliedAt)}</td>
                          <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* FEEDBACK */}
        {section === "feedback" && (
          <>
            <div className="page-header"><h2>My Feedback</h2><p>Feedback from your admin / teacher</p></div>
            <div className="card">
              <h3>Received Feedback ({feedback.length})</h3>
              {feedback.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">💬</div><p>No feedback received yet</p></div>
              ) : feedback.map(f => (
                <div className="feedback-card" key={f._id}>
                  <div className="fb-student">📝 Feedback from Admin</div>
                  <div className="fb-msg">{f.message}</div>
                  <div className="fb-date">{fmt(f.createdAt)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
