import { useCallback, useEffect, useState } from "react";
import {
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { acceptOpenShift, getOpenShifts } from "../../services/openShiftService";

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

function extractShifts(payload) {
  if (Array.isArray(payload)) return payload;

  const possibleLists = [
    payload?.data,
    payload?.items,
    payload?.results,
    payload?.data?.data,
    payload?.data?.items,
  ];

  return possibleLists.find(Array.isArray) ?? [];
}

function formatClock(value) {
  if (!value) return "--:--";
  const text = String(value);
  const timeMatch = text.match(/(?:T|\s)?(\d{2}:\d{2})/);
  if (timeMatch) return timeMatch[1];

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? text
    : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function parseDate(value) {
  if (!value) return null;
  const text = String(value);
  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatShortDate(value) {
  const date = parseDate(value);
  if (!date) return value ? String(value) : "Chưa có ngày";
  const weekday = date.getDay() === 0 ? "CN" : `T${date.getDay() + 1}`;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${weekday} ${day}/${month}`;
}

function formatLongDate(value) {
  const date = parseDate(value);
  if (!date) return value ? String(value) : "Chưa có ngày";
  const weekdayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${weekdayNames[date.getDay()]} – ${day}/${month}/${date.getFullYear()}`;
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Không có";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function normalizeShift(shift) {
  const date = firstValue(shift.date, shift.shift_date, shift.work_date, shift.start_date, shift.starts_at, shift.start_at);
  const start = firstValue(shift.start_time, shift.startTime, shift.starts_at, shift.start_at);
  const end = firstValue(shift.end_time, shift.endTime, shift.ends_at, shift.end_at);
  const registeredCount = Number(
    firstValue(shift.registered_count, shift.registeredCount, shift.claimed_count, shift.assigned_count, 0),
  );
  const remainingValue = firstValue(
    shift.remaining_count,
    shift.remaining_slots,
    shift.available_count,
    shift.available_slots,
    shift.open_slots,
  );
  const neededValue = firstValue(
    shift.needed_count,
    shift.neededCount,
    shift.vacancies,
    shift.staff_needed,
    shift.required_count,
    shift.required_staff,
    1,
  );
  const neededCount = Number(neededValue);
  const remainingCount = remainingValue === undefined
    ? Math.max(neededCount - registeredCount, 0)
    : Number(remainingValue);
  const rawStatus = String(firstValue(shift.status, "open")).toLowerCase();
  const isOpen = !["closed", "filled", "cancelled", "canceled", "đã đủ người", "đã đóng"].includes(rawStatus);
  const bonus = firstValue(
    shift.bonus,
    shift.incentive,
    shift.incentive_amount,
    shift.bonus_amount,
    shift.reward,
    0,
  );

  return {
    id: firstValue(shift.id, shift.open_shift_id, shift.shift_id),
    date,
    shiftName: firstValue(shift.shift_name, shift.shiftName, shift.name, shift.shift?.name, "Ca làm việc"),
    startTime: formatClock(start),
    endTime: formatClock(end),
    roleTag: firstValue(shift.role_tag, shift.roleTag, shift.role?.name, shift.required_role?.name, "Chưa xác định"),
    neededCount: Number.isFinite(neededCount) ? neededCount : 0,
    registeredCount: Number.isFinite(registeredCount) ? registeredCount : 0,
    remainingCount: Number.isFinite(remainingCount) ? remainingCount : 0,
    bonus,
    rawStatus,
    isOpen,
    version: firstValue(shift.version, shift.lock_version),
  };
}

function getErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 409) return "Ca này đã có người nhận. Danh sách ca đã được cập nhật.";

  const data = error?.response?.data;
  const validationErrors = data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors).flat().find(Boolean);
    if (firstError) return String(firstError);
  }

  return data?.message || data?.error || error?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
}

