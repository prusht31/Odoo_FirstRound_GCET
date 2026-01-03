import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeList from './pages/hr/EmployeeList';
import HREmployeeProfile from './pages/hr/HREmployeeProfile';
import HRLeaves from './pages/hr/HRLeaves';
import HRAttendance from './pages/hr/HRAttendance';
import MyAttendance from './pages/employee/MyAttendance';
import MyLeaves from './pages/employee/MyLeaves';
import MyProfile from './pages/employee/MyProfile';
import EmployeeSummary from './pages/employee/EmployeeSummary';
import PrivateRoutes from './utils/PrivateRoutes';
import { Toaster } from 'react-hot-toast';

import HRSummary from './pages/hr/HRSummary';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* HR Routes (Formerly Admin) */}
          <Route path="/hr-dashboard" element={<PrivateRoutes requiredRole={["hr"]} />}>
            <Route path="" element={<HRDashboard />}>
              <Route index element={<HRSummary />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/:id" element={<HREmployeeProfile />} />
              <Route path="leaves" element={<HRLeaves />} />
              <Route path="attendance" element={<HRAttendance />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route path="/employee-dashboard" element={<PrivateRoutes requiredRole={["employee"]} />}>
            <Route path="" element={<EmployeeDashboard />}>
              <Route index element={<EmployeeSummary />} />
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="leaves" element={<MyLeaves />} />
              <Route path="profile" element={<MyProfile />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
