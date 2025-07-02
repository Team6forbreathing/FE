import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FileList.css'; // FileList 스타일시트 가져오기
import Header from '../components/Header'; // 헤더 컴포넌트 가져오기
import downloadIcon from '../assets/download.png'; // 다운로드 아이콘
import resultIcon from '../assets/result.png'; // 진단 결과 아이콘
import uploadIcon from '../assets/upload.png'; // 업로드 아이콘

// AHI 수치에 따라 수면 무호흡증의 심각도를 반환하는 함수 (간단한 레이블)
function getSeverity1(ahi) {
  if (ahi < 5) return '[정상]'; // AHI 5 미만: 정상
  if (ahi < 15) return '[주의]'; // AHI 5~15 미만: 주의
  if (ahi < 30) return '[위험]'; // AHI 15~30 미만: 위험
  return '[심각]'; // AHI 30 이상: 심각
}

// AHI 수치에 따라 수면 무호흡증의 상세 설명을 반환하는 함수
function getSeverity2(ahi) {
  if (ahi < 5) return '😊 걱정하지 마세요! 수면 상태가 아주 양호합니다. 😊'; // 정상
  if (ahi < 15) return '😐 수면 중 가벼운 문제가 관찰되었어요. 생활습관을 점검해보면 좋아요. 😐'; // 주의
  if (ahi < 30) return '😟 수면 질이 떨어지고 있어요. 개선이 필요할 수 있습니다. 😟'; // 위험
  return '🚨 수면 중 심각한 이상이 감지되었습니다. 전문가 상담이 꼭 필요해요. 🚨'; // 심각
}

// 심각도에 따라 CSS 클래스 이름을 반환하는 함수
const getSeverityClass = (level) => {
  switch (level) {
    case '[정상]':
      return 'severity-normal'; // 정상 상태 스타일
    case '[주의]':
      return 'severity-warning'; // 주의 상태 스타일
    case '[위험]':
      return 'severity-risk'; // 위험 상태 스타일
    case '[심각]':
      return 'severity-danger'; // 심각 상태 스타일
    default:
      return ''; // 기본값 (스타일 없음)
  }
};

