import React, { useState } from 'react';
import axiosInstance from '../utils/axiosHelper';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            if (res.status === 200) {
                login(res.data.user, res.data.token);
                if (res.data.user.role === 'hr') {
                    navigate('/hr-dashboard');
                } else {
                    navigate('/employee-dashboard');
                }
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
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-teal-600 to-gray-100 font-sans">
            <h2 className="text-4xl font-bold text-white mb-6 font-serif">Dayflow HRMS</h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="Type your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            placeholder="Type your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow-md transition duration-200"
                    >
                        Login
                    </button>
                    <p className='mt-4 text-center text-sm text-gray-600'>
                        Don't have an account? <Link to="/register" className='text-teal-600 font-bold hover:underline'>Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
