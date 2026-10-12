import httpClient from "./httpClient";

// FR05 - lập lịch, chỉnh tay, Apply
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const generateSchedule = (data) => httpClient.post("/schedule/generate", data).then((r) => r.data);
export const getSchedule = (params) => httpClient.get("/schedule", { params }).then((r) => r.data);
export const updateShift = (id, data) => httpClient.put(`/schedule/shifts/${id}`, data).then((r) => r.data);
export const applySchedule = (data) => httpClient.post("/schedule/apply", data).then((r) => r.data);
export const getMySchedule = (params) => httpClient.get("/me/schedule", { params }).then((r) => r.data);
