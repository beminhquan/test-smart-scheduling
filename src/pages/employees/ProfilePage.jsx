import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../../services/employeeService";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

function unwrapProfile(payload) {
  return payload?.profile ?? payload?.user ?? payload?.data ?? payload ?? {};
}

function displayText(value, fallback = "Chưa cập nhật") {
  if (Array.isArray(value)) {
    const values = value.map((item) => displayText(item, "")).filter(Boolean);
    return values.length ? values.join(", ") : fallback;
  }
  if (value && typeof value === "object") {
    return value.name ?? value.label ?? value.title ?? fallback;
  }
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function normalizeProfile(payload, user, fallback = {}) {
  const source = unwrapProfile(payload);
  const avatar = source.avatar_url ?? source.avatarUrl ?? source.avatar ?? fallback.avatarUrl ?? "";
  return {
    id: source.id ?? fallback.id ?? user?.id,
    fullName: displayText(source.full_name ?? source.fullName ?? source.name ?? fallback.fullName ?? user?.name, "Nhân viên"),
    email: displayText(source.email ?? fallback.email ?? user?.email, "Chưa cập nhật"),
    phone: displayText(source.phone ?? source.phone_number ?? source.mobile ?? fallback.phone, ""),
    address: displayText(source.address ?? source.home_address ?? fallback.address, ""),
    contractType: displayText(source.contract_type ?? source.contractType ?? source.contract?.name ?? fallback.contractType),
    roleTag: displayText(source.role_tag ?? source.roleTag ?? source.role_tags ?? source.role?.name ?? fallback.roleTag),
    avatarUrl: typeof avatar === "string" ? avatar : avatar?.url ?? avatar?.path ?? "",
  };
}

function validateVietnamesePhone(value) {
  const normalized = value.replace(/[\s().-]/g, "");
  const isValid = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/.test(normalized);
  return isValid ? normalized : null;
}

function formatFileSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 403) return "Bạn không có quyền cập nhật hồ sơ này.";

  const responseData = error?.response?.data;
  const validationErrors = responseData?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors).flat().find(Boolean);
    if (firstError) return String(firstError);
  }
  return responseData?.message || responseData?.error || error?.message || "Không thể cập nhật hồ sơ. Vui lòng thử lại.";
}

export default function ProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await getMyProfile(user);
      const nextProfile = normalizeProfile(response, user);
      setProfile(nextProfile);
      setPhone(nextProfile.phone);
      setAddress(nextProfile.address);
      setAvatarPreview(nextProfile.avatarUrl);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => () => {
    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const beginEditing = () => {
    setPhone(profile.phone);
    setAddress(profile.address);
    setAvatarFile(null);
    setAvatarPreview(profile.avatarUrl);
    setErrorMessage("");
    setSuccessMessage("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setPhone(profile.phone);
    setAddress(profile.address);
    setAvatarFile(null);
    setAvatarPreview(profile.avatarUrl);
    setErrorMessage("");
    setEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrorMessage("Ảnh đại diện phải có định dạng JPG hoặc PNG.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setErrorMessage("Ảnh đại diện không được lớn hơn 2 MB.");
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedPhone = validateVietnamesePhone(phone.trim());
    if (!normalizedPhone) {
      setErrorMessage("Vui lòng nhập số điện thoại hợp lệ, ví dụ 0912345678.");
      return;
    }

    setSaving(true);
    try {
      const updates = {
        phone: normalizedPhone,
        address: address.trim(),
        avatar: avatarFile,
      };
      const response = await updateMyProfile(updates, user);
      const fallback = {
        ...profile,
        phone: normalizedPhone,
        address: updates.address,
        avatarUrl: avatarFile ? avatarPreview : profile.avatarUrl,
      };
      const updatedProfile = normalizeProfile(response, user, fallback);
      setProfile(updatedProfile);
      setPhone(updatedProfile.phone);
      setAddress(updatedProfile.address);
      setAvatarPreview(updatedProfile.avatarUrl);
      setAvatarFile(null);
      setEditing(false);
      setSuccessMessage("Cập nhật thành công");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const initials = (profile?.fullName || "NV")
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl pt-1">
      <header className="mb-6 pr-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Hồ sơ cá nhân</h1>
        <p className="mt-1 text-sm text-slate-500">Xem và cập nhật thông tin liên hệ của bạn.</p>
      </header>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-2 rounded-2xl bg-white text-sm text-slate-500 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin" /> Đang tải hồ sơ...
        </div>
      ) : !profile ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-slate-600">Không thể tải hồ sơ của bạn.</p>
          <button type="button" onClick={loadProfile} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Thử lại
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-blue-700 ring-4 ring-blue-50/70">
              {avatarPreview ? (
                <img src={avatarPreview} alt={`Ảnh đại diện ${profile.fullName}`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold">{initials || <UserRound className="h-10 w-10" />}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Nhân viên</p>
              <h2 className="mt-1 truncate text-xl font-semibold text-slate-900">{profile.fullName}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{profile.email}</span>
              </p>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={beginEditing}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:self-center"
              >
                <Pencil className="h-4 w-4" /> Chỉnh sửa
              </button>
            )}
          </div>

          <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-2">
            <section>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Thông tin cá nhân</h3>
              <div className="space-y-4">
                <ReadOnlyField icon={UserRound} label="Họ và tên" value={profile.fullName} />
                <ReadOnlyField icon={Mail} label="Email" value={profile.email} />
                <ReadOnlyField icon={BriefcaseBusiness} label="Loại hợp đồng" value={profile.contractType} />
                <ReadOnlyField icon={BadgeCheck} label="Role_Tag" value={profile.roleTag} />
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Thông tin liên hệ</h3>
              <div className="space-y-4">
                {editing ? (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</span>
                      <span className="relative block">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="0912345678"
                          className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ</span>
                      <span className="relative block">
                        <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <textarea
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          rows={3}
                          placeholder="Nhập địa chỉ của bạn"
                          className="w-full resize-y rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </span>
                    </label>
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Ảnh đại diện</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleAvatarChange}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Camera className="h-4 w-4" /> Chọn ảnh JPG/PNG
                      </button>
                      <p className="mt-1.5 text-xs text-slate-500">
                        Tối đa 2 MB{avatarFile ? ` · Đã chọn ${avatarFile.name} (${formatFileSize(avatarFile.size)})` : ""}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <ReadOnlyField icon={Phone} label="Số điện thoại" value={profile.phone} />
                    <ReadOnlyField icon={MapPin} label="Địa chỉ" value={profile.address} multiline />
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs text-slate-500">Ảnh đại diện</p>
                      <p className="mt-1 text-sm text-slate-700">{profile.avatarUrl ? "Đã cập nhật" : "Chưa có ảnh đại diện"}</p>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          {editing && (
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

function ReadOnlyField({ icon: Icon, label, value, multiline = false }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <div className="min-w-0">
          <p className="text-xs text-slate-500">{label}</p>
          <p className={`mt-1 text-sm font-medium text-slate-800 ${multiline ? "whitespace-pre-wrap" : "break-words"}`}>
            {value || "Chưa cập nhật"}
          </p>
        </div>
      </div>
    </div>
  );
}
