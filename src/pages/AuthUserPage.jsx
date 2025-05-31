import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindAccount.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function AuthUserPage() {
  const { isLoading, decodedAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && decodedAuth == 'USER') {
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
          <h1>인가 사용자 페이지</h1>
          <p>이 페이지는 인가 사용자만 접근할 수 있습니다.</p>
        </section>
      </main>
    </>
  );
}

export default AuthUserPage;