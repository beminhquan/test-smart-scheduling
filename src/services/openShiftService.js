import httpClient from "./httpClient";

// FR07 - Open Shift / Shift Bidding
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getOpenShifts = (params) => httpClient.get("/open-shifts", { params }).then((r) => r.data);
export const createOpenShift = (data) => httpClient.post("/open-shifts", data).then((r) => r.data);
export const acceptOpenShift = (id, data) => httpClient.post(`/open-shifts/${id}/accept`, data).then((r) => r.data);
