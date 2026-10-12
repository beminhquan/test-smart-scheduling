import httpClient from "./httpClient";

// FR08 - nghỉ đột xuất + gợi ý người thay
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getLeaveRequests = (params) => httpClient.get("/leave", { params }).then((r) => r.data);
export const submitLeave = (data) => httpClient.post("/leave", data).then((r) => r.data);
export const getReplacementSuggestions = (id) => httpClient.get(`/leave/${id}/suggestions`).then((r) => r.data);
export const confirmReplacement = (id, data) => httpClient.post(`/leave/${id}/replacement`, data).then((r) => r.data);
