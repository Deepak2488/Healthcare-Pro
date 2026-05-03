import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

const visitData = [
  { day: "Mon", visits: 86, admissions: 24 },
  { day: "Tue", visits: 112, admissions: 32 },
  { day: "Wed", visits: 94, admissions: 27 },
  { day: "Thu", visits: 126, admissions: 38 },
  { day: "Fri", visits: 118, admissions: 35 },
  { day: "Sat", visits: 74, admissions: 18 },
  { day: "Sun", visits: 68, admissions: 16 },
];

const departments = [
  { name: "Emergency", value: 86, color: "#dc2626" },
  { name: "ICU", value: 72, color: "#f59e0b" },
  { name: "Cardiology", value: 64, color: "#2563eb" },
  { name: "OPD", value: 48, color: "#0f766e" },
];

export default function Dashboard() {
  const patients = useStore((s) => s.patients);
  const notifications = useStore((s) => s.notifications);
  const criticalPatients = patients.filter((patient) => patient.status === "Critical");
  const averageRisk = Math.round(
    patients.reduce((total, patient) => total + patient.riskScore, 0) / patients.length,
  );

  const stats = [
    {
      label: "Total patients",
      value: patients.length,
      change: "+12%",
      icon: Users,
      className: "dash-blue",
    },
    {
      label: "Critical cases",
      value: criticalPatients.length,
      change: "Live",
      icon: AlertTriangle,
      className: "dash-rose",
    },
    {
      label: "Average risk",
      value: `${averageRisk}%`,
      change: "-4%",
      icon: Activity,
      className: "dash-amber",
    },
    {
      label: "Open alerts",
      value: notifications.filter((item) => !item.read).length,
      change: "New",
      icon: CalendarCheck,
      className: "dash-teal",
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="hero-kicker">Home / Dashboard</p>
          <h1>Hospital command center</h1>
          <span>Live patient flow, clinical risk, and care operations in one colorful view.</span>
          <div className="hero-actions">
            <Link className="primary-action hero-primary" to="/patients">
              <Users />
              Manage Patients
            </Link>
            <Link className="hero-secondary" to="/analytics">
              View Analytics
              <ArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="hero-pulse-card" aria-label="System health">
          <div className="pulse-ring">
            <HeartPulse />
          </div>
          <p>Care quality</p>
          <strong>96%</strong>
          <span>Stable operations</span>
        </div>
      </section>

      <section className="dashboard-stats-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className={`dashboard-stat-card ${item.className}`} key={item.label}>
              <div>
                <Icon />
              </div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>
                <ArrowUpRight />
                {item.change} this week
              </p>
            </div>
          );
        })}
      </section>

      <section className="dashboard-grid dashboard-grid-color">
        <div className="panel panel-large dashboard-chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Patient volume</h2>
              <p>Visits and admissions across the current week</p>
            </div>
            <div className="panel-icon-blue">
              <HeartPulse />
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardVisits" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.36} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="dashboardAdmissions" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#dbeafe" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Area dataKey="visits" type="monotone" stroke="#2563eb" strokeWidth={3} fill="url(#dashboardVisits)" />
                <Area
                  dataKey="admissions"
                  type="monotone"
                  stroke="#0f766e"
                  strokeWidth={3}
                  fill="url(#dashboardAdmissions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel priority-panel">
          <div className="panel-heading">
            <div>
              <h2>Priority queue</h2>
              <p>Highest risk patients</p>
            </div>
            <div className="panel-icon-rose">
              <BedDouble />
            </div>
          </div>
          <div className="queue-list colorful-queue">
            {[...patients]
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 4)
              .map((patient) => (
                <Link key={patient.id} to={`/patients/${patient.id}`}>
                  <span className="risk-dot" />
                  <strong>{patient.name}</strong>
                  <span>{patient.department} · Risk {patient.riskScore}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Department capacity</h2>
              <p>Current occupancy by care unit</p>
            </div>
            <div className="panel-icon-teal">
              <Stethoscope />
            </div>
          </div>
          <div className="capacity-list">
            {departments.map((department) => (
              <div key={department.name}>
                <div>
                  <span>{department.name}</span>
                  <strong>{department.value}%</strong>
                </div>
                <div className="capacity-track">
                  <span style={{ width: `${department.value}%`, background: department.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel care-team-panel">
          <div className="panel-heading">
            <div>
              <h2>Care readiness</h2>
              <p>Operational signals</p>
            </div>
            <div className="panel-icon-green">
              <ShieldCheck />
            </div>
          </div>
          <div className="readiness-grid">
            <div>
              <strong>24</strong>
              <span>Doctors on shift</span>
            </div>
            <div>
              <strong>18m</strong>
              <span>Avg wait time</span>
            </div>
            <div>
              <strong>92%</strong>
              <span>Bed utilization</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
