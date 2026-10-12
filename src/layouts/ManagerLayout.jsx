import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";
import Logo from "../components/Logo";

const menu = [
  { to: "/manager/dashboard", label: "🏠 Tổng quan " },
  { to: "/manager/employees", label: "👥 Quản lý nhân viên " },
  { to: "/manager/shift-config", label: "⚙️ Ca & ràng buộc " },
  { to: "/manager/schedule", label: "📅 Lịch làm việc" },
  { to: "/manager/work-hours", label: "🕐 Giờ làm" },
  { to: "/manager/shift-exchange", label: "🔄 Đổi ca " },
  { to: "/manager/open-shifts", label: "📋 Ca trực mở " },
  { to: "/manager/leave", label: "📝 Đơn xin nghỉ " },
  { to: "/manager/attendance", label: "☑️ Chấm công " },
  { to: "/manager/payroll", label: "💰 Tính lương " },
  { to: "/manager/reports", label: "📊 Báo cáo" },
  { to: "/manager/assistant", label: "🤖 Trợ lý AI" },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition-colors ${isActive
    ? "bg-blue-500/25 font-medium text-white"
    : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <aside className="flex w-full shrink-0 flex-col bg-[#0B1D3F] p-4 text-white md:sticky md:top-0 md:h-screen md:w-60">
        <div className="mb-6 border-b border-white/10 px-3 pb-5">
          <Logo />
        </div>
        <nav className="flex flex-row flex-wrap gap-1 md:flex-1 md:flex-col md:justify-between md:overflow-y-auto">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} className={linkClass}>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 border-t border-white/10 px-3 pt-4 text-sm">
          <div className="font-medium text-slate-200">{user?.name}</div>
          <button onClick={logout} className="mt-1 text-slate-400 hover:text-white">
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1 p-5 md:p-8">
        <div className="absolute right-9 top-12 z-10 md:right-12 md:top-16">
          <NotificationBell />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
