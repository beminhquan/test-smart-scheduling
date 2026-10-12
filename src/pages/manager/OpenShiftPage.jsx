import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  X,
  PlusCircle,
  Users,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

// Dữ liệu ca trực mở ban đầu: chỉ hiển thị Ca sáng, Ca chiều, Ca tối (đã bỏ phụ cấp)
const initialOpenShifts = [
  {
    id: "OS001",
    day: "Thứ 3 23/09",
    date: "23/09/2026",
    time: "Ca chiều",
    role: "Phục vụ",
    needed: 1,
    registered: 0,
    status: "Đang mở", // 🟡 Đang mở, chưa ai đăng ký -> Hủy bình thường
    registrations: [],
  },
  {
    id: "OS002",
    day: "Thứ 6 26/09",
    date: "26/09/2026",
    time: "Ca tối",
    role: "Pha chế",
    needed: 1,
    registered: 1,
    status: "Đang mở", // 🟡 Đang mở, đã có người đăng ký -> Phải xác nhận và cảnh báo
    registrations: [
      { name: "Lê Văn Hoàng", role: "Pha chế", phone: "0912 345 678" },
    ],
  },
  {
    id: "OS003",
    day: "Thứ 7 27/09",
    date: "27/09/2026",
    time: "Ca sáng",
    role: "Phục vụ",
    needed: 1,
    registered: 1,
    status: "Đã đủ", // 🔵 Đã có người được duyệt -> Không nên xóa (ảnh hưởng lịch)
    registrations: [
      { name: "Vũ Quốc Tuấn", role: "Phục vụ", phone: "0905 123 456", approved: true },
    ],
  },
  {
    id: "OS004",
    day: "Thứ 2 22/09",
    date: "22/09/2026",
    time: "Ca sáng",
    role: "Thu ngân",
    needed: 1,
    registered: 0,
    status: "Đã đóng", // ⚪ Đã đóng -> Không xóa
    registrations: [],
  },
  {
    id: "OS005",
    day: "Thứ 4 24/09",
    date: "24/09/2026",
    time: "Ca tối",
    role: "Phục vụ",
    needed: 1,
    registered: 0,
    status: "Đã hủy", // 🔴 Đã hủy -> Không xóa (chỉ xem lịch sử)
    registrations: [],
  },
];

// Hàm lấy tên ca ngắn gọn (Ca sáng / Ca chiều / Ca tối)
const extractShiftName = (shift) => {
  if (!shift) return "Ca chiều";
  const name =
    shift.shiftName ||
    shift.demand?.name ||
    shift.demand?.shortName ||
    shift.time ||
    "";
  if (name.includes("Sáng") || name.includes("06:") || name.includes("08:")) {
    return "Ca sáng";
  }
  if (name.includes("Chiều") || name.includes("12:") || name.includes("13:")) {
    return "Ca chiều";
  }
  if (name.includes("Tối") || name.includes("17:")) {
    return "Ca tối";
  }
  return "Ca chiều";
};

