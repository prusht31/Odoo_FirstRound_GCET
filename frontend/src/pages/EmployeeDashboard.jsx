import React from 'react';
import Navbar from '../components/Navbar';
import { NavLink, Outlet } from 'react-router-dom';
import { FaCalendarCheck, FaClipboardList, FaTachometerAlt, FaUser } from 'react-icons/fa';

const EmployeeDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <aside className="w-64 bg-white shadow-xl z-10 hidden md:block">
                    <div className="p-6">
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Main Menu</h3>
                        <nav className="space-y-2">
                            <NavLink
                                to="/employee-dashboard"
                                end
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <FaTachometerAlt /> Dashboard
                            </NavLink>
                            <NavLink
                                to="/employee-dashboard/attendance"
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <FaCalendarCheck /> My Attendance
                            </NavLink>
                            <NavLink
                                to="/employee-dashboard/leaves"
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <FaClipboardList /> My Leaves
                            </NavLink>
                            <NavLink
                                to="/employee-dashboard/profile"
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <FaUser /> My Profile
                            </NavLink>
                        </nav>
                    </div>
                </aside>
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
