import React, { useState } from 'react';
import '../styles/Login.css';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <Header />
      
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <div className="login-links">
          <Link to="/FindID">아이디 찾기</Link>
          <span>|</span>
          <Link to="/FindPassword">비밀번호 찾기</Link>
        </div>

        <div className="register-prompt">
          <span>계정이 없으신가요? </span>
          <Link to="/SignUp">회원가입</Link>
        </div>
      </form>
    </div>
  </>
  );
}

export default Login;