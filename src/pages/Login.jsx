import React, { useState } from 'react';
import '../styles/Login.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    console.log('Login attempt with:', { username, password });

    const result = await login(username, password);
    if (result.success) {
      const userNameCookie = Cookies.get('user_name');
      console.log('Login successful - Server response:', result);
      console.log('Current user_name cookie:', userNameCookie);
      setMessage(result.message || '로그인 성공!');
      // navigate('/dashboard'); // 디버깅용으로 주석 처리
    } else {
      console.error('Login failed:', result.message);
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
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit">Login</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}

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