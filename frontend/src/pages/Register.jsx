import React, { useState } from 'react';
import axiosInstance from '../utils/axiosHelper';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            setError('Mobile number must be 10 digits');
            return;
        }

        try {
            const res = await axiosInstance.post('/auth/register', { name, email, password, phone, role });
            if (res.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-teal-600 to-gray-100 font-sans py-8">
            <h2 className="text-4xl font-bold text-white mb-6 font-serif">Dayflow HRMS</h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Mobile Number</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="1234567890"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength="10"
                            pattern="\d{10}"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Role</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="employee">Employee</option>
                            <option value="hr">HR</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow-md transition duration-200 mt-2"
                    >
                        Register
                    </button>
                    <p className='mt-4 text-center text-sm text-gray-600'>
                        Already have an account? <Link to="/login" className='text-teal-600 font-bold hover:underline'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
