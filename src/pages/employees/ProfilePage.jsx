import React, { useState, useEffect } from "react";
import { mockProfile } from "../../mocks/dashboard";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile(mockProfile);
      setFormData(mockProfile);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
  };

  if (loading || !profile) {
    return <div className="p-6 text-center text-slate-500 text-sm">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hồ Sơ Cá Nhân</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý thông tin liên hệ và định mức giờ làm việc cá nhân
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition cursor-pointer"
        >
          {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center h-fit">
          <img
            src={profile.avatar}
            alt={profile.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <h2 className="text-lg font-bold text-slate-800 mt-4">{profile.fullName}</h2>
          <p className="text-sm text-blue-600 font-medium">{profile.role}</p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            {profile.status}
          </span>
          <div className="w-full mt-6 pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
            <p><strong>Mã NV:</strong> {profile.id}</p>
            <p><strong>Bộ phận:</strong> {profile.department}</p>
            <p><strong>Ngày vào làm:</strong> {profile.joinDate}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Thông tin chi tiết</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  disabled={!isEditing}
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  disabled={!isEditing}
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số giờ tối đa / tuần
                </label>
                <input
                  type="number"
                  name="maxHoursPerWeek"
                  disabled={!isEditing}
                  value={formData.maxHoursPerWeek || 40}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}