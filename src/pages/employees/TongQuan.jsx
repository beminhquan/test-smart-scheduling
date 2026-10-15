import React from "react";
import {
  mockProfile,
  mockMySchedules,
  mockOpenShifts,
  mockShiftExchanges,
} from "../../mocks/dashboard";

export default function TongQuan() {
  const schedules = mockMySchedules || [];
  const openShifts = mockOpenShifts || [];
  const exchanges = mockShiftExchanges || [];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Xin chào, {mockProfile?.fullName || "Nhân viên"} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng quan lịch làm việc và các thông báo trong tuần của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase">Ca làm tuần này</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{schedules.length} ca</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase">Tổng giờ dự kiến</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">20.0 giờ</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase">Ca trống có thể nhận</p>
          <p className="text-2xl font-bold text-indigo-600 mt-2">
            {openShifts.filter((s) => !s.registered).length} ca
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase">Yêu cầu chờ duyệt</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {exchanges.filter((e) => e.status === "PENDING").length} đơn
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Ca làm việc sắp tới</h2>
        <div className="divide-y divide-slate-100">
          {schedules.map((shift) => (
            <div key={shift.id} className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  {shift.shiftName} ({shift.time})
                </p>
                <p className="text-xs text-slate-500">
                  {shift.dayOfWeek}, {shift.date} • {shift.location}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {shift.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}