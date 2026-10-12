// FR11 - Chấm công
// Cần làm:
//  - Xem chấm công của mọi nhân viên
//  - Chỉnh khi sai sót, bắt buộc nhập lý do
export default function AttendancePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Chấm công</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ul className="list-disc pl-5">
        <li>Xem chấm công của mọi nhân viên</li>
        <li>Chỉnh khi sai sót, bắt buộc nhập lý do</li>
        </ul>
      </div>
    </div>
  );
}
