import api from "../services/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }
        try {
            await api.get("../../sanctum/csrf-cookie");
            const res = await api.post("/login", {
                email,
                password
            });
            const token = res.data.access_token.plainTextToken;
            sessionStorage.setItem('auth_token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.get("/me");
            const hostname = window.location.hostname;

            if (hostname.startsWith("suadm")) {

                if (response.data.is_superadmin) {
                    setUser(response.data);
                    navigate("/dashboard");
                    return;
                }
            }
            if (hostname.startsWith("app")) {
                if (response.data.is_superadmin) {
                    window.location.href = import.meta.env.VITE_SDADM_URL;
                    return;
                }
                setUser(response.data);
                navigate("/conversations");
                return;
            }

        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            alert("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <img src="/logo.ico" width="120" />
                </div>

                <h2 className="login-title">Login</h2>

                <form className="login-form" onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}>

                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="login-button"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;