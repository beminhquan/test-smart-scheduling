  import { Navigate, Route, Routes } from "react-router-dom";
  import { useAuth } from "./context/AuthContext";
  import { ROLES } from "./constants";

  import LoginPage from "./pages/LoginPage";
  import ManagerLayout from "./layouts/ManagerLayout";
  import EmployeeLayout from "./layouts/EmployeeLayout";

  import EmployeeListPage from "./pages/manager/EmployeeListPage";
  import ShiftConfigPage from "./pages/manager/ShiftConfigPage";
  import SchedulePage from "./pages/manager/SchedulePage";
  import WorkHoursPage from "./pages/manager/WorkHoursPage";
  import ShiftExchangePage from "./pages/manager/ShiftExchangePage";
  import OpenShiftPage from "./pages/manager/OpenShiftPage";
  import LeavePage from "./pages/manager/LeavePage";
  import AttendancePage from "./pages/manager/AttendancePage";
  import PayrollPage from "./pages/manager/PayrollPage";
  import DashboardPage from "./pages/manager/DashboardPage";
  import ReportPage from "./pages/manager/ReportPage";
  import AssistantPage from "./pages/manager/AssistantPage";

  import EmployeeProfilePage from "./pages/employees/ProfilePage";
  import EmployeeAvailabilityPage from "./pages/employees/AvailabilityPage";
  import EmployeeMySchedulePage from "./pages/employees/MySchedulePage";
  import EmployeeShiftExchangePage from "./pages/employees/ShiftExchangePage";
  import EmployeeOpenShiftPage from "./pages/employees/OpenShiftPage";
  import EmployeeLeavePage from "./pages/employees/LeavePage";
  import EmployeeAttendancePage from "./pages/employees/AttendancePage";
  import TongQuan from "./pages/employees/TongQuan";

  function Protected({ role, children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) return <Navigate to={homeOf(user.role)} replace />;
    return children;
  }

  const homeOf = (role) => (role === ROLES.MANAGER ? "/manager/schedule" : "/employees/schedule");

  export default function App() {
    const { user } = useAuth();
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/manager" element={<Protected role={ROLES.MANAGER}><ManagerLayout /></Protected>}>
          <Route index element={<Navigate to="schedule" replace />} />
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="shift-config" element={<ShiftConfigPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="work-hours" element={<WorkHoursPage />} />
          <Route path="shift-exchange" element={<ShiftExchangePage />} />
          <Route path="open-shifts" element={<OpenShiftPage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="assistant" element={<AssistantPage />} />
        </Route>

        <Route path="/employees" element={<Protected role={ROLES.STAFF}><EmployeeLayout /></Protected>}>
          <Route index element={<Navigate to="schedule" replace />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="availability" element={<EmployeeAvailabilityPage />} />
          <Route path="schedule" element={<EmployeeMySchedulePage />} />
          <Route path="shift-exchange" element={<EmployeeShiftExchangePage />} />
          <Route path="open-shifts" element={<EmployeeOpenShiftPage />} />
          <Route path="leave" element={<EmployeeLeavePage />} />
          <Route path="attendance" element={<EmployeeAttendancePage />} />
          <Route path="Tong-quan" element={<TongQuan />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? homeOf(user.role) : "/login"} replace />} />
      </Routes>
    );
  }
