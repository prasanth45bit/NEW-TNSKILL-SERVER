import React, { useEffect, useState, useMemo } from "react";
import { isAdmin, getAuthHeader } from "../../services/authService";
import "./ViewComplaints.css";

export default function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    // only admins may view complaints
    if (!isAdmin()) {
      window.location.hash = '#/admin/login';
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sql/complaints', { headers: { ...getAuthHeader() } });
        const data = await res.json();
        setComplaints(data || []);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------- FILTERING + SORTING -------------
  const filtered = useMemo(() => {
    let list = [...complaints];

    // Search
    if (search.trim() !== "") {
      list = list.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((c) => c.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }

    // Sorting
    if (sort === "latest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "priority") {
      const pri = { high: 3, medium: 2, low: 1 };
      list.sort((a, b) => pri[b.priority] - pri[a.priority]);
    }

    return list;
  }, [complaints, search, categoryFilter, statusFilter, sort]);

  return (
    <main className="complaints-view-page">
      <h2 className="page-title">All Complaints</h2>

      {/* --- Filter Bar --- */}
      <div className="cv-filter-bar">
        <div className="cv-search-box">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="cv-search-icon">🔍</span>
        </div>

        <select
          className="cv-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="transport">Transport</option>
          <option value="water">Water</option>
          <option value="roads">Roads</option>
          <option value="energy">Energy</option>
          <option value="schools">Schools</option>
          <option value="hospitals">Hospitals</option>
          <option value="tourism">Tourism</option>
          <option value="other">Other</option>
        </select>

        <select
          className="cv-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="cv-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* --- Table --- */}
      {loading ? (
        <div className="cv-loading">Loading complaints…</div>
      ) : filtered.length === 0 ? (
        <div className="cv-empty">No complaints match your filters.</div>
      ) : (
        <div className="cv-table-wrapper">
          <table className="cv-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Reporter</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td className="cv-tag cv-cat">{c.category}</td>
                  <td className={`cv-tag cv-${c.status}`}>{c.status}</td>
                  <td className={`cv-tag cv-pr-${c.priority}`}>{c.priority}</td>
                  <td>{c.reporterName}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
