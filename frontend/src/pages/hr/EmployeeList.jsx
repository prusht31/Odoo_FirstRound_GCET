import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosHelper';
import { useAuth } from '../../context/authContext';
import { FaUser, FaMoneyBillWave, FaTrash } from "react-icons/fa";

const EmployeeList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canEdit = user?.role === 'hr';

    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceMap, setAttendanceMap] = useState({});

    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [salaryModalOpen, setSalaryModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [salaryData, setSalaryData] = useState({ basicSalary: '', hra: '', allowances: '', pf: '', tax: '' });

    // Add Employee Form State
    const [newEmployee, setNewEmployee] = useState({
        name: '', email: '', password: '', role: 'employee', designation: '', department: ''
    });

    const fetchEmployees = async () => {
        try {
            const res = await axiosInstance.get('/employees');
            setEmployees(res.data);
            setFilteredEmployees(res.data);
            fetchTodayAttendance();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTodayAttendance = async () => {
        try {
            const date = new Date().toISOString().split("T")[0];
            const res = await axiosInstance.get(`/ attendance ? date = ${date} `);
            // Map userId -> status
            const map = {};
            res.data.forEach(att => {
                // att.user is populated, so it might be an object. Check controller.
                // Controller: populate("user", "name email")
                const uid = att.user._id || att.user;
                map[uid] = att.status; // "Present"
            });
            setAttendanceMap(map);
        } catch (e) { console.error(e); }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const lowerQ = searchQuery.toLowerCase();
        const filtered = employees.filter(emp => emp.name.toLowerCase().includes(lowerQ) || emp.email.toLowerCase().includes(lowerQ));
        setFilteredEmployees(filtered);
    }, [searchQuery, employees]);

    const handleSalaryClick = (emp) => {
        setSelectedEmployee(emp);
        setSalaryData({ basicSalary: '', hra: '', allowances: '', pf: '', tax: '' });
        // Optionally fetch existing salary here
        fetchSalary(emp._id);
        setSalaryModalOpen(true);
    };

    const fetchSalary = async (id) => {
        try {
            const res = await axiosInstance.get(`/ salary ? userId = ${id} `);
            // If data exists, just set the monthlyWage for the simplified view
            if (res.data) {
                setSalaryData({ monthlyWage: res.data.monthlyWage || '' });
            } else {
                setSalaryData({ monthlyWage: '' });
            }
        } catch (e) { setSalaryData({ monthlyWage: '' }); }
    }

    const handleSalarySave = async (e) => {
        e.preventDefault();
        try {
            const wage = Number(salaryData.monthlyWage);
            const basic = wage * 0.5; // 50%
            const hra = basic * 0.5; // 50% of basic
            // Fixed Allowance as balancing figure
            // Logic: Wage = Basic + HRA + Fixed + Others
            // Here let's just say Fixed = Wage - (Basic+HRA) if any
            const fixedAllowance = wage - (basic + hra);

            const pfEmployee = basic * 0.12;
            const pfEmployer = basic * 0.12;
            const professionalTax = 200;

            const totalDeductions = pfEmployee + professionalTax;
            const netSalary = wage - totalDeductions;

            const payload = {
                userId: selectedEmployee._id,
                monthlyWage: wage,
                yearlyWage: wage * 12,
                wageType: 'Fixed Wage',
                workingDaysPerWeek: 5,
                breakTime: 1,
                components: {
                    basic: { amount: basic, percentage: 50, type: 'Percentage' },
                    hra: { amount: hra, percentage: 50, type: 'Percentage' },
                    standardAllowance: 0,
                    performanceBonus: 0,
                    lta: 0,
                    fixedAllowance: fixedAllowance > 0 ? fixedAllowance : 0 // Should be positive
                },
                deductions: {
                    pfEmployee: { amount: pfEmployee, percentage: 12 },
                    pfEmployer: { amount: pfEmployer, percentage: 12 },
                    professionalTax: professionalTax
                },
                grossSalary: wage,
                totalDeductions,
                netSalary
            };

            await axiosInstance.post('/salary', payload);
            toast.success("Salary Updated");
            setSalaryModalOpen(false);
        } catch (error) {
            toast.error("Error updating salary");
        }
    }

    const handleChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/employees', newEmployee);
            setIsModalOpen(false);
            setNewEmployee({ name: '', email: '', password: '', role: 'employee', designation: '', department: '' });
            fetchEmployees();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating employee");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axiosInstance.delete(`/ employees / ${id} `);
            fetchEmployees();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusColor = (uid) => {
        const status = attendanceMap[uid];
        if (status === "Present") return "bg-green-500";
        // Logic for "On Leave" would require checking Leave requests for today. 
        // For Hackathon, let's assume absent if not present, or maybe just "Yellow" if not present.
        return "bg-yellow-500";
    };

    const getStatusText = (uid) => {
        const status = attendanceMap[uid];
        if (status === "Present") return "Present";
        return "Absent";
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Team Directory</h2>
                    <p className="text-gray-500 mt-1">Manage your employees</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    {canEdit && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold transition whitespace-nowrap"
                        >
                            + Add Employee
                        </button>
                    )}
                </div>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map(emp => (
                        <div key={emp._id} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center relative hover:shadow-lg transition">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 mb-4 overflow-hidden">
                                {emp.profilePicture ? <img src={emp.profilePicture} className="w-full h-full object-cover" /> : emp.name[0]}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{emp.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{emp.role} | {emp.designation || 'Employee'}</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`w - 3 h - 3 rounded - full ${getStatusColor(emp._id)} `}></span>
                                <span className="text-xs text-gray-600">{getStatusText(emp._id)}</span>
                            </div>

                            {canEdit && (
                                <div className="flex gap-3 mt-auto w-full">
                                    <button onClick={() => navigate(`/ hr - dashboard / employees / ${emp._id} `)} className="flex-1 bg-teal-50 text-teal-600 py-2 rounded-lg text-sm font-semibold hover:bg-teal-100 flex items-center justify-center gap-2">
                                        <FaUser /> Profile
                                    </button>
                                    <button onClick={() => navigate(`/hr-dashboard/employees/${emp._id}`, { state: { activeTab: 'salary' } })} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 flex items-center justify-center gap-2">
                                        <FaMoneyBillWave /> Salary
                                    </button>
                                    <button onClick={() => handleDelete(emp._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 flex items-center justify-center gap-2">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Employee Modal (Simplified reuse) */}
            {isModalOpen && canEdit && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md m-4">
                        <h3 className="text-xl font-bold mb-4">Add Employee</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input name="name" placeholder="Full Name" value={newEmployee.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <input name="email" type="email" placeholder="Email" value={newEmployee.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <input name="password" type="password" placeholder="Password" value={newEmployee.password} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <div className="flex gap-2">
                                <select name="role" value={newEmployee.role} onChange={handleChange} className="w-1/2 p-2 border rounded">
                                    <option value="employee">Employee</option>
                                    <option value="hr">HR</option>
                                </select>
                                <input name="designation" placeholder="Designation" value={newEmployee.designation} onChange={handleChange} className="w-1/2 p-2 border rounded" />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Salary Modal */}
            {salaryModalOpen && canEdit && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md m-4">
                        <h3 className="text-xl font-bold mb-4">Manage Salary: {selectedEmployee?.name}</h3>
                        <form onSubmit={handleSalarySave} className="space-y-3">
                            <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 mb-4">
                                <strong>Note:</strong> Simplifying setup. Setting Monthly Wage will auto-calculate components (50% Basic, 50% HRA) and deductions (12% PF). For advanced editing, use the Payroll Module.
                            </div>

                            <label className="block text-sm font-bold text-gray-700">Monthly Wage (₹)</label>
                            <input
                                type="number"
                                value={salaryData.monthlyWage || ''}
                                onChange={e => setSalaryData({ ...salaryData, monthlyWage: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
                                required
                            />

                            {salaryData.monthlyWage > 0 && (
                                <div className="text-sm text-gray-600 space-y-1 mt-2 border-t pt-2">
                                    <div className="flex justify-between"><span>Basic (50%)</span> <span>≈ ₹{(salaryData.monthlyWage * 0.5).toFixed(0)}</span></div>
                                    <div className="flex justify-between"><span>HRA (50% of Basic)</span> <span>≈ ₹{(salaryData.monthlyWage * 0.5 * 0.5).toFixed(0)}</span></div>
                                    <div className="flex justify-between font-bold text-teal-700"><span>Net Salary (Approx)</span> <span>≈ ₹{(salaryData.monthlyWage - (salaryData.monthlyWage * 0.5 * 0.12) - 200).toFixed(0)}</span></div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setSalaryModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Structure</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
