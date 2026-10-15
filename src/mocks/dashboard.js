// Dữ liệu giả cho màn Tổng quan (FR10). Khi có Backend thì bỏ file này.
export const mockDashboard = {
  weekLabel: "22/09/2026 – 28/09/2026",
  stats: {
    totalEmployees: 28,
    newEmployees: 2,
    availabilityRegistered: 26,
    understaffedShifts: 2,
    attendanceRate: 95,
  },
  // 7 phần tử = Thứ 2 ... CN; null = không có ca
  schedule: [
    { employee: "Nguyễn Văn A", shifts: ["Sáng", "Sáng", "Chiều", "Sáng", null, "Tối", null] },
    { employee: "Trần Thị Bích", shifts: ["Sáng", "Chiều", "Chiều", null, "Sáng", "Sáng", "Tối"] },
    { employee: "Lê Minh Cường", shifts: ["Chiều", "Sáng", null, "Sáng", "Chiều", null, "Sáng"] },
    { employee: "Phạm Thị Dung", shifts: [null, "Tối", "Sáng", "Chiều", "Sáng", "Chiều", null] },
  ],
  shiftsPerDay: [
    { day: "T2", shifts: 12 },
    { day: "T3", shifts: 11 },
    { day: "T4", shifts: 12 },
    { day: "T5", shifts: 10 },
    { day: "T6", shifts: 13 },
    { day: "T7", shifts: 15 },
    { day: "CN", shifts: 14 },
  ],
  hoursPerEmployee: [
    { name: "Nguyễn Văn A", hours: 32 },
    { name: "Trần Thị Bích", hours: 36 },
    { name: "Lê Minh Cường", hours: 28 },
    { name: "Phạm Thị Dung", hours: 30 },
  ],
  attendance: [
    { name: "Hợp lệ", value: 171 },
    { name: "Trễ", value: 12 },
    { name: "Ngoài khu vực", value: 3 },
  ],
  understaffed: [
    { id: 1, date: "26/09/2026", shift: "Ca tối", required: 4, assigned: 3, missing: 1 },
    { id: 2, date: "27/09/2026", shift: "Ca sáng", required: 5, assigned: 4, missing: 1 },
  ],
};
// ==========================================
// DỮ LIỆU GIẢ LẬP (MOCK DATA) CHO TRANG EMPLOYEES
// (Dán nối tiếp vào cuối file src/mocks/dashboard.js)
// ==========================================

export const mockProfile = {
  id: "EMP-001",
  fullName: "Nguyễn Văn An",
  email: "nguyenvanan@smartschedule.vn",
  phone: "0901234567",
  role: "Nhân viên Pha chế (Barista)",
  department: "Quầy Pha Chế - Cơ sở Quận 1",
  joinDate: "2025-03-15",
  status: "Đang làm việc",
  hourlyRate: 35000,
  maxHoursPerWeek: 40,
  avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=2563eb&color=fff",
};

export const mockMySchedules = [
  {
    id: "SCH-101",
    date: "2026-10-12",
    dayOfWeek: "Thứ Hai",
    shiftName: "Ca Sáng",
    time: "07:00 - 12:00",
    location: "Cơ sở Quận 1 - Khu A",
    role: "Pha chế chính",
    status: "COMPLETED",
    note: "Kiểm kê nguyên liệu đầu tuần",
  },
  {
    id: "SCH-102",
    date: "2026-10-14",
    dayOfWeek: "Thứ Tư",
    shiftName: "Ca Chiều",
    time: "12:00 - 17:00",
    location: "Cơ sở Quận 1 - Khu A",
    role: "Thu ngân",
    status: "COMPLETED",
    note: "Hỗ trợ đào tạo nhân viên mới",
  },
  {
    id: "SCH-103",
    date: "2026-10-16",
    dayOfWeek: "Thứ Sáu",
    shiftName: "Ca Sáng",
    time: "07:00 - 12:00",
    location: "Cơ sở Quận 1 - Khu B",
    role: "Pha chế chính",
    status: "UPCOMING",
    note: "Ca tiêu chuẩn",
  },
  {
    id: "SCH-104",
    date: "2026-10-17",
    dayOfWeek: "Thứ Bảy",
    shiftName: "Ca Tối",
    time: "17:00 - 22:00",
    location: "Cơ sở Quận 1 - Khu A",
    role: "Pha chế chính",
    status: "UPCOMING",
    note: "Cuối tuần đông khách",
  },
];

