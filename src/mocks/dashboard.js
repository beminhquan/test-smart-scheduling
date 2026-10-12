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
