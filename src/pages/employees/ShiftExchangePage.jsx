import React, { useState, useEffect } from "react";
import { mockLeaveRequests } from "../../mocks/dashboard";

const STATUS_BADGE = {
  PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED: { label: "Đã duyệt", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Từ chối", className: "bg-rose-100 text-rose-700 border-rose-200" },
};

export default function LeavePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [formData, setFormData] = useState({
    leaveType: "Nghỉ phép năm",
    startDate: "",
    endDate: "",
    shiftName: "",
    reason: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockLeaveRequests || []);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) return;

    const newItem = {
      id: `LV-${Date.now().toString().slice(-3)}`,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      shiftName: formData.shiftName || "Cả ngày",
      reason: formData.reason,
      createdAt: new Date().toISOString().slice(0, 10),
      status: "PENDING",
    };

    setItems((prev) => [newItem, ...prev]);
    setFormData({
      leaveType: "Nghỉ phép năm",
      startDate: "",
      endDate: "",
      shiftName: "",
      reason: "",
    });
  };

  const handleCancel = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter(
    (item) => filterStatus === "ALL" || item.status === filterStatus
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Đơn Xin Nghỉ Phép</h1>
          <p className="text-sm text-slate-500 mt-1">
            Đăng ký nghỉ phép và theo dõi tiến độ phê duyệt từ Quản lý
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm">
            <span className="text-slate-500">Đơn chờ duyệt: </span>
            <span className="font-bold text-amber-600">
              {items.filter((i) => i.status === "PENDING").length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tạo đơn xin nghỉ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Loại nghỉ phép *
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                <option value="Nghỉ ốm">Nghỉ ốm</option>
                <option value="Nghỉ việc riêng">Nghỉ việc riêng (Không lương)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Từ ngày *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Đến ngày *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ca xin nghỉ
              </label>
              <input
                type="text"
                name="shiftName"
                value={formData.shiftName}
                onChange={handleChange}
                placeholder="VD: Ca Sáng (07:00 - 12:00) hoặc Cả ngày"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lý do xin nghỉ *
              </label>
              <textarea
                name="reason"
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Nhập lý do xin nghỉ..."
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
            >
              Gửi đơn xin nghỉ
            </button>
          </form>
        </div>

        {/* Right Column: List & Filter */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Danh sách đơn xin nghỉ</h2>
            <div className="flex gap-2">
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status === "ALL" ? "Tất cả" : STATUS_BADGE[status]?.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">Đang tải dữ liệu...</div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Không có đơn xin nghỉ nào phù hợp.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 bg-slate-50">
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Loại nghỉ / Ca</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Lý do</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredItems.map((item) => {
                    const badge = STATUS_BADGE[item.status] || STATUS_BADGE.PENDING;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-medium text-slate-700">{item.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{item.leaveType}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.shiftName}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {item.startDate} → {item.endDate}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{item.reason}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {item.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleCancel(item.id)}
                              className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                            >
                              Hủy
                            </button>
                          )}
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
    </div>
  );
}