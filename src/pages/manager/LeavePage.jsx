// FR08 - Nghỉ phép
// Cần làm:
//  - Danh sách đơn nghỉ đột xuất
//  - Xem 3-5 gợi ý người thay (AI)
//  - Chọn người thay
export default function LeavePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Nghỉ phép</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ul className="list-disc pl-5">
        <li>Danh sách đơn nghỉ đột xuất</li>
        <li>Xem 3-5 gợi ý người thay (AI)</li>
        <li>Chọn người thay</li>
        </ul>
      </div>
    </div>
  );
}
