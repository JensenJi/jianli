import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Settings } from "lucide-react";

const navItems = [
  { name: "我的旅行", path: "/travel" },
  { name: "我的作品", path: "/works" },
  { name: "好友留言", path: "/message" },
  { name: "我的简历", path: "/aboutme" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="nav-bar-wrapper">
      <div className="nav-bar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.name}
          </Link>
        ))}
        
        {user ? (
          <>
            {user.email === import.meta.env.VITE_ADMIN_EMAIL && (
              <Link
                to="/admin"
                className={location.pathname === "/admin" ? "active" : ""}
                title="后台管理"
              >
                <Settings className="w-4 h-4 inline" />
                管理
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="logout-btn"
              title="退出登录"
            >
              <LogOut className="w-4 h-4 inline" />
              退出
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={location.pathname === "/login" ? "active" : ""}
          >
            注册登录
          </Link>
        )}
      </div>
      <style>{`
        .nav-bar-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
        }
        .nav-bar {
          background-color: #dbe08c;
          display: flex;
          padding: 0;
          width: 100%;
          max-width: 56rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .nav-bar::-webkit-scrollbar { display: none; }
        .nav-bar a, .nav-bar button {
          color: #89800c;
          padding: 10px 14px;
          transition: all 0.2s ease;
          position: relative;
          text-decoration: none;
          font-weight: bold;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .nav-bar a, .nav-bar button { padding: 10px 20px; font-size: 16px; }
        }
        @media (max-width: 639px) {
          .nav-bar a, .nav-bar button { font-size: 14px; padding: 10px 10px; }
        }
        .nav-bar a:not(:last-child)::after,
        .nav-bar button::after {
          content: "";
          position: absolute;
          right: 0;
          top: 25%;
          bottom: 25%;
          width: 1px;
          background: #ffffff;
        }
        .nav-bar a:hover,
        .nav-bar a.active,
        .nav-bar button:hover {
          color: #ffffff;
          font-weight: bold;
          background-color: #d1d678;
        }
      `}</style>
    </div>
  );
}
