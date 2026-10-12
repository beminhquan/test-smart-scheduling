import httpClient from "./httpClient";

// Nhu cầu nhân sự mỗi ca + ràng buộc lập lịch
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getShiftConfig = (params) => httpClient.get("/shift-config", { params }).then((r) => r.data);
export const saveShiftConfig = (data) => httpClient.put("/shift-config", data).then((r) => r.data);
