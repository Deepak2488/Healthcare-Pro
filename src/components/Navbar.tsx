import { Bell, LogOut, Search } from "lucide-react";
import { useStore } from "../store/useStore";
import { requestNotificationPermission, sendLocalNotification } from "../utils/notifications";

export default function Navbar() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const notifications = useStore((s) => s.notifications);
  const markNotificationsRead = useStore((s) => s.markNotificationsRead);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleNotificationTest = async () => {
    const permission = await requestNotificationPermission();

    if (permission === "granted") {
      sendLocalNotification("HealthCare Pro", "Notifications are enabled for patient events.");
      markNotificationsRead();
    }
  };

  return (
    <header className="app-navbar">
      <div>
        <h1>Healthcare operations</h1>
        <p>{user?.name || "Clinical staff"} · {user?.role || "Care team"}</p>
      </div>

      <div className="nav-actions">
        <label className="nav-search">
          <Search />
          <input placeholder="Search patients, doctors..." />
        </label>
        <button className="icon-button" type="button" onClick={handleNotificationTest}>
          <Bell />
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </button>
        <button className="logout-button" onClick={logout} type="button">
          <LogOut />
          Logout
        </button>
      </div>
    </header>
  );
}
