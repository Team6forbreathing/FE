import React, { useState } from 'react';
import '../styles/FindAccount.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function FindID() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleFindID = (e) => {
    e.preventDefault();
    alert(`입력된 이름: ${name}, 이메일: ${email}`);
    // 실제 아이디 찾기 로직 또는 API 호출 위치
  };

  return (
    <>
      <Header />
      <div className="find-wrapper">
        <form className="find-box" onSubmit={handleFindID}>
          <h2>Find ID</h2>
          <label>이름
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>이메일
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit">아이디 찾기</button>

          <div className="back-link">
            <Link to="/Login">로그인으로 돌아가기</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default FindID;