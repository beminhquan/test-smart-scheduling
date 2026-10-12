import httpClient from "./httpClient";

// FR09 - tổng hợp giờ làm
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getWorkHours = (params) => httpClient.get("/work-hours", { params }).then((r) => r.data);
