import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthUserPage.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function AuthUserPage() {
  const { isLoading, decodedAuth } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authorization
    if (!isLoading && decodedAuth !== 'ADMIN') {
      navigate('/');
    }

    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_ALL_USER_LIST, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        // Map only userId and userName from the content array
        const mappedUsers = data.content.map(user => ({
          userId: user.userId,
          userName: user.userName
        }));
        setUsers(mappedUsers);
      } catch (err) {
        setError(err.message);
      }
    };

    if (!isLoading) {
      fetchUsers();
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

  if (error) {
    return (
      <>
        <Header />
        <main className="auth-user-page">
          <section className="auth-user-section">
            <p>Error: {error}</p>
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
