// Simple localStorage-based data store

const get = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// --- AUTH ---
export const authStore = {
  login(username, password, role) {
    if (role === "admin") {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("role", "admin");
        localStorage.setItem("username", "admin");
        return { ok: true };
      }
      return { ok: false, message: "Invalid admin credentials" };
    }
    const students = get("students", []);
    const student = students.find(s => s.username === username && s.password === password);
    if (!student) return { ok: false, message: "Invalid credentials" };
    localStorage.setItem("token", "student-token");
    localStorage.setItem("role", "student");
    localStorage.setItem("username", username);
    return { ok: true };
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  }
};

// --- STUDENTS ---
export const studentStore = {
  getAll() { return get("students", []); },
  add({ username, password, name, email }) {
    const all = get("students", []);
    if (all.find(s => s.username === username)) throw new Error("Username already exists");
    const updated = [...all, { _id: Date.now().toString(), username, password, name: name || "", email: email || "", createdAt: new Date().toISOString() }];
    set("students", updated);
  },
  remove(username) { set("students", get("students", []).filter(s => s.username !== username)); }
};

// --- JOBS ---
export const jobStore = {
  getAll() { return get("jobs", []); },
  add({ title, description }) {
    const updated = [...get("jobs", []), { _id: Date.now().toString(), title, description: description || "", postedAt: new Date().toISOString() }];
    set("jobs", updated);
  },
  remove(id) { set("jobs", get("jobs", []).filter(j => j._id !== id)); }
};

// --- APPLICATIONS ---
export const applicationStore = {
  getAll() { return get("applications", []); },
  getByStudent(username) { return get("applications", []).filter(a => a.student === username); },
  add({ student, job, jobId, reason }) {
    const all = get("applications", []);
    if (all.find(a => a.student === student && a.jobId === jobId)) throw new Error("Already applied for this job");
    const updated = [...all, { _id: Date.now().toString(), student, job, jobId, reason, status: "Pending", appliedAt: new Date().toISOString() }];
    set("applications", updated);
  },
  updateStatus(id, status) {
    const updated = get("applications", []).map(a => a._id === id ? { ...a, status } : a);
    set("applications", updated);
  }
};

// --- HOURS ---
export const hoursStore = {
  getAll() { return get("hours", []); },
  getByStudent(username) { return get("hours", []).filter(h => h.student === username); },
  add({ student, hours, description }) {
    const updated = [...get("hours", []), { _id: Date.now().toString(), student, hours: Number(hours), description: description || "", date: new Date().toISOString() }];
    set("hours", updated);
  }
};

// --- FEEDBACK ---
export const feedbackStore = {
  getAll() { return get("feedback", []); },
  getByStudent(username) { return get("feedback", []).filter(f => f.student === username); },
  add({ student, message }) {
    const updated = [...get("feedback", []), { _id: Date.now().toString(), student, message, createdAt: new Date().toISOString() }];
    set("feedback", updated);
  },
  remove(id) { set("feedback", get("feedback", []).filter(f => f._id !== id)); }
};
