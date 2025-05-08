import React, { useState } from 'react';
import '../styles/Login.css';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Username: ${username}\nPassword: ${password}`);
  };

  return (
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
  );
}

export default Login;
