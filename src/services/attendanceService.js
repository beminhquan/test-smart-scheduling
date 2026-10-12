import httpClient from "./httpClient";

// FR11 - check-in/out và chỉnh chấm công
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const checkIn = (data) => httpClient.post("/attendance/check-in", data).then((r) => r.data);
export const checkOut = (data) => httpClient.post("/attendance/check-out", data).then((r) => r.data);
export const getAttendance = (params) => httpClient.get("/attendance", { params }).then((r) => r.data);
export const adjustAttendance = (id, data) => httpClient.put(`/attendance/${id}`, data).then((r) => r.data);
