import React, { useState, useEffect } from "react";
import { mockAvailability } from "../../mocks/dashboard";

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAvailability(mockAvailability || []);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSlot = (id, slot) => {
    setSavedSuccess(false);
    setAvailability((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [slot]: !item[slot] } : item))
    );
  };

  const handleNoteChange = (id, value) => {
    setSavedSuccess(false);
    setAvailability((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: value } : item))
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Đăng Ký Lịch Rảnh (Availability)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cập nhật khung giờ có thể làm việc trong tuần tới để hệ thống xếp lịch tự động
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition cursor-pointer"
        >
          Lưu lịch rảnh
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          ✓ Đã lưu đăng ký lịch rảnh tuần tới thành công!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 bg-slate-50">
                  <th className="py-3.5 px-4">Thứ trong tuần</th>
                  <th className="py-3.5 px-4 text-center">Ca Sáng (07:00 - 12:00)</th>
                  <th className="py-3.5 px-4 text-center">Ca Chiều (12:00 - 17:00)</th>
                  <th className="py-3.5 px-4 text-center">Ca Tối (17:00 - 22:00)</th>
                  <th className="py-3.5 px-4">Ghi chú cá nhân</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {availability.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.day}</td>
                    {["morning", "afternoon", "evening"].map((slot) => (
                      <td key={slot} className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSlot(row.id, slot)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            row[slot]
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          }`}
                        >
                          {row[slot] ? "✓ Rảnh" : "Bận"}
                        </button>
                      </td>
                    ))}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={row.note}
                        onChange={(e) => handleNoteChange(row.id, e.target.value)}
                        placeholder="Ghi chú thêm..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}