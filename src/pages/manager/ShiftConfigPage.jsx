import { useState, useId } from "react";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Clock,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Save,
  RotateCcw,
} from "lucide-react";

// Dữ liệu ca mẫu ban đầu theo thiết kế
const initialShiftTemplates = [
  {
    id: 1,
    name: "Sáng",
    startTime: "06:00",
    endTime: "12:00",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Chiều",
    startTime: "12:00",
    endTime: "17:00",
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Tối",
    startTime: "17:00",
    endTime: "22:00",
    status: "Hoạt động",
  },
];

// Danh mục các ràng buộc ca xếp lịch tự động (FR05)
const initialShiftConstraints = [
  {
    id: "rest_between_shifts",
    name: "Thời gian nghỉ tối thiểu giữa 2 ca",
    desc: "Đảm bảo nhân viên có đủ thời gian nghỉ ngơi giữa hai ca làm việc liên tiếp.",
    category: "Cứng (Bắt buộc)",
    enabled: true,
    value: 12,
    unit: "giờ",
    min: 8,
    max: 24,
  },
  {
    id: "no_clopening",
    name: "Tránh ca đóng cửa tiếp ca mở cửa (No Clopening)",
    desc: "Không xếp nhân viên làm ca tối muộn rồi lại tiếp tục làm ca sáng sớm hôm sau.",
    category: "Cứng (Bắt buộc)",
    enabled: true,
    unit: "Kích hoạt",
  },
  {
    id: "max_shifts_per_day",
    name: "Số ca làm việc tối đa trong một ngày",
    desc: "Mỗi nhân viên chỉ được phân công tối đa số ca này trong một ngày.",
    category: "Cứng (Bắt buộc)",
    enabled: true,
    value: 1,
    unit: "ca/ngày",
    min: 1,
    max: 2,
  },
  {
    id: "max_hours_per_week",
    name: "Số giờ làm việc tối đa mỗi tuần",
    desc: "Không vượt quá giới hạn giờ làm quy định của luật lao động và hợp đồng.",
    category: "Cứng (Bắt buộc)",
    enabled: true,
    value: 40,
    unit: "giờ/tuần",
    min: 20,
    max: 60,
  },
  {
    id: "max_consecutive_days",
    name: "Số ngày làm việc liên tiếp tối đa",
    desc: "Sau số ngày này, nhân viên bắt buộc phải có ít nhất 1 ngày nghỉ.",
    category: "Cứng (Bắt buộc)",
    enabled: true,
    value: 6,
    unit: "ngày",
    min: 3,
    max: 7,
  },
  {
    id: "skill_match",
    name: "Đúng vai trò & chứng chỉ chuyên môn",
    desc: "Nhân viên làm vị trí nào phải có kỹ năng tương ứng (Pha chế, Thu ngân, Phục vụ).",
    category: "Cứng (Bắt buộc)",
    enabled: true,
    unit: "Kích hoạt",
  },
  {
    id: "fair_weekend_distribution",
    name: "Phân bổ công bằng ca cuối tuần",
    desc: "Chia đều các ca làm Thứ 7 và Chủ nhật giữa các nhân viên trong nhóm.",
    category: "Mềm (Tối ưu)",
    enabled: true,
    unit: "Kích hoạt",
  },
  {
    id: "preference_matching",
    name: "Ưu tiên nguyện vọng đăng ký của nhân viên",
    desc: "Cố gắng đáp ứng tối đa ca làm mong muốn và ngày xin nghỉ của nhân viên.",
    category: "Mềm (Tối ưu)",
    enabled: true,
    unit: "Kích hoạt",
  },
];

