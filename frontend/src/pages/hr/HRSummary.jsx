
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../utils/axiosHelper';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaUserTie, FaPen, FaSave, FaTimes, FaFileAlt, FaMoneyCheckAlt, FaCheckCircle, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';

const HRSummary = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('private');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get('/users/profile');
            setUser(res.data.user);
            setFormData(res.data.user);
        } catch (error) {
            console.error("Error fetching profile", error);
            toast.error("Failed to fetch profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500000) { // 500KB limit
                toast.error("Image size too large. Please use an image under 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                name: formData.name,
                phone: formData.phone,
                department: formData.department,
                address: formData.address,
                about: formData.about,
                interests: formData.interests,
                profilePicture: formData.profilePicture,
            };

            const response = await axiosInstance.put(`/users/profile`, updatedData);
            toast.success("Profile Updated Successfully!");
            setUser(response.data.user || formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
            const errorMessage = error.response?.data?.message || error.message || "Error updating profile.";
            toast.error(errorMessage);
        }
    };

    if (loading) return <div className="text-center py-10">Loading HR Profile...</div>;
    if (!user) return <div className="text-center py-10">Profile not found.</div>;

    const mockSkills = user.skills && user.skills.length > 0 ? user.skills : ['Strategic Planning', 'Employee Relations', 'Performance Management', 'Recruiting', 'Conflict Resolution'];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-visible border border-gray-200 relative">
                <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-600 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent"></div>
                    <div className="absolute top-6 right-6 text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        {new Date().toDateString()}
                    </div>
                </div>

                <div className="px-8 pb-4">
                    <div className="flex flex-col md:flex-row gap-8 relative">
                        {/* Profile Picture */}
                        <div className="-mt-16 bg-white p-1 rounded-full w-40 h-40 shadow-lg flex-shrink-0 z-10 relative group">
                            <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden border-4 border-teal-500 relative">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-5xl font-bold text-gray-400">{formData.name ? formData.name[0] : 'HR'}</div>
                                )}

                                {isEditing && (
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition opacity-0 group-hover:opacity-100 rounded-full"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <FaCamera className="text-white text-2xl" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            <button
                                onClick={() => {
                                    if (isEditing) {
                                        setFormData(user);
                                        setIsEditing(false);
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                                className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition ${isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-700'} text-white z-20`}
                                title={isEditing ? "Cancel Editing" : "Edit Profile"}
                            >
                                {isEditing ? <FaTimes /> : <FaPen />}
                            </button>
                        </div>

                        {/* Top Info */}
                        <div className="pt-2 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 content-end">
                            <div className="mt-4 md:mt-0">
                                {isEditing ? (
                                    <input
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className="text-3xl font-bold text-gray-800 border-b-2 border-teal-500 focus:outline-none w-full bg-transparent placeholder-gray-400"
                                        placeholder="Full Name"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-bold text-gray-800 font-sans tracking-tight">{user.name}</h1>
                                )}

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaUserTie className="text-teal-500" />
                                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider w-20">Login ID</span>
                                        <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-sm">{user._id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaEnvelope className="text-teal-500" />
                                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider w-20">Email</span>
                                        <span className="font-medium text-gray-700">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaPhone className="text-teal-500" />
                                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider w-20">Mobile</span>
                                        {isEditing ? (
                                            <input name="phone" value={formData.phone || ''} onChange={handleInputChange} className="border-b border-gray-300 focus:border-teal-500 outline-none flex-1 bg-transparent" placeholder="Phone Number" />
                                        ) : (
                                            <span className="font-medium text-gray-700">{user.phone || 'N/A'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-l pl-8 border-gray-200 hidden md:block">
                                <InfoRow label="Company" value="Dayflow Inc." />
                                <InfoRow
                                    label="Department"
                                    value={user.department}
                                    isEditing={isEditing}
                                    name="department"
                                    formData={formData}
                                    onChange={handleInputChange}
                                />
                                <InfoRow
                                    label="Location"
                                    value={user.address || 'Headquarters'}
                                    isEditing={isEditing}
                                    name="address"
                                    formData={formData}
                                    onChange={handleInputChange}
                                />
                                <InfoRow label="Role" value="HR Manager" />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="absolute top-4 right-8 animate-fadeIn">
                            <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="px-8 flex gap-8 border-t border-gray-200 bg-gray-50 mt-4 rounded-b-2xl">
                    {[
                        { id: 'private', label: 'Private Info' },
                        { id: 'resume', label: 'Resume' },
                        { id: 'salary', label: 'Salary Info' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 font-bold text-sm uppercase tracking-wide cursor-pointer border-b-4 transition-colors ${activeTab === tab.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'private' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {/* Left: About & Interests - Light Theme */}
                    <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold font-serif italic mb-4 text-teal-600 border-b border-gray-200 pb-2 flex justify-between items-center">
                                About Note
                            </h3>
                            {isEditing ? (
                                <textarea name="about" value={formData.about || ''} onChange={handleInputChange} className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg h-32 outline-none border border-gray-300 focus:border-teal-500 transition shadow-inner font-light resize-none" placeholder="Write a professional bio..." />
                            ) : (
                                <p className="text-gray-600 leading-relaxed font-light whitespace-pre-line text-lg">
                                    {user.about || "No details added yet."}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold font-serif italic mb-4 text-teal-600 border-b border-gray-200 pb-2">Interests & Hobbies</h3>
                            {isEditing ? (
                                <textarea name="interests" value={formData.interests || ''} onChange={handleInputChange} className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg h-24 outline-none border border-gray-300 focus:border-teal-500 transition shadow-inner font-light resize-none" placeholder="Your hobbies..." />
                            ) : (
                                <p className="text-gray-600 leading-relaxed font-light">
                                    {user.interests || "Reading, Traveling, Hiking"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Skills */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                            Skills
                            {!isEditing && <button className="text-xs bg-teal-50 text-teal-600 px-3 py-1 rounded-full hover:bg-teal-100 transition">+ Add</button>}
                        </h3>

                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                            <div className="flex flex-wrap gap-3">
                                {mockSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-white text-gray-700 shadow-sm rounded-lg font-semibold text-sm border-l-4 border-teal-500 transform transition hover:scale-105 cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            {mockSkills.length === 0 && <p className="text-gray-400 italic text-center mt-10">No skills added yet.</p>}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'resume' && (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100 animate-fadeIn min-h-[400px] flex flex-col justify-center items-center">
                    <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm">
                        <FaFileAlt />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume / CV Document</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Access and manage your professional documents, certificates, and resume here.</p>
                    <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-teal-700 transition transform hover:-translate-y-1">
                        View Current Resume
                    </button>
                    <div className="mt-8">
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            Last updated: <strong>Jan 15, 2025</strong>
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'salary' && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white text-teal-600 rounded-lg shadow-sm border border-gray-200 text-xl"><FaMoneyCheckAlt /></div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Compensation Structure</h2>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Confidential • Tier 1 Management</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-gray-400 uppercase font-bold">Annual CTC</span>
                            <span className="text-2xl font-bold text-gray-800">₹18,00,000</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Earnings Table */}
                            <div>
                                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-4 border-b pb-2">Earnings (Monthly)</h3>
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-100">
                                        <SalaryRow label="Basic Salary" value="₹85,000" />
                                        <SalaryRow label="House Rent Allowance (HRA)" value="₹42,500" />
                                        <SalaryRow label="Special Allowance" value="₹15,000" />
                                        <SalaryRow label="LTA" value="₹5,000" />
                                        <SalaryRow label="Performance Bonus" value="₹2,500" />
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-bold text-gray-800">
                                            <td className="pt-4">Gross Earnings</td>
                                            <td className="pt-4 text-right">₹1,50,000</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Deductions Table */}
                            <div>
                                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-4 border-b pb-2">Deductions (Monthly)</h3>
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-100">
                                        <SalaryRow label="Provident Fund (PF)" value="₹1,800" isDeduction />
                                        <SalaryRow label="Professional Tax" value="₹200" isDeduction />
                                        <SalaryRow label="Income Tax (TDS)" value="₹12,500" isDeduction />
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-bold text-gray-800">
                                            <td className="pt-4">Total Deductions</td>
                                            <td className="pt-4 text-right text-red-500">- ₹14,500</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Net Pay Highlight */}
                        <div className="mt-12 bg-teal-50 rounded-xl p-6 border border-teal-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                            <div>
                                <p className="text-teal-800 font-bold text-lg">Net Monthly Salary</p>
                                <p className="text-teal-600 text-sm">Disbursed on the 1st of every month</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="text-4xl font-bold text-gray-800">₹1,35,500</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const InfoRow = ({ label, value, isEditing, name, formData, onChange }) => (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors duration-200">
        <span className="text-gray-400 text-sm font-bold uppercase w-1/3">{label}</span>
        {isEditing && name ? (
            <input
                name={name}
                value={formData[name] || ''}
                onChange={onChange}
                className="text-right border-b border-gray-300 focus:border-teal-500 outline-none w-1/2 bg-white px-1"
            />
        ) : (
            <span className="text-gray-800 font-semibold flex-1 text-right">{value}</span>
        )}
    </div>
);

const SalaryRow = ({ label, value, isDeduction }) => (
    <tr className="group hover:bg-gray-50 transition-colors">
        <td className="py-3 text-gray-600 group-hover:text-gray-900">{label}</td>
        <td className={`py-3 text-right font-medium ${isDeduction ? 'text-red-500' : 'text-gray-800'}`}>{value}</td>
    </tr>
);

export default HRSummary;


