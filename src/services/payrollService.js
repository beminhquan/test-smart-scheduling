import httpClient from "./httpClient";

// FR12 - tính lương nội bộ
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getPayrollSummary = (params) => httpClient.get("/payroll", { params }).then((r) => r.data);
export const savePayRate = (data) => httpClient.put("/payroll/rates", data).then((r) => r.data);
