import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login";
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

    if (!token || !user) {
        return <Login onLoginSuccess = { handleLoginSuccess }
        />;
    }

    return ( <
        div className = "App" >
        <
        h2 > Welcome, { user.username }! < /h2> <
        p > Role: { user.role } < /p> <
        p > User ID: { user.sub } < /p> <
        p > Token expires at: { new Date(user.exp * 1000).toLocaleString() } < /p> <
        button onClick = { handleLogout } > Logout < /button>

        <
        details style = {
            { marginTop: "20px" } } >
        <
        summary > Show raw token(
            for demonstration) < /summary> <
        p style = {
            { wordBreak: "break-all", fontSize: "0.8em" } } > { token } < /p> <
        /details> <
        /div>
    );
}

export default App;