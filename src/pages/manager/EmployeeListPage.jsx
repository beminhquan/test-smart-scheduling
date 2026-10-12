import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

const initialEmployees = [
  {
    id: "NV001",
    name: "Nguyễn Văn An",
    phone: "0905123456",
    birthDate: "2002-05-12",
    role: "Phục vụ",
    contract: "Toàn thời gian",
    status: "Đang làm việc",
    account: {
      email: "nguyenvanan@gmail.com",
      password: "12345678",
      status: "active",
    },
  },
  {
    id: "NV002",
    name: "Trần Thị Bích",
    phone: "0905123457",
    birthDate: "2001-08-20",
    role: "Pha chế",
    contract: "Toàn thời gian",
    status: "Đang làm việc",
    account: {
      email: "tranthibich@gmail.com",
      password: "12345678",
      status: "active",
    },
  },
  {
    id: "NV003",
    name: "Lê Minh Cường",
    phone: "0905123458",
    birthDate: "2003-01-15",
    role: "Phục vụ",
    contract: "Bán thời gian",
    status: "Đang làm việc",
    account: null,
  },
  {
    id: "NV004",
    name: "Phạm Thị Dung",
    phone: "0905123459",
    birthDate: "2002-11-03",
    role: "Pha chế",
    contract: "Bán thời gian",
    status: "Nghỉ phép",
    account: {
      email: "phamthidung@gmail.com",
      password: "12345678",
      status: "active",
    },
  },
  {
    id: "NV005",
    name: "Hoàng Văn Nam",
    phone: "0905123460",
    birthDate: "2001-06-25",
    role: "Phục vụ",
    contract: "Bán thời gian",
    status: "Đang làm việc",
    account: null,
  },
];

const emptyForm = {
  id: "",
  name: "",
  phone: "",
  birthDate: "",
  contract: "Bán thời gian",
  role: "Phục vụ",
  createAccount: true,
  email: "",
  password: "",
  changePasswordFirstLogin: true,
};

