import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [newLeave, setNewLeave] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });

    const fetchLeaves = async () => {
        try {
            const res = await axiosInstance.get('/leave');
            setLeaves(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/leave', newLeave);
            setNewLeave({ startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            toast.error("Error applying leave");
        }
    };

    const handleChange = (e) => {
        setNewLeave({ ...newLeave, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Leaves</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-100 stick top-4">
                        <h3 className="text-xl font-bold mb-4 text-teal-800">Apply for Leave</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
                                    <select name="leaveType" value={newLeave.leaveType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" required>
                                        <option value="">Select Type</option>
                                        <option value="Paid Leave">Paid Leave</option>
                                        <option value="Sick Leave">Sick Leave</option>
                                        <option value="Unpaid Leave">Unpaid Leave</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input name="startDate" type="date" value={newLeave.startDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input name="endDate" type="date" value={newLeave.endDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
                                <textarea name="reason" value={newLeave.reason} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Reason for leave..." required />
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-bold hover:bg-teal-700 transition shadow-md">Submit Request</button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Leave History</h3>
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {leaves.map(leave => (
                                    <tr key={leave._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{leave.leaveType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="font-medium text-gray-900">{new Date(leave.startDate).toLocaleDateString()}</div>
                                            <div className="text-xs">to {new Date(leave.endDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {leave.reason}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {leaves.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                            No leave history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLeaves;
