import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MapPin, Bell, Search, Layers } from "lucide-react";
import "./Home.css";

/* ---------------- MOCK DATA ---------------- */
const metricsMock = [
  { id: "population", label: "Population", value: "1,250,430", delta: "+0.8%" },
  { id: "energy", label: "Energy Usage (MW)", value: "5,120", delta: "-1.6%" },
  { id: "traffic", label: "Avg. Traffic (mins)", value: "18", delta: "-3%" },
  { id: "incidents", label: "Open Incidents", value: "42", delta: "+5%" },
];

const servicesMock = [
  { id: 1, title: "Waste Pickup", desc: "Schedule & status", badge: "Active" },
  { id: 2, title: "Public Transport", desc: "Routes & live arrivals", badge: "Live" },
  { id: 3, title: "Street Lights", desc: "Outage reporting", badge: "Report" },
  { id: 4, title: "Water Supply", desc: "Quality & disruptions", badge: "Alert" },
];

const incidentsOverTime = [
  { date: "Nov 1", incidents: 12 },
  { date: "Nov 5", incidents: 18 },
  { date: "Nov 10", incidents: 8 },
  { date: "Nov 15", incidents: 15 },
  { date: "Nov 20", incidents: 9 },
  { date: "Nov 25", incidents: 11 },
  { date: "Nov 30", incidents: 7 },
];

const resourceDistribution = [
  { name: "Transport", value: 400 },
  { name: "Energy", value: 300 },
  { name: "Waste", value: 200 },
  { name: "Water", value: 100 },
];

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#ef4444"];

const newsMock = [
  { id: 1, title: "New EV charging stations launched", date: "Dec 1, 2025" },
  { id: 2, title: "Smart bins pilot expands to 5 districts", date: "Nov 28, 2025" },
  { id: 3, title: "Traffic management update: new signal timings", date: "Nov 22, 2025" },
];

const eventsMock = [
  { id: 1, title: "City Clean-Up Drive", date: "Dec 12, 2025" },
  { id: 2, title: "Open Data Hackathon", date: "Jan 10, 2026" },
];

/* ---------------- SMALL COMPONENTS ---------------- */

function MetricCard({ label, value, delta }) {
  return (
    <div className="metric-card smooth-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value-row">
        <span className="metric-value">{value}</span>
        <span className={`metric-delta ${delta.includes("-") ? "neg" : "pos"}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

function ServiceCard({ title, desc, badge }) {
  return (
    <div className="service-card smooth-card">
      <div className="service-icon">
        <Layers size={20} />
      </div>
      <div className="service-info">
        <div className="service-title">{title}</div>
        <div className="service-desc">{desc}</div>
      </div>
      <div className={`service-badge b-${badge.toLowerCase()}`}>{badge}</div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export function Home() {
  const [services, setServices] = useState(servicesMock);
  const [metrics, setMetrics] = useState(metricsMock);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = useMemo(() => {
    const q = query.toLowerCase();
    return services.filter((s) => {
      const matchBadge = filter === "all" || s.badge.toLowerCase() === filter;
      const matchQuery =
        !q || s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
      return matchBadge && matchQuery;
    });
  }, [services, query, filter]);

  return (
    <main className="home-main fade-in">
      {/* ---------------- HEADER ---------------- */}
      <header className="home-header">
        <div className="header-left">
          <div className="logo-pill"><MapPin size={18} /></div>
          <div>
            <h1 className="site-title">SmartCity Info Portal</h1>
            <p className="site-subtitle">Live city data, alerts & services</p>
          </div>
        </div>

        <div className="header-right">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search services, news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="alert-btn smooth-card" >
            <Bell size={16} /> Alerts
          </button>
        </div>
      </header>

      {/* ---------------- METRICS ---------------- */}
      <section className="metrics-grid">
        {metrics.map((m) => (
          <MetricCard key={m.id} {...m} />
        ))}
      </section>

      {/* ---------------- GRID LAYOUT ---------------- */}
      <section className="main-grid">
        {/* LEFT */}
        <div className="left-panel">
          {/* MAP */}
          <div className="map-card smooth-card">
            <div className="map-label">
              <MapPin size={16} /> <span>Live City Map</span>
            </div>
            <iframe
              className="map-frame"
              title="city-map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.57%2C12.95%2C77.61%2C12.99&layer=mapnik&marker=12.971%2C77.594"
            />
          </div>

          {/* SERVICES */}
          <div className="services-grid">
            {filteredServices.map((service) => (
              <button
                key={service.id}
                className="service-btn"
                onClick={() => setSelectedService(service)}
              >
                <ServiceCard {...service} />
              </button>
            ))}
          </div>

          {/* INCIDENT CHART */}
          <div className="chart-card smooth-card">
            <h3>Incidents Over Time</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={incidentsOverTime}>
                <defs>
                  <linearGradient id="incGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="incidents" stroke="#4f46e5" fill="url(#incGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="right-panel">
          {/* PIE CHART */}
          <div className="chart-card smooth-card">
            <h4>Resource Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={resourceDistribution} dataKey="value" innerRadius={35} outerRadius={70}>
                  {resourceDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* NEWS */}
          <div className="card smooth-card">
            <h4>Latest News</h4>
            <ul className="news-list">
              {newsMock.map((n) => (
                <li key={n.id}>
                  <b>{n.title}</b>
                  <span>{n.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EVENTS */}
          <div className="card smooth-card">
            <h4>Upcoming Events</h4>
            <ul className="events-list">
              {eventsMock.map((e) => (
                <li key={e.id}>
                  <span>
                    <b>{e.title}</b>
                    <p>{e.date}</p>
                  </span>
                  <button className="btn-small">Register</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">© {new Date().getFullYear()} SmartCity</footer>

      {/* ---------------- MODAL ---------------- */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content smooth-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedService.title}</h3>
            <p>{selectedService.desc}</p>
            <div className="modal-actions">
              <button className="btn-primary">Open Dashboard</button>
              <button>Report Issue</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
