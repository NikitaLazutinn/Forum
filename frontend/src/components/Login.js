import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, googleLogin } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");                        

    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem("token", data.accessToken);
      navigate("/");
    } catch (err) {
      const message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && (
          <p
            role="alert"
            aria-live="polite"
            class="error"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
        >
          Login
        </button>
      </form>
      <button
        onClick={googleLogin}
      >
        Login with Google
      </button>
      <p>
        <Link to="/forgot-password">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
}
