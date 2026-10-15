import React, { useState, useEffect } from "react";
import { mockMySchedules } from "../../mocks/dashboard";

const STATUS_BADGE = {
  UPCOMING: { label: "Sắp tới", className: "bg-blue-100 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Hoàn thành", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export default function MySchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSchedules(mockMySchedules || []);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const filteredSchedules = schedules.filter(
    (s) => filterStatus === "ALL" || s.status === filterStatus
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lịch Làm Việc Của Tôi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem lịch phân ca hàng tuần và chi tiết công việc trong từng ca
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm">
            <span className="text-slate-500">Tổng số ca tuần này: </span>
            <span className="font-bold text-blue-600">{schedules.length} ca</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["ALL", "UPCOMING", "COMPLETED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "ALL" ? "Tất cả ca" : STATUS_BADGE[status]?.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">Tuần: 12/10/2026 - 18/10/2026</span>
      </div>

      {/* Schedule Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Đang tải lịch làm việc...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSchedules.map((shift) => {
            const badge = STATUS_BADGE[shift.status] || STATUS_BADGE.UPCOMING;
            return (
              <div
                key={shift.id}
                onClick={() => setSelectedShift(shift)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {shift.dayOfWeek} ({shift.date})
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{shift.shiftName}</h3>
                  <p className="text-sm font-medium text-blue-600 mt-1">{shift.time}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <p>Vị trí: {shift.role}</p>
                    <p>Khu vực: {shift.location}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  Xem chi tiết ca
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Chi tiết ca */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                Chi tiết {selectedShift.shiftName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedShift(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-sm text-slate-600">
              <p><strong className="text-slate-800">Mã ca:</strong> {selectedShift.id}</p>
              <p><strong className="text-slate-800">Ngày:</strong> {selectedShift.dayOfWeek}, {selectedShift.date}</p>
              <p><strong className="text-slate-800">Khung giờ:</strong> {selectedShift.time}</p>
              <p><strong className="text-slate-800">Vị trí:</strong> {selectedShift.role}</p>
              <p><strong className="text-slate-800">Địa điểm:</strong> {selectedShift.location}</p>
              <p><strong className="text-slate-800">Ghi chú:</strong> {selectedShift.note}</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedShift(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}