// FileList 컴포넌트: 특정 사용자와 날짜에 대한 파일 목록과 수면 무호흡 진단 결과를 표시
function FileList() {
  const location = useLocation(); // URL 정보 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // URL에서 user와 date 파라미터 추출
  const searchParams = new URLSearchParams(location.search);
  const user = searchParams.get('user'); // 예: "admin"
  const date = searchParams.get('date'); // 예: "2025-05-31"

  const [files, setFiles] = useState([]); // 파일 목록을 저장하는 상태
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일을 저장하는 상태
  const [ahi, setAhi] = useState(null); // API에서 가져온 AHI 값 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태

  // 데이터를 가져오는 비동기 함수
  const fetchData = async () => {
    if (!user || !date) return; // user 또는 date가 없으면 실행 중지

    setIsLoading(true); // 로딩 시작
    setError(null); // 기존 에러 초기화

    try {
      // API 호출: 특정 사용자와 날짜의 데이터 가져오기
      const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user}`, {
        headers: {
          'Content-Type': 'application/json', // 요청 헤더 설정
        },
        params: {
          startDate: date, // 단일 날짜로 요청
          endDate: date,
        },
        withCredentials: true, // 인증 정보 포함
      });

      console.log('FileList API 응답:', response.data);

      // API 응답(2D 배열)을 날짜와 파일 목록 객체로 변환
      const start = new Date(date);
      const fileList = response.data
        .map((fileArray, index) => {
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + index); // 인덱스 기반 날짜 계산
          return {
            date: currentDate.toISOString().split('T')[0], // ISO 포맷 날짜
            files: fileArray,
          };
        })
        .filter((item) => item.date === date); // 지정된 날짜 데이터만 필터링

      if (fileList.length > 0) {
        setFiles(fileList[0].files || []); // 파일 목록 설정
        setAhi(response.data[0]?.ahi || 10); // AHI 값 설정 (기본값 10)
      } else {
        setFiles([]); // 파일 없음
        setAhi(10); // 기본 AHI 값
      }
    } catch (err) {
      console.error('데이터 가져오기 에러:', err.response?.data || err.message);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setFiles([]); // 에러 시 빈 파일 목록
      setAhi(23); // 에러 시 기본 AHI 값
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // user 또는 date 변경 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, [user, date]); // 의존성 배열: user, date 변경 시 재실행

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // 선택된 파일 상태 업데이트
  };

  // 파일 업로드 핸들러
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작
    setError(null); // 기존 에러 초기화

    try {
      const formData = new FormData();
      formData.append('file', selectedFile); // FormData에 파일 추가
      formData.append('date', date); // FormData에 날짜 추가

      // 파일 업로드 API 호출
      const response = await axios.post(
        `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // 멀티파트 폼 데이터 설정
          },
          withCredentials: true, // 인증 정보 포함
        }
      );

      console.log('파일 업로드 응답:', response.data);
      alert(`"${selectedFile.name}" 파일이 성공적으로 업로드되었습니다.`);

      setSelectedFile(null); // 선택된 파일 초기화
      await fetchData(); // 업로드 후 파일 목록 새로고침
    } catch (err) {
      console.error('파일 업로드 에러:', err.response?.data || err.message);
      alert('파일 업로드 중 오류가 발생했습니다.');
      setError('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 파일 다운로드 핸들러
  const handleDownload = async (fileName) => {
    try {
      // 파일 다운로드 API 호출
      const response = await axios.get(
        `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user}/download`,
        {
          headers: {
            'Content-Type': 'application/json', // 요청 헤더 설정
          },
          params: {
            date: date, // 쿼리 파라미터로 날짜 추가
            file: fileName, // 쿼리 파라미터로 파일명 추가
          },
          withCredentials: true, // 인증 정보 포함
          responseType: 'blob', // 파일 다운로드를 위해 blob 타입 설정
        }
      );

      // Blob 데이터를 다운로드 링크로 변환
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 다운로드 파일명 설정
      document.body.appendChild(link);
      link.click(); // 다운로드 실행
      link.remove(); // 링크 요소 제거
      window.URL.revokeObjectURL(url); // 메모리 해제
    } catch (err) {
      console.error('파일 다운로드 에러:', err.response?.data || err.message);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const [showResult, setShowResult] = useState(false); // 진단 결과 표시 여부
  const [isDiagnosing, setIsDiagnosing] = useState(false); // 진단 중 상태

  // 진단 버튼 클릭 핸들러
  const handleDiagnosisClick = () => {
    setIsDiagnosing(true); // 진단 시작
    setTimeout(() => {
      setShowResult(true); // 7.5초 후 결과 표시
      setIsDiagnosing(false); // 진단 종료
    }, 7500);
  };

  // AHI 값에 따른 심각도 계산
  const severity1 = ahi !== null ? getSeverity1(ahi) : '[정상]'; // 간단한 심각도 레이블
  const severity2 = ahi !== null ? getSeverity2(ahi) : getSeverity2(10); // 상세 심각도 설명

  // UI 렌더링
  return (
    <>
      <Header /> {/* 헤더 컴포넌트 렌더링 */}

      <div className="visualize-container">
        <p>{date}에 측정된 수면 데이터 파일입니다.</p>
        <p>파일 이름을 클릭하면, 관련 시각화 자료를 볼 수 있습니다.</p>
        <p>수면 데이터를 바탕으로 수면 무호흡 정도를 진단한 결과를 확인해보세요!</p>

        {/* 메타 정보 표시 */}
        <div className="visualize-meta">
          <p>업로더: {user}</p>
          <p>업로드 날짜: {date}</p>
        </div>

        {/* 파일 업로드 폼 (인가 사용자만 가능) */}
        <div className="upload-wrapper">
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange} // 파일 선택 핸들러
              style={{ display: 'none' }} // input 숨김
            />
            <label htmlFor="fileUpload" className="upload-icon-label">
              <img src={uploadIcon} alt="파일 업로드" /> {/* 업로드 아이콘 */}
            </label>
            <span className="file-name">
              {selectedFile ? selectedFile.name : '선택된 파일 없음'} {/* 선택된 파일명 표시 */}
            </span>
            <button type="submit" className="upload-button" disabled={isLoading}>
              {isLoading ? '업로드 중...' : '파일 업로드'} {/* 업로드 버튼 */}
            </button>
          </form>
        </div>

        {/* 파일 목록 테이블 */}
        <div className="file-table-list">
          <table className="file-table">
            <thead>
              <tr>
                <th>파일명</th>
                <th>다운로드</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="2">데이터를 불러오는 중...</td> {/* 로딩 중 메시지 */}
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="2">{error}</td> {/* 에러 메시지 */}
                </tr>
              ) : files.length > 0 ? (
                files.map((file, idx) => (
                  <tr key={idx}>
                    <td
                      onClick={() =>
                        navigate(`/visualize/${file}?user=${user}&date=${date}`, {
                          state: { backgroundLocation: location }, // 시각화 페이지로 이동
                        })
                      }
                      className="file-name-cell"
                      style={{ cursor: 'pointer' }} // 클릭 가능 스타일
                    >
                      {file} {/* 파일명 표시 */}
                    </td>
                    <td>
                      <div
                        onClick={(e) => {
                          e.stopPropagation(); // 파일명 클릭 이벤트와 충돌 방지
                          handleDownload(file); // 다운로드 실행
                        }}
                        className="download-icon-btn"
                      >
                        <img src={downloadIcon} alt="Download" /> {/* 다운로드 아이콘 */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">해당 날짜의 파일이 없습니다.</td> {/* 파일 없음 메시지 */}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 진단 섹션 */}
        <div className="diagnosis-section">
          {!showResult ? (
            isDiagnosing ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p>진단 중입니다. 잠시만 기다려 주세요...</p> {/* 진단 중 스피너 */}
              </div>
            ) : (
              <button onClick={handleDiagnosisClick} className="diagnosis-button">
                {`${date}의 수면 무호흡 진단하기`} {/* 진단 버튼 */}
              </button>
            )
          ) : (
            <div className={`result-box ${getSeverityClass(severity1)}`}>
              <img src={resultIcon} alt="진단 결과 아이콘" className="result-icon" />
              <p className="ahi-title">
                <strong>{user}</strong>님, <strong>{date}</strong>에 업로드된 데이터를 바탕으로 측정한 수면 무호흡증 진단 결과입니다.
              </p>
              <p className="ahi-result">
                AHI 수치: <strong>{ahi !== null ? ahi : 'N/A'}</strong><br />
                Apnea Guard 진단 결과: <span className={getSeverityClass(severity1)}><strong>{severity1}</strong></span>
              </p>
              <hr />
              <hr />
              <p className="ahi-description">{severity2}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FileList; // 컴포넌트 내보내기
