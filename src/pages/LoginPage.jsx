import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import FormInput from "../components/FormInput";
import ErrorMessage from "../components/ErrorMessage";
import { ROLES } from "../constants";

// FR01 - Đăng nhập
export default function LoginPage() {
  const { saveLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      saveLogin(data);
      navigate(data.user.role === ROLES.MANAGER ? "/manager" : "/employees");
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-sm rounded-lg border border-gray-200 bg-white p-4">
      <h1 className="mb-4 text-2xl font-semibold">Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormInput label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <ErrorMessage message={error} />
        <button className="rounded-md bg-blue-600 px-3.5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" type="submit">Đăng nhập</button>
      </form>
      {import.meta.env.VITE_USE_MOCK !== "false" && (
        <p className="mt-3 text-xs text-gray-500">
          Chế độ mock: email bắt đầu bằng "manager" = Manager, còn lại = Staff. Mật khẩu nhập gì cũng được.
        </p>
      )}
    </div>
  );
}
