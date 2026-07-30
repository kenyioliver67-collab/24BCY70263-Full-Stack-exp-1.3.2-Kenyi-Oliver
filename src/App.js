import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";
import AdminPage from "./pages/AdminPage";
import Unauthorized from "./pages/Unauthorized";
import { verifyToken } from "./services/mockAuthApi";

function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const checkStoredToken = async() => {
            const storedToken = localStorage.getItem("jwt_token");
            if (storedToken) {
                const decoded = await verifyToken(storedToken);
                if (decoded) {
                    setToken(storedToken);
                    setUser(decoded);
                } else {
                    localStorage.removeItem("jwt_token");
                }
            }
            setCheckingSession(false);
        };

        checkStoredToken();
    }, []);

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem("jwt_token", newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        setUser(decoded);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        setToken(null);
        setUser(null);
    };

    if (checkingSession) {
        return <p > Checking session... < /p>;
    }

    return ( <
        div className = "App" > {
            user && ( <
                nav style = {
                    { marginBottom: "20px" } } >
                <
                span > Logged in as { user.username }({ user.role })— < /span> <
                button onClick = { handleLogout } > Logout < /button> <
                /nav>
            )
        }

        <
        Routes >
        <
        Route path = "/login"
        element = {
            token ? < Navigate to = "/dashboard" / > : < Login onLoginSuccess = { handleLoginSuccess }
            />
        }
        />

        <
        Route path = "/dashboard"
        element = { <
            ProtectedRoute token = { token }
            user = { user } >
            <
            Dashboard user = { user }
            /> <
            /ProtectedRoute>
        }
        />

        <
        Route path = "/editor"
        element = { <
            ProtectedRoute token = { token }
            user = { user }
            allowedRoles = {
                ["editor", "admin"] } >
            <
            EditorPage user = { user }
            /> <
            /ProtectedRoute>
        }
        />

        <
        Route path = "/admin"
        element = { <
            ProtectedRoute token = { token }
            user = { user }
            allowedRoles = {
                ["admin"] } >
            <
            AdminPage user = { user }
            /> <
            /ProtectedRoute>
        }
        />

        <
        Route path = "/unauthorized"
        element = { < Unauthorized / > }
        /> <
        Route path = "*"
        element = { < Navigate to = { token ? "/dashboard" : "/login" }
            />} / >
            <
            /Routes> <
            /div>
        );
    }

    export default App;