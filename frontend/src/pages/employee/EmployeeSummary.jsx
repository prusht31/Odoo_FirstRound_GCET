import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaClipboardList, FaMoneyBillWave, FaClock, FaEdit, FaPlus, FaChartLine } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosHelper';

const EmployeeSummary = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [attendanceToday, setAttendanceToday] = useState(null);
    const [leaveBalance, setLeaveBalance] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Profile for Leave Balance
                const userRes = await axiosInstance.get('/users/profile');
                if (userRes.data && userRes.data.user) {
                    setLeaveBalance(userRes.data.user.leaveBalance || 0);
                }

                // Fetch Today's Attendance
                const today = new Date().toISOString().split("T")[0];
                const attRes = await axiosInstance.get(`/attendance?date=${today}`);
                const todayRecord = attRes.data.find(a => a.date.startsWith(today));

                if (todayRecord) {
                    setAttendanceToday(todayRecord);
                }

            } catch (e) {
                console.error(e);
            }
        };
        fetchDashboardData();
    }, []);

    const getWorkingHours = () => {
        if (!attendanceToday) return "0:00 hrs";
        if (!attendanceToday.punchIn) return "0:00 hrs";

        const start = new Date(attendanceToday.punchIn);
        const end = attendanceToday.punchOut ? new Date(attendanceToday.punchOut) : new Date();

        const diff = Math.abs(end - start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}:${mins < 10 ? '0' + mins : mins} hrs`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
                <p className="text-teal-100">Here's what's happening with your work today</p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Today's Status</div>
                        <div className={`w-3 h-3 rounded-full ${attendanceToday ? (attendanceToday.punchOut ? 'bg-gray-400' : 'bg-green-500 animate-pulse') : 'bg-red-400'}`}></div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        {attendanceToday ? (attendanceToday.punchOut ? "Checked Out" : "Checked In") : "Not Checked In"}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                        {attendanceToday && attendanceToday.punchIn && new Date(attendanceToday.punchIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Working Hours</div>
                        <FaClock className="text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{getWorkingHours()}</div>
                    <div className="text-xs text-gray-400 mt-2">Today's total time</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Leave Balance</div>
                        <FaChartLine className={leaveBalance < 0 ? 'text-red-500' : 'text-green-500'} />
                    </div>
                    <div className={`text-2xl font-bold ${leaveBalance < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {leaveBalance} days
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                        {leaveBalance < 0 ? <span className="text-red-500 font-semibold">⚠ Loss of Pay (LOP)</span> : 'Available leaves'}
                    </div>
                </div>
            </div>

            {/* Main Navigation Cards */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => navigate('/employee-dashboard/profile')}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white group-hover:scale-110 transition shadow-md">
                                <FaUser className="text-2xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">My Profile</h3>
                                <p className="text-sm text-gray-500">View and edit personal information</p>
                            </div>
                            <span className="text-2xl text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition">→</span>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/employee-dashboard/attendance')}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-green-200 transition cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white group-hover:scale-110 transition shadow-md">
                                <FaCalendarCheck className="text-2xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition">My Attendance</h3>
                                <p className="text-sm text-gray-500">Check in/out and view records</p>
                            </div>
                            <span className="text-2xl text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition">→</span>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/employee-dashboard/leaves')}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-purple-200 transition cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white group-hover:scale-110 transition shadow-md">
                                <FaClipboardList className="text-2xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition">My Leaves</h3>
                                <p className="text-sm text-gray-500">Apply and manage leave requests</p>
                            </div>
                            <span className="text-2xl text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition">→</span>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/employee-dashboard/profile')}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white group-hover:scale-110 transition shadow-md">
                                <FaMoneyBillWave className="text-2xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition">My Salary</h3>
                                <p className="text-sm text-gray-500">View salary details and structure</p>
                            </div>
                            <span className="text-2xl text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition">→</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => navigate('/employee-dashboard/attendance')}
                        className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 p-6 rounded-xl flex flex-col items-start transition group shadow-sm hover:shadow-md"
                    >
                        <div className="bg-green-500 text-white p-3 rounded-lg mb-3 group-hover:scale-110 transition shadow-md">
                            <FaClock className="text-xl" />
                        </div>
                        <span className="font-bold text-gray-800 text-lg">Check In/Out</span>
                        <span className="text-sm text-gray-600 mt-1">Mark your attendance now</span>
                    </button>

                    <button
                        onClick={() => navigate('/employee-dashboard/leaves')}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 p-6 rounded-xl flex flex-col items-start transition group shadow-sm hover:shadow-md"
                    >
                        <div className="bg-purple-500 text-white p-3 rounded-lg mb-3 group-hover:scale-110 transition shadow-md">
                            <FaPlus className="text-xl" />
                        </div>
                        <span className="font-bold text-gray-800 text-lg">Apply Leave</span>
                        <span className="text-sm text-gray-600 mt-1">Request time off</span>
                    </button>

                    <button
                        onClick={() => navigate('/employee-dashboard/profile')}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 p-6 rounded-xl flex flex-col items-start transition group shadow-sm hover:shadow-md"
                    >
                        <div className="bg-blue-500 text-white p-3 rounded-lg mb-3 group-hover:scale-110 transition shadow-md">
                            <FaEdit className="text-xl" />
                        </div>
                        <span className="font-bold text-gray-800 text-lg">Update Profile</span>
                        <span className="text-sm text-gray-600 mt-1">Edit your information</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSummary;
