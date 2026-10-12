import httpClient from "./httpClient";

// FR06 - đổi ca
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)

export const getExchangeRequests = (params) => httpClient.get("/shift-exchange", { params }).then((r) => r.data);
export const sendExchangeRequest = (data) => httpClient.post("/shift-exchange", data).then((r) => r.data);
export const respondExchange = (id, data) => httpClient.patch(`/shift-exchange/${id}`, data).then((r) => r.data);
