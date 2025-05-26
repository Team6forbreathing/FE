import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StatsSection.css';
import userIcon from '../assets/users.png';
import fileIcon from '../assets/storage.png';

function StatsSection() {
  const [userCount, setUserCount] = useState('-');
  const [fileCount, setFileCount] = useState('-');

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const userResponse = await axios.get(import.meta.env.VITE_USER_COUNT_API_URL);
        setUserCount(userResponse.data.toLocaleString());
      } catch (error) {
        console.error('사용자 수 가져오기 오류:', error.message);
        setUserCount('-');
      }
    };

    const fetchFileCount = async () => {
      try {
        const fileResponse = await axios.get(import.meta.env.VITE_FILE_COUNT_API_URL);
        setFileCount(fileResponse.data.toLocaleString());
      } catch (error) {
        console.error('파일 수 가져오기 오류:', error.message);
        setFileCount('-');
      }
    };

    Promise.allSettled([fetchUserCount(), fetchFileCount()]);
  }, []);

  return (
    <section className="stats-box-section">
      <div className="stats-box-grid">
        <div className="stat-box">
          <img src={userIcon} alt="Users" className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-number">{userCount}</div>
            <div className="stat-box-label">가입한 사용자 수</div>
          </div>
        </div>
        <div className="stat-box">
          <img src={fileIcon} alt="Files" className="stat-box-icon" />
          <div className="stat-box-content">
            <div className="stat-box-number">{fileCount}</div>
            <div className="stat-box-label">업로드된 파일 수</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
