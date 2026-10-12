import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../services/reportService";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Table from "../../components/Table";

// FR10 - Tổng quan (Dashboard): thống kê lịch làm, giờ làm, chấm công

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

// Màu nhạt theo ca (ca lạ thì dùng màu xám)
const SHIFT_STYLE = {
  "Sáng": "bg-sky-50 text-sky-700",
  "Chiều": "bg-amber-50 text-amber-700",
  "Tối": "bg-indigo-50 text-indigo-700",
};
const DEFAULT_SHIFT_STYLE = "bg-slate-100 text-slate-600";

// Màu biểu đồ: dịu, không chói
const AXIS_TICK = { fill: "#64748B", fontSize: 12 };
const GRID_COLOR = "#E2E8F0";
const ATTENDANCE_COLORS = ["#6EE7B7", "#FCD34D", "#FDA4AF"]; // hợp lệ, trễ, ngoài khu vực

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, note, accent, noteClass = "text-slate-400" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className={`block h-1 w-8 rounded-full ${accent}`} />
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className={`mt-1 text-xs ${noteClass}`}>{note}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .catch(() => setError("Không tải được dữ liệu tổng quan"));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!data) return <Loading />;

  const { stats } = data;

  return (
    <div className="space-y-5">
      <header className="rounded-xl bg-[#0B1D3F] px-6 py-6 pr-20 text-white shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="mt-1 text-sm text-blue-100">Xin chào, {user?.name}</p>
      </header>

      {/* 4 thẻ số liệu */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng số nhân viên" value={stats.totalEmployees} note={`${stats.newEmployees} người mới`} accent="bg-sky-400" />
        <StatCard label="Đã đăng ký khả năng làm việc" value={stats.availabilityRegistered} note="Tuần này" accent="bg-indigo-400" />
        <StatCard label="Ca thiếu nhân viên" value={stats.understaffedShifts} note="Cần xử lý" noteClass="text-rose-500" accent="bg-rose-400" />
        <StatCard label="Tỷ lệ đi làm" value={`${stats.attendanceRate}%`} note="Tháng này" accent="bg-emerald-400" />
      </div>

      {/* Lịch tuần + Trợ lý AI */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Lịch làm việc tuần" subtitle={data.weekLabel} className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-32" />
                  {DAYS.map((d) => (
                    <th key={d} className="p-1 text-center text-xs font-medium text-slate-500">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.schedule.map((row) => (
                  <tr key={row.employee}>
                    <td className="p-1 text-xs font-medium text-slate-700">{row.employee}</td>
                    {row.shifts.map((s, i) => (
                      <td
                        key={i}
                        className={`rounded-md px-2 py-2 text-center text-xs font-medium ${
                          s ? SHIFT_STYLE[s] ?? DEFAULT_SHIFT_STYLE : "bg-slate-50 text-slate-300"
                        }`}
                      >
                        {s ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Trợ lý AI" subtitle="Tôi có thể hỗ trợ quản lý" className="flex flex-col">
          <ul className="flex-1 space-y-2.5 text-sm text-slate-600">
            <li className="flex gap-2"><span className="text-slate-300">•</span>Đề xuất nhân viên thay ca</li>
            <li className="flex gap-2"><span className="text-slate-300">•</span>Tóm tắt tình hình chấm công</li>
            <li className="flex gap-2"><span className="text-slate-300">•</span>Phân tích dữ liệu làm việc</li>
          </ul>
          <button
            onClick={() => navigate("/manager/assistant")}
            className="mt-5 w-full rounded-lg bg-blue-50 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Bắt đầu trò chuyện
          </button>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Số ca theo ngày" subtitle="Tuần này">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.shiftsPerDay}>
                <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                <XAxis dataKey="day" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={28} />
                <Tooltip cursor={{ fill: "#F1F5F9" }} />
                <Bar dataKey="shifts" name="Số ca" fill="#93C5FD" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Giờ làm theo nhân viên" subtitle="Tuần này">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hoursPerEmployee} layout="vertical">
                <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
                <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} width={110} />
                <Tooltip cursor={{ fill: "#F1F5F9" }} />
                <Bar dataKey="hours" name="Giờ" fill="#A5B4FC" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Tình hình chấm công" subtitle="Tháng này">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.attendance} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2} stroke="none">
                  {data.attendance.map((_, i) => (
                    <Cell key={i} fill={ATTENDANCE_COLORS[i % ATTENDANCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bảng ca thiếu nhân viên */}
      <Card title="Ca thiếu nhân viên" subtitle="Cần xử lý">
        <Table
          columns={[
            { key: "date", label: "Ngày" },
            { key: "shift", label: "Ca" },
            { key: "required", label: "Cần" },
            { key: "assigned", label: "Đã xếp" },
            {
              key: "missing",
              label: "Thiếu",
              render: (r) => (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600">
                  Thiếu {r.missing}
                </span>
              ),
            },
            {
              key: "action",
              label: "",
              render: () => (
                <Link to="/manager/open-shifts" className="text-sm text-blue-600 hover:underline">
                  Tạo Open Shift
                </Link>
              ),
            },
          ]}
          rows={data.understaffed}
        />
      </Card>
    </div>
  );
}
