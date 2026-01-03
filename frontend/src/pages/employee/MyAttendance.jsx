import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const MyAttendance = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);

    const fetchAttendance = async () => {
        try {
            const res = await axiosInstance.get('/attendance');
            setHistory(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePunch = async (type) => { // type: 'in' or 'out'
        try {
            await axiosInstance.post(`/attendance/punch-${type}`);
            toast.success(`Punched ${type} successfully`);
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        }
    };

    React.useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Attendance</h2>

            <div className="bg-white p-8 rounded-xl shadow-lg mb-10 text-center">
                <p className="text-gray-500 mb-4 text-lg">Current Date: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="flex gap-6 justify-center">
                    <button
                        onClick={() => handlePunch('in')}
                        className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-md transition transform hover:scale-105"
                    >
                        Punch In
                    </button>
                    <button
                        onClick={() => handlePunch('out')}
                        className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-md transition transform hover:scale-105"
                    >
                        Punch Out
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-700 mb-4">Attendance History</h3>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Punch In</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Punch Out</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.map(att => (
                            <tr key={att._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                    {att.punchIn ? new Date(att.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                    {att.punchOut ? new Date(att.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700">
                                        {att.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAttendance;
