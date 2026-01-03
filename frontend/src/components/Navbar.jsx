import React from 'react';
import { useAuth } from '../context/authContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-teal-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
            <h1 className="text-2xl font-bold font-serif tracking-wide">Dayflow HRMS</h1>
            <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                    <p className="font-semibold text-lg">{user?.name}</p>
                    <p className="text-xs text-teal-200 uppercase tracking-wider">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-teal-800 hover:bg-teal-900 text-teal-100 border border-teal-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
