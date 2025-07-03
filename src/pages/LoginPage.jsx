import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/employee/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      const employeeData = {
        _id: data.employee.id,
        firstName: data.employee.firstName,
        lastName: data.employee.lastName,
        email: data.employee.email,
        location: data.employee.location,
        language: data.employee.language,
      };

      // ✅ Store both employee and login flag
      localStorage.setItem('employee', JSON.stringify(employeeData));
      localStorage.setItem('isLoggedIn', 'true');

      // ✅ Check-In API Trigger
      await fetch(`${API_BASE}/api/attendance/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: data.employee.id }),
      });

      // ✅ Redirect after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Employee Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
