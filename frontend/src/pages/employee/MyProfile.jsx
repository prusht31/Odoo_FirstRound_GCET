import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosHelper";
import toast from 'react-hot-toast';

const MyProfile = () => {
    const [activeTab, setActiveTab] = useState("private");
    const [user, setUser] = useState(null);
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        profilePicture: "",
        bankDetails: {
            accountNo: "",
            ifsc: "",
            pan: "",
            uan: ""
        }
    });

    useEffect(() => {
        fetchProfile();
        fetchSalary();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/users/profile");
            setUser(res.data.user);
            setFormData({
                name: res.data.user.name || "",
                phone: res.data.user.phone || "",
                dob: res.data.user.dob ? res.data.user.dob.split('T')[0] : "",
                gender: res.data.user.gender || "",
                address: res.data.user.address || "",
                profilePicture: res.data.user.profilePicture || "",
                bankDetails: {
                    accountNo: res.data.user.bankDetails?.accountNo || "",
                    ifsc: res.data.user.bankDetails?.ifsc || "",
                    pan: res.data.user.bankDetails?.pan || "",
                    uan: res.data.user.bankDetails?.uan || ""
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSalary = async () => {
        try {
            const res = await axiosInstance.get("/salary");
            setSalary(res.data);
        } catch (error) {
            console.log("No salary info found");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put("/users/profile", formData);
            toast.success("Profile Updated Successfully");
            fetchProfile();
        } catch (error) {
            toast.error("Error updating profile");
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden my-8">
            <div className="bg-teal-600 h-32 relative">
                <div className="absolute -bottom-16 left-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden cursor-pointer">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user.name[0]
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                            <span className="text-white text-xs font-bold">Change Photo</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="pt-20 px-8 pb-8">
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-500">{user.role.toUpperCase()} | {user.designation || "Employee"}</p>

                {/* Tabs */}
                <div className="flex gap-6 mt-8 border-b border-gray-200">
                    {["private", "resume", "salary", "security"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-2 font-medium capitalize transition-colors ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-500"}`}
                        >
                            {tab === "private" ? "Private Info" : tab}
                        </button>
                    ))}
                </div>

                <div className="mt-8">
                    {activeTab === "private" && (
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full border rounded-lg px-3 py-2" />
                            </div>

                            <h3 className="col-span-2 text-xl font-bold mt-4 text-gray-800">Bank Details</h3>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
                                <input name="bankDetails.accountNo" value={formData.bankDetails.accountNo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">IFSC Code</label>
                                <input name="bankDetails.ifsc" value={formData.bankDetails.ifsc} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                                <input name="bankDetails.pan" value={formData.bankDetails.pan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">UAN</label>
                                <input name="bankDetails.uan" value={formData.bankDetails.uan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700">Save Changes</button>
                            </div>
                        </form>
                    )}

                    {activeTab === "salary" && (
                        <div>
                            {salary ? (
                                <div className="space-y-6">
                                    <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <div className="text-sm font-bold text-teal-600 uppercase">Monthly Wage</div>
                                            <div className="text-xl font-bold text-gray-800">₹{salary.monthlyWage}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-teal-600 uppercase">Yearly Package</div>
                                            <div className="text-xl font-bold text-gray-800">₹{salary.yearlyWage}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-teal-600 uppercase">Hand In Salary</div>
                                            <div className="text-2xl font-bold text-green-600">₹{salary.netSalary}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-teal-600 uppercase">Status</div>
                                            <div className={`text-xl font-bold ${salary.status === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                                                {salary.status === 'Paid' ? 'Received' : 'Pending'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                                            <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Earnings</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Basic</span>
                                                    <span className="font-semibold">₹{salary.components?.basic?.amount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">HRA</span>
                                                    <span className="font-semibold">₹{salary.components?.hra?.amount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Standard Allowance</span>
                                                    <span className="font-semibold">₹{salary.components?.standardAllowance}</span>
                                                </div>
                                                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                                    <span className="text-gray-800">Gross Salary</span>
                                                    <span className="text-gray-900">₹{salary.grossSalary}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                                            <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Deductions</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">PF (Employee)</span>
                                                    <span className="font-semibold text-red-600">-₹{salary.deductions?.pfEmployee?.amount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Professional Tax</span>
                                                    <span className="font-semibold text-red-600">-₹{salary.deductions?.professionalTax}</span>
                                                </div>
                                                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                                    <span className="text-gray-800">Total Deductions</span>
                                                    <span className="text-red-600">-₹{salary.totalDeductions}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-500 text-lg mb-2">Salary structure pending.</p>
                                    <p className="text-gray-400 text-sm">Please contact your HR administrator to set this up.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "resume" && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-500">Resume Upload (Mock)</p>
                            <button className="mt-4 bg-gray-100 px-4 py-2 rounded text-gray-700 font-semibold hover:bg-gray-200">Select File</button>
                        </div>
                    )}
                    {activeTab === "security" && (
                        <div className="max-w-md">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                            <input type="password" className="w-full border rounded-lg px-3 py-2 mb-4" />
                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <input type="password" className="w-full border rounded-lg px-3 py-2 mb-4" />
                            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700">Update Password</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

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
        netSalary: 0
    });

    useEffect(() => {
        fetchSalary();
    }, []);

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

        let fixedValues = Number(s.components.standardAllowance) + Number(s.components.performanceBonus) + Number(s.components.lta);

        // Fixed Allowance (Balancing figure)
        let otherComponents = basic + s.components.hra.amount + fixedValues;
        s.components.fixedAllowance = wage > otherComponents ? wage - otherComponents : 0;

        s.grossSalary = basic + s.components.hra.amount + fixedValues + s.components.fixedAllowance;

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
        // Simple deep update helper
        let s = JSON.parse(JSON.stringify(salary));
        if (path === 'basic.percentage') s.components.basic.percentage = value;
        if (path === 'hra.percentage') s.components.hra.percentage = value;
        // ... add more if needed
        setSalary(s);
    };

    const saveSalary = async () => {
        try {
            await axiosInstance.post('/salary', { ...salary, userId: user._id });
            toast.success("Salary Saved!");
        } catch (e) { toast.error("Error saving salary"); }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Salary Management (HR Only)</h3>

            {/* Wage Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-teal-700">Wage Definition</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Monthly Wage</label>
                        <input type="number" value={salary.monthlyWage} onChange={handleWageChange} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Yearly Wage (Auto)</label>
                        <input type="number" value={salary.yearlyWage} readOnly className="w-full bg-gray-100 border p-2 rounded" />
                    </div>
                </div>
            </div>

            {/* Components Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-teal-700">Salary Components</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="w-1/3 text-sm font-semibold">Basic Salary</span>
                        <input
                            type="number"
                            value={salary.components.basic.percentage}
                            onChange={(e) => handleComponentChange('basic.percentage', e.target.value)}
                            className="w-20 border p-1 rounded"
                            placeholder="%"
                        />
                        <span className="text-sm">% of Wage</span>
                        <span className="ml-auto font-bold">₹{salary.components.basic.amount}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="w-1/3 text-sm font-semibold">HRA</span>
                        <input
                            type="number"
                            value={salary.components.hra.percentage}
                            onChange={(e) => handleComponentChange('hra.percentage', e.target.value)}
                            className="w-20 border p-1 rounded"
                            placeholder="%"
                        />
                        <span className="text-sm">% of Basic</span>
                        <span className="ml-auto font-bold">₹{salary.components.hra.amount}</span>
                    </div>
                    <div className="flex items-center gap-4 border-t pt-2">
                        <span className="w-1/3 text-sm font-bold">Fixed Allowance (Balancing)</span>
                        <span className="ml-auto font-bold text-teal-600">₹{salary.components.fixedAllowance}</span>
                    </div>
                </div>
            </div>

            {/* Deductions Section */}
            <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-red-700">Deductions</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="w-1/3 text-sm font-semibold">PF (Employee)</span>
                        <span className="text-sm">12% of Basic</span>
                        <span className="ml-auto font-bold text-red-600">-₹{salary.deductions.pfEmployee.amount}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-1/3 text-sm font-semibold">Professional Tax</span>
                        <span className="ml-auto font-bold text-red-600">-₹{salary.deductions.professionalTax}</span>
                    </div>
                </div>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                    <div className="text-sm text-gray-500">Net Salary (Monthly)</div>
                    <div className="text-2xl font-bold text-teal-800">₹{salary.netSalary}</div>
                </div>
                <button onClick={saveSalary} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700">Save Structure</button>
            </div>
        </div>
    );
};

export default MyProfile;
