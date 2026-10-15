import React, { useState, useEffect } from "react";
import { mockAttendance } from "../../mocks/dashboard";

const STATUS_BADGE = {
  ON_TIME: { label: "Đúng giờ", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  LATE: { label: "Đi muộn", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(mockAttendance || []);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckInOut = () => {
    if (!checkedIn) {
      const now = new Date().toTimeString().slice(0, 5);
      const newRecord = {
        id: `ATT-${Date.now().toString().slice(-3)}`,
        date: new Date().toISOString().slice(0, 10),
        shiftName: "Ca Hiện Tại (07:00 - 12:00)",
        checkIn: now,
        checkOut: "--:--",
        totalHours: 0,
        status: "ON_TIME",
      };
      setRecords((prev) => [newRecord, ...prev]);
      setCheckedIn(true);
    } else {
      const now = new Date().toTimeString().slice(0, 5);
      setRecords((prev) =>
        prev.map((item, idx) =>
          idx === 0 ? { ...item, checkOut: now, totalHours: 5.0 } : item
        )
      );
      setCheckedIn(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chấm Công Cá Nhân</h1>
          <p className="text-sm text-slate-500 mt-1">
            Thực hiện Check-in / Check-out và theo dõi bảng công hàng tháng
          </p>
        </div>
        <button
          type="button"
          onClick={handleCheckInOut}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm text-white transition cursor-pointer ${
            checkedIn ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {checkedIn ? "Check-out Kết thúc ca" : "Check-in Bắt đầu ca"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Lịch sử chấm công</h2>
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 bg-slate-50">
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Ngày</th>
                  <th className="py-3 px-4">Ca làm việc</th>
                  <th className="py-3 px-4">Giờ vào</th>
                  <th className="py-3 px-4">Giờ ra</th>
                  <th className="py-3 px-4">Số giờ</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {records.map((r) => {
                  const badge = STATUS_BADGE[r.status] || STATUS_BADGE.ON_TIME;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-medium text-slate-700">{r.id}</td>
                      <td className="py-3.5 px-4 text-slate-700">{r.date}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{r.shiftName}</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-medium">{r.checkIn}</td>
                      <td className="py-3.5 px-4 text-blue-600 font-medium">{r.checkOut}</td>
                      <td className="py-3.5 px-4 text-slate-700">{r.totalHours}h</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}