export default function ShiftConfigPage() {
  const searchInputId = useId();
  // Tab hiện tại: "templates" (Quản lý ca mẫu) hoặc "constraints" (Ràng buộc ca)
  const [activeTab, setActiveTab] = useState("templates");

  // State Ca mẫu
  const [shiftTemplates, setShiftTemplates] = useState(initialShiftTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "Hoạt động" | "Tạm dừng"
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Form Thêm / Sửa ca mẫu
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "06:00",
    endTime: "12:00",
    status: "Hoạt động",
  });

  // Modal Xóa ca mẫu
  const [shiftToDelete, setShiftToDelete] = useState(null);

  // State Ràng buộc ca
  const [constraints, setConstraints] = useState(initialShiftConstraints);

  // Toast thông báo in-app
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Lọc danh sách ca mẫu
  const filteredTemplates = shiftTemplates.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Xử lý mở form tạo mới
  const handleOpenCreateForm = () => {
    setFormMode("create");
    setEditingId(null);
    setFormData({
      name: "",
      startTime: "06:00",
      endTime: "12:00",
      status: "Hoạt động",
    });
    // Cuộn mượt xuống form bên dưới
    const formElement = document.getElementById("shiftTemplateFormCard");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Xử lý chọn sửa một ca mẫu
  const handleStartEdit = (template) => {
    setFormMode("edit");
    setEditingId(template.id);
    setFormData({
      name: template.name,
      startTime: template.startTime,
      endTime: template.endTime,
      status: template.status,
    });
    const formElement = document.getElementById("shiftTemplateFormCard");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hủy form
  const handleCancelForm = () => {
    setFormMode("create");
    setEditingId(null);
    setFormData({
      name: "",
      startTime: "06:00",
      endTime: "12:00",
      status: "Hoạt động",
    });
  };

  // Lưu ca mẫu (Thêm mới hoặc Cập nhật)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập tên ca mẫu!", "warning");
      return;
    }

    if (formMode === "edit") {
      setShiftTemplates((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formData.name.trim(),
                startTime: formData.startTime,
                endTime: formData.endTime,
                status: formData.status,
              }
            : item
        )
      );
      showToast(`Đã cập nhật ca mẫu "${formData.name}" thành công!`, "success");
      handleCancelForm();
    } else {
      const newId =
        shiftTemplates.length > 0
          ? Math.max(...shiftTemplates.map((t) => t.id)) + 1
          : 1;
      const newTemplate = {
        id: newId,
        name: formData.name.trim(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: formData.status,
      };
      setShiftTemplates((prev) => [...prev, newTemplate]);
      showToast(`Đã thêm ca mẫu "${formData.name}" thành công!`, "success");
      handleCancelForm();
    }
  };

  // Xóa ca mẫu
  const handleConfirmDelete = () => {
    if (!shiftToDelete) return;
    setShiftTemplates((prev) =>
      prev.filter((item) => item.id !== shiftToDelete.id)
    );
    showToast(`Đã xóa ca mẫu "${shiftToDelete.name}" thành công!`, "success");
    if (editingId === shiftToDelete.id) {
      handleCancelForm();
    }
    setShiftToDelete(null);
  };

  // Cập nhật ràng buộc ca
  const handleToggleConstraint = (id) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleChangeConstraintValue = (id, newVal) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: Number(newVal) } : c))
    );
  };

  const handleSaveConstraints = () => {
    showToast("Đã lưu cấu hình ràng buộc xếp ca thành công!", "success");
  };

  const handleResetConstraints = () => {
    setConstraints(initialShiftConstraints);
    showToast("Đã khôi phục cài đặt ràng buộc mặc định!", "info");
  };

  return (
    <div className="shift-config-page min-h-full bg-[#F4F7FB] p-4 text-slate-800 md:p-6 lg:p-8 font-sans relative">
      {/* Toast thông báo in-app */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-top-4 ${
            toast.type === "warning"
              ? "bg-amber-600 text-white"
              : toast.type === "info"
              ? "bg-blue-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {toast.type === "warning" ? (
            <AlertTriangle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================
          1. HEADER & THANH ĐIỀU HƯỚNG TAB
      ======================================================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Calendar size={24} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Quản lý ca & ràng buộc
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 md:text-sm">
              Quản lý các ca làm việc mẫu (CA_MAU) và thiết lập quy tắc ràng buộc khi tạo lịch tự động.
            </p>
          </div>
        </div>

        {/* Nút chọn tuần & Nút Thêm ca mẫu theo đúng thiết kế */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs md:text-sm">
            <Calendar size={16} className="text-blue-600" />
            <span className="mx-1 font-semibold">Tuần 22/09/2026 - 28/09/2026</span>
            <button
              type="button"
              className="rounded p-0.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Tuần trước"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="rounded p-0.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Tuần sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab("templates");
              handleOpenCreateForm();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98] md:text-sm"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Thêm ca mẫu</span>
          </button>
        </div>
      </div>

      {/* Tabs chuyển đổi giữa "Quản lý ca mẫu" và "Ràng buộc ca trực" */}
      <div className="mb-6 flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === "templates"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers size={17} />
          <span>Quản lý ca mẫu</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
            {shiftTemplates.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("constraints")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
            activeTab === "constraints"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders size={17} />
          <span>Cấu hình ràng buộc ca</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {constraints.filter((c) => c.enabled).length}/{constraints.length}
          </span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: GIAO DIỆN QUẢN LÝ CA MẪU (THEO ĐÚNG ẢNH THIẾT KẾ)
      ======================================================== */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* CARD 1: DANH SÁCH CA MẪU */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs md:p-6">
            {/* Toolbar: Tìm kiếm & Bộ lọc */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <label htmlFor={searchInputId} className="sr-only">
                  Tìm kiếm ca mẫu
                </label>
                <input
                  id={searchInputId}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm ca mẫu..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Nút Bộ lọc */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition shadow-2xs md:text-sm ${
                    filterStatus !== "all"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Filter size={15} />
                  <span>Bộ lọc</span>
                  {filterStatus !== "all" && (
                    <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] text-white">
                      1
                    </span>
                  )}
                </button>

                {/* Dropdown bộ lọc */}
                {showFilterDropdown && (
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Lọc theo trạng thái
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterStatus("all");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                        filterStatus === "all"
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Tất cả trạng thái
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterStatus("Hoạt động");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                        filterStatus === "Hoạt động"
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      ● Hoạt động
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterStatus("Tạm dừng");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                        filterStatus === "Tạm dừng"
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      ○ Tạm dừng
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bảng danh sách ca mẫu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3">Tên ca</th>
                    <th className="px-4 py-3">Giờ bắt đầu</th>
                    <th className="px-4 py-3">Giờ kết thúc</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                        Không tìm thấy ca mẫu nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`transition hover:bg-slate-50/70 ${
                          editingId === item.id ? "bg-blue-50/40" : ""
                        }`}
                      >
                        {/* Số thứ tự */}
                        <td className="px-4 py-4 text-center font-medium text-slate-500">
                          {index + 1}
                        </td>

                        {/* Tên ca */}
                        <td className="px-4 py-4 font-bold text-slate-800">
                          {item.name}
                        </td>

                        {/* Giờ bắt đầu */}
                        <td className="px-4 py-4 text-slate-600 font-mono">
                          {item.startTime}
                        </td>

                        {/* Giờ kết thúc */}
                        <td className="px-4 py-4 text-slate-600 font-mono">
                          {item.endTime}
                        </td>

                        {/* Trạng thái (Huy hiệu xanh chuẩn thiết kế) */}
                        <td className="px-4 py-4">
                          {item.status === "Hoạt động" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              <span className="h-2 w-2 rounded-full bg-slate-400" />
                              Tạm dừng
                            </span>
                          )}
                        </td>

                        {/* Thao tác (Nút sửa xanh & Nút xóa đỏ) */}
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="rounded-lg border border-slate-200 p-1.5 text-blue-600 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50"
                              title="Chỉnh sửa ca mẫu"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setShiftToDelete(item)}
                              className="rounded-lg border border-slate-200 p-1.5 text-rose-500 shadow-2xs transition hover:border-rose-300 hover:bg-rose-50"
                              title="Xóa ca mẫu"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang footer */}
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-400">
                Hiển thị 1 - {filteredTemplates.length} trong {shiftTemplates.length} ca
              </div>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
                  disabled
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-2xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
                  disabled
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: BOTTOM SECTION (GỒM 2 CỘT: FORM THÊM/SỬA VÀ THÔNG TIN / VÍ DỤ HIỆN TẠI) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* CỘT TRÁI: FORM THÊM / CHỈNH SỬA CA MẪU */}
            <div
              id="shiftTemplateFormCard"
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs md:p-6"
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">
                    {formMode === "edit"
                      ? `Chỉnh sửa ca mẫu: ${formData.name || "..."}`
                      : "Thêm ca mẫu"}
                  </h2>
                </div>
                {formMode === "edit" && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="Hủy chế độ sửa"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                {/* Tên ca */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Tên ca <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên ca..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Giờ bắt đầu & Giờ kết thúc */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Giờ bắt đầu <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <Clock
                        size={16}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Giờ kết thúc <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <Clock
                        size={16}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Hoạt động">● Hoạt động</option>
                    <option value="Tạm dừng">○ Tạm dừng</option>
                  </select>
                </div>

                {/* Buttons Hành động */}
                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 md:text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98] md:text-sm"
                  >
                    {formMode === "edit" ? "Cập nhật ca mẫu" : "Lưu ca mẫu"}
                  </button>
                </div>
              </form>
            </div>

            {/* CỘT PHẢI: THÔNG TIN & VÍ DỤ CA MẪU HIỆN TẠI */}
            <div className="space-y-5">
              {/* Box 1: Thông tin */}
              <div className="rounded-2xl border border-blue-100 bg-[#F0F7FF] p-5">
                <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-blue-900">
                  <Info size={18} className="text-blue-600" />
                  <span>Thông tin</span>
                </div>
                <ul className="space-y-2 text-xs leading-relaxed text-blue-950/80 md:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <span>
                      Ca mẫu được sử dụng để thiết lập nhu cầu nhân sự khi tạo lịch tự động.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <span>
                      Sau khi thêm hoặc chỉnh sửa ca mẫu, hệ thống sẽ tự động cập nhật trong phần Thiết lập nhu cầu.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Ví dụ ca mẫu hiện tại */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <div className="mb-3.5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Layers size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Ví dụ ca mẫu hiện tại
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 font-semibold text-slate-400">
                        <th className="pb-2.5">Tên ca</th>
                        <th className="pb-2.5">Giờ bắt đầu</th>
                        <th className="pb-2.5">Giờ kết thúc</th>
                        <th className="pb-2.5 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {shiftTemplates.map((item) => (
                        <tr key={item.id} className="text-slate-700">
                          <td className="py-2.5 font-bold text-slate-800">
                            {item.name}
                          </td>
                          <td className="py-2.5 font-mono text-slate-600">
                            {item.startTime}
                          </td>
                          <td className="py-2.5 font-mono text-slate-600">
                            {item.endTime}
                          </td>
                          <td className="py-2.5 text-right">
                            {item.status === "Hoạt động" ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Tạm dừng
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: CẤU HÌNH RÀNG BUỘC CA TRỰC (FR05 - OR-TOOLS)
      ======================================================== */}
      {activeTab === "constraints" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs md:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Cấu hình quy tắc & Ràng buộc xếp lịch
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 md:text-sm">
                  Các ràng buộc này sẽ được nạp trực tiếp vào thuật toán tối ưu hóa (OR-Tools) khi chạy tạo lịch tự động.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetConstraints}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw size={14} />
                  <span>Mặc định</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveConstraints}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Save size={14} />
                  <span>Lưu cấu hình</span>
                </button>
              </div>
            </div>

            {/* Danh sách các ràng buộc chia theo nhóm */}
            <div className="space-y-4">
              {constraints.map((c) => {
                const isHard = c.category.includes("Cứng");

                return (
                  <div
                    key={c.id}
                    className={`flex flex-col gap-4 rounded-xl border p-4 transition md:flex-row md:items-center md:justify-between ${
                      c.enabled
                        ? isHard
                          ? "border-blue-200 bg-blue-50/20"
                          : "border-slate-200 bg-white"
                        : "border-slate-100 bg-slate-50/60 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          c.enabled
                            ? isHard
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">
                            {c.name}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isHard
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {c.category}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {c.desc}
                        </p>
                      </div>
                    </div>

                    {/* Điều khiển Bật/Tắt & Giá trị */}
                    <div className="flex items-center justify-between gap-4 self-end md:self-auto">
                      {c.value !== undefined && c.enabled && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={c.min}
                            max={c.max}
                            value={c.value}
                            onChange={(e) =>
                              handleChangeConstraintValue(c.id, e.target.value)
                            }
                            className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                          />
                          <span className="text-xs font-medium text-slate-500">
                            {c.unit}
                          </span>
                        </div>
                      )}

                      {/* Switch bật / tắt */}
                      <button
                        type="button"
                        onClick={() => handleToggleConstraint(c.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          c.enabled ? "bg-blue-600" : "bg-slate-300"
                        }`}
                        title={c.enabled ? "Bật ràng buộc" : "Tắt ràng buộc"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            c.enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MODAL XÁC NHẬN XÓA CA MẪU
      ======================================================== */}
      {shiftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShiftToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Xác nhận xóa ca mẫu
                </h3>
                <p className="text-xs text-slate-500">
                  Hành động này sẽ gỡ bỏ ca mẫu khỏi danh sách cấu hình.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-700">
              <div>
                Tên ca: <strong>{shiftToDelete.name}</strong>
              </div>
              <div className="mt-1">
                Thời gian:{" "}
                <span className="font-mono">
                  {shiftToDelete.startTime} – {shiftToDelete.endTime}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShiftToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
