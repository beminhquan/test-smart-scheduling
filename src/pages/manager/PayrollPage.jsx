// FR12 - Lương
// Cần làm:
//  - Cấu hình đơn giá giờ, hệ số ca
//  - Bảng tổng hợp giờ + lương theo kỳ
//  - Xuất PDF
export default function PayrollPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Lương</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ul className="list-disc pl-5">
        <li>Cấu hình đơn giá giờ, hệ số ca</li>
        <li>Bảng tổng hợp giờ + lương theo kỳ</li>
        <li>Xuất PDF</li>
        </ul>
      </div>
    </div>
  );
}
