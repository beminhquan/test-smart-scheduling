import httpClient from "./httpClient";
import { mockDashboard } from "../mocks/dashboard";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// FR10 - dashboard + xuất PDF
// TODO: kiểm tra lại đường dẫn API với Backend (Laravel)
export async function getDashboardStats(params) {
  if (USE_MOCK) return mockDashboard;
  const res = await httpClient.get("/reports/dashboard", { params });
  return res.data;
}

export const exportReportPdf = (params) => httpClient.get("/reports/pdf", { params }).then((r) => r.data);