function PasswordInput(props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`${props.className || ""} pr-10`}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
      >
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState(initialEmployees);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [createdAccount, setCreatedAccount] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // =========================
  // LỌC NHÂN VIÊN
  // =========================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const keyword = search.toLowerCase().trim();

      const matchSearch =
        !keyword ||
        employee.name.toLowerCase().includes(keyword) ||
        employee.id.toLowerCase().includes(keyword);

      const matchRole =
        !roleFilter || employee.role === roleFilter;

      const matchStatus =
        !statusFilter || employee.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [employees, search, roleFilter, statusFilter]);

  // =========================
  // THAY ĐỔI FORM
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // MỞ FORM THÊM NHÂN VIÊN
  // =========================

  const openAddEmployee = () => {
    setForm({
      ...emptyForm,
      id: `NV${String(employees.length + 1).padStart(3, "0")}`,
      password: "",
    });

    setShowAddModal(true);
  };

  // =========================
  // TẠO NHÂN VIÊN
  // =========================

  const handleCreateEmployee = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập họ và tên.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    if (form.createAccount && !form.email.trim()) {
      alert("Vui lòng nhập email đăng nhập.");
      return;
    }

    if (form.createAccount && !form.password.trim()) {
      alert("Vui lòng nhập mật khẩu.");
      return;
    }

    const newEmployee = {
      id: form.id,
      name: form.name,
      phone: form.phone,
      birthDate: form.birthDate,
      role: form.role,
      contract: form.contract,
      status: "Đang làm việc",
      account: form.createAccount
        ? {
            email: form.email,
            password: form.password,
            status: "active",
          }
        : null,
    };

    setEmployees((prev) => [...prev, newEmployee]);

    if (form.createAccount) {
      setCreatedAccount({
        employeeName: form.name,
        email: form.email,
      });

      setShowAddModal(false);
      setShowSuccessModal(true);
    } else {
      setShowAddModal(false);
    }

    setForm(emptyForm);
  };

  // =========================
  // SỬA NHÂN VIÊN
  // =========================

  const openEditEmployee = (employee) => {
    setSelectedEmployee(employee);

    setForm({
      ...emptyForm,
      id: employee.id,
      name: employee.name,
      phone: employee.phone,
      birthDate: employee.birthDate,
      contract: employee.contract,
      role: employee.role,
      email: employee.account?.email || "",
      password: employee.account?.password || "",
    });

    setShowEditModal(true);
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập họ và tên.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    const updatedEmployee = {
      ...selectedEmployee,
      name: form.name,
      phone: form.phone,
      birthDate: form.birthDate,
      contract: form.contract,
      role: form.role,
      account: selectedEmployee.account
        ? {
            ...selectedEmployee.account,
            email: form.email,
            password: form.password,
          }
        : null,
    };

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === selectedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setShowEditModal(false);
    setForm(emptyForm);
    setSelectedEmployee(null);
  };

  // =========================
  // KHÓA / MỞ KHÓA TÀI KHOẢN
  // =========================

  const handleToggleAccount = (employee) => {
    if (!employee.account) {
      alert("Nhân viên chưa được cấp tài khoản.");
      return;
    }

    const isLocked =
      employee.account.status === "locked";

    const newStatus = isLocked
      ? "active"
      : "locked";

    setEmployees((prev) =>
      prev.map((item) =>
        item.id === employee.id
          ? {
              ...item,
              account: {
                ...item.account,
                status: newStatus,
              },
            }
          : item
      )
    );
  };

  // =========================
  // XÓA NHÂN VIÊN
  // =========================

  const handleDeleteEmployee = (employee) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa nhân viên ${employee.name}?\n\nDữ liệu lịch sử vẫn được giữ lại.`
    );

    if (!confirmed) {
      return;
    }

    setEmployees((prev) =>
      prev.map((item) =>
        item.id === employee.id
          ? {
              ...item,
              status: "Nghỉ việc",
              account: item.account
                ? {
                    ...item.account,
                    status: "locked",
                  }
                : null,
            }
          : item
      )
    );
  };

  // =========================
  // CẤP TÀI KHOẢN
  // =========================

  const openCreateAccount = (employee) => {
    setSelectedEmployee(employee);

    setForm({
      ...emptyForm,
      email: "",
      password: "",
    });

    setShowAccountModal(true);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      alert("Vui lòng nhập email đăng nhập.");
      return;
    }

    if (!form.password.trim()) {
      alert("Vui lòng nhập mật khẩu.");
      return;
    }

    const updatedEmployee = {
      ...selectedEmployee,
      account: {
        email: form.email,
        password: form.password,
        status: "active",
      },
    };

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === selectedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setCreatedAccount({
      employeeName: selectedEmployee.name,
      email: form.email,
    });

    setShowAccountModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-full bg-[#f5f7fb] p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-[#18233d]">
            Quản lý nhân viên
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Danh sách nhân viên và thông tin phục vụ việc xếp lịch
          </p>

        </div>

        <Button onClick={openAddEmployee}>
          + Thêm nhân viên
        </Button>

      </div>

      {/* ================= FILTER ================= */}

      <div className="rounded-xl bg-white p-4 shadow-sm">

        <div className="mb-5 flex flex-wrap gap-3">

          <div className="flex-1 min-w-[250px]">

            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none transition focus:border-blue-500"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-600 outline-none"
          >
            <option value="">Tất cả vai trò</option>
            <option value="Phục vụ">Phục vụ</option>
            <option value="Pha chế">Pha chế</option>
            <option value="Thu ngân">Thu ngân</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-600 outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>

        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-x-auto">

          <table className="w-full border-collapse text-sm">

            <thead>

              <tr className="border-b border-gray-100 text-left text-gray-500">

                <th className="px-4 py-4 font-medium">
                  Mã NV
                </th>

                <th className="px-4 py-4 font-medium">
                  Họ và tên
                </th>

                <th className="px-4 py-4 font-medium">
                  Vai trò
                </th>

                <th className="px-4 py-4 font-medium">
                  Loại hợp đồng
                </th>

                <th className="px-4 py-4 font-medium">
                  Tài khoản
                </th>

                <th className="px-4 py-4 font-medium">
                  Trạng thái
                </th>

                <th className="px-4 py-4 font-medium">
                  Thao tác
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map((employee) => (

                <tr
                  key={employee.id}
                  className="border-b border-gray-50 transition hover:bg-gray-50"
                >

                  <td className="px-4 py-5 font-medium text-gray-600">
                    {employee.id}
                  </td>

                  <td className="px-4 py-5 text-gray-700">
                    {employee.name}
                  </td>

                  <td className="px-4 py-5 text-gray-600">
                    {employee.role}
                  </td>

                  <td className="px-4 py-5 text-gray-600">
                    {employee.contract}
                  </td>

                  {/* TÀI KHOẢN */}

                  <td className="px-4 py-5">

                    {employee.account ? (

                      <div>

                        <div className="flex items-center gap-2">

                          <span
                            className={`h-2 w-2 rounded-full ${
                              employee.account.status === "locked"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />

                          <span
                            className={`text-sm ${
                              employee.account.status === "locked"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {employee.account.status === "locked"
                              ? "Đã khóa"
                              : "Đã cấp"}
                          </span>

                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          {employee.account.email}
                        </p>

                      </div>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          openCreateAccount(employee)
                        }
                        className="rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                      >
                        Cấp tài khoản
                      </button>

                    )}

                  </td>

                  {/* TRẠNG THÁI */}

                  <td className="px-4 py-5">

                    {employee.status === "Nghỉ phép" ? (

                      <span className="text-orange-500">
                        Nghỉ phép
                      </span>

                    ) : employee.status === "Nghỉ việc" ? (

                      <span className="text-red-500">
                        Nghỉ việc
                      </span>

                    ) : (

                      <span className="text-gray-600">
                        Đang làm việc
                      </span>

                    )}

                  </td>

                  {/* THAO TÁC */}

                  <td className="px-4 py-5">

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditEmployee(employee)
                        }
                        className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Sửa
                      </button>

                      {employee.account && (

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleAccount(employee)
                          }
                          className={
                            employee.account.status === "locked"
                              ? "rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100"
                              : "rounded-md bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-100"
                          }
                        >
                          {employee.account.status === "locked"
                            ? "Mở khóa"
                            : "Khóa"}
                        </button>

                      )}

                      {employee.status !== "Nghỉ việc" && (

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEmployee(employee)
                          }
                          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Xóa
                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-5 flex items-center justify-between text-xs text-gray-400">

          <span>
            Hiển thị 1–{filteredEmployees.length} trong{" "}
            {employees.length} nhân viên
          </span>

          <div className="flex items-center gap-2">

            <button className="px-2 py-1 text-gray-400">
              ‹
            </button>

            <button className="rounded bg-blue-600 px-2.5 py-1 text-white">
              1
            </button>

            <button className="px-2 py-1">
              2
            </button>

            <button className="px-2 py-1">
              3
            </button>

            <button className="px-2 py-1">
              4
            </button>

            <button className="px-2 py-1">
              5
            </button>

            <button className="px-2 py-1 text-gray-400">
              ›
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          MODAL: THÊM NHÂN VIÊN
      ===================================================== */}

      <Modal
        open={showAddModal}
        title="Thêm nhân viên"
        onClose={() => setShowAddModal(false)}
      >

        <form
          onSubmit={handleCreateEmployee}
          className="max-h-[75vh] overflow-y-auto pr-1"
        >

          <div className="mb-5">

            <h4 className="mb-3 text-sm font-semibold text-[#18233d]">
              Thông tin nhân viên
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Mã nhân viên
                </label>

                <input
                  value={form.id}
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Họ và tên *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Số điện thoại *
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0905xxxxxx"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Ngày sinh
                </label>

                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Loại hợp đồng
                </label>

                <select
                  name="contract"
                  value={form.contract}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option>Toàn thời gian</option>
                  <option>Bán thời gian</option>
                </select>

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Vai trò
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option>Phục vụ</option>
                  <option>Pha chế</option>
                  <option>Thu ngân</option>
                </select>

              </div>

            </div>

          </div>

          {/* TÀI KHOẢN */}

          <div className="border-t border-gray-100 pt-5">

            <div className="mb-3">

              <h4 className="text-sm font-semibold text-[#18233d]">
                Tài khoản đăng nhập
              </h4>

              <p className="mt-1 text-xs text-gray-400">
                Manager có thể cấp tài khoản cho nhân viên ngay khi tạo hồ sơ.
              </p>

            </div>

            <label className="mb-4 flex cursor-pointer items-center gap-2">

              <input
                type="checkbox"
                name="createAccount"
                checked={form.createAccount}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">
                Cấp tài khoản cho nhân viên
              </span>

            </label>

            {form.createAccount && (

              <div className="space-y-3">

                <div>

                  <label className="mb-1 block text-xs text-gray-500">
                    Email đăng nhập *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nhanvien@gmail.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="mb-1 block text-xs text-gray-500">
                    Mật khẩu *
                  </label>

                  <PasswordInput
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />

                </div>

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    name="changePasswordFirstLogin"
                    checked={form.changePasswordFirstLogin}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <span className="text-xs text-gray-600">
                    Yêu cầu đổi mật khẩu khi đăng nhập lần đầu
                  </span>

                </label>

              </div>

            )}

          </div>

          <div className="mt-6 flex justify-end gap-2">

            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>

            <Button type="submit">
              Thêm nhân viên
            </Button>

          </div>

        </form>

      </Modal>

      {/* =====================================================
          MODAL: SỬA NHÂN VIÊN
      ===================================================== */}

      <Modal
        open={showEditModal}
        title="Sửa nhân viên"
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
          setForm(emptyForm);
        }}
      >

        <form onSubmit={handleUpdateEmployee}>

          <div className="mb-5">

            <h4 className="mb-3 text-sm font-semibold text-[#18233d]">
              Thông tin nhân viên
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Mã nhân viên
                </label>

                <input
                  value={form.id}
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Họ và tên *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Số điện thoại *
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Ngày sinh
                </label>

                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Loại hợp đồng
                </label>

                <select
                  name="contract"
                  value={form.contract}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option>Toàn thời gian</option>
                  <option>Bán thời gian</option>
                </select>

              </div>

              <div>

                <label className="mb-1 block text-xs text-gray-500">
                  Vai trò
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option>Phục vụ</option>
                  <option>Pha chế</option>
                  <option>Thu ngân</option>
                </select>

              </div>

              {selectedEmployee?.account && (

                <div className="sm:col-span-2">

                  <label className="mb-1 block text-xs text-gray-500">
                    Email đăng nhập
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />

                </div>

              )}

              {selectedEmployee?.account && (

                <div className="sm:col-span-2">

                  <label className="mb-1 block text-xs text-gray-500">
                    Mật khẩu
                  </label>

                  <PasswordInput
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />

                </div>

              )}

            </div>

          </div>

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedEmployee(null);
                setForm(emptyForm);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>

            <Button type="submit">
              Lưu thay đổi
            </Button>

          </div>

        </form>

      </Modal>

      {/* =====================================================
          MODAL: CẤP TÀI KHOẢN
      ===================================================== */}

      <Modal
        open={showAccountModal}
        title="Cấp tài khoản"
        onClose={() => {
          setShowAccountModal(false);
          setSelectedEmployee(null);
          setForm(emptyForm);
        }}
      >

        <form onSubmit={handleCreateAccount}>

          <div className="mb-4 rounded-lg bg-gray-50 p-3">

            <p className="text-xs text-gray-500">
              Nhân viên
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {selectedEmployee?.name}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {selectedEmployee?.id}
            </p>

          </div>

          <div className="mb-4">

            <label className="mb-1 block text-xs text-gray-500">
              Email đăng nhập *
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nhanvien@gmail.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

          </div>

          <div className="mb-4">

            <label className="mb-1 block text-xs text-gray-500">
              Mật khẩu *
            </label>

            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

          </div>

          <label className="mb-5 flex cursor-pointer items-center gap-2">

            <input
              type="checkbox"
              name="changePasswordFirstLogin"
              checked={form.changePasswordFirstLogin}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="text-xs text-gray-600">
              Yêu cầu đổi mật khẩu khi đăng nhập lần đầu
            </span>

          </label>

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={() => {
                setShowAccountModal(false);
                setSelectedEmployee(null);
                setForm(emptyForm);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>

            <Button type="submit">
              Cấp tài khoản
            </Button>

          </div>

        </form>

      </Modal>

      {/* =====================================================
          MODAL: CẤP TÀI KHOẢN THÀNH CÔNG
      ===================================================== */}

      <Modal
        open={showSuccessModal}
        title="Cấp tài khoản thành công"
        onClose={() => setShowSuccessModal(false)}
      >

        <div className="space-y-4">

          <div className="rounded-lg bg-green-50 p-4">

            <p className="font-medium text-green-700">
              ✓ Tài khoản đã được tạo
            </p>

            <p className="mt-1 text-sm text-green-600">
              Hãy cung cấp email và mật khẩu cho nhân viên.
            </p>

          </div>

          <div className="rounded-lg border border-gray-200 p-4">

            <div>

              <p className="text-xs text-gray-400">
                Nhân viên
              </p>

              <p className="font-medium text-gray-800">
                {createdAccount?.employeeName}
              </p>

            </div>

            <div className="mt-3">

              <p className="text-xs text-gray-400">
                Email
              </p>

              <p className="text-sm text-gray-700">
                {createdAccount?.email}
              </p>

            </div>

          </div>

          <div className="flex justify-end">

            <Button
              type="button"
              onClick={() => setShowSuccessModal(false)}
            >
              Đã hiểu
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
}