import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthUserPage.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function AuthUserPage() {
  const { isLoading, decodedAuth } = useAuth();
  const navigate = useNavigate();

  const users = [
    { userId: 'user1', userName: '홍길동' },
    { userId: 'user2', userName: '김철수' },
    { userId: 'user3', userName: '이영희' },
    { userId: 'user4', userName: '홍길동' },
    { userId: 'user5', userName: '김철수' },
    { userId: 'user6', userName: '이영희' },
    { userId: 'user7', userName: '홍길동' },
    { userId: 'user8', userName: '김철수' },
    { userId: 'user9', userName: '이영희' },
    // 더 많은 사용자 추가 가능
  ];

  useEffect(() => {
    if (!isLoading && decodedAuth !== 'ADMIN') {
      navigate('/');
    }
  }, [isLoading, decodedAuth, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="auth-user-page">
          <section className="auth-user-section">
            <p>로딩 중...</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="auth-user-page">
        <section className="auth-user-section">
          <p className="user-list-title">User List</p>

          {/* 헤더 */}
          <div className="user-list-header">
            <span>UserName</span>
            <span>UserID</span>
          </div>

          {/* 스크롤 가능한 목록 */}
          <ul className="user-list-scroll">
            {users.map((user) => (
              <li
                key={user.userId}
                className="user-list-item"
                onClick={() => navigate(`/Data?user=${user.userId}`)}
              >
                <span>{user.userName}</span>
                <span>{user.userId}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default AuthUserPage;