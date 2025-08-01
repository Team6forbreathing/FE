import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Data.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// Data 컴포넌트: 사용자 데이터 파일 목록을 표시하고 관리하는 페이지
function Data() {
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일을 저장하는 상태
  const [sortOrder, setSortOrder] = useState('latest'); // 정렬 순서: 'latest'(최신순) 또는 'oldest'(오래된순)
  const [startDate, setStartDate] = useState(''); // 조회 시작일
  const [endDate, setEndDate] = useState(''); // 조회 종료일
  const [files, setFiles] = useState([]); // 가져온 파일 데이터를 저장하는 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [viewingUserId, setViewingUserId] = useState(null); // 현재 보고 있는 사용자의 ID를 저장할 상태
  
  const { isLoggedIn, info, decodedAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 user 파라미터 추출
  const searchParams = new URLSearchParams(location.search);
  const userParam = searchParams.get('user');

  // 시작일과 종료일 사이의 모든 날짜를 생성하는 함수
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

  // startDate, endDate, isLoggedIn, userParam, decodedAuth 변경 시 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      // 로그인 상태와 날짜가 설정되지 않은 경우 데이터 가져오지 않음
      if (!startDate || !endDate || !isLoggedIn) return;

      setIsLoading(true);
      setError(null);

      let userId;
      try {
        const userData = await info();
        if (!userData || !userData.user_id) {
          setError("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
          setIsLoading(false);
          return;
        }

        // 관리자는 userParam 사용, 일반 유저는 userData.user_id 사용
        if (decodedAuth === 'ADMIN' && userParam) {
          userId = userParam;
        } else {
          userId = userData.user_id;
        }
      } catch (err) {
        console.error("info API 에러:", err.message);
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
        return;
      }

      // 최종적으로 결정된 userId를 상태에 저장
      setViewingUserId(userId);

      try {
        console.log("사용자 데이터 가져오기:", `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}`);
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

        console.log('API 응답:', response.data);

        const dateRange = generateDateRange(startDate, endDate);
        const fileList = dateRange.map((date, index) => {
          const apiIndex = (new Date(date) - new Date(startDate)) / (1000 * 60 * 60 * 24);
          const files = response.data[apiIndex] || [];
          return {
            date,
            files,
          };
        });

        setFiles(fileList);
        console.log('처리된 파일 목록:', fileList);
      } catch (err) {
        console.error('데이터 가져오기 에러:', err.response?.data || err.message);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        const dateRange = generateDateRange(startDate, endDate);
        setFiles(dateRange.map((date) => ({ date, files: [] })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, isLoggedIn, userParam, decodedAuth, info]);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 파일 업로드 핸들러
  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      alert(`"${selectedFile.name}" 파일 업로드 예정 (백엔드 연동 필요)`);
    }
  };

  // 정렬 순서 토글
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  // 파일을 날짜 기준으로 정렬
  const sortedFiles = [...files].sort((a, b) =>
    sortOrder === 'latest'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  // 파일을 세트 번호로 그룹화
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

  // UI 렌더링
  return (
    <>
      <Header />
      <main className="data-main">
        <section className="data-result-page">
          <h2>데이터 파일 목록</h2>
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
                      onClick={() => {
                        // useEffect에서 결정된 viewingUserId 상태를 사용
                        if (viewingUserId) {
                            console.log("Navigating to FileList with:", { user: viewingUserId, date: item.date });
                            navigate(`/FileList?user=${viewingUserId}&date=${item.date}`);
                        } else {
                            console.warn("viewingUserId is null, redirecting to login");
                            navigate('/login');
                        }
                      }}
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
