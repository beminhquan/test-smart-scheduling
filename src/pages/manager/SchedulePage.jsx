import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Users,
  Building,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Coffee,
  ShieldCheck,
  Timer,
  Copy,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Loader2,
  Info,
  CalendarDays,
  FileCheck2,
  PlusCircle,
} from "lucide-react";

// ==========================================
// DANH SÁCH NHÂN VIÊN MẪU (28 NHÂN VIÊN)
// ==========================================
const employeeRoster = [
  { id: "NV001", name: "Nguyễn Văn An", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV002", name: "Trần Thị Bích", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV003", name: "Lê Minh Cường", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV004", name: "Phạm Thị Dung", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV005", name: "Hoàng Văn Nam", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV006", name: "Nguyễn Văn A", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV007", name: "Vũ Quốc Tuấn", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV008", name: "Đỗ Mai Linh", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV009", name: "Trịnh Bích Phương", role: "Thu ngân", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV010", name: "Đinh Quang Khải", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV011", name: "Lương Gia Huy", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV012", name: "Bùi Thảo My", role: "Thu ngân", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV013", name: "Võ Tuấn Anh", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV014", name: "Phan Thùy Trang", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV015", name: "Ngô Gia Bảo", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV016", name: "Dương Minh Trí", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV017", name: "Hà Kim Ngân", role: "Thu ngân", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV018", name: "Đặng Quốc Việt", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV019", name: "Nguyễn Hải Yến", role: "Pha chế", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces" },
  { id: "NV020", name: "Trương Hữu Nghĩa", role: "Phục vụ", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=faces" },
];

const initialDays = [
  { id: "T2", label: "T2", date: "22/09", fullDate: "Thứ 2, 22/09/2026", active: true },
  { id: "T3", label: "T3", date: "23/09", fullDate: "Thứ 3, 23/09/2026", active: true },
  { id: "T4", label: "T4", date: "24/09", fullDate: "Thứ 4, 24/09/2026", active: true },
  { id: "T5", label: "T5", date: "25/09", fullDate: "Thứ 5, 25/09/2026", active: true },
  { id: "T6", label: "T6", date: "26/09", fullDate: "Thứ 6, 26/09/2026", active: true },
  { id: "T7", label: "T7", date: "27/09", fullDate: "Thứ 7, 27/09/2026", active: false },
  { id: "CN", label: "CN", date: "28/09", fullDate: "Chủ nhật, 28/09/2026", active: false },
];

const initialConstraints = [
  {
    id: "sufficient_staff",
    title: "Đủ số lượng nhân viên",
    desc: "Đảm bảo mỗi ca có đủ số lượng nhân viên theo nhu cầu.",
    type: "users",
    color: "blue",
    enabled: true,
  },
  {
    id: "availability",
    title: "Theo thời gian rảnh",
    desc: "Chỉ phân công nhân viên vào những ca mà họ đã đăng ký rảnh.",
    type: "calendar",
    color: "orange",
    enabled: true,
  },
  {
    id: "no_overlap",
    title: "Không trùng ca",
    desc: "Đảm bảo nhân viên không được phân công các ca bị trùng thời gian.",
    type: "clock",
    color: "indigo",
    enabled: true,
  },
  {
    id: "min_rest",
    title: "Thời gian nghỉ tối thiểu",
    desc: "Đảm bảo nhân viên có đủ thời gian nghỉ giữa các ca.",
    type: "coffee",
    color: "orange",
    enabled: true,
    inputLabel: "Thời gian nghỉ tối thiểu",
    value: 8,
    unit: "giờ",
  },
  {
    id: "max_consecutive",
    title: "Giới hạn số ca liên tiếp",
    desc: "Không cho nhân viên làm quá số ca liên tiếp được quy định.",
    type: "alert",
    color: "red",
    enabled: true,
    inputLabel: "Số ca liên tiếp tối đa",
    value: 5,
    unit: "ca/tuần",
  },
  {
    id: "max_hours",
    title: "Giới hạn giờ làm việc",
    desc: "Không cho nhân viên vượt quá số giờ làm tối đa.",
    type: "timer",
    color: "green",
    enabled: true,
    inputLabel: "Số giờ làm tối đa",
    value: 40,
    unit: "giờ/tuần",
  },
  {
    id: "role_match",
    title: "Theo vai trò",
    desc: "Chỉ phân công nhân viên vào ca phù hợp với vai trò được yêu cầu.",
    type: "shield",
    color: "amber",
    enabled: true,
  },
];

const initialShiftDemands = [
  { id: "morning", name: "Ca sáng (06:00 - 12:00)", shortName: "Sáng", time: "06:00 - 12:00", phucVu: 3, phaChe: 2, thuNgan: 0, total: 5 },
  { id: "afternoon", name: "Ca chiều (12:00 - 17:00)", shortName: "Chiều", time: "12:00 - 17:00", phucVu: 2, phaChe: 2, thuNgan: 0, total: 4 },
  { id: "evening", name: "Ca tối (17:00 - 22:00)", shortName: "Tối", time: "17:00 - 22:00", phucVu: 2, phaChe: 1, thuNgan: 0, total: 3 },
];

const generateInitialSchedules = () => {
  const sched = {};

  initialDays.forEach((day, dayIndex) => {
    // 1. Ca sáng (Cần 5: 3 PV + 2 PC)
    let morningEmps = [
      employeeRoster[0],
      employeeRoster[2],
      employeeRoster[3],
      employeeRoster[4],
      employeeRoster[5],
    ];
    if (day.id === "T3") {
      morningEmps = [
        employeeRoster[0],
        employeeRoster[2],
        employeeRoster[3],
        employeeRoster[4],
      ];
    } else if (dayIndex % 2 === 1) {
      morningEmps = [
        employeeRoster[6],
        employeeRoster[7],
        employeeRoster[1],
        employeeRoster[9],
        employeeRoster[10],
      ];
    }
    sched[`morning_${day.id}`] = {
      shiftId: "morning",
      dayId: day.id,
      assigned: morningEmps,
    };

    // 2. Ca chiều (Cần 4: 2 PV + 2 PC)
    let afternoonEmps = [
      employeeRoster[6],
      employeeRoster[7],
      employeeRoster[1],
      employeeRoster[9],
    ];
    if (day.id === "T5") {
      afternoonEmps = [
        employeeRoster[6],
        employeeRoster[7],
        employeeRoster[1],
      ];
    } else if (dayIndex % 2 === 1) {
      afternoonEmps = [
        employeeRoster[10],
        employeeRoster[13],
        employeeRoster[12],
        employeeRoster[15],
      ];
    }
    sched[`afternoon_${day.id}`] = {
      shiftId: "afternoon",
      dayId: day.id,
      assigned: afternoonEmps,
    };

    // 3. Ca tối (Cần 3: 2 PV + 1 PC)
    let eveningEmps = [
      employeeRoster[10],
      employeeRoster[14],
      employeeRoster[12],
    ];
    if (day.id === "T4") {
      eveningEmps = [
        employeeRoster[10],
        employeeRoster[12],
      ];
    }
    if (day.id === "CN") {
      eveningEmps = [
        employeeRoster[14],
      ];
    }
    sched[`evening_${day.id}`] = {
      shiftId: "evening",
      dayId: day.id,
      assigned: eveningEmps,
    };
  });

  return sched;
};

export default function SchedulePage() {
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [activeModal, setActiveModal] = useState(null); // 'createScheduleModal' | 'shiftDetailModal' | 'editShiftModal' | 'confirmScheduleModal' | 'fullWeeklyScheduleModal' | null
  const [constraints, setConstraints] = useState(initialConstraints);
  const [days, setDays] = useState(initialDays);
  const [shiftDemands, setShiftDemands] = useState(initialShiftDemands);

  // Toàn bộ phân công cho 21 ca trong tuần
  const [schedules, setSchedules] = useState(generateInitialSchedules);

  // Ca hiện tại đang được chọn để xem chi tiết / chỉnh sửa
  const [selectedShiftKey, setSelectedShiftKey] = useState("morning_T3");

  // Trạng thái xác nhận lịch tuần
  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState(false);

  // State tạm trong modal chỉnh sửa
  const [editEmployeesList, setEditEmployeesList] = useState([]);
  const [showAddEmployeeDropdown, setShowAddEmployeeDropdown] = useState(false);
  const [weekendConfigured, setWeekendConfigured] = useState(false);

  // Trạng thái chạy OR-Tools
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Lấy thông tin ca đang chọn
  const getSelectedShiftInfo = () => {
    const [shiftId, dayId] = selectedShiftKey.split("_");
    const demand = shiftDemands.find((d) => d.id === shiftId) || shiftDemands[0];
    const day = days.find((d) => d.id === dayId) || days[1];
    const shiftSchedule = schedules[selectedShiftKey] || { assigned: [] };
    const assigned = shiftSchedule.assigned || [];

    const pvAssigned = assigned.filter((e) => e.role === "Phục vụ").length;
    const pcAssigned = assigned.filter((e) => e.role === "Pha chế").length;
    const tnAssigned = assigned.filter((e) => e.role === "Thu ngân").length;

    const pvMissing = Math.max(0, demand.phucVu - pvAssigned);
    const pcMissing = Math.max(0, demand.phaChe - pcAssigned);
    const tnMissing = Math.max(0, demand.thuNgan - tnAssigned);
    const totalMissing = Math.max(0, demand.total - assigned.length);

    return {
      shiftKey: selectedShiftKey,
      shiftId,
      dayId,
      demand,
      day,
      assigned,
      pvAssigned,
      pcAssigned,
      tnAssigned,
      pvMissing,
      pcMissing,
      tnMissing,
      totalMissing,
      isSatisfied: assigned.length >= demand.total,
    };
  };

  const selectedInfo = getSelectedShiftInfo();

  // Bắt sự kiện Bootstrap native data-bs-toggle & data-bs-dismiss
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const toggleTrigger = e.target.closest('[data-bs-toggle="modal"]');
      if (toggleTrigger) {
        e.preventDefault();
        const targetId = toggleTrigger.getAttribute("data-bs-target");
        if (targetId) {
          const cleanId = targetId.replace("#", "");
          if (cleanId === "editShiftModal") {
            const current = schedules[selectedShiftKey]?.assigned || [];
            setEditEmployeesList([...current]);
          }
          setActiveModal(cleanId);
        }
        return;
      }

      const dismissTrigger = e.target.closest('[data-bs-dismiss="modal"]');
      if (dismissTrigger) {
        e.preventDefault();
        setActiveModal(null);
        return;
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [schedules, selectedShiftKey]);

  // Khóa scroll body khi modal mở
  useEffect(() => {
    if (activeModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [activeModal]);

  // Mở chi tiết ca khi click vào bất kỳ ô nào trong bảng
  const handleCellClick = (shiftId, dayId) => {
    const key = `${shiftId}_${dayId}`;
    setSelectedShiftKey(key);
    setActiveModal("shiftDetailModal");
  };

  // Mở modal chỉnh sửa ca
  const handleOpenEditModal = () => {
    const current = schedules[selectedShiftKey]?.assigned || [];
    setEditEmployeesList([...current]);
    setActiveModal("editShiftModal");
  };

  // CHUYỂN SANG TRANG TẠO CA TRỰC MỞ
  const handleGoToOpenShift = (targetShift) => {
    setActiveModal(null);
    const shiftData = targetShift || selectedInfo;
    navigate("/manager/open-shifts", {
      state: {
        shift: shiftData,
        fromSchedule: true,
      },
    });
  };

  const toggleConstraint = (id) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const updateConstraintValue = (id, val) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: val } : c))
    );
  };

  const updateDemandField = (shiftId, field, delta) => {
    setShiftDemands((prev) =>
      prev.map((item) => {
        if (item.id === shiftId) {
          const newVal = Math.max(0, item[field] + delta);
          const updated = { ...item, [field]: newVal };
          updated.total = updated.phucVu + updated.phaChe + updated.thuNgan;
          return updated;
        }
        return item;
      })
    );
  };

  const toggleDay = (dayId) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, active: !d.active } : d))
    );
  };

  const handleCopyWeekendDemand = () => {
    setDays((prev) =>
      prev.map((d) => (d.id === "T7" || d.id === "CN" ? { ...d, active: true } : d))
    );
    setWeekendConfigured(true);
  };

  const handleCustomWeekendDemand = () => {
    setDays((prev) =>
      prev.map((d) => (d.id === "T7" || d.id === "CN" ? { ...d, active: true } : d))
    );
    setWeekendConfigured(true);
  };

  const handleRemoveFromEditShift = (empId) => {
    setEditEmployeesList((prev) => prev.filter((e) => e.id !== empId));
  };

  const handleAddEmployeeToEditShift = (employee) => {
    if (!editEmployeesList.some((e) => e.id === employee.id)) {
      setEditEmployeesList((prev) => [...prev, employee]);
    }
    setShowAddEmployeeDropdown(false);
  };

  const handleSaveEditShift = () => {
    setSchedules((prev) => ({
      ...prev,
      [selectedShiftKey]: {
        ...prev[selectedShiftKey],
        assigned: editEmployeesList,
      },
    }));
    setActiveModal(null);
  };

  // Xác nhận phát hành lịch tuần
  const handleConfirmSchedule = () => {
    setIsScheduleConfirmed(true);
    setActiveModal(null);
  };

  // Chạy OR-Tools tạo lịch
  const handleRunORTools = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSchedules((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const [sId] = key.split("_");
          const demand = shiftDemands.find((d) => d.id === sId) || shiftDemands[0];
          while (next[key].assigned.length < demand.total) {
            const missingRole =
              next[key].assigned.filter((e) => e.role === "Phục vụ").length < demand.phucVu
                ? "Phục vụ"
                : "Pha chế";
            const candidate = employeeRoster.find(
              (r) => r.role === missingRole && !next[key].assigned.some((a) => a.id === r.id)
            ) || employeeRoster[5];
            next[key].assigned = [...next[key].assigned, candidate];
          }
        });
        return next;
      });

      setIsGenerating(false);
      setGenerationSuccess(true);
      setTimeout(() => {
        setGenerationSuccess(false);
        setActiveModal(null);
      }, 900);
    }, 1500);
  };

  // Tính thống kê động
  const uniqueEmployees = new Set();
  const deficientShifts = [];

  initialDays.forEach((day) => {
    shiftDemands.forEach((demand) => {
      const key = `${demand.id}_${day.id}`;
      const shiftData = schedules[key] || { assigned: [] };
      const currentCount = shiftData.assigned.length;
      shiftData.assigned.forEach((e) => uniqueEmployees.add(e.id));

      if (currentCount < demand.total) {
        deficientShifts.push({
          key,
          day,
          demand,
          assigned: shiftData.assigned,
          missing: demand.total - currentCount,
        });
      }
    });
  });

  const assignedEmployeesCount = uniqueEmployees.size || 26;

  return (
    <div className="schedule-page-container min-h-full bg-[#F8FAFC] p-4 text-slate-800 md:p-6 lg:p-8">
      {/* CSS Nhúng chuẩn Bootstrap modal & toggle */}
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
          max-width: 540px;
          pointer-events: none;
        }
        .modal-dialog-xl {
          max-width: 1240px !important;
          width: 95% !important;
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
        .form-check-input {
          width: 2.75rem;
          height: 1.5rem;
          appearance: none;
          background-color: #e2e8f0;
          border-radius: 2rem;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          outline: none;
        }
        .form-check-input::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 1.25rem;
          height: 1.25rem;
          background-color: #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform 0.2s ease;
        }
        .form-check-input:checked {
          background-color: #2563eb;
        }
        .form-check-input:checked::after {
          transform: translateX(1.25rem);
        }
        body.modal-open {
          overflow: hidden;
        }
      `}</style>

      {/* ========================================================
          1. HEADER SchedulePage
      ======================================================== */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Tạo lịch tự động
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Cấu hình nhu cầu nhân sự và các ràng buộc để hệ thống sử dụng OR-Tools tạo lịch làm việc tự động.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bộ chọn tuần */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-xs">
            <Calendar size={17} className="text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Tuần 22/09/2026 - 28/09/2026</span>
            <div className="ml-1 flex items-center border-l border-slate-200 pl-2">
              <button
                type="button"
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Tuần trước"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Tuần sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Xem lịch chi tiết (toàn bộ T2 -> CN) */}
          <button
            type="button"
            className="btn btn-outline-primary flex items-center gap-2 rounded-xl border border-blue-600 bg-white px-3.5 py-2 text-sm font-semibold text-blue-600 shadow-xs transition hover:bg-blue-50 active:scale-[0.98]"
            data-bs-toggle="modal"
            data-bs-target="#fullWeeklyScheduleModal"
          >
            <CalendarDays size={17} />
            <span>Xem lịch chi tiết</span>
          </button>

          {/* Xác nhận lịch */}
          <button
            type="button"
            className="btn flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98]"
            data-bs-toggle="modal"
            data-bs-target="#confirmScheduleModal"
          >
            <FileCheck2 size={17} />
            <span>Xác nhận lịch</span>
          </button>

          {/* Nút tạo lịch bằng OR-Tools */}
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
            data-bs-toggle="modal"
            data-bs-target="#createScheduleModal"
          >
            <Cpu size={17} />
            <span>Tạo lịch bằng OR-Tools</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          CÁC CARD THỐNG KÊ (5 CARDS CHÍNH)
      ======================================================== */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* 1. 28 Nhân viên */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users size={22} />
          </div>
          <div>
            <div className="text-xl font-bold leading-none text-slate-800">28</div>
            <div className="mt-1 text-xs text-slate-500">Nhân viên</div>
          </div>
        </div>

        {/* 2. 21 Ca làm việc */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Building size={22} />
          </div>
          <div>
            <div className="text-xl font-bold leading-none text-slate-800">21</div>
            <div className="mt-1 text-xs text-slate-500">Ca làm việc</div>
          </div>
        </div>

        {/* 3. 7 Ngày */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-xl font-bold leading-none text-slate-800">7</div>
            <div className="mt-1 text-xs text-slate-500">Ngày</div>
          </div>
        </div>

        {/* 4. 26 Nhân viên được phân công */}
        <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-[#F4F3FD] p-3.5 shadow-xs">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Users size={22} />
          </div>
          <div>
            <div className="text-xl font-bold leading-none text-slate-800">{assignedEmployeesCount}</div>
            <div className="mt-1 text-xs text-slate-600">Nhân viên được phân công</div>
          </div>
        </div>

        {/* 5. Trạng thái lịch */}
        <div
          className={`flex items-center gap-3 rounded-xl border p-3.5 shadow-xs ${
            isScheduleConfirmed
              ? "border-emerald-300 bg-[#EEF9F2]"
              : "border-emerald-200 bg-[#EEF9F2]"
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Check size={22} />
          </div>
          <div>
            <div className="text-base font-bold leading-none text-emerald-700">
              {isScheduleConfirmed ? "Đã xác nhận" : "Hoàn tất"}
            </div>
            <div className="mt-1 text-xs text-slate-600">Trạng thái</div>
          </div>
        </div>
      </div>

      {/* ========================================================
          LAYOUT CHÍNH: 3 CỘT (RÀNG BUỘC - NHU CẦU - KẾT QUẢ)
      ======================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* ======================================================
            2. KHU VỰC RÀNG BUỘC KHI XẾP LỊCH (Cột 1: 4/12)
        ====================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs xl:col-span-4">
          <div className="mb-5 flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Ràng buộc khi xếp lịch</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Các ràng buộc giúp hệ thống tạo lịch phù hợp với nhu cầu và quy định của quán.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {constraints.map((c) => {
              const renderIcon = () => {
                switch (c.type) {
                  case "users":
                    return <Users size={17} className="text-blue-600" />;
                  case "calendar":
                    return <Calendar size={17} className="text-amber-500" />;
                  case "clock":
                    return <Clock size={17} className="text-indigo-600" />;
                  case "coffee":
                    return <Coffee size={17} className="text-orange-500" />;
                  case "alert":
                    return <AlertTriangle size={17} className="text-rose-500" />;
                  case "timer":
                    return <Timer size={17} className="text-emerald-600" />;
                  case "shield":
                    return <ShieldCheck size={17} className="text-amber-600" />;
                  default:
                    return <CheckCircle2 size={17} className="text-blue-600" />;
                }
              };

              const getBgColor = () => {
                switch (c.color) {
                  case "blue":
                    return "bg-blue-50";
                  case "orange":
                    return "bg-amber-50";
                  case "indigo":
                    return "bg-indigo-50";
                  case "red":
                    return "bg-rose-50";
                  case "green":
                    return "bg-emerald-50";
                  case "amber":
                    return "bg-amber-50";
                  default:
                    return "bg-slate-50";
                }
              };

              return (
                <div key={c.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getBgColor()}`}>
                        {renderIcon()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{c.title}</div>
                        <div className="text-xs text-slate-400">{c.desc}</div>
                      </div>
                    </div>
                    <div className="form-check form-switch pt-0.5">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`switch-${c.id}`}
                        checked={c.enabled}
                        onChange={() => toggleConstraint(c.id)}
                      />
                    </div>
                  </div>

                  {c.inputLabel && (
                    <div className="mt-2.5 ml-11 flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                      <span className="text-xs text-slate-500">{c.inputLabel}</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={c.value}
                          onChange={(e) => updateConstraintValue(c.id, e.target.value)}
                          className="h-7 w-16 rounded border border-slate-200 bg-white text-center text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                        />
                        <span className="text-xs text-slate-400">{c.unit}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================
            3. THIẾT LẬP NHU CẦU NHÂN SỰ (Cột 2: 4/12)
        ====================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs xl:col-span-4">
          <div className="mb-5 flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Thiết lập nhu cầu nhân sự</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Điều chỉnh số lượng nhân sự cho từng ca theo ngày áp dụng.
              </p>
            </div>
          </div>

          {/* 1. Ngày áp dụng nhu cầu */}
          <div className="mb-5">
            <div className="mb-2 text-xs font-semibold text-slate-700">1. Ngày áp dụng nhu cầu</div>
            <div className="flex flex-wrap items-center gap-2">
              {days.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition ${
                    day.active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Cảnh báo Thứ 7 & Chủ nhật */}
            {!weekendConfigured && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-[#FFFBEB] p-3 text-xs">
                <div className="flex items-start gap-2">
                  <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <div className="font-semibold text-amber-800">
                      Thứ 7 và Chủ nhật chưa thiết lập nhu cầu.
                    </div>
                    <div className="mt-0.5 text-amber-700">
                      Bạn có thể sao chép nhu cầu cho T7 & CN hoặc thiết lập riêng.
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyWeekendDemand}
                    className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-xs hover:bg-blue-50"
                  >
                    <Copy size={13} />
                    <span>Sao chép nhu cầu cho T7 & CN</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCustomWeekendDemand}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Thiết lập riêng T7 & CN
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Nhu cầu theo ca mẫu */}
          <div>
            <div className="mb-2 text-xs font-semibold text-slate-700">2. Nhu cầu theo ca mẫu</div>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                    <th className="px-3 py-2.5 font-medium">Ca làm việc</th>
                    <th className="px-2 py-2.5 text-center font-medium">Phục vụ</th>
                    <th className="px-2 py-2.5 text-center font-medium">Pha chế</th>
                    <th className="px-2 py-2.5 text-center font-medium">Thu ngân</th>
                    <th className="px-3 py-2.5 text-right font-medium">Tổng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {shiftDemands.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-3 font-medium text-slate-800">{shift.name}</td>
                      <td className="px-2 py-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateDemandField(shift.id, "phucVu", -1)}
                            className="h-4 w-4 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span>{shift.phucVu}</span>
                          <button
                            type="button"
                            onClick={() => updateDemandField(shift.id, "phucVu", 1)}
                            className="h-4 w-4 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateDemandField(shift.id, "phaChe", -1)}
                            className="h-4 w-4 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span>{shift.phaChe}</span>
                          <button
                            type="button"
                            onClick={() => updateDemandField(shift.id, "phaChe", 1)}
                            className="h-4 w-4 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateDemandField(shift.id, "thuNgan", -1)}
                            className="h-4 w-4 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span>{shift.thuNgan}</span>
                          <button
                            type="button"
                            onClick={() => updateDemandField(shift.id, "thuNgan", 1)}
                            className="h-4 w-4 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-slate-900">{shift.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              * Nhu cầu này sẽ áp dụng cho các ngày đã chọn (T2 - T6).
            </p>
          </div>
        </div>

        {/* ======================================================
            4. KẾT QUẢ TẠO LỊCH (Cột 3: 4/12)
        ====================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs xl:col-span-4">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Kết quả tạo lịch</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Nhấn vào bất kỳ ca nào để xem thông tin nhân viên
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50/50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100/60"
              data-bs-toggle="modal"
              data-bs-target="#fullWeeklyScheduleModal"
            >
              <CalendarDays size={13} />
              <span>Xem cả tuần</span>
            </button>
          </div>

          {/* Bảng ma trận Ca / Ngày - CÁC Ô ĐỀU CÓ THỂ NHẤN ĐỂ XEM NHÂN VIÊN */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-600">
                  <th className="px-2 py-2.5 text-left font-medium">Ca / Ngày</th>
                  {days.map((d) => (
                    <th key={d.id} className="px-1.5 py-2.5 font-medium whitespace-nowrap">
                      {d.label}
                      <span className="block text-[10px] text-slate-400">{d.date}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shiftDemands.map((demand) => (
                  <tr key={demand.id}>
                    <td className="px-2 py-2.5 text-left font-medium text-slate-700">
                      {demand.shortName}
                    </td>
                    {days.map((d) => {
                      const key = `${demand.id}_${d.id}`;
                      const shiftData = schedules[key] || { assigned: [] };
                      const currentCount = shiftData.assigned.length;
                      const isSatisfied = currentCount >= demand.total;
                      const isSelected = selectedShiftKey === key;

                      return (
                        <td key={d.id} className="p-1">
                          <button
                            type="button"
                            onClick={() => handleCellClick(demand.id, d.id)}
                            className={`group relative w-full cursor-pointer rounded-md px-1 py-1.5 font-semibold transition-all duration-150 hover:scale-105 hover:shadow-xs active:scale-95 ${
                              isSatisfied
                                ? "bg-[#EEF9F2] text-emerald-700 hover:bg-emerald-100"
                                : "bg-[#FDF2F2] text-rose-600 hover:bg-rose-100"
                            } ${
                              isSelected ? "ring-2 ring-blue-500 ring-offset-1 font-bold" : ""
                            }`}
                            title={`Nhấn để xem nhân viên: ${demand.name} - ${d.label} (${d.date})`}
                          >
                            <span>
                              {currentCount}/{demand.total}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ghi chú màu sắc */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Đủ nhân viên</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-600">Thiếu nhân viên</span>
              </div>
            </div>
            <span className="text-[11px] text-blue-600 font-medium">
              👉 Nhấn vào ô để xem ca
            </span>
          </div>

          {/* Cảnh báo ca chưa đủ nhân viên */}
          {deficientShifts.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-[#FFFBEB] p-3 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                <div>
                  <div className="font-semibold text-amber-900">
                    Lịch làm việc có ca chưa đủ nhân viên
                  </div>
                  <div className="mt-0.5 text-amber-800">
                    Hệ thống đã phát hiện một số ca chưa đáp ứng đủ nhu cầu nhân sự.
                  </div>
                </div>
              </div>

              {/* Danh sách các ca thiếu */}
              <div className="mt-3 space-y-2">
                {deficientShifts.slice(0, 3).map((def) => {
                  const [sId, dId] = def.key.split("_");
                  return (
                    <div
                      key={def.key}
                      onClick={() => handleCellClick(sId, dId)}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-amber-100 bg-white/90 p-2.5 transition hover:bg-amber-50/50"
                      title="Nhấn để xem chi tiết ca này"
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="shrink-0 text-rose-500" />
                        <div>
                          <span className="font-semibold text-slate-800">
                            {def.day.fullDate.split(",")[0]} ({def.day.date}) - {def.demand.shortName}
                          </span>
                          <span className="ml-2 font-medium text-rose-600">
                            Thiếu {def.missing} nhân viên
                          </span>
                          <div className="text-[11px] text-blue-600">
                            Đang có: {def.assigned.length}/{def.demand.total} nhân viên
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGoToOpenShift(def);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
                      >
                        <PlusCircle size={12} />
                        <span>Tạo ca trực mở</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* NÚT TẠO CA TRỰC MỞ (THAY THẾ TÌM NGƯỜI THAY THẾ VÀ XEM CHI TIẾT) */}
              <div className="mt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleGoToOpenShift()}
                  className="btn btn-primary flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  <PlusCircle size={15} />
                  <span>Tạo ca trực mở</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          5. MODAL CHI TIẾT CA (id: shiftDetailModal)
      ======================================================== */}
      <div
        className={`modal fade ${activeModal === "shiftDetailModal" ? "show" : ""}`}
        id="shiftDetailModal"
        tabIndex="-1"
        aria-hidden={activeModal !== "shiftDetailModal"}
        style={{ display: activeModal === "shiftDetailModal" ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Clock size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Chi tiết ca làm việc</h3>
              </div>
              <button
                type="button"
                className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                data-bs-dismiss="modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Banner ca làm việc */}
              <div
                className={`mb-5 flex items-start justify-between rounded-xl p-4 border ${
                  selectedInfo.isSatisfied
                    ? "border-emerald-200 bg-[#EEF9F2]"
                    : "border-rose-100 bg-[#FDF2F2]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${
                      selectedInfo.isSatisfied ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"
                    }`}
                  >
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        selectedInfo.isSatisfied ? "text-emerald-800" : "text-rose-600"
                      }`}
                    >
                      {selectedInfo.day.fullDate}
                    </div>
                    <div className="text-xs text-slate-600">
                      {selectedInfo.demand.name}
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    selectedInfo.isSatisfied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {selectedInfo.isSatisfied
                    ? `Đủ ${selectedInfo.assigned.length}/${selectedInfo.demand.total} nhân viên`
                    : `Thiếu ${selectedInfo.totalMissing} nhân viên`}
                </span>
              </div>

              {/* Bảng nhu cầu nhân sự */}
              <div className="mb-5">
                <div className="mb-2 text-xs font-semibold text-slate-700">Nhu cầu nhân sự</div>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <th className="px-3 py-2 font-medium">Vai trò</th>
                        <th className="px-3 py-2 text-center font-medium">Yêu cầu</th>
                        <th className="px-3 py-2 text-center font-medium">Đã xếp</th>
                        <th className="px-3 py-2 text-center font-medium">Thiếu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="px-3 py-2.5 font-medium">Phục vụ</td>
                        <td className="px-3 py-2.5 text-center">{selectedInfo.demand.phucVu}</td>
                        <td className="px-3 py-2.5 text-center">{selectedInfo.pvAssigned}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={selectedInfo.pvMissing === 0 ? "text-slate-400" : "font-semibold text-rose-600"}>
                            {selectedInfo.pvMissing}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2.5 font-medium">Pha chế</td>
                        <td className="px-3 py-2.5 text-center">{selectedInfo.demand.phaChe}</td>
                        <td className="px-3 py-2.5 text-center">{selectedInfo.pcAssigned}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={selectedInfo.pcMissing === 0 ? "text-slate-400" : "font-semibold text-rose-600"}>
                            {selectedInfo.pcMissing}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2.5 font-medium">Thu ngân</td>
                        <td className="px-3 py-2.5 text-center">{selectedInfo.demand.thuNgan}</td>
                        <td className="px-3 py-2.5 text-center">{selectedInfo.tnAssigned}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={selectedInfo.tnMissing === 0 ? "text-slate-400" : "font-semibold text-rose-600"}>
                            {selectedInfo.tnMissing}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50 font-bold">
                        <td className="px-3 py-2.5 text-slate-900">Tổng</td>
                        <td className="px-3 py-2.5 text-center text-slate-900">{selectedInfo.demand.total}</td>
                        <td className="px-3 py-2.5 text-center text-slate-900">{selectedInfo.assigned.length}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={selectedInfo.isSatisfied ? "text-emerald-600" : "text-rose-600"}>
                            {selectedInfo.totalMissing}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danh sách nhân viên đã được xếp */}
              <div>
                <div className="mb-2 text-xs font-semibold text-slate-700">
                  Nhân viên đã được xếp ({selectedInfo.assigned.length}/{selectedInfo.demand.total})
                </div>
                {selectedInfo.assigned.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                    Chưa có nhân viên nào được phân công cho ca này.
                  </div>
                ) : (
                  <div className="space-y-2 rounded-xl border border-slate-100 p-2">
                    {selectedInfo.assigned.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50/70 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-800">{emp.name}</span>
                            <span className="ml-2 text-[10px] text-slate-400">({emp.id})</span>
                          </div>
                        </div>
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                          {emp.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer: Chỉnh sửa ca & Tạo ca trực mở */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="flex items-center gap-1.5 rounded-xl border border-blue-600 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
              >
                <Edit3 size={15} />
                <span>Chỉnh sửa ca</span>
              </button>
              <button
                type="button"
                onClick={() => handleGoToOpenShift(selectedInfo)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                <PlusCircle size={15} />
                <span>Tạo ca trực mở</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          6. MODAL CHỈNH SỬA CA (id: editShiftModal)
      ======================================================== */}
      <div
        className={`modal fade ${activeModal === "editShiftModal" ? "show" : ""}`}
        id="editShiftModal"
        tabIndex="-1"
        aria-hidden={activeModal !== "editShiftModal"}
        style={{ display: activeModal === "editShiftModal" ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Edit3 size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Chỉnh sửa ca làm việc</h3>
              </div>
              <button
                type="button"
                className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                data-bs-dismiss="modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Banner ca */}
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-[#EFF6FF] p-4">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedInfo.day.fullDate} - {selectedInfo.demand.name}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    Cần:{" "}
                    <span className="font-semibold text-blue-600">
                      {selectedInfo.demand.phucVu} Phục vụ + {selectedInfo.demand.phaChe} Pha chế ({selectedInfo.demand.total} người)
                    </span>
                  </div>
                </div>
              </div>

              {/* Danh sách nhân viên hiện tại */}
              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold text-slate-700">
                  Nhân viên hiện tại ({editEmployeesList.length}/{selectedInfo.demand.total})
                </div>
                <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                  {editEmployeesList.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{emp.name}</div>
                          <div className="text-[11px] font-medium text-blue-600">{emp.role}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromEditShift(emp.id)}
                        className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        <Trash2 size={13} />
                        <span>Xóa khỏi ca</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút thêm nhân viên */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeDropdown(!showAddEmployeeDropdown)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 py-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <Plus size={16} />
                  <span>+ Thêm nhân viên</span>
                </button>

                {/* Dropdown danh sách nhân viên để chọn */}
                {showAddEmployeeDropdown && (
                  <div className="absolute top-full left-0 z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase text-slate-400">
                      Chọn nhân viên có sẵn:
                    </div>
                    {employeeRoster
                      .filter((cand) => !editEmployeesList.some((e) => e.id === cand.id))
                      .map((cand) => (
                        <div
                          key={cand.id}
                          onClick={() => handleAddEmployeeToEditShift(cand)}
                          className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-xs font-semibold text-slate-800">{cand.name}</div>
                              <div className="text-[10px] text-blue-600">{cand.role}</div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-blue-600">+ Thêm</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEditShift}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          7. MODAL TẠO LỊCH TỰ ĐỘNG (id: createScheduleModal)
      ======================================================== */}
      <div
        className={`modal fade ${activeModal === "createScheduleModal" ? "show" : ""}`}
        id="createScheduleModal"
        tabIndex="-1"
        aria-hidden={activeModal !== "createScheduleModal"}
        style={{ display: activeModal === "createScheduleModal" ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Cpu size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tạo lịch tự động</h3>
              </div>
              <button
                type="button"
                className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                data-bs-dismiss="modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 size={40} className="animate-spin text-blue-600" />
                  <div className="mt-4 text-base font-bold text-slate-800">
                    Đang tạo lịch bằng OR-Tools...
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Đang giải bài toán phân bổ tối ưu 28 nhân viên vào 21 ca làm việc...
                  </p>
                </div>
              ) : generationSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 size={44} className="text-emerald-500" />
                  <div className="mt-3 text-base font-bold text-slate-900">
                    Tạo lịch thành công!
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Lịch làm việc đã được cập nhật tối ưu nhất theo các ràng buộc.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Bạn có chắc muốn tạo lịch tự động cho tuần{" "}
                    <span className="font-bold text-blue-600">22/09/2026 - 28/09/2026</span>?
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 text-slate-700">
                      <div>
                        <span className="text-slate-500">Số nhân viên:</span>{" "}
                        <span className="font-bold text-slate-900">28</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Số ngày:</span>{" "}
                        <span className="font-bold text-slate-900">7 ngày</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Nhu cầu nhân sự:</span>{" "}
                        <span className="font-bold text-slate-900">21 ca làm việc</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ràng buộc đang bật:</span>{" "}
                        <span className="font-bold text-emerald-600">
                          {constraints.filter((c) => c.enabled).length}/{constraints.length}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-slate-200/60 pt-3">
                      <div className="mb-1 text-[11px] font-semibold text-slate-500">
                        Các ràng buộc áp dụng:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {constraints
                          .filter((c) => c.enabled)
                          .map((c) => (
                            <span
                              key={c.id}
                              className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700"
                            >
                              ✓ {c.title}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isGenerating && !generationSuccess && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  data-bs-dismiss="modal"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleRunORTools}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  Tạo lịch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          8. MODAL XÁC NHẬN LỊCH (id: confirmScheduleModal)
      ======================================================== */}
      <div
        className={`modal fade ${activeModal === "confirmScheduleModal" ? "show" : ""}`}
        id="confirmScheduleModal"
        tabIndex="-1"
        aria-hidden={activeModal !== "confirmScheduleModal"}
        style={{ display: activeModal === "confirmScheduleModal" ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FileCheck2 size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận lịch làm việc</h3>
              </div>
              <button
                type="button"
                className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                data-bs-dismiss="modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-[#EEF9F2] p-3.5">
                <CheckCircle2 size={24} className="shrink-0 text-emerald-600" />
                <div className="text-xs text-emerald-900">
                  <div className="font-bold text-sm text-emerald-800">
                    Sẵn sàng phát hành lịch tuần này!
                  </div>
                  <div>Tuần áp dụng: 22/09/2026 - 28/09/2026</div>
                </div>
              </div>

              <p className="text-sm text-slate-700">
                Bạn có chắc chắn muốn xác nhận và ban hành lịch làm việc cho tuần này?
              </p>

              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1.5">
                <div>• Tổng số ca đã xếp: <strong className="text-slate-800">21 ca</strong></div>
                <div>• Số nhân viên tham gia: <strong className="text-slate-800">{assignedEmployeesCount} nhân viên</strong></div>
                <div>• Trạng thái sau xác nhận: <strong className="text-emerald-600">Chính thức (Đã phát hành)</strong></div>
                <div>• Toàn bộ nhân viên sẽ nhận được thông báo lịch làm việc mới qua ứng dụng.</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
              >
                Xác nhận & Ban hành
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          9. MODAL XEM TOÀN BỘ LỊCH CHI TIẾT TỪ T2 ĐẾN CN
          (id: fullWeeklyScheduleModal)
      ======================================================== */}
      <div
        className={`modal fade ${activeModal === "fullWeeklyScheduleModal" ? "show" : ""}`}
        id="fullWeeklyScheduleModal"
        tabIndex="-1"
        aria-hidden={activeModal !== "fullWeeklyScheduleModal"}
        style={{ display: activeModal === "fullWeeklyScheduleModal" ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-xl">
          <div className="modal-content">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Toàn bộ lịch làm việc tuần (22/09/2026 - 28/09/2026)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Xem chi tiết danh sách tất cả nhân viên được phân công từ Thứ 2 đến Chủ nhật
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-close rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  data-bs-dismiss="modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body: Lưới lịch tuần đầy đủ 7 ngày x 3 ca */}
            <div className="max-h-[75vh] overflow-y-auto p-5">
              {/* Chú thích màu vai trò */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-700">Phân loại vai trò:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-slate-600 font-medium">Phục vụ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-slate-600 font-medium">Pha chế</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-600"></span>
                    <span className="text-slate-600 font-medium">Thu ngân</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  💡 Nhấn vào bất kỳ ca nào để mở chỉnh sửa hoặc tạo ca trực mở
                </div>
              </div>

              {/* Bảng lịch tuần */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[1000px] border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/80">
                      <th className="w-36 border-r border-slate-200 p-3 text-left font-bold text-slate-700">
                        Ca làm việc
                      </th>
                      {days.map((d) => (
                        <th key={d.id} className="border-r border-slate-200 p-2.5 text-center font-bold text-slate-800 last:border-r-0">
                          <div>{d.fullDate.split(",")[0]}</div>
                          <div className="text-[11px] font-normal text-slate-500">{d.date}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {shiftDemands.map((demand) => (
                      <tr key={demand.id}>
                        {/* Cột tên ca bên trái */}
                        <td className="border-r border-slate-200 bg-slate-50/70 p-3 align-top">
                          <div className="font-bold text-slate-900">{demand.name.split("(")[0]}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">{demand.time}</div>
                          <div className="mt-2 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            Cần: {demand.total} người
                          </div>
                        </td>

                        {/* 7 Cột từ Thứ 2 đến Chủ nhật */}
                        {days.map((d) => {
                          const key = `${demand.id}_${d.id}`;
                          const shiftData = schedules[key] || { assigned: [] };
                          const currentEmps = shiftData.assigned;
                          const isFull = currentEmps.length >= demand.total;

                          return (
                            <td
                              key={d.id}
                              onClick={() => {
                                handleCellClick(demand.id, d.id);
                              }}
                              className="group relative cursor-pointer border-r border-slate-200 p-2 align-top transition hover:bg-blue-50/30 last:border-r-0"
                            >
                              {/* Header nhỏ trong ô */}
                              <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                    isFull
                                      ? "bg-[#EEF9F2] text-emerald-700"
                                      : "bg-[#FDF2F2] text-rose-600"
                                  }`}
                                >
                                  {currentEmps.length}/{demand.total} người
                                </span>

                                {!isFull && (
                                  <span className="text-[10px] font-semibold text-rose-500">
                                    Thiếu {demand.total - currentEmps.length}
                                  </span>
                                )}
                              </div>

                              {/* Danh sách nhân viên trong ca */}
                              <div className="space-y-1.5">
                                {currentEmps.map((emp) => {
                                  const roleColor =
                                    emp.role === "Phục vụ"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : emp.role === "Pha chế"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-purple-50 text-purple-700 border-purple-200";

                                  return (
                                    <div
                                      key={emp.id}
                                      className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white p-1 shadow-2xs"
                                    >
                                      <img
                                        src={emp.avatar}
                                        alt={emp.name}
                                        className="h-5 w-5 rounded-full object-cover shrink-0"
                                      />
                                      <span className="truncate text-[11px] font-semibold text-slate-800">
                                        {emp.name.split(" ").slice(-2).join(" ")}
                                      </span>
                                      <span
                                        className={`ml-auto shrink-0 rounded px-1 py-0.2 text-[9px] font-medium border ${roleColor}`}
                                      >
                                        {emp.role}
                                      </span>
                                    </div>
                                  );
                                })}

                                {currentEmps.length === 0 && (
                                  <div className="py-3 text-center text-[10px] text-slate-400 italic">
                                    Chưa xếp người
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <div className="text-xs text-slate-500">
                Nhấn trực tiếp vào ô bất kỳ để xem hoặc đổi nhân viên ca đó.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  data-bs-dismiss="modal"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal("confirmScheduleModal");
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                >
                  Xác nhận lịch này
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop dùng chung khi modal mở */}
      {activeModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
