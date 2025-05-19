import React, { useState } from 'react';
import '../styles/FindAccount.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function FindPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleFindPassword = (e) => {
    e.preventDefault();
    alert(`입력된 아이디: ${username}, 이메일: ${email}`);
    // 실제 비밀번호 찾기 로직 또는 API 호출 위치
  };

  return (
    <>
    <Header />
    <div className="find-wrapper">
      <form className="find-box" onSubmit={handleFindPassword}>
        <h2>Find Password</h2>
        <label>아이디
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">비밀번호 찾기</button>

        <div className="back-link">
          <Link to="/Login">로그인으로 돌아가기</Link>
        </div>
      </form>
    </div>
    </>
  );
}

export default FindPassword;