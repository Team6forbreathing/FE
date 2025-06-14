import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Data.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

function Data() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [files, setFiles] = useState([]); // State for fetched data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const { isLoggedIn, info } = useAuth(); // Access auth context
  const navigate = useNavigate();
  const location = useLocation();

  // Extract user parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const userParam = searchParams.get('user'); // e.g., "test" from ?user=test

  // Generate all dates between startDate and endDate
  const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Fetch data when startDate, endDate, or userParam changes
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !isLoggedIn) return; // Only fetch if logged in and dates are set

      setIsLoading(true);
      setError(null);

      let userId;
      if (userParam) {
        userId = userParam;
      } else {
        const userData = await info();
        userId = userData.user_id;
      }

      try {
        console.log("Fetching user data from:", `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}`);

        const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}`, {
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

        // Generate all dates in the range
        const dateRange = generateDateRange(startDate, endDate);

        // Process the 2D array into a list of objects with date and files
        const fileList = dateRange.map((date, index) => {
          const apiIndex = (new Date(date) - new Date(startDate)) / (1000 * 60 * 60 * 24);
          const files = response.data[apiIndex] || []; // Use empty array if no files for the date
          return {
            date,
            files,
          };
        });

        setFiles(fileList);
        console.log('Processed files:', fileList);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        // If error, still show the date range with empty files
        const dateRange = generateDateRange(startDate, endDate);
        setFiles(dateRange.map((date) => ({ date, files: [] })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, isLoggedIn, userParam]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      alert(`"${selectedFile.name}" 파일 업로드 예정 (백엔드 연동 필요)`);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  // Sort files by date
  const sortedFiles = [...files].sort((a, b) =>
    sortOrder === 'latest'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  // Group files by set number (e.g., _0, _1, _3)
  const groupFilesBySet = (fileArray) => {
    const sets = {};
    fileArray.forEach((file) => {
      const match = file.match(/_(\d+)\.(json|csv)/);
      if (match) {
        const setNumber = `_${match[1]}`;
        if (!sets[setNumber]) sets[setNumber] = [];
        sets[setNumber].push(file);
      }
    });
    return Object.entries(sets).map(([setNumber, files]) => ({ setNumber, files }));
  };

  return (
    <>
      <Header />
      <main className="data-main">
        <section className="data-result-page">
          <h2>Data File List</h2>

          <div className="date-filter">
            <label>
              조회 시작일:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </label>
            <label>
              조회 종료일:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </label>
          </div>

          <div className="file-list">
            <div className="file-list-header">
              <h3>업로드된 파일 목록</h3>
              <div className="sort-toggle">
                <button onClick={toggleSortOrder}>
                  {sortOrder === 'latest' ? '최신순' : '오래된순'}
                </button>
              </div>
            </div>
            {isLoading ? (
              <p className="loading-message">데이터를 불러오는 중...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : sortedFiles.length > 0 ? (
              <div className="file-list-container">
                {sortedFiles.map((item, index) => (
                  <div key={index} className="date-group">
                    <h4
                      className="date-header clickable-date"
                      onClick={() => navigate(`/FileList?user=${userParam || 'admin'}&date=${item.date}`)}
                    >
                      {item.date}
                    </h4>
                    {item.files.length > 0 ? (
                      groupFilesBySet(item.files).map(({ setNumber, files }, setIndex) => (
                        <div key={setIndex} className="file-set">
                          <div className="set-button">
                            <span className="set-title">수면데이터{setNumber}</span>
                          </div>
                          <div className="file-set-details">
                            {files.map((file, fileIndex) => (
                              <span key={fileIndex} className="file-detail">
                                {file}
                                {fileIndex < files.length - 1 && <span className="file-separator"> | </span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-files-message"></p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-files-message">해당 날짜 범위의 파일이 없습니다.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Data;
