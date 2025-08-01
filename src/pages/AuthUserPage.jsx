import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthUserPage.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// AuthUserPage 컴포넌트: 관리자 권한이 있는 사용자만 접근 가능한 페이지
function AuthUserPage() {
  const { isLoading, decodedAuth } = useAuth(); // AuthContext에서 로딩 상태와 사용자 권한 정보 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [users, setUsers] = useState([]); // 사용자 목록을 저장하는 상태
  const [error, setError] = useState(null); // 에러 메시지를 저장하는 상태

  // 컴포넌트 마운트 및 업데이트 시 실행되는 useEffect 훅
  useEffect(() => {
    // 권한 확인: 로딩이 완료되고 사용자가 ADMIN이 아닌 경우 홈으로 리디렉션
    if (!isLoading && decodedAuth !== 'ADMIN') {
      navigate('/');
    }

    // 모든 사용자 데이터를 API에서 가져오는 함수
    const fetchAllUsers = async () => {
      try {
        let allUsers = []; // 모든 사용자 데이터를 저장할 배열
        let page = 0; // 현재 페이지 번호
        let totalPages = 1; // 총 페이지 수

        // 모든 페이지를 순회하며 사용자 데이터 가져오기
        while (page < totalPages) {
          // API 호출: 페이지와 페이지당 데이터 수를 쿼리 파라미터로 전달
          const response = await fetch(`${import.meta.env.VITE_ALL_USER_LIST}?page=${page}&size=10`, {
            headers: {
              'Content-Type': 'application/json' // 요청 헤더 설정
            }
          });

          // 응답이 실패하면 에러 발생
          if (!response.ok) {
            throw new Error('사용자 데이터를 가져오지 못했습니다.');
          }

          const data = await response.json(); // 응답 데이터를 JSON으로 파싱
          // 사용자 데이터를 필요한 필드만 추출하여 매핑
          const mappedUsers = data.content.map(user => ({
            userId: user.userId,
            userName: user.userName
          }));

          // 기존 사용자 배열에 새로 가져온 사용자 데이터 추가
          allUsers = [...allUsers, ...mappedUsers];
          totalPages = data.totalPages; // 총 페이지 수 업데이트
          page++; // 다음 페이지로 이동
        }

        setUsers(allUsers); // 사용자 목록 상태 업데이트
      } catch (err) {
        setError(err.message); // 에러 발생 시 에러 메시지 저장
      }
    };

    // 로딩이 완료된 경우에만 사용자 데이터 가져오기
    if (!isLoading) {
      fetchAllUsers();
    }
  }, [isLoading, decodedAuth, navigate]); // 의존성 배열: isLoading, decodedAuth, navigate 변경 시 재실행

  // 로딩 중일 때 표시되는 UI
  if (isLoading) {
    return (
      <>
        <Header /> {/* 헤더 컴포넌트 렌더링 */}
        <main className="auth-user-page">
          <section className="auth-user-section">
            <p>로딩 중...</p> {/* 로딩 메시지 표시 */}
          </section>
        </main>
      </>
    );
  }

  // 에러 발생 시 표시되는 UI
  if (error) {
    return (
      <>
        <Header /> {/* 헤더 컴포넌트 렌더링 */}
        <main className="auth-user-page">
          <section className="auth-user-section">
            <p>에러: {error}</p> {/* 에러 메시지 표시 */}
          </section>
        </main>
      </>
    );
  }

  // 정상적으로 사용자 목록을 렌더링하는 UI
  return (
    <>
      <Header /> {/* 헤더 컴포넌트 렌더링 */}
      <main className="auth-user-page">
        <section className="auth-user-section">
          <p className="user-list-title">사용자 목록</p> {/* 사용자 목록 제목 */}

          {/* 사용자 목록 헤더 */}
          <div className="user-list-header">
            <span>사용자 이름</span>
            <span>사용자 ID</span>
          </div>

          {/* 스크롤 가능한 사용자 목록 */}
          <ul className="user-list-scroll">
            {users.map((user) => (
              <li
                key={user.userId} // 각 사용자 항목의 고유 키
                className="user-list-item"
                onClick={() => navigate(`/Data?user=${user.userId}`)} // 클릭 시 해당 사용자 데이터 페이지로 이동
              >
                <span>{user.userName}</span> {/* 사용자 이름 표시 */}
                <span>{user.userId}</span> {/* 사용자 ID 표시 */}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default AuthUserPage; // 컴포넌트 내보내기
