import React from 'react';
import '../styles/MyPage.css';
import Header from '../components/Header';

function MyPage() {
  const user = {
    id: 'Honggildong',
    name: '홍길동',
    gender: '남',
    age: 28,
    height: 182,
    weight: 78,
    complication: '없음',
  };

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
          <div className="info-title-bar">내 프로필</div> {/* 헤더 추가 */}
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
