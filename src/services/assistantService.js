import httpClient from "./httpClient";

// FR13 - AI Assistant (chỉ gợi ý, Manager quyết định)
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const askAssistant = (data) => httpClient.post("/assistant/ask", data).then((r) => r.data);
