import React, { useEffect, useState } from 'react';
import '../styles/StatsSection.css';
import userIcon from '../assets/users.png';
import fileIcon from '../assets/storage.png';

function StatsSection() {
  const [userCount, setUserCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    // 나중에 API 연동 가능 
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setUserCount(data.userCount);
        setFileCount(data.fileCount);
      })
      .catch(() => {
        // 기본값 유지
      });
  }, []);

  return (
    <section className="stats-box-section">
      <div className="stats-box-grid">
        <div className="stat-box">
          <img src={userIcon} alt="Users" className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-number">{userCount.toLocaleString()}</div>
            <div className="stat-box-label">가입한 사용자 수</div>
          </div>
        </div>
        <div className="stat-box">
          <img src={fileIcon} alt="Files" className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-number">{fileCount.toLocaleString()}</div>
            <div className="stat-box-label">업로드된 파일 수</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
