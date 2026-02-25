import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

export default function AdminDashboard() {

  const [section, setSection] = useState("overview");

  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hours, setHours] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students")) || []);
    setJobs(JSON.parse(localStorage.getItem("jobs")) || []);
    setApplications(JSON.parse(localStorage.getItem("applications")) || []);
    setHours(JSON.parse(localStorage.getItem("hours")) || []);
    setFeedback(JSON.parse(localStorage.getItem("feedback")) || []);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const addStudent = () => {
    const updated = [...students, { username, password }];
    localStorage.setItem("students", JSON.stringify(updated));
    setStudents(updated);
    setUsername("");
    setPassword("");
  };

  const postJob = () => {
    const updated = [...jobs, { id: Date.now(), title: jobTitle }];
    localStorage.setItem("jobs", JSON.stringify(updated));
    setJobs(updated);
    setJobTitle("");
  };

  const approve = (index) => {
    applications[index].status = "Approved";
    localStorage.setItem("applications", JSON.stringify(applications));
    setApplications([...applications]);
  };

  const reject = (index) => {
    applications[index].status = "Rejected";
    localStorage.setItem("applications", JSON.stringify(applications));
    setApplications([...applications]);
  };

  const giveFeedback = () => {
    const updated = [...feedback, { student: selectedStudent, message: feedbackMsg }];
    localStorage.setItem("feedback", JSON.stringify(updated));
    setFeedback(updated);
    setFeedbackMsg("");
  };

  const menuItems = [
    { label: "Overview", value: "overview" },
    { label: "Students", value: "students" },
    { label: "Post Job", value: "jobs" },
    { label: "Applications", value: "applications" },
    { label: "Work Hours", value: "hours" },
    { label: "Feedback", value: "feedback" }
  ];

  return (
    <div className="layout admin-bg">
      <Sidebar menuItems={menuItems} setSection={setSection} logout={logout} />

      <div className="content">

        {section === "overview" && (
          <div className="card">
            <h2>Total Students: {students.length}</h2>
            <h2>Total Jobs: {jobs.length}</h2>
            <h2>Total Applications: {applications.length}</h2>
          </div>
        )}

        {section === "students" && (
          <div className="card">
            <h3>Add Student</h3>
            <input placeholder="Username"
              value={username}
              onChange={e=>setUsername(e.target.value)} />
            <input placeholder="Password"
              value={password}
              onChange={e=>setPassword(e.target.value)} />
            <button onClick={addStudent}>Add</button>

            <h3>Registered Students</h3>
            {students.map((s,i)=>(
              <p key={i}>{s.username}</p>
            ))}
          </div>
        )}

        {section === "jobs" && (
          <div className="card">
            <h3>Post Job</h3>
            <input value={jobTitle}
              onChange={e=>setJobTitle(e.target.value)} />
            <button onClick={postJob}>Post</button>
          </div>
        )}

        {section === "applications" && (
          <div className="card">
            <h3>Manage Applications</h3>
            {applications.map((app,i)=>(
              <div key={i} className="row">
                <span>
                  {app.student} applied for {app.job}
                  <br/>
                  Reason: {app.reason}
                  <br/>
                  Status: {app.status || "Pending"}
                </span>
                <div>
                  <button onClick={()=>approve(i)}>Approve</button>
                  <button onClick={()=>reject(i)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "hours" && (
          <div className="card">
            <h3>Work Hours by Student</h3>
            {students.map(student=>(
              <div key={student.username}>
                <h4>{student.username}</h4>
                {hours
                  .filter(h=>h.student===student.username)
                  .map((h,i)=>(
                    <p key={i}>{h.hours} hours</p>
                  ))}
              </div>
            ))}
          </div>
        )}

        {section === "feedback" && (
          <div className="card">
            <h3>Give Feedback</h3>
            <input placeholder="Student Username"
              onChange={e=>setSelectedStudent(e.target.value)} />
            <input placeholder="Feedback"
              value={feedbackMsg}
              onChange={e=>setFeedbackMsg(e.target.value)} />
            <button onClick={giveFeedback}>Submit</button>
          </div>
        )}

      </div>
    </div>
  );
}