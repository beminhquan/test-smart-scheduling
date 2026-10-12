// Lịch tuần/tháng dùng chung (lịch làm việc, đăng ký rảnh/bận...).
// TODO: chọn thư viện Calendar - tài liệu chỉ ghi "thư viện có sẵn", chưa nêu tên.
export default function CalendarView({ events = [] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p>CalendarView (chưa cài) - {events.length} ca</p>
    </div>
  );
}