export const mockOpenShifts = [
  {
    id: "OS-201",
    date: "2026-10-18",
    dayOfWeek: "Chủ Nhật",
    shiftName: "Ca Chiều",
    time: "12:00 - 17:00",
    role: "Phục vụ / Pha chế",
    location: "Cơ sở Quận 1",
    slotsAvailable: 2,
    bonus: "+15% phụ cấp",
    status: "OPEN",
    registered: false,
  },
  {
    id: "OS-202",
    date: "2026-10-19",
    dayOfWeek: "Thứ Hai",
    shiftName: "Ca Tối",
    time: "17:00 - 22:00",
    role: "Thu ngân",
    location: "Cơ sở Quận 1",
    slotsAvailable: 1,
    bonus: "Tiêu chuẩn",
    status: "OPEN",
    registered: false,
  },
  {
    id: "OS-203",
    date: "2026-10-20",
    dayOfWeek: "Thứ Ba",
    shiftName: "Ca Sáng",
    time: "07:00 - 12:00",
    role: "Pha chế chính",
    location: "Cơ sở Quận 1",
    slotsAvailable: 1,
    bonus: "+10% phụ cấp",
    status: "REGISTERED",
    registered: true,
  },
];

export const mockShiftExchanges = [
  {
    id: "EX-301",
    currentShift: "Ca Sáng (07:00 - 12:00) - 2026-10-16",
    targetShift: "Ca Chiều (12:00 - 17:00) - 2026-10-16",
    targetEmployee: "Trần Thị Bình",
    reason: "Bận lịch thi học kỳ tại trường",
    createdAt: "2026-10-13",
    status: "PENDING",
  },
  {
    id: "EX-302",
    currentShift: "Ca Tối (17:00 - 22:00) - 2026-10-10",
    targetShift: "Ca Sáng (07:00 - 12:00) - 2026-10-11",
    targetEmployee: "Lê Minh Hoàng",
    reason: "Có việc gia đình đột xuất",
    createdAt: "2026-10-08",
    status: "APPROVED",
  },
  {
    id: "EX-303",
    currentShift: "Ca Chiều (12:00 - 17:00) - 2026-10-05",
    targetShift: "Ca Tối (17:00 - 22:00) - 2026-10-05",
    targetEmployee: "Phạm Quốc Bảo",
    reason: "Đổi ca cá nhân",
    createdAt: "2026-10-03",
    status: "REJECTED",
  },
];

export const mockLeaveRequests = [
  {
    id: "LV-401",
    leaveType: "Nghỉ phép năm",
    startDate: "2026-10-22",
    endDate: "2026-10-23",
    shiftName: "Toàn thời gian (2 ngày)",
    reason: "Về quê có việc gia đình",
    createdAt: "2026-10-14",
    status: "PENDING",
  },
  {
    id: "LV-402",
    leaveType: "Nghỉ ốm",
    startDate: "2026-10-02",
    endDate: "2026-10-02",
    shiftName: "Ca Sáng (07:00 - 12:00)",
    reason: "Khám sức khỏe định kỳ",
    createdAt: "2026-10-01",
    status: "APPROVED",
  },
  {
    id: "LV-403",
    leaveType: "Nghỉ việc riêng",
    startDate: "2026-09-25",
    endDate: "2026-09-25",
    shiftName: "Ca Tối (17:00 - 22:00)",
    reason: "Bận lịch cá nhân",
    createdAt: "2026-09-24",
    status: "REJECTED",
  },
];

export const mockAvailability = [
  { id: "AV-1", day: "Thứ Hai", morning: true, afternoon: true, evening: false, note: "Rảnh sáng và chiều" },
  { id: "AV-2", day: "Thứ Ba", morning: false, afternoon: true, evening: true, note: "Bận học sáng" },
  { id: "AV-3", day: "Thứ Tư", morning: true, afternoon: true, evening: false, note: "" },
  { id: "AV-4", day: "Thứ Năm", morning: false, afternoon: true, evening: true, note: "Bận học sáng" },
  { id: "AV-5", day: "Thứ Sáu", morning: true, afternoon: false, evening: true, note: "" },
  { id: "AV-6", day: "Thứ Bảy", morning: true, afternoon: true, evening: true, note: "Có thể tăng ca" },
  { id: "AV-7", day: "Chủ Nhật", morning: false, afternoon: true, evening: true, note: "" },
];

export const mockAttendance = [
  {
    id: "ATT-501",
    date: "2026-10-14",
    shiftName: "Ca Chiều (12:00 - 17:00)",
    checkIn: "11:55",
    checkOut: "17:03",
    totalHours: 5.0,
    status: "ON_TIME",
  },
  {
    id: "ATT-502",
    date: "2026-10-12",
    shiftName: "Ca Sáng (07:00 - 12:00)",
    checkIn: "07:08",
    checkOut: "12:05",
    totalHours: 4.9,
    status: "LATE",
  },
  {
    id: "ATT-503",
    date: "2026-10-10",
    shiftName: "Ca Tối (17:00 - 22:00)",
    checkIn: "16:52",
    checkOut: "22:00",
    totalHours: 5.0,
    status: "ON_TIME",
  },
];
