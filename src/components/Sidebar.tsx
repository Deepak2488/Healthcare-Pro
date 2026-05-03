import { NavLink } from "react-router-dom";
import { Activity, BarChart3, LayoutDashboard, UsersRound } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: UsersRound },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="brand-block">
        <div>
          <Activity />
        </div>
        <section>
          <h2>HealthCare Pro</h2>
          <p>Clinical OS</p>
        </section>
      </div>

      <nav className="side-nav">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={link.to === "/"}
              to={link.to}
            >
              <Icon />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
