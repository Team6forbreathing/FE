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
  const { isLoggedIn, info } = useAuth(); // AuthContext에서 로그인 상태와 사용자 정보 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const location = useLocation(); // URL 정보 가져오기

  // URL에서 user 파라미터 추출
  const searchParams = new URLSearchParams(location.search);
  const userParam = searchParams.get('user'); // 예: ?user=test에서 "test" 추출

  // 시작일과 종료일 사이의 모든 날짜를 생성하는 함수
  const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]); // 날짜를 ISO 포맷(YYYY-MM-DD)으로 추가
      currentDate.setDate(currentDate.getDate() + 1); // 다음 날로 이동
    }
    return dates;
  };

  // startDate, endDate, userParam, isLoggedIn 변경 시 데이터 가져오기
  useEffect(() => {
    // 데이터 가져오는 비동기 함수
    const fetchData = async () => {
      // 로그인 상태와 날짜가 설정되지 않은 경우 데이터 가져오지 않음
      if (!startDate || !endDate || !isLoggedIn) return;

      setIsLoading(true); // 로딩 시작
      setError(null); // 기존 에러 초기화

      let userId;
      if (userParam) {
        userId = userParam; // URL 파라미터에서 userId 가져오기
      } else {
        const userData = await info(); // AuthContext에서 사용자 정보 가져오기
        userId = userData.user_id;
      }

      try {
        // API 호출 로그
        console.log("사용자 데이터 가져오기:", `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}`);

        // 사용자 데이터를 API에서 가져오기
        const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}`, {
          headers: {
            'Content-Type': 'application/json', // 요청 헤더 설정
          },
          params: {
            startDate, // 시작일
            endDate, // 종료일
          },
          withCredentials: true, // 인증 정보 포함
        });

        console.log('API 응답:', response.data);

        // 날짜 범위 생성
        const dateRange = generateDateRange(startDate, endDate);

        // 2D 배열을 날짜와 파일 목록 객체로 변환
        const fileList = dateRange.map((date, index) => {
          const apiIndex = (new Date(date) - new Date(startDate)) / (1000 * 60 * 60 * 24); // 날짜 인덱스 계산
          const files = response.data[apiIndex] || []; // 해당 날짜의 파일이 없으면 빈 배열
          return {
            date,
            files,
          };
        });

        setFiles(fileList); // 파일 목록 상태 업데이트
        console.log('처리된 파일 목록:', fileList);
      } catch (err) {
        // 에러 처리
        console.error('데이터 가져오기 에러:', err.response?.data || err.message);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        // 에러 발생 시에도 날짜 범위는 표시하되 파일은 빈 배열로 설정
        const dateRange = generateDateRange(startDate, endDate);
        setFiles(dateRange.map((date) => ({ date, files: [] })));
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchData(); // 데이터 가져오기 실행
  }, [startDate, endDate, isLoggedIn, userParam]); // 의존성 배열: 지정된 값 변경 시 재실행

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // 선택된 파일 상태 업데이트
  };

  // 파일 업로드 핸들러 (현재는 백엔드 연동 없이 알림만 표시)
  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      alert(`"${selectedFile.name}" 파일 업로드 예정 (백엔드 연동 필요)`);
    }
  };

  // 정렬 순서 토글: 최신순 ↔ 오래된순
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  // 파일을 날짜 기준으로 정렬
  const sortedFiles = [...files].sort((a, b) =>
    sortOrder === 'latest'
      ? new Date(b.date) - new Date(a.date) // 최신순
      : new Date(a.date) - new Date(b.date) // 오래된순
  );

  // 파일을 세트 번호(_0, _1, _3 등)로 그룹화
  const groupFilesBySet = (fileArray) => {
    const sets = {};
    fileArray.forEach((file) => {
      const match = file.match(/_(\d+)\.(json|csv)/); // 파일명에서 세트 번호 추출
      if (match) {
        const setNumber = `_${match[1]}`; // 세트 번호 (예: _0, _1)
        if (!sets[setNumber]) sets[setNumber] = [];
        sets[setNumber].push(file); // 동일 세트에 파일 추가
      }
    });
    return Object.entries(sets).map(([setNumber, files]) => ({ setNumber, files })); // 세트별 객체로 변환
  };

  // UI 렌더링
  return (
    <>
      <Header /> {/* 헤더 컴포넌트 렌더링 */}
      <main className="data-main">
        <section className="data-result-page">
          <h2>데이터 파일 목록</h2> {/* 페이지 제목 */}

          {/* 날짜 필터 입력란 */}
          <div className="date-filter">
            <label>
              조회 시작일:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} // 시작일 업데이트
                className="date-input"
              />
            </label>
            <label>
              조회 종료일:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} // 종료일 업데이트
                className="date-input"
              />
            </label>
          </div>

          {/* 파일 목록 섹션 */}
          <div className="file-list">
            <div className="file-list-header">
              <h3>업로드된 파일 목록</h3> {/* 파일 목록 제목 */}
              <div className="sort-toggle">
                <button onClick={toggleSortOrder}>
                  {sortOrder === 'latest' ? '최신순' : '오래된순'} {/* 정렬 버튼 */}
                </button>
              </div>
            </div>
            {isLoading ? (
              <p className="loading-message">데이터를 불러오는 중...</p> // 로딩 중 메시지
            ) : error ? (
              <p className="error-message">{error}</p> // 에러 메시지
            ) : sortedFiles.length > 0 ? (
              <div className="file-list-container">
                {sortedFiles.map((item, index) => (
                  <div key={index} className="date-group">
                    <h4
                      className="date-header clickable-date"
                      onClick={() => navigate(`/FileList?user=${userParam || 'admin'}&date=${item.date}`)} // 날짜 클릭 시 상세 페이지로 이동
                    >
                      {item.date} {/* 날짜 표시 */}
                    </h4>
                    {item.files.length > 0 ? (
                      groupFilesBySet(item.files).map(({ setNumber, files }, setIndex) => (
                        <div key={setIndex} className="file-set">
                          <div className="set-button">
                            <span className="set-title">수면데이터{setNumber}</span> {/* 세트 제목 */}
                          </div>
                          <div className="file-set-details">
                            {files.map((file, fileIndex) => (
                              <span key={fileIndex} className="file-detail">
                                {file} {/* 파일명 표시 */}
                                {fileIndex < files.length - 1 && <span className="file-separator"> | </span>} {/* 파일 구분자 */}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-files-message"></p> // 파일 없음 메시지 (빈 태그)
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-files-message">해당 날짜 범위의 파일이 없습니다.</p> // 파일이 없는 경우 메시지
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Data; // 컴포넌트 내보내기
