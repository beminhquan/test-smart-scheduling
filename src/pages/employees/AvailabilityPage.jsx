import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Send,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyAvailability, saveMyAvailability } from "../../services/availabilityService";
import { getShiftConfig } from "../../services/shiftConfigService";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const WEEKDAY_NAMES = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(value) {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, count) {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
}

function getNextWeekStart() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  return toIsoDate(addDays(today, 7 - mondayOffset));
}

function getWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(fromIsoDate(weekStart), index);
    return {
      iso: toIsoDate(date),
      date,
      weekday: WEEKDAY_NAMES[date.getDay()],
      shortWeekday: date.getDay() === 0 ? "CN" : `T${date.getDay() + 1}`,
      shortDate: `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`,
    };
  });
}

function formatWeekRange(weekStart) {
  const days = getWeekDays(weekStart);
  const start = days[0].date;
  const end = days[6].date;
  const format = (date) => `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  return `${format(start)} – ${format(end)}`;
}

function getFallbackDeadline(weekStart) {
  const deadline = fromIsoDate(weekStart);
  deadline.setDate(deadline.getDate() - 3); // Thứ Sáu trước tuần đăng ký.
  deadline.setHours(23, 59, 59, 999);
  return deadline.toISOString();
}

function unwrap(payload) {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
}

function getShiftList(config, availability) {
  const candidates = [
    config,
    config?.shift_types,
    config?.shifts,
    config?.shiftTypes,
    config?.data,
    availability?.shift_types,
    availability?.shifts,
  ];
  const list = candidates.find(Array.isArray) ?? [];

  return list.map((shift, index) => {
    const id = shift.id ?? shift.shift_id ?? shift.code ?? `shift-${index + 1}`;
    const name = shift.name ?? shift.shift_name ?? shift.label ?? `Ca ${index + 1}`;
    const start = shift.start_time ?? shift.startTime ?? shift.start_at;
    const end = shift.end_time ?? shift.endTime ?? shift.end_at;
    const timeLabel = start && end ? `${String(start).slice(0, 5)}–${String(end).slice(0, 5)}` : "";
    return { id, name, timeLabel };
  });
}

function emptyMatrix(days, shifts) {
  return Object.fromEntries(
    days.map((day) => [day.iso, Object.fromEntries(shifts.map((shift) => [shift.id, false]))]),
  );
}

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return ["1", "true", "available", "free", "rảnh"].includes(String(value).toLowerCase());
}

function normalizeMatrix(availability, days, shifts) {
  const matrix = emptyMatrix(days, shifts);
  const rows = availability?.days ?? availability?.availability ?? availability?.entries ?? [];

  if (Array.isArray(rows)) {
    rows.forEach((row) => {
      const date = String(row.date ?? row.day ?? "").slice(0, 10);
      if (!matrix[date]) return;

      if (Array.isArray(row.shifts)) {
        row.shifts.forEach((entry) => {
          const shiftId = String(entry.shift_id ?? entry.shiftId ?? entry.id ?? "");
          if (shiftId in matrix[date]) {
            matrix[date][shiftId] = toBoolean(entry.is_available ?? entry.available ?? entry.value);
          }
        });
      } else {
        const shiftId = String(row.shift_id ?? row.shiftId ?? "");
        if (shiftId in matrix[date]) {
          matrix[date][shiftId] = toBoolean(row.is_available ?? row.available ?? row.value);
        }
      }
    });
  } else if (rows && typeof rows === "object") {
    Object.entries(rows).forEach(([date, dayValues]) => {
      if (!matrix[date] || !dayValues || typeof dayValues !== "object") return;
      Object.entries(dayValues).forEach(([shiftId, value]) => {
        if (shiftId in matrix[date]) matrix[date][shiftId] = toBoolean(value);
      });
    });
  }

  return matrix;
}

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRemaining(milliseconds) {
  if (!Number.isFinite(milliseconds)) return "Chưa cấu hình hạn chót";
  if (milliseconds <= 0) return "Đã quá hạn đăng ký";
  const totalMinutes = Math.floor(milliseconds / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
  if (hours > 0) return `Còn ${hours} giờ ${minutes} phút`;
  return `Còn ${minutes} phút`;
}

function availabilityDeadlineIsValid(value) {
  return Boolean(value) && Number.isFinite(new Date(value).getTime());
}

function getErrorMessage(error) {
  const responseData = error?.response?.data;
  const validationErrors = responseData?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors).flat().find(Boolean);
    if (firstError) return String(firstError);
  }
  return responseData?.message || responseData?.error || error?.message || "Không thể tải dữ liệu. Vui lòng thử lại.";
}

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(getNextWeekStart);
  const [shifts, setShifts] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [savedMatrix, setSavedMatrix] = useState({});
  const [deadlineAt, setDeadlineAt] = useState(null);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [now, setNow] = useState(Date.now());

  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const isDirty = useMemo(() => JSON.stringify(matrix) !== JSON.stringify(savedMatrix), [matrix, savedMatrix]);
  const configuredDeadline = availabilityDeadlineIsValid(deadlineAt);
  const deadlineTimestamp = configuredDeadline ? new Date(deadlineAt).getTime() : Number.NaN;
  const remainingTime = deadlineTimestamp - now;
  const isExpired = remainingTime <= 0;
  const readOnly = isExpired || loading || submitting;

  const loadWeek = useCallback(async (targetWeek) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setDeadlineAt(null);

    try {
      const params = { week_start: targetWeek };
      if (USE_MOCK) params.user_id = user?.id;

      const [availabilityResponse, configResponse] = await Promise.all([
        getMyAvailability(params),
        USE_MOCK ? Promise.resolve(null) : getShiftConfig({ week_start: targetWeek }),
      ]);
      const availability = unwrap(availabilityResponse) ?? {};
      const config = unwrap(configResponse) ?? {};
      const shiftList = getShiftList(config, availability);
      const targetDays = getWeekDays(targetWeek);
      const nextMatrix = normalizeMatrix(availability, targetDays, shiftList);

      setShifts(shiftList);
      setMatrix(nextMatrix);
      setSavedMatrix(nextMatrix);
      setSubmittedAt(availability.submitted_at ?? availability.submittedAt ?? null);
      setDeadlineAt(
        availability.deadline_at ??
          availability.deadlineAt ??
          availability.registration_deadline_at ??
          config.deadline_at ??
          config.deadline ??
          config.registration_deadline ??
          (USE_MOCK ? getFallbackDeadline(targetWeek) : null),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setShifts([]);
      setMatrix({});
      setSavedMatrix({});
      setSubmittedAt(null);
      setDeadlineAt(USE_MOCK ? getFallbackDeadline(targetWeek) : null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadWeek(weekStart);
  }, [loadWeek, weekStart]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const changeWeek = (offset) => {
    setWeekStart(toIsoDate(addDays(fromIsoDate(weekStart), offset * 7)));
  };

  const toggleCell = (date, shiftId) => {
    if (readOnly) return;
    setSuccessMessage("");
    setMatrix((current) => ({
      ...current,
      [date]: { ...current[date], [shiftId]: !current[date]?.[shiftId] },
    }));
  };

  const setAllAvailability = (available) => {
    if (readOnly) return;
    setSuccessMessage("");
    setMatrix(Object.fromEntries(
      days.map((day) => [day.iso, Object.fromEntries(shifts.map((shift) => [shift.id, available]))]),
    ));
  };

  const submitAvailability = async () => {
    if (readOnly || !configuredDeadline || shifts.length === 0) return;
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      week_start: weekStart,
      days: days.map((day) => ({
        date: day.iso,
        shifts: shifts.map((shift) => ({
          shift_id: shift.id,
          is_available: Boolean(matrix[day.iso]?.[shift.id]),
        })),
      })),
    };
    if (USE_MOCK) payload.user_id = user?.id;

    try {
      const response = unwrap(await saveMyAvailability(payload)) ?? {};
      const sentAt = response.submitted_at ?? response.submittedAt ?? new Date().toISOString();
      setSubmittedAt(sentAt);
      setSavedMatrix(matrix);
      setSuccessMessage("Đã gửi lịch rảnh thành công");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const statusText = isExpired
    ? "Đã quá hạn đăng ký"
    : isDirty
      ? submittedAt ? "Có thay đổi chưa gửi" : "Chưa gửi"
      : submittedAt ? `Đã gửi lúc ${formatDateTime(submittedAt)}` : "Chưa gửi";

  return (
    <div className="mx-auto max-w-[1500px] pt-1">
      <header className="mb-6 pr-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Đăng ký lịch rảnh</h1>
        <p className="mt-1 text-sm text-slate-500">
          Chọn các ca bạn có thể làm trong tuần đang xem để Manager xếp lịch phù hợp.
        </p>
      </header>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <section className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Tuần đăng ký</p>
            <p className="mt-0.5 font-semibold text-slate-900">{formatWeekRange(weekStart)}</p>
            <p className="mt-1 text-xs text-slate-500">Mặc định là tuần kế tiếp</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className={`min-w-0 text-sm ${isExpired ? "text-red-600" : "text-slate-600"}`}>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock3 className="h-4 w-4 shrink-0" />
              <span>Hạn đăng ký</span>
            </div>
            <p className="mt-1 text-xs">
              {configuredDeadline ? `${formatDateTime(deadlineAt)} · ` : ""}{formatRemaining(remainingTime)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => changeWeek(-1)}
              aria-label="Tuần trước"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => changeWeek(1)}
              aria-label="Tuần sau"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Thời gian có thể làm</h2>
            <p className="mt-1 text-xs text-slate-500">Ô màu xanh là rảnh, ô màu xám là bận.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`mr-1 rounded-full px-3 py-1 text-xs font-medium ${isExpired ? "bg-red-50 text-red-700" : submittedAt && !isDirty ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {statusText}
            </span>
            <button
              type="button"
              onClick={() => setAllAvailability(true)}
              disabled={readOnly || shifts.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" /> Chọn tất cả rảnh
            </button>
            <button
              type="button"
              onClick={() => setAllAvailability(false)}
              disabled={readOnly || shifts.length === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Xóa chọn
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin" /> Đang tải lịch tuần...
          </div>
        ) : shifts.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-4 text-center text-sm text-slate-500">
            Manager chưa cấu hình danh mục ca cho tuần này.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] border-collapse text-center">
                <thead>
                  <tr>
                    <th className="w-40 border-b border-slate-200 px-3 py-3 text-left text-xs font-medium text-slate-500">Ca làm việc</th>
                    {days.map((day) => (
                      <th key={day.iso} className="border-b border-slate-200 px-2 py-3 text-xs font-medium text-slate-500">
                        <span className="block text-slate-700">{day.weekday}</span>
                        <span className="mt-1 block font-normal">{day.shortDate}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr key={shift.id}>
                      <th className="border-b border-slate-100 px-3 py-3 text-left font-medium text-slate-800">
                        <span className="block text-sm">{shift.name}</span>
                        {shift.timeLabel && <span className="mt-1 block text-xs font-normal text-slate-500">{shift.timeLabel}</span>}
                      </th>
                      {days.map((day) => {
                        const available = Boolean(matrix[day.iso]?.[shift.id]);
                        return (
                          <td key={day.iso} className="border-b border-slate-100 px-2 py-2">
                            <button
                              type="button"
                              onClick={() => toggleCell(day.iso, shift.id)}
                              disabled={readOnly}
                              aria-pressed={available}
                              aria-label={`${day.weekday} ${day.shortDate}, ${shift.name}: ${available ? "Rảnh" : "Bận"}`}
                              className={`w-full rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                                available
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                              }`}
                            >
                              {available ? "Rảnh" : "Bận"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {days.map((day) => (
                <article key={day.iso} className="rounded-xl border border-slate-200 p-3">
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">{day.weekday}, {day.shortDate}</h3>
                  <div className="space-y-2">
                    {shifts.map((shift) => {
                      const available = Boolean(matrix[day.iso]?.[shift.id]);
                      return (
                        <div key={shift.id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700">{shift.name}</p>
                            {shift.timeLabel && <p className="text-xs text-slate-500">{shift.timeLabel}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCell(day.iso, shift.id)}
                            disabled={readOnly}
                            aria-pressed={available}
                            className={`min-w-24 rounded-lg border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed ${
                              available
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }`}
                          >
                            {available ? "Rảnh" : "Bận"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!configuredDeadline && !loading && !USE_MOCK && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            Manager chưa cấu hình hạn chót đăng ký cho tuần này.
          </p>
        )}

        {isExpired && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Đã quá hạn đăng ký. Lịch rảnh tuần này chỉ xem được.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            Các ô không chọn được lưu là <span className="font-medium text-slate-700">Bận</span> cho đủ 7 ngày.
          </p>
          <button
            type="button"
            onClick={submitAvailability}
            disabled={readOnly || !configuredDeadline || shifts.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isExpired ? "Đã quá hạn đăng ký" : !configuredDeadline ? "Chưa có hạn đăng ký" : submitting ? "Đang gửi..." : "Gửi đăng ký"}
          </button>
        </div>
      </section>
    </div>
  );
}
