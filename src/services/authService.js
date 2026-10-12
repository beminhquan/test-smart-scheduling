import httpClient from "./httpClient";
import { mockLogin } from "../mocks";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// FR01 - Đăng nhập. Trả về { user, token }
export async function login(email, password) {
  if (USE_MOCK) return mockLogin(email);
  const res = await httpClient.post("/auth/login", { email, password });
  return res.data;
}
