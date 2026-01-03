import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosHelper";
import toast from 'react-hot-toast';

const HREmployeeProfile = () => {
    const { id } = useParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "private");
    const [user, setUser] = useState(null);
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axiosInstance.get(`/employees/${id}`);
                setUser(userRes.data);

                try {
                    const salaryRes = await axiosInstance.get(`/salary?userId=${id}`);
                    setSalary(salaryRes.data);
                } catch (e) { console.log("Salary not found"); }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div>Loading Employee Profile...</div>;
    if (!user) return <div>Employee not found</div>;

    return (
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 h-40 relative">
                <div className="absolute -bottom-16 left-10">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden shadow-lg">
                        {user.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : user.name[0]}
                    </div>
                </div>
            </div>

            <div className="pt-20 px-10 pb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-teal-600 font-semibold">{user.designation || "Employee"} at {user.department || "General"} Dept</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>ID: {user._id.substring(0, 6).toUpperCase()}</span>
                            <span>|</span>
                            <span>{user.email}</span>
                            <span>|</span>
                            <span>{user.phone || "No Phone"}</span>
                        </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mt-10 border-b border-gray-200">
                    {["private", "resume", "salary"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 font-medium capitalize transition-colors text-lg ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-500"}`}
                        >
                            {tab === "private" ? "Private Info" : tab + " Info"}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="mt-8 min-h-[400px]">
                    {activeTab === "private" && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                <InfoGroup label="Full Name" value={user.name} />
                                <InfoGroup label="Date of Birth" value={user.dob ? user.dob.split('T')[0] : "N/A"} />
                                <InfoGroup label="Gender" value={user.gender || "N/A"} />
                                <InfoGroup label="Address" value={user.address || "N/A"} />
                                <InfoGroup label="Nationality" value="Indian" />
                                <InfoGroup label="Marital Status" value="Single" />

                                <div className="col-span-2 mt-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Bank Details</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <InfoGroup label="Account No" value={user.bankDetails?.accountNo || "N/A"} />
                                        <InfoGroup label="IFSC Code" value={user.bankDetails?.ifsc || "N/A"} />
                                        <InfoGroup label="PAN" value={user.bankDetails?.pan || "N/A"} />
                                        <InfoGroup label="UAN" value={user.bankDetails?.uan || "N/A"} />
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">About</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {user.name} is a dedicated {user.designation} in the {user.department} department.
                                    Joined on {new Date(user.createdAt).toLocaleDateString()}.
                                </p>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                                    <div className="flex gap-2">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">Communication</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">Teamwork</span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">Problem Solving</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "resume" && (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <p className="text-gray-500 font-medium">Resume.pdf</p>
                            <button className="mt-4 text-teal-600 font-semibold hover:underline">Download / Preview</button>
                        </div>
                    )}

                    {activeTab === "salary" && (
                        <div>
                            {/* HR Editing View */}
                            <SalaryManager user={user} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoGroup = ({ label, value }) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
        <p className="text-gray-900 font-medium text-lg">{value}</p>
    </div>
);

export default HREmployeeProfile;

const SalaryManager = ({ user }) => {
    const [salary, setSalary] = useState({
        monthlyWage: 0,
        yearlyWage: 0,
        wageType: 'Fixed Wage',
        workingDaysPerWeek: 5,
        breakTime: 1,
        components: {
            basic: { amount: 0, percentage: 50, type: 'Percentage' },
            hra: { amount: 0, percentage: 50, type: 'Percentage' },
            standardAllowance: 0,
            performanceBonus: 0,
            lta: 0,
            fixedAllowance: 0
        },
        deductions: {
            pfEmployee: { amount: 0, percentage: 12 },
            pfEmployer: { amount: 0, percentage: 12 },
            professionalTax: 200
        },
        grossSalary: 0,
        totalDeductions: 0,
        netSalary: 0,
        status: 'Pending'
    });

    useEffect(() => {
        if (user?._id) fetchSalary();
    }, [user]);

    useEffect(() => {
        calculateSalary();
    }, [salary.monthlyWage, salary.components.basic.percentage, salary.components.hra.percentage]);

    const fetchSalary = async () => {
        try {
            const res = await axiosInstance.get(`/salary?userId=${user._id}`);
            if (res.data) setSalary(res.data);
        } catch (e) { console.error(e); }
    };

    const calculateSalary = () => {
        let s = { ...salary };
        let wage = Number(s.monthlyWage);
        s.yearlyWage = wage * 12;

        // Components
        // Basic
        if (s.components.basic.type === 'Percentage') {
            s.components.basic.amount = (wage * s.components.basic.percentage) / 100;
        }
        let basic = s.components.basic.amount;

        // HRA
        if (s.components.hra.type === 'Percentage') {
            s.components.hra.amount = (basic * s.components.hra.percentage) / 100;
        }
        let hra = s.components.hra.amount;

        let fixedValues = Number(s.components.standardAllowance) + Number(s.components.performanceBonus) + Number(s.components.lta);

        // Fixed Allowance (Balancing figure)
        let otherComponents = basic + hra + fixedValues;
        s.components.fixedAllowance = wage > otherComponents ? wage - otherComponents : 0;

        s.grossSalary = basic + hra + fixedValues + s.components.fixedAllowance;

        // Deductions
        s.deductions.pfEmployee.amount = (basic * s.deductions.pfEmployee.percentage) / 100;
        s.deductions.pfEmployer.amount = (basic * s.deductions.pfEmployer.percentage) / 100;

        s.totalDeductions = s.deductions.pfEmployee.amount + Number(s.deductions.professionalTax);
        s.netSalary = s.grossSalary - s.totalDeductions;

        setSalary(s);
    };

    const handleWageChange = (e) => {
        setSalary({ ...salary, monthlyWage: e.target.value });
    };

    const handleComponentChange = (path, value) => {
        let s = JSON.parse(JSON.stringify(salary));
        if (path === 'basic.percentage') s.components.basic.percentage = value;
        if (path === 'hra.percentage') s.components.hra.percentage = value;
        if (path === 'standardAllowance') s.components.standardAllowance = value;
        if (path === 'performanceBonus') s.components.performanceBonus = value;
        if (path === 'lta') s.components.lta = value;
        if (path === 'workingDaysPerWeek') s.workingDaysPerWeek = value;
        if (path === 'breakTime') s.breakTime = value;
        setSalary(s);
    };

    const saveSalary = async () => {
        try {
            await axiosInstance.post('/salary', { ...salary, userId: user._id });
            toast.success("Salary Saved!");
        } catch (e) { toast.error("Error saving salary"); }
    };

    return (
        <div className="bg-white text-gray-800 p-8 rounded-xl shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">Salary Structure</h3>

            {/* Top Row: General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Monthly Wage</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">₹</span>
                        <input type="number" value={salary.monthlyWage} onChange={handleWageChange} className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-teal-500 p-3 pl-8 outline-none text-gray-800 text-lg font-bold transition-all rounded-t" />
                        <span className="absolute right-3 top-3 text-gray-400 text-xs">/ Month</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Yearly Wage</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">₹</span>
                        <input type="number" value={salary.yearlyWage} readOnly className="w-full bg-gray-100 border-b-2 border-gray-200 p-3 pl-8 outline-none text-gray-500 text-lg font-bold rounded-t" />
                        <span className="absolute right-3 top-3 text-gray-400 text-xs">/ Year</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Working Days / Week</label>
                    <input type="number" value={salary.workingDaysPerWeek} onChange={e => handleComponentChange('workingDaysPerWeek', e.target.value)} className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-teal-500 p-3 outline-none text-gray-800 font-bold text-center rounded-t" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Break Time (Hrs)</label>
                    <input type="number" value={salary.breakTime} onChange={e => handleComponentChange('breakTime', e.target.value)} className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-teal-500 p-3 outline-none text-gray-800 font-bold text-center rounded-t" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Salary Components */}
                <div className="space-y-6">
                    <h4 className="text-xl font-bold text-teal-600 border-b-2 border-gray-200 pb-2">Salary Components</h4>

                    {/* Basic */}
                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-800 font-semibold">Basic Salary</label>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-800">₹{salary.components.basic.amount?.toFixed(2)}</span>
                                <div className="flex items-center bg-white rounded px-2 py-1 border border-gray-300">
                                    <input type="number" value={salary.components.basic.percentage} onChange={e => handleComponentChange('basic.percentage', e.target.value)} className="w-12 bg-transparent text-right outline-none text-sm" />
                                    <span className="text-xs text-gray-500 ml-1">%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Define Basic salary from company cost compute it based on monthly Wages</p>
                        <div className="h-2 w-full bg-gray-200 rounded overflow-hidden"><div className="h-full bg-teal-500" style={{ width: `${salary.components.basic.percentage}%` }}></div></div>
                    </div>

                    {/* HRA */}
                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-800 font-semibold">House Rent Allowance</label>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-800">₹{salary.components.hra.amount?.toFixed(2)}</span>
                                <div className="flex items-center bg-white rounded px-2 py-1 border border-gray-300">
                                    <input type="number" value={salary.components.hra.percentage} onChange={e => handleComponentChange('hra.percentage', e.target.value)} className="w-12 bg-transparent text-right outline-none text-sm" />
                                    <span className="text-xs text-gray-500 ml-1">%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">HRA provided to employees 50% of the basic salary</p>
                    </div>

                    {/* Standard Allowance */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <div>
                            <label className="block text-gray-800 font-semibold">Standard Allowance</label>
                            <span className="text-xs text-gray-500">Fixed amount provided to employee</span>
                        </div>
                        <div className="relative w-32">
                            <span className="absolute left-2 top-2 text-gray-400">₹</span>
                            <input type="number" value={salary.components.standardAllowance} onChange={e => handleComponentChange('standardAllowance', e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded p-2 pl-6 text-right text-gray-800 outline-none focus:border-teal-500" />
                        </div>
                    </div>

                    {/* Performance Bonus */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <div>
                            <label className="block text-gray-800 font-semibold">Performance Bonus</label>
                            <span className="text-xs text-gray-500">Variable amount paid during payroll</span>
                        </div>
                        <div className="relative w-32">
                            <span className="absolute left-2 top-2 text-gray-400">₹</span>
                            <input type="number" value={salary.components.performanceBonus} onChange={e => handleComponentChange('performanceBonus', e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded p-2 pl-6 text-right text-gray-800 outline-none focus:border-teal-500" />
                        </div>
                    </div>

                    {/* LTA */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <div>
                            <label className="block text-gray-800 font-semibold">Leave Travel Allowance</label>
                            <span className="text-xs text-gray-500">Paid to cover travel expenses</span>
                        </div>
                        <div className="relative w-32">
                            <span className="absolute left-2 top-2 text-gray-400">₹</span>
                            <input type="number" value={salary.components.lta} onChange={e => handleComponentChange('lta', e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded p-2 pl-6 text-right text-gray-800 outline-none focus:border-teal-500" />
                        </div>
                    </div>

                    {/* Fixed Allowance */}
                    <div className="flex justify-between items-center pt-3 bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <div>
                            <label className="block text-teal-700 font-bold">Fixed Allowance</label>
                            <span className="text-xs text-teal-600">Balancing portion of wages</span>
                        </div>
                        <span className="text-xl font-bold text-teal-700">₹{salary.components.fixedAllowance?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Right: Deductions */}
                <div className="space-y-6">
                    <h4 className="text-xl font-bold text-red-600 border-b-2 border-gray-200 pb-2">Provident Fund (PF) & Deductions</h4>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                            <label className="text-gray-800 font-semibold">PF (Employee)</label>
                            <div className="text-right">
                                <span className="block font-bold text-red-600">₹{salary.deductions.pfEmployee.amount?.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">12% of Basic</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="text-gray-800 font-semibold">PF (Employer) <span className="text-xs text-gray-500 block">Contributor</span></label>
                            <div className="text-right">
                                <span className="block font-bold text-gray-600">₹{salary.deductions.pfEmployer.amount?.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">12% of Basic</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4">
                            <label className="text-gray-800 font-semibold">Professional Tax</label>
                            <span className="font-bold text-red-600">₹{salary.deductions.professionalTax}</span>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200 mt-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600 font-semibold">Gross Salary</span>
                                <span className="text-xl font-bold text-gray-800">₹{salary.grossSalary?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-semibold">Total Deductions</span>
                                <span className="text-xl font-bold text-red-600">-₹{salary.totalDeductions?.toFixed(2)}</span>
                            </div>
                            <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
                                <span className="text-teal-700 font-bold uppercase tracking-wider">Net Salary</span>
                                <span className="text-3xl font-bold text-teal-600">₹{salary.netSalary?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-8">
                            <div className="flex items-center gap-2">
                                <label className="text-gray-600 font-bold">Status:</label>
                                <select
                                    value={salary.status || 'Pending'}
                                    onChange={(e) => setSalary({ ...salary, status: e.target.value })}
                                    className="bg-white border-2 border-gray-300 p-2 rounded text-gray-800 font-bold outline-none focus:border-teal-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid (Received)</option>
                                </select>
                            </div>
                            <button onClick={saveSalary} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md transform hover:scale-105">
                                Save Structure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

