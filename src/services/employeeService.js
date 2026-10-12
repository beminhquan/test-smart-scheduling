import httpClient from "./httpClient";

// FR03 - hồ sơ nhân viên, Role_Tag, khóa tài khoản
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getEmployees = (params) => httpClient.get("/employees", { params }).then((r) => r.data);
export const createEmployee = (data) => httpClient.post("/employees", data).then((r) => r.data);
export const updateEmployee = (id, data) => httpClient.put(`/employees/${id}`, data).then((r) => r.data);
export const lockEmployee = (id, data) => httpClient.patch(`/employees/${id}/lock`, data).then((r) => r.data);
export const getMyProfile = (params) => httpClient.get("/me", { params }).then((r) => r.data);
export const updateMyProfile = (data) => httpClient.put("/me", data).then((r) => r.data);
