import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";
import { useStore } from "../store/useStore";

const monthlyGrowth = [
  { month: "Jan", patients: 88 },
  { month: "Feb", patients: 104 },
  { month: "Mar", patients: 98 },
  { month: "Apr", patients: 126 },
  { month: "May", patients: 142 },
  { month: "Jun", patients: 156 },
];

const colors = ["#2563eb", "#0f766e", "#f59e0b", "#dc2626", "#7c3aed"];

export default function Analytics() {
  const patients = useStore((s) => s.patients);
  const departments = Object.entries(
    patients.reduce<Record<string, number>>((acc, patient) => {
      acc[patient.department] = (acc[patient.department] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const riskBands = [
    { label: "Low", value: patients.filter((patient) => patient.riskScore < 40).length },
    { label: "Medium", value: patients.filter((patient) => patient.riskScore >= 40 && patient.riskScore < 75).length },
    { label: "High", value: patients.filter((patient) => patient.riskScore >= 75).length },
  ];

  return (
    <div className="analytics-page">
      <section className="module-hero analytics-hero">
        <div>
          <p>Analytics Page</p>
          <h1>Clinical analytics</h1>
          <span>Understand growth, care mix, patient risk, and department demand through colorful clinical signals.</span>
        </div>
        <div className="module-hero-card">
          <BarChart3 />
          <strong>+18%</strong>
          <span>Growth trend</span>
        </div>
      </section>

      <section className="analytics-stats-grid">
        <div className="analytics-stat-card analytics-blue">
          <TrendingUp />
          <span>Growth trend</span>
          <strong>+18%</strong>
        </div>
        <div className="analytics-stat-card analytics-teal">
          <PieIcon />
          <span>Departments</span>
          <strong>{departments.length}</strong>
        </div>
        <div className="analytics-stat-card analytics-rose">
          <Activity />
          <span>High risk</span>
          <strong>{riskBands.find((band) => band.label === "High")?.value || 0}</strong>
        </div>
      </section>

      <section className="analytics-grid analytics-grid-polished">
        <div className="panel panel-large analytics-chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Patient growth</h2>
              <p>Monthly registration trend</p>
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGrowth} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="patients" radius={[8, 8, 0, 0]}>
                  {monthlyGrowth.map((item, index) => (
                    <Cell key={item.month} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel analytics-mix-panel">
          <div className="panel-heading">
            <div>
              <h2>Department mix</h2>
              <p>Current patient distribution</p>
            </div>
          </div>
          <div className="chart-box chart-box-small">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departments} dataKey="value" innerRadius={55} outerRadius={86} paddingAngle={4}>
                  {departments.map((item, index) => (
                    <Cell key={item.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-list">
            {departments.map((department, index) => (
              <div key={department.name}>
                <span style={{ background: colors[index % colors.length] }} />
                {department.name}
                <strong>{department.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel panel-full analytics-risk-panel">
          <div className="panel-heading">
            <div>
              <h2>Risk bands</h2>
              <p>Risk distribution across current patients</p>
            </div>
          </div>
          <div className="risk-band-grid">
            {riskBands.map((band) => (
              <div key={band.label}>
                <span>{band.label}</span>
                <strong>{band.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
