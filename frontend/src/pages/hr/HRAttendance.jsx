import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosHelper';
import { FaCalendarAlt, FaFilter, FaDownload, FaSearch } from 'react-icons/fa';

const HRAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [filterType, setFilterType] = useState('all'); // all, daily, monthly, yearly
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [attendance, filterType, selectedDate, selectedMonth, selectedYear, searchQuery]);

    const fetchAttendance = async () => {
        try {
            const res = await axiosInstance.get('/attendance');
            setAttendance(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const applyFilters = () => {
        let filtered = [...attendance];

        // Apply date filters
        if (filterType === 'daily') {
            filtered = filtered.filter(att => att.date.startsWith(selectedDate));
        } else if (filterType === 'monthly') {
            filtered = filtered.filter(att => att.date.startsWith(selectedMonth));
        } else if (filterType === 'yearly') {
            filtered = filtered.filter(att => att.date.startsWith(selectedYear));
        }

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(att =>
                att.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredAttendance(filtered);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'bg-green-100 text-green-700';
            case 'absent': return 'bg-red-100 text-red-700';
            case 'half-day': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const calculateHours = (punchIn, punchOut) => {
        if (!punchIn || !punchOut) return '-';
        const diff = new Date(punchOut) - new Date(punchIn);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Attendance Records</h2>
                    <p className="text-gray-500 mt-1">Track and manage employee attendance</p>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-md">
                    <FaDownload /> Export
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FaFilter className="text-teal-600" />
                    <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Filter Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">View By</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Records</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* Date Picker (for daily) */}
                    {filterType === 'daily' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                        </div>
                    )}

                    {/* Month Picker (for monthly) */}
                    {filterType === 'monthly' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Select Month</label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                        </div>
                    )}

                    {/* Year Picker (for yearly) */}
                    {filterType === 'yearly' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Select Year</label>
                            <input
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                min="2020"
                                max="2030"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                        </div>
                    )}

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Search Employee</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-600 font-semibold">Total Records</div>
                        <div className="text-2xl font-bold text-blue-700">{filteredAttendance.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="text-sm text-green-600 font-semibold">Present</div>
                        <div className="text-2xl font-bold text-green-700">
                            {filteredAttendance.filter(a => a.status?.toLowerCase() === 'present').length}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <div className="text-sm text-red-600 font-semibold">Absent</div>
                        <div className="text-2xl font-bold text-red-700">
                            {filteredAttendance.filter(a => a.status?.toLowerCase() === 'absent').length}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                        <div className="text-sm text-yellow-600 font-semibold">Half Day</div>
                        <div className="text-2xl font-bold text-yellow-700">
                            {filteredAttendance.filter(a => a.status?.toLowerCase() === 'half-day').length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Punch In</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Punch Out</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hours</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAttendance.map(att => (
                                <tr key={att._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                                {att.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-semibold text-gray-900">{att.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{att.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <FaCalendarAlt className="text-gray-400" />
                                            {new Date(att.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-green-600">
                                            {att.punchIn ? new Date(att.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-red-600">
                                            {att.punchOut ? new Date(att.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {calculateHours(att.punchIn, att.punchOut)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(att.status)}`}>
                                            {att.status || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredAttendance.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <FaCalendarAlt className="text-5xl mb-3" />
                                            <p className="text-lg font-semibold">No attendance records found</p>
                                            <p className="text-sm">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HRAttendance;
