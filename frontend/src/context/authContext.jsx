import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosHelper";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axiosInstance.get("/users/profile");
                    // Note: Backend user.routes.js has /profile returning {message, user}
                    if (res.data.success || res.status === 200) {
                        setUser(res.data.user);
                    } else {
                        setUser(null);
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.log(error);
                    setUser(null);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };

        verifyUser();
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
