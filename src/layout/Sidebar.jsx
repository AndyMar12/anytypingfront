import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../services/axios";
import "../styles/sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const hostname = window.location.hostname;
  const appType = hostname.startsWith("suadm") ? "superadmin" : "app";

  const menus = {
    superadmin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Companies", path: "/companies" },
      { label: "Users", path: "/users" },
      { label: "Webhook Logs", path: "/logs" },
      { label: "WhatsApp Accounts", path: "/waba-accounts" }
    ],
    app: [
      { label: "Conversations", path: "/conversations" },
      { label: "WhatsApp Numbers", path: "/contacts" },
      { label: "Settings", path: "/settings" }
    ],
  };

  const menuItems = menus[appType];

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      //localStorage.removeItem("auth_token");
      sessionStorage.clear();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button
        className="sidebar-close"
        onClick={() => setSidebarOpen(false)}
      >
        ✕
      </button>
      <div>
        <div className="sidebar-logo">
          <h2>AnyTyping</h2>
          <small>{appType === "superadmin" ? "SuperAdmin" : "App"}</small>
        </div>

        <nav className="sidebar-nav">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {item.label}
            </NavLink>

          ))}

        </nav>

      </div>
      <div className="sidebar-user">

        <div className="sidebar-user-name">
          {user?.name}
        </div>

        <div className="sidebar-user-email">
          {user?.email}
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


export default Sidebar;