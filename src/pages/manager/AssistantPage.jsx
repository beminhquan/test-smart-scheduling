// FR13 - AI Assistant
// Cần làm:
//  - Hộp chat hỏi đáp
//  - Chỉ gợi ý, Manager quyết định
//  - Khi LLM lỗi/chậm: báo lỗi rõ ràng, không ảnh hưởng chức năng khác
export default function AssistantPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">AI Assistant</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ul className="list-disc pl-5">
        <li>Hộp chat hỏi đáp</li>
        <li>Chỉ gợi ý, Manager quyết định</li>
        <li>Khi LLM lỗi/chậm: báo lỗi rõ ràng, không ảnh hưởng chức năng khác</li>
        </ul>
      </div>
    </div>
  );
}
