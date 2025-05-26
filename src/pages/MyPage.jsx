import React, { useState, useEffect } from 'react';
import '../styles/MyPage.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function MyPage() {
  const { info, isLoggedIn } = useAuth();
  const [user, setUser] = useState({
    id: 'N/A',
    name: 'N/A',
    gender: 'N/A',
    age: 0,
    height: 0,
    weight: 0,
    complication: '없음',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLoggedIn) {
        const userData = await info();
        if (userData) {
          setUser({
            id: userData.user_id || 'N/A',
            name: userData.user_name || 'N/A',
            gender: userData.user_gender === 'F' ? '여' : userData.user_gender === 'M' ? '남' : 'N/A',
            age: userData.user_age || 0,
            height: userData.user_height || 0,
            weight: userData.user_weight || 0,
            complication: userData.user_comp ? '있음' : '없음',
          });
        }
      } else {
        // Reset user state when not logged in
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
  }, [info, isLoggedIn]); // Added isLoggedIn to dependencies

  const dataFiles = [
    { name: 'sleep_2024-05-01.csv', url: '/files/sleep_2024-05-01.csv' },
    { name: 'sleep_2024-05-07.csv', url: '/files/sleep_2024-05-07.csv' },
    { name: 'sleep_2024-05-13.csv', url: '/files/sleep_2024-05-13.csv' },
  ];

  return (
    <>
      <Header />
      <div className="mypage-wrapper">
        {/* 왼쪽: 프로필 이미지 + ID */}
        <div className="left-profile-box">
          <div className="info-title-bar">내 프로필</div>
          <div className="profile-content">
            <div className="profile-icon">👤</div>
            <div className="user-id-box">
              <div className="id-label">ID</div>
              <div className="id-value">{user.id}</div>
            </div>
          </div>
        </div>
        {/* 오른쪽: 사용자 정보 테이블 */}
        <div className="right-info-box">
          <div className="info-title-bar">회원 정보</div>
          <table className="user-info-table">
            <tbody>
              <tr>
                <td><div className="cell-left">이름</div></td>
                <td><div className="cell-right">{user.name}</div></td>
              </tr>
              <tr>
                <td><div className="cell-left">성별</div></td>
                <td><div className="cell-right">{user.gender}</div></td>
              </tr>
              <tr>
                <td><div className="cell-left">나이</div></td>
                <td><div className="cell-right">{user.age}</div></td>
              </tr>
              <tr>
                <td><div className="cell-left">키</div></td>
                <td><div className="cell-right">{user.height}</div></td>
              </tr>
              <tr>
                <td><div className="cell-left">몸무게</div></td>
                <td><div className="cell-right">{user.weight}</div></td>
              </tr>
              <tr>
                <td><div className="cell-left">합병증 여부</div></td>
                <td><div className="cell-right">{user.complication}</div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="download-box">
          <div className="download-title-bar">수면 데이터 다운로드</div>
          <p className="download-description">업로드한 수면 데이터를 확인하고 개별 다운로드할 수 있습니다.</p>

          <ul className="file-list">
            {dataFiles.map((file, index) => (
              <li key={index} className="file-item">
                <span>📄 {file.name}</span>
                <a className="file-download-btn" href={file.url} download>
                  다운로드
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default MyPage;