export default function OpenShiftPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadShifts = useCallback(async ({ silent = false, keepError = false } = {}) => {
    if (!silent) setLoading(true);
    if (!keepError) setErrorMessage("");

    try {
      const response = await getOpenShifts({ status: "open" });
      setShifts(extractShifts(response).map(normalizeShift));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  const handleSelectShift = (shift) => {
    setSuccessMessage("");
    setErrorMessage("");
    setSelectedShift(shift);
  };

  const handleAcceptShift = async () => {
    if (!selectedShift?.id || submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await acceptOpenShift(selectedShift.id, {});
      setSelectedShift(null);
      setSuccessMessage("Nhận ca thành công.");
      await loadShifts({ silent: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      if (error?.response?.status === 409) {
        setSelectedShift(null);
        await loadShifts({ silent: true, keepError: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const employeeName = user?.name || user?.full_name || "Nhân viên";

  return (
    <div className="mx-auto max-w-[1500px] pt-1">
      <header className="mb-7 pr-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Ca trực mở</h1>
        <p className="mt-1 text-sm text-slate-500">Xem và đăng ký các ca đang cần thêm nhân viên.</p>
      </header>

      {errorMessage && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => loadShifts()}
            className="inline-flex shrink-0 items-center gap-1 font-medium hover:text-red-900"
          >
            <RefreshCw className="h-4 w-4" /> Thử lại
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <section className="min-h-[310px] rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="text-xs font-normal text-slate-500">
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Ngày</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Ca</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Thời gian</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Vai trò</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Cần thêm</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Đã đăng ký</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Trạng thái</th>
                <th className="border-b border-slate-200 px-2 py-3 font-normal">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="h-52 text-center text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" /> Đang tải ca trực mở...
                    </span>
                  </td>
                </tr>
              ) : shifts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-52 text-center text-sm text-slate-500">
                    Hiện chưa có ca nào cần thêm nhân viên.
                  </td>
                </tr>
              ) : (
                shifts.map((shift, index) => {
                  const canRegister = shift.isOpen && shift.remainingCount > 0 && shift.id != null;
                  const isSelected = selectedShift?.id === shift.id;

                  return (
                    <tr key={shift.id ?? `${shift.date}-${index}`} className="text-sm text-slate-700">
                      <td className="border-b border-slate-100 px-2 py-4 font-medium text-slate-800">
                        {formatShortDate(shift.date)}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-4">{shift.shiftName}</td>
                      <td className="border-b border-slate-100 px-2 py-4">
                        {shift.startTime}–{shift.endTime}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-4">{shift.roleTag}</td>
                      <td className="border-b border-slate-100 px-2 py-4">{shift.neededCount}</td>
                      <td className="border-b border-slate-100 px-2 py-4">{shift.registeredCount}</td>
                      <td className="border-b border-slate-100 px-2 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          canRegister ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                        }`}>
                          {canRegister ? "Đang mở" : "Đã đủ người"}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-2 py-3">
                        <button
                          type="button"
                          onClick={() => handleSelectShift(shift)}
                          disabled={!canRegister || submitting}
                          className={`min-w-[96px] rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-300 ${
                            isSelected ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {canRegister ? "Đăng ký" : "Đã đủ người"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedShift && (
        <section
          className="ml-auto mt-5 max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="open-shift-confirm-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="open-shift-confirm-title" className="text-lg font-semibold text-slate-900">
                Đăng ký ca
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {formatLongDate(selectedShift.date)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedShift(null)}
              aria-label="Đóng xác nhận"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-sm text-slate-500">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Clock3 className="h-4 w-4" />
              <span>{selectedShift.shiftName}: {selectedShift.startTime}–{selectedShift.endTime}</span>
              <span aria-hidden="true">•</span>
              <span>Vai trò: {selectedShift.roleTag}</span>
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cần thêm: {selectedShift.neededCount} · Đã đăng ký: {selectedShift.registeredCount}
            </p>
            <p className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4" />
              Thưởng khuyến khích: <span className="font-medium text-slate-700">{formatMoney(selectedShift.bonus)}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              {employeeName} · {selectedShift.roleTag}
            </p>
          </div>

          <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setSelectedShift(null)}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAcceptShift}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {submitting ? "Đang gửi..." : "Xác nhận đăng ký"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
