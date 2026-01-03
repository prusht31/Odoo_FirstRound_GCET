import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosHelper';
import toast from 'react-hot-toast';

const HRLeaves = () => {
    const [leaves, setLeaves] = useState([]);

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

    const handleStatus = async (id, status) => {
        try {
            await axiosInstance.put(`/leave/${id}`, { status });
            toast.success("Status Updated: " + status);
            fetchLeaves();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Leave Requests</h2>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leaves.map(leave => (
                            <tr key={leave._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{leave.user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    From: {new Date(leave.startDate).toLocaleDateString()}<br />
                                    To: {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={leave.reason}>
                                    {leave.reason}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {leave.status === 'Pending' ? (
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => handleStatus(leave._id, 'Approved')} className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition font-bold">Approve</button>
                                            <button onClick={() => handleStatus(leave._id, 'Rejected')} className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition font-bold">Reject</button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Action taken</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No leave requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HRLeaves;
