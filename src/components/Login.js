import { useState } from "react";
import { loginRequest } from "../services/mockAuthApi";

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async(e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const { token } = await loginRequest(username, password);
            onLoginSuccess(token);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "login-container" >
        <
        h2 > Login < /h2> <
        form onSubmit = { handleLogin } >
        <
        div >
        <
        label > Username: < /label> <
        input type = "text"
        value = { username }
        onChange = {
            (e) => setUsername(e.target.value)
        }
        /> < /
        div > <
        div >
        <
        label > Password: < /label> <
        input type = "password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        /> < /
        div > <
        button type = "submit"
        disabled = { loading } > { loading ? "Logging in..." : "Login" } <
        /button> {
        errorMsg && < p style = {
            { color: "red" }
        } > { errorMsg } < /p>} < /
        form > <
        p style = {
            { fontSize: "0.85em", color: "gray" }
        } >
        Try: alice / password123, or admin / adminpass <
        /p> < /
        div >
    );
}

export default Login;