export default function OpenShiftPage() {
  const location = useLocation();

  const [openShifts, setOpenShifts] = useState(initialOpenShifts);
  const [selectedShiftForView, setSelectedShiftForView] = useState(null);

  // State quản lý Sửa & Xóa
  const [shiftToEdit, setShiftToEdit] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  // Toast thông báo phản hồi thao tác
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Khởi tạo form thêm mới tự động nhận thông tin ca thiếu nếu chuyển từ SchedulePage
  const [form, setForm] = useState(() => {
    if (location.state?.shift) {
      const s = location.state.shift;
      const dayLabel = s.day?.fullDate || s.dayName || "Thứ 3 23/09";
      const missingRole =
        s.pvMissing > 0
          ? "Phục vụ"
          : s.pcMissing > 0
          ? "Pha chế"
          : "Thu ngân";

      return {
        day: dayLabel.split(",")[0] || dayLabel,
        time: extractShiftName(s),
        role: missingRole,
        needed: s.totalMissing || s.missing || 1,
      };
    }
    return {
      day: "Thứ 3 23/09",
      time: "Ca chiều",
      role: "Phục vụ",
      needed: 1,
    };
  });

  // Tự mở modal nếu có dữ liệu truyền từ trang Tạo lịch
  const [isOpenModal, setIsOpenModal] = useState(() => Boolean(location.state?.shift));

  // Lắng nghe sự kiện click tương thích chuẩn Bootstrap [data-bs-toggle="modal"] và [data-bs-dismiss="modal"]
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const toggleTrigger = e.target.closest('[data-bs-toggle="modal"]');
      if (toggleTrigger) {
        e.preventDefault();
        const targetId = toggleTrigger.getAttribute("data-bs-target");
        if (targetId === "#openShiftModal" || targetId === "#exampleModal") {
          setIsOpenModal(true);
        }
        return;
      }

      const dismissTrigger = e.target.closest('[data-bs-dismiss="modal"]');
      if (dismissTrigger) {
        e.preventDefault();
        setIsOpenModal(false);
        setSelectedShiftForView(null);
        setShiftToEdit(null);
        setShiftToDelete(null);
        return;
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Khóa scroll trang khi mở bất kỳ modal nào
  useEffect(() => {
    if (isOpenModal || selectedShiftForView || shiftToEdit || shiftToDelete) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isOpenModal, selectedShiftForView, shiftToEdit, shiftToDelete]);

  // Xử lý tạo ca trực mới
  const handleCreateOpenShift = (e) => {
    e.preventDefault();

    const newShift = {
      id: `OS00${openShifts.length + 1}`,
      day: form.day,
      date: "23/09/2026",
      time: form.time,
      role: form.role,
      needed: Number(form.needed) || 1,
      registered: 0,
      status: "Đang mở",
      registrations: [],
    };

    setOpenShifts((prev) => [newShift, ...prev]);
    setIsOpenModal(false);
    showToast("Đã mở ca trực mới thành công!", "success");
  };

  // ========================================================
  // QUY TẮC KIỂM TRA QUYỀN XÓA / HỦY CA
  // ========================================================
  const getDeleteRule = (shift) => {
    if (shift.status === "Đã đủ" || shift.status === "Đã duyệt") {
      return {
        allowed: false,
        type: "approved",
        badge: "🔵 Đã có người được duyệt",
        reason: "Không thể xóa: Đã có nhân viên được duyệt, ảnh hưởng trực tiếp đến lịch làm việc chính thức.",
      };
    }
    if (shift.status === "Đã đóng") {
      return {
        allowed: false,
        type: "closed",
        badge: "⚪ Đã đóng",
        reason: "Không thể xóa: Ca trực đã đóng và kết thúc hạn đăng ký.",
      };
    }
    if (shift.status === "Đã hủy") {
      return {
        allowed: false,
        type: "cancelled",
        badge: "🔴 Đã hủy",
        reason: "Không thể xóa: Ca trực đã bị hủy trước đó, chỉ lưu trữ để xem lịch sử.",
      };
    }
    if (shift.status === "Đang mở") {
      if (shift.registered > 0) {
        return {
          allowed: true,
          type: "warning",
          badge: "🟡 Đang mở, đã có người đăng ký",
          reason: "Cảnh báo: Phải xác nhận và cảnh báo gửi thông báo hủy đến nhân viên đã đăng ký.",
        };
      }
      return {
        allowed: true,
        type: "normal",
        badge: "🟡 Đang mở, chưa ai đăng ký",
        reason: "Cho phép hủy bình thường (chưa có nhân viên đăng ký).",
      };
    }
    return { allowed: false, type: "disabled", badge: "Không xác định", reason: "Không được phép xóa." };
  };

  // ========================================================
  // QUY TẮC KIỂM TRA QUYỀN SỬA CA
  // ========================================================
  const getEditRule = (shift) => {
    if (shift.status === "Đã đủ" || shift.status === "Đã duyệt") {
      return {
        allowed: false,
        reason: "Không thể sửa: Ca trực đã đủ người và đã duyệt vào lịch.",
      };
    }
    if (shift.status === "Đã đóng") {
      return {
        allowed: false,
        reason: "Không thể sửa: Ca trực đã đóng hạn.",
      };
    }
    if (shift.status === "Đã hủy") {
      return {
        allowed: false,
        reason: "Không thể sửa: Ca trực đã bị hủy.",
      };
    }
    return {
      allowed: true,
      hasWarning: shift.registered > 0,
      reason: shift.registered > 0
        ? "Lưu ý: Ca này đã có người đăng ký, việc sửa đổi có thể ảnh hưởng đến nhân viên."
        : "Chỉnh sửa thông tin ca trực mở.",
    };
  };

  // Mở modal sửa
  const handleOpenEdit = (shift) => {
    const editRule = getEditRule(shift);
    if (!editRule.allowed) return;
    setShiftToEdit(shift);
    setEditForm({
      ...shift,
      needed: shift.needed,
    });
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm) return;

    setOpenShifts((prev) =>
      prev.map((s) =>
        s.id === editForm.id
          ? {
              ...editForm,
              needed: Number(editForm.needed) || 1,
            }
          : s
      )
    );
    setShiftToEdit(null);
    setEditForm(null);
    showToast("Cập nhật ca trực mở thành công!", "success");
  };

  // Mở modal xóa
  const handleOpenDelete = (shift) => {
    const deleteRule = getDeleteRule(shift);
    if (!deleteRule.allowed) return;
    setShiftToDelete(shift);
  };

  // Thực hiện xóa / hủy ca
  const handleConfirmDelete = () => {
    if (!shiftToDelete) return;
    const rule = getDeleteRule(shiftToDelete);

    if (rule.type === "warning") {
      // Đã có người đăng ký: Chuyển sang trạng thái "Đã hủy" để lưu vết lịch sử & thông báo
      setOpenShifts((prev) =>
        prev.map((s) =>
          s.id === shiftToDelete.id
            ? { ...s, status: "Đã hủy" }
            : s
        )
      );
      showToast(
        `Đã hủy ca trực và gửi thông báo đến ${shiftToDelete.registered} nhân viên đã đăng ký!`,
        "warning"
      );
    } else {
      // Chưa có ai đăng ký: Xóa bỏ trực tiếp
      setOpenShifts((prev) => prev.filter((s) => s.id !== shiftToDelete.id));
      showToast("Đã hủy và xóa ca trực mở thành công!", "success");
    }

    setShiftToDelete(null);
  };

  // Số ca đang mở cần bổ sung
  const pendingCount = openShifts.filter((s) => s.status === "Đang mở").length;

  return (
    <div className="open-shifts-page min-h-full bg-[#F4F7FB] p-5 text-slate-800 md:p-8 lg:p-10 font-sans relative">
      {/* Toast thông báo in-app */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-top-4 ${
            toast.type === "warning"
              ? "bg-amber-600 text-white"
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

      {/* CSS Chuẩn Bootstrap Modal */}
      <style>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1055;
          display: none;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          outline: 0;
        }
        .modal.show {
          display: block;
        }
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1050;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
        }
        .modal-dialog {
          position: relative;
          width: auto;
          margin: 1.75rem auto;
          max-width: 520px;
          pointer-events: none;
        }
        .modal-dialog-centered {
          display: flex;
          align-items: center;
          min-height: calc(100% - 3.5rem);
        }
        .modal-content {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          pointer-events: auto;
          background-color: #ffffff;
          background-clip: padding-box;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          outline: 0;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .modal-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .btn-close {
          background: transparent;
          border: none;
          cursor: pointer;
        }
        body.modal-open {
          overflow: hidden;
        }
      `}</style>

      {/* ========================================================
          1. HEADER Ca trực mở
      ======================================================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">
            Ca trực mở
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Các ca còn thiếu nhân viên và cho phép nhân viên đăng ký
          </p>
        </div>

        {/* Nút trigger modal theo chuẩn Bootstrap */}
        {/* <!-- Button trigger modal --> */}
        <button
          type="button"
          className="btn btn-primary inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#1E40AF] active:scale-[0.98]"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => setIsOpenModal(true)}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Mở ca trực</span>
        </button>
      </div>

      {/* ========================================================
          2. SUMMARY CARD (Tuần hiện tại & Số ca đang cần bổ sung)
      ======================================================== */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Tuần hiện tại */}
          <div>
            <div className="text-xs font-medium text-[#64748B]">Tuần hiện tại</div>
            <div className="mt-1.5 text-base font-bold text-[#0F172A]">
              22/09 – 28/09/2026
            </div>
          </div>

          {/* Ca đang cần bổ sung */}
          <div>
            <div className="text-xs font-medium text-[#64748B]">
              {pendingCount} ca đang cần bổ sung
            </div>
            <div className="mt-1.5 text-xl font-bold text-[#D97706]">
              {pendingCount}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BẢNG DANH SÁCH CA TRỰC MỞ
      ======================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs font-medium text-[#64748B]">
                <th className="px-5 py-2 font-semibold">Ngày</th>
                <th className="px-5 py-2 font-semibold">Ca</th>
                <th className="px-5 py-2 font-semibold">Vai trò</th>
                <th className="px-5 py-2 text-center font-semibold">Cần thêm</th>
                <th className="px-5 py-2 text-center font-semibold">Đã đăng ký</th>
                <th className="px-5 py-2 text-center font-semibold">Trạng thái</th>
                <th className="px-5 py-2 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {openShifts.map((shift) => {
                const deleteRule = getDeleteRule(shift);
                const editRule = getEditRule(shift);

                return (
                  <tr
                    key={shift.id}
                    className="transition hover:opacity-95"
                  >
                    {/* Ngày */}
                    <td className="rounded-l-xl bg-[#F8FAFC] px-5 py-4.5 font-medium text-[#0F172A]">
                      {shift.day}
                    </td>

                    {/* Ca (Chỉ ghi Ca sáng / Ca chiều / Ca tối) */}
                    <td className="bg-[#F8FAFC] px-5 py-4.5 font-medium text-[#334155]">
                      {shift.time}
                    </td>

                    {/* Vai trò */}
                    <td className="bg-[#F8FAFC] px-5 py-4.5 text-[#334155]">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            shift.role === "Phục vụ"
                              ? "bg-blue-500"
                              : shift.role === "Pha chế"
                              ? "bg-amber-500"
                              : "bg-purple-500"
                          }`}
                        />
                        {shift.role}
                      </span>
                    </td>

                    {/* Cần thêm */}
                    <td className="bg-[#F8FAFC] px-5 py-4.5 text-center font-medium text-[#0F172A]">
                      {shift.needed}
                    </td>

                    {/* Đã đăng ký */}
                    <td className="bg-[#F8FAFC] px-5 py-4.5 text-center text-[#334155]">
                      {shift.registered > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedShiftForView(shift)}
                          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                          title="Bấm để xem danh sách nhân viên đã đăng ký"
                        >
                          <span>{shift.registered}</span>
                          <Users size={13} />
                        </button>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="bg-[#F8FAFC] px-5 py-4.5 text-center">
                      {shift.status === "Đang mở" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#D97706]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                          Đang mở
                        </span>
                      )}
                      {shift.status === "Đã đủ" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                          Đã đủ
                        </span>
                      )}
                      {shift.status === "Đã đóng" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#64748B]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#64748B]" />
                          Đã đóng
                        </span>
                      )}
                      {shift.status === "Đã hủy" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#DC2626]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
                          Đã hủy
                        </span>
                      )}
                    </td>

                    {/* Thao tác (Sửa & Xóa) */}
                    <td className="rounded-r-xl bg-[#F8FAFC] px-5 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Nút Sửa */}
                        <button
                          type="button"
                          disabled={!editRule.allowed}
                          onClick={() => handleOpenEdit(shift)}
                          title={editRule.reason}
                          className={`rounded-lg p-1.5 transition ${
                            editRule.allowed
                              ? "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                              : "cursor-not-allowed text-slate-300 opacity-40"
                          }`}
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Nút Xóa */}
                        <button
                          type="button"
                          disabled={!deleteRule.allowed}
                          onClick={() => handleOpenDelete(shift)}
                          title={deleteRule.reason}
                          className={`rounded-lg p-1.5 transition ${
                            deleteRule.allowed
                              ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                              : "cursor-not-allowed text-slate-300 opacity-40"
                          }`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bảng quy tắc hủy/sửa ca trực giải thích rõ ràng */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Info size={14} className="text-blue-600" />
            <span>Quy tắc quản lý và hủy ca trực mở:</span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <span><strong>🟡 Đang mở (chưa ai đăng ký):</strong> ✅ Hủy/xóa bình thường.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <span><strong>🟡 Đang mở (đã có đăng ký):</strong> ⚠️ Phải xác nhận và cảnh báo.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span><strong>🔵 Đã đủ / Đã duyệt:</strong> ❌ Không xóa (đã ảnh hưởng lịch).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
              <span><strong>⚪ Đã đóng:</strong> ❌ Không xóa ca đã đóng hạn.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
              <span><strong>🔴 Đã hủy:</strong> ❌ Không xóa (chỉ xem lịch sử).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ghi chú dưới cùng */}
      <div className="mt-4 text-xs text-[#94A3B8]">
        Nhân viên có thể đăng ký ca mở. Quản lý xác nhận khi đủ người.
      </div>

      {/* ========================================================
          4. BOOTSTRAP MODAL: MỞ CA TRỰC MỚI (id: exampleModal)
      ======================================================== */}
      {/* <!-- Modal --> */}
      <div
        className={`modal fade ${isOpenModal ? "show" : ""}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!isOpenModal}
        style={{ display: isOpenModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <PlusCircle size={18} />
                </div>
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Mở ca trực mới
                </h1>
              </div>
              <button
                type="button"
                className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsOpenModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Form Mở ca trực */}
            <form onSubmit={handleCreateOpenShift}>
              <div className="modal-body space-y-4">
                {/* Chọn ngày */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Ngày trực *
                  </label>
                  <select
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Thứ 2 22/09">Thứ 2 (22/09/2026)</option>
                    <option value="Thứ 3 23/09">Thứ 3 (23/09/2026)</option>
                    <option value="Thứ 4 24/09">Thứ 4 (24/09/2026)</option>
                    <option value="Thứ 5 25/09">Thứ 5 (25/09/2026)</option>
                    <option value="Thứ 6 26/09">Thứ 6 (26/09/2026)</option>
                    <option value="Thứ 7 27/09">Thứ 7 (27/09/2026)</option>
                    <option value="Chủ nhật 28/09">Chủ nhật (28/09/2026)</option>
                  </select>
                </div>

                {/* Ca trực (Chỉ Ca sáng / Ca chiều / Ca tối) */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Ca trực *
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Ca sáng">Ca sáng</option>
                    <option value="Ca chiều">Ca chiều</option>
                    <option value="Ca tối">Ca tối</option>
                  </select>
                </div>

                {/* Vai trò và Số lượng */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Vai trò *
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Phục vụ">Phục vụ</option>
                      <option value="Pha chế">Pha chế</option>
                      <option value="Thu ngân">Thu ngân</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Số lượng cần thêm *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={form.needed}
                      onChange={(e) => setForm({ ...form, needed: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  data-bs-dismiss="modal"
                  onClick={() => setIsOpenModal(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1E40AF]"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. MODAL CHỈNH SỬA CA TRỰC MỞ
      ======================================================== */}
      {shiftToEdit && editForm && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Pencil size={18} />
                  </div>
                  <h1 className="modal-title fs-5">
                    Chỉnh sửa ca trực ({shiftToEdit.day})
                  </h1>
                </div>
                <button
                  type="button"
                  className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  onClick={() => setShiftToEdit(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="modal-body space-y-4">
                  {/* Cảnh báo nếu đã có người đăng ký */}
                  {shiftToEdit.registered > 0 && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                      <div>
                        <strong>Lưu ý:</strong> Ca trực này đã có <strong>{shiftToEdit.registered} nhân viên đăng ký</strong>. Hãy cân nhắc kỹ trước khi thay đổi ca hoặc vai trò để tránh ảnh hưởng đến nhân sự!
                      </div>
                    </div>
                  )}

                  {/* Chọn ngày */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Ngày trực *
                    </label>
                    <select
                      value={editForm.day}
                      onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                    >
                      <option value="Thứ 2 22/09">Thứ 2 (22/09/2026)</option>
                      <option value="Thứ 3 23/09">Thứ 3 (23/09/2026)</option>
                      <option value="Thứ 4 24/09">Thứ 4 (24/09/2026)</option>
                      <option value="Thứ 5 25/09">Thứ 5 (25/09/2026)</option>
                      <option value="Thứ 6 26/09">Thứ 6 (26/09/2026)</option>
                      <option value="Thứ 7 27/09">Thứ 7 (27/09/2026)</option>
                      <option value="Chủ nhật 28/09">Chủ nhật (28/09/2026)</option>
                    </select>
                  </div>

                  {/* Ca trực (Chỉ Ca sáng / Ca chiều / Ca tối) */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Ca trực *
                    </label>
                    <select
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                    >
                      <option value="Ca sáng">Ca sáng</option>
                      <option value="Ca chiều">Ca chiều</option>
                      <option value="Ca tối">Ca tối</option>
                    </select>
                  </div>

                  {/* Vai trò và Số lượng */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Vai trò *
                      </label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                      >
                        <option value="Phục vụ">Phục vụ</option>
                        <option value="Pha chế">Pha chế</option>
                        <option value="Thu ngân">Thu ngân</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Số lượng cần thêm *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editForm.needed}
                        onChange={(e) => setEditForm({ ...editForm, needed: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShiftToEdit(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1E40AF]"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL XÁC NHẬN HỦY / XÓA CA TRỰC (Áp dụng đúng quy tắc)
      ======================================================== */}
      {shiftToDelete && (() => {
        const rule = getDeleteRule(shiftToDelete);

        return (
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        rule.type === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {rule.type === "warning" ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </div>
                    <h1 className="modal-title fs-5">
                      {rule.type === "warning"
                        ? "Cảnh báo hủy ca đã có người đăng ký"
                        : "Xác nhận hủy ca trực mở"}
                    </h1>
                  </div>
                  <button
                    type="button"
                    className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    onClick={() => setShiftToDelete(null)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-body space-y-4">
                  {/* Chi tiết ca muốn xóa */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs">
                    <div className="font-semibold text-slate-800">
                      {shiftToDelete.day} — {shiftToDelete.time}
                    </div>
                    <div className="mt-1 text-slate-600">
                      Vai trò: <strong>{shiftToDelete.role}</strong> • Cần: <strong>{shiftToDelete.needed} người</strong>
                    </div>
                  </div>

                  {/* Cảnh báo phân cấp theo quy tắc */}
                  {rule.type === "warning" ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                        <div>
                          <p className="font-bold">
                            ⚠️ Ca này hiện đã có {shiftToDelete.registered} nhân viên đăng ký!
                          </p>
                          <p className="mt-1">
                            Nếu bạn hủy ca trực này, hệ thống sẽ tự động gỡ bỏ ca và gửi thông báo hủy ca đến các nhân viên sau:
                          </p>
                        </div>
                      </div>

                      {/* Danh sách nhân viên bị ảnh hưởng */}
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Nhân viên đã đăng ký:
                        </div>
                        {shiftToDelete.registrations.map((reg, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-slate-800">
                              {reg.name} ({reg.role})
                            </span>
                            <span className="text-slate-400">{reg.phone}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 italic">
                        Bạn có chắc chắn muốn hủy ca trực và gửi thông báo hủy đến nhân viên không?
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600">
                      <p>
                        Ca trực này hiện <strong>chưa có nhân viên nào đăng ký</strong>. Bạn có thể hủy và gỡ bỏ ca trực này khỏi danh sách một cách an toàn.
                      </p>
                      <p className="mt-2 text-slate-400">
                        Bạn có chắc chắn muốn xóa ca trực này không?
                      </p>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShiftToDelete(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className={`rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-xs transition ${
                      rule.type === "warning"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-rose-600 hover:bg-rose-700"
                    }`}
                  >
                    {rule.type === "warning"
                      ? "Xác nhận hủy & Gửi thông báo"
                      : "Xác nhận xóa ca"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          7. MODAL XEM CHI TIẾT ĐĂNG KÝ
      ======================================================== */}
      {selectedShiftForView && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Users size={18} />
                  </div>
                  <h1 className="modal-title fs-5">
                    Danh sách đăng ký ({selectedShiftForView.day})
                  </h1>
                </div>
                <button
                  type="button"
                  className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  onClick={() => setSelectedShiftForView(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                  <div><strong>Ca:</strong> {selectedShiftForView.time}</div>
                  <div><strong>Vai trò:</strong> {selectedShiftForView.role}</div>
                  <div><strong>Cần thêm:</strong> {selectedShiftForView.needed} người</div>
                </div>

                {selectedShiftForView.registrations.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    Chưa có nhân viên nào đăng ký ca trực này.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedShiftForView.registrations.map((reg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-2xs"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{reg.name}</div>
                          <div className="text-[11px] text-slate-400">{reg.phone}</div>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {reg.approved ? "Đã duyệt" : "Đã đăng ký"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedShiftForView(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop dùng chung */}
      {(isOpenModal || selectedShiftForView || shiftToEdit || shiftToDelete) && (
        <div
          className="modal-backdrop fade show"
          onClick={() => {
            setIsOpenModal(false);
            setSelectedShiftForView(null);
            setShiftToEdit(null);
            setShiftToDelete(null);
          }}
        />
      )}
    </div>
  );
}
