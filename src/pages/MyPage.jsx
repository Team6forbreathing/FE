import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [recentDates, setRecentDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile information
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
  }, [info, isLoggedIn]);

  // Fetch recent data for the last 7 days
  useEffect(() => {
    const fetchRecentData = async () => {
      if (!isLoggedIn || !user.id || user.id === 'N/A') return;

      setIsLoading(true);
      setError(null);

      try {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // 7-day range including today

        const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
            endDate: today.toISOString().split('T')[0], // YYYY-MM-DD
          },
          withCredentials: true,
        });

        console.log('MyPage API response:', response.data);

        // API returns a 2D array: [[files for date1], [files for date2], ...]
        const dateList = response.data
          .map((fileArray, index) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + index);
            return {
              date: currentDate.toISOString().split('T')[0],
              files: fileArray,
            };
          })
          .filter(item => item.files && item.files.length > 0) // Only dates with files
          .slice(0, 3) // Up to 3 dates
          .map(item => ({
            id: item.date,
            date: item.date,
            uploadedBy: user.id,
            files: item.files,
          }));

        setRecentDates(dateList);
      } catch (err) {
        console.error('Error fetching recent data:', err.response?.data || err.message);
        setError(err.response?.data?.message || '최근 데이터를 불러오는 중 오류가 발생했습니다.');
        setRecentDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentData();
  }, [isLoggedIn, user.id]);

  // Handle file download for a specific date
  const handleDownload = async (date, files) => {
    try {
      // Download each file for the given date
      for (const fileName of files) {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user.id}/download`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              date: date,
              file: fileName,
            },
            withCredentials: true,
            responseType: 'blob',
          }
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      alert(`"${date}"의 파일들이 다운로드되었습니다.`);
    } catch (err) {
      console.error('Error downloading files:', err.response?.data || err.message);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header />
      <div className="mypage-wrapper">
        {/* Left: Profile Image + ID */}
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
        {/* Right: User Information Table */}
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

        {/* Recent Data Section */}
        {recentDates.length > 0 && (
          <div className="download-box">
            <div className="download-title-bar">수면 데이터 다운로드</div>
            <p className="download-description">
              최근 일주일간의 수면 기록 (최대 3일)을 확인하고 다운로드하세요.<br />
              날짜를 클릭하여 해당 날짜의 파일들을 다운로드할 수 있습니다.
            </p>

            {isLoading ? (
              <p>데이터를 불러오는 중...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <ul className="file-list">
                {recentDates.map((item, index) => (
                  <li
                    key={index}
                    className="file-item"
                    onClick={() => handleDownload(item.date, item.files)}
                  >
                    <span>📄 <p>{item.date}</p></span>
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

export default MyPage;
