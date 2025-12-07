import React, { useState } from "react";
import { getSession, getAuthHeader } from "../../services/authService";
import "./complaints.css";

export default function RaiseComplaint() {
  const categories = ["school", "hospital", "energy", "transport", "tourism", "other"];
  const priorityList = ["low", "medium", "high"];

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "medium",
    imageLink: "",
    locationLink: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const session = getSession();

  React.useEffect(() => {
    if (!session) {
      // redirect unauthenticated users to login
      window.location.hash = '#/login';
    }
  }, [session]);

  function handleChange(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function submitForm(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (!session) {
      setMessage('You must be logged in to submit a complaint.');
      setLoading(false);
      window.location.hash = '#/login';
      return;
    }
    try {
      const headers = { "Content-Type": "application/json", ...getAuthHeader() };

      const payload = {
        ...form,
        notes: "Submitted from SmartCity App",
      };

      const res = await fetch("http://localhost:3000/api/sql/complaints", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to submit");
      }

      setMessage("Complaint submitted successfully ✔");
      setForm({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        imageLink: "newimahe.png",
        locationLink: ""
      });
    } catch (err) {
      setMessage(err.message || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rc-page">
      <h2 className="rc-title">Raise a Complaint</h2>

      {!session && <div className="rc-warning">⚠ Please login to submit a complaint.</div>}

      <form className="rc-card" onSubmit={submitForm}>
        {/* Title */}
        <label>Complaint Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter complaint title"
        />

        {/* Category + Priority Row */}
        <div className="rc-row">
          <div className="rc-col">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="rc-col">
            <label>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              {priorityList.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <label>Description</label>
        <textarea
          required
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Explain the issue in detail..."
        />

        {/* Image Link */}
        <label>Image (optional)</label>
        <input
          value={form.imageLink}
          type="file"
          onChange={(e) => handleChange("imageLink", e.target.value)}
          placeholder="Paste image URL"
        />

        {form.imageLink && (
          <img src={form.imageLink} alt="Preview" className="rc-preview" />
        )}

        {/* Location Link */}
        <label>Location (Google / OpenStreetMap link)</label>
        <input
          value={form.locationLink}
          onChange={(e) => handleChange("locationLink", e.target.value)}
          placeholder="Paste location URL"
        />

        {/* Submit */}
        <button className="rc-submit" disabled={loading || !session}>
          {loading ? "Submitting…" : "Submit Complaint"}
        </button>

        {message && <div className="rc-message">{message}</div>}
      </form>
    </main>
  );
}
