import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Data.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import uploadIcon from '../assets/upload.png';

function Data() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
  const [startDate, setStartData] = useState('');
  const [endDate, setEndDate] = useState('');
  const [files, setFiles] = useState([]); // State for fetched data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const { isLoggedIn } = useAuth(); // Access auth context
  const navigate = useNavigate();

  // Fetch data when startDate or endDate changes
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !isLoggedIn) return; // Only fetch if logged in and dates are set

      setIsLoading(true);
      setError(null);

      try {
        
        const response = await axios.get(import.meta.env.VITE_USER_DATA_LIST_API_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            startDate,
            endDate,
          },
          withCredentials: true,
        });

        console.log('API response:', response.data);

        // Assuming the API returns an array of objects with id, uploadedBy, and date
        // Adjust the data structure based on actual API response
        setFiles(response.data || []);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, isLoggedIn]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      alert(`"${selectedFile.name}" 파일 업로드 예정 (백엔드 연동 필요)`);
      // TODO: Implement file upload API call if needed
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  // Filter files by date (client-side, in case API doesn't filter)
  const filteredFiles = files.filter((file) => {
    const fileDate = new Date(file.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && fileDate < start) return false;
    if (end && fileDate > end) return false;
    return true;
  });

  // Sort filtered files
  const sortedFiles = [...filteredFiles].sort((a, b) =>
    sortOrder === 'latest'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      <Header />
      <main className="data-main">
        <section className="data-result-page">
          <h2>Data File List</h2>

          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="fileUpload" className="upload-icon-label">
              <img src={uploadIcon} alt="파일 업로드" />
            </label>
            <span className="file-name">
              {selectedFile ? selectedFile.name : '선택된 파일 없음'}
            </span>
            <button type="submit" className="upload-button">
              파일 업로드
            </button>
          </form>

          {/* Date filter inputs */}
          <div className="date-filter">
            <label>
              시작일:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartData(e.target.value)}
              />
            </label>
            <label>
              종료일:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <div className="file-list">
            <h3>업로드된 파일 목록</h3>
            <div className="sort-toggle">
              <button onClick={toggleSortOrder}>
                {sortOrder === 'latest' ? '최신순' : '오래된순'}
              </button>
            </div>
            {isLoading ? (
              <p>데이터를 불러오는 중...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : sortedFiles.length > 0 ? (
              <ul>
                {sortedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="file-item clickable-box"
                    onClick={() =>
                      navigate(`/FileList?user=${file.uploadedBy}&date=${file.date}`)
                    }
                  >
                    <span className="file-name">{file.date}</span>
                    <span className="file-user">{file.uploadedBy}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>해당 날짜 범위의 파일이 없습니다.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Data;