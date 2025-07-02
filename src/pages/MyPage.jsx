import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyPage.css'; // MyPage 스타일시트 가져오기
import Header from '../components/Header'; // 헤더 컴포넌트 가져오기
import { useAuth } from '../context/AuthContext'; // 인증 컨텍스트 가져오기

// MyPage 컴포넌트: 사용자 프로필 정보와 최근 수면 데이터를 표시하는 페이지
function MyPage() {
  const { info, isLoggedIn } = useAuth(); // AuthContext에서 사용자 정보와 로그인 상태 가져오기
  const [user, setUser] = useState({
    id: 'N/A', // 사용자 ID
    name: 'N/A', // 사용자 이름
    gender: 'N/A', // 성별
    age: 0, // 나이
    height: 0, // 키
    weight: 0, // 몸무게
    complication: '없음', // 합병증 여부
  });
  const [recentDates, setRecentDates] = useState([]); // 최근 7일간 데이터 날짜 목록
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 사용자 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLoggedIn) { // 로그인 상태일 때만 실행
        const userData = await info(); // 사용자 정보 가져오기
        if (userData) {
          setUser({
            id: userData.user_id || 'N/A', // 사용자 ID
            name: userData.user_name || 'N/A', // 사용자 이름
            gender: userData.user_gender === 'F' ? '여' : userData.user_gender === 'M' ? '남' : 'N/A', // 성별 변환
            age: userData.user_age || 0, // 나이
            height: userData.user_height || 0, // 키
            weight: userData.user_weight || 0, // 몸무게
            complication: userData.user_comp ? '있음' : '없음', // 합병증 여부
          });
        }
      } else {
        // 로그인하지 않은 경우 기본값 설정
        setUser({
          id: 'N/A',
          name: 'N/A',
          gender: 'N/A',
          age: 0,
          height: 0,
          weight: 0,
          complication: '없음',
        });
      }
    };
    fetchUserInfo();
  }, [info, isLoggedIn]); // 의존성 배열: info, isLoggedIn 변경 시 재실행

  // 최근 7일간 데이터 가져오기
  useEffect(() => {
    const fetchRecentData = async () => {
      if (!isLoggedIn || !user.id || user.id === 'N/A') return; // 로그인하지 않았거나 유효한 ID가 없으면 실행 중지

      setIsLoading(true); // 로딩 시작
      setError(null); // 기존 에러 초기화

      try {
        const today = new Date(); // 오늘 날짜
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // 오늘 포함 7일 범위 설정

        // API 호출: 사용자 데이터 가져오기
        const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user.id}`, {
          headers: {
            'Content-Type': 'application/json', // 요청 헤더 설정
          },
          params: {
            startDate: startDate.toISOString().split('T')[0], // 시작일 (YYYY-MM-DD)
            endDate: today.toISOString().split('T')[0], // 종료일 (YYYY-MM-DD)
          },
          withCredentials: true, // 인증 정보 포함
        });

        console.log('MyPage API 응답:', response.data);

        // API 응답(2D 배열)을 날짜와 파일 목록 객체로 변환
        const dateList = response.data
          .map((fileArray, index) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + index); // 인덱스 기반 날짜 계산
            return {
              date: currentDate.toISOString().split('T')[0], // ISO 포맷 날짜
              files: fileArray,
            };
          })
          .filter(item => item.files && item.files.length > 0) // 파일이 있는 날짜만 필터링
          .slice(0, 3) // 최대 3일만 표시
          .map(item => ({
            id: item.date,
            date: item.date,
            uploadedBy: user.id, // 업로더 ID
          }));

        setRecentDates(dateList); // 최근 날짜 목록 상태 업데이트
      } catch (err) {
        console.error('최근 데이터 가져오기 에러:', err.response?.data || err.message);
        setError(err.response?.data?.message || '최근 데이터를 불러오는 중 오류가 발생했습니다.');
        setRecentDates([]); // 에러 시 빈 목록 설정
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchRecentData();
  }, [isLoggedIn, user.id]); // 의존성 배열: isLoggedIn, user.id 변경 시 재실행

  // UI 렌더링
  return (
    <>
      <Header /> {/* 헤더 컴포넌트 렌더링 */}
      <div className="mypage-wrapper">
        {/* 좌측: 프로필 이미지 + ID */}
        <div className="left-profile-box">
          <div className="info-title-bar">내 프로필</div> {/* 프로필 섹션 제목 */}
          <div className="profile-content">
            <div className="profile-icon">👤</div> {/* 프로필 아이콘 */}
            <div className="user-id-box">
              <div className="id-label">ID</div>
              <div className="id-value">{user.id}</div> {/* 사용자 ID 표시 */}
            </div>
          </div>
        </div>
        {/* 우측: 사용자 정보 테이블 */}
        <div className="right-info-box">
          <div className="info-title-bar">회원 정보</div> {/* 회원 정보 섹션 제목 */}
          <table className="user-info-table">
            <tbody>
              <tr>
                <td><div className="cell-left">이름</div></td>
                <td><div className="cell-right">{user.name}</div></td> {/* 사용자 이름 */}
              </tr>
              <tr>
                <td><div className="cell-left">성별</div></td>
                <td><div className="cell-right">{user.gender}</div></td> {/* 성별 */}
              </tr>
              <tr>
                <td><div className="cell-left">나이</div></td>
                <td><div className="cell-right">{user.age}</div></td> {/* 나이 */}
              </tr>
              <tr>
                <td><div className="cell-left">키</div></td>
                <td><div className="cell-right">{user.height}</div></td> {/* 키 */}
              </tr>
              <tr>
                <td><div className="cell-left">몸무게</div></td>
                <td><div className="cell-right">{user.weight}</div></td> {/* 몸무게 */}
              </tr>
              <tr>
                <td><div className="cell-left">합병증 여부</div></td>
                <td><div className="cell-right">{user.complication}</div></td> {/* 합병증 여부 */}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 최근 데이터 섹션 */}
        {recentDates.length > 0 && (
          <div className="download-box">
            <div className="download-title-bar">수면 데이터 다운로드</div> {/* 수면 데이터 섹션 제목 */}
            <p className="download-description">
              최근 일주일간의 수면 기록 (최대 3일)을 확인하세요.<br />
              날짜를 클릭하여 해당 날짜의 파일들을 확인하고 다운로드할 수 있습니다.
            </p>

            {isLoading ? (
              <p>데이터를 불러오는 중...</p> // 로딩 중 메시지
            ) : error ? (
              <p>{error}</p> // 에러 메시지
            ) : (
              <ul className="file-list">
                {recentDates.map((item, index) => (
                  <li
                    key={index}
                    className="file-item"
                    onClick={() => navigate(`/FileList?user=${item.uploadedBy}&date=${item.date}`)} // 파일 목록 페이지로 이동
                  >
                    <span>📄 <p>{item.date}</p></span> {/* 날짜 표시 */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default MyPage; // 컴포넌트 내보내기
