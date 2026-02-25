import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

export default function StudentDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [section, setSection] = useState("overview");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [hoursInput, setHoursInput] = useState("");
  const [reason, setReason] = useState("");

  useEffect(()=>{
    setJobs(JSON.parse(localStorage.getItem("jobs")) || []);
    setApplications(JSON.parse(localStorage.getItem("applications")) || []);
    setFeedback(JSON.parse(localStorage.getItem("feedback")) || []);
  },[]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const apply = (job) => {
    const updated = [
      ...applications,
      { student: user.username, job: job.title, reason, status: "Pending" }
    ];
    localStorage.setItem("applications", JSON.stringify(updated));
    setApplications(updated);
    setReason("");
  };

  const logHours = () => {
    const hrs = JSON.parse(localStorage.getItem("hours")) || [];
    hrs.push({ student: user.username, hours: hoursInput });
    localStorage.setItem("hours", JSON.stringify(hrs));
    setHoursInput("");
  };

  const menuItems = [
    { label: "Apply Job", value: "jobs" },
    { label: "Log Hours", value: "hours" },
    { label: "My Applications", value: "applications" },
    { label: "Feedback", value: "feedback" }
  ];

  return (
    <div className="layout student-bg">
      <Sidebar menuItems={menuItems} setSection={setSection} logout={logout} />

      <div className="content">

        {section === "jobs" && (
          <div className="card">
            <h3>Apply for Job</h3>
            {jobs.map(job=>(
              <div key={job.id}>
                <p>{job.title}</p>
                <input
                  placeholder="Why should you get this job?"
                  value={reason}
                  onChange={e=>setReason(e.target.value)}
                />
                <button onClick={()=>apply(job)}>Apply</button>
              </div>
            ))}
          </div>
        )}

        {section === "hours" && (
          <div className="card">
            <h3>Log Work Hours</h3>
            <input type="number"
              value={hoursInput}
              onChange={e=>setHoursInput(e.target.value)} />
            <button onClick={logHours}>Submit</button>
          </div>
        )}

        {section === "applications" && (
          <div className="card">
            <h3>My Applications</h3>
            {applications
              .filter(app=>app.student===user.username)
              .map((app,i)=>(
                <p key={i}>
                  {app.job} - {app.status}
                </p>
              ))}
          </div>
        )}

        {section === "feedback" && (
          <div className="card">
            <h3>Feedback from Admin</h3>
            {feedback
              .filter(f=>f.student===user.username)
              .map((f,i)=>(
                <p key={i}>{f.message}</p>
              ))}
          </div>
        )}

      </div>
    </div>
  );
}