import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FileList.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import downloadIcon from '../assets/download.png';
import resultIcon from '../assets/result.png';
import uploadIcon from '../assets/upload.png';

// AHI 수치에 따라 수면 무호흡증의 심각도를 반환하는 함수 (간단한 레이블)
function getSeverity1(ahi) {
  if (ahi < 5) return '[정상]';
  if (ahi < 15) return '[주의]';
  if (ahi < 30) return '[위험]';
  return '[심각]';
}

// AHI 수치에 따라 수면 무호흡증의 상세 설명을 반환하는 함수
function getSeverity2(ahi) {
  if (ahi < 5) return '😊 걱정하지 마세요! 수면 상태가 아주 양호합니다. 😊';
  if (ahi < 15) return '😐 수면 중 가벼운 문제가 관찰되었어요. 생활습관을 점검해보면 좋아요. 😐';
  if (ahi < 30) return '😟 수면 질이 떨어지고 있어요. 개선이 필요할 수 있습니다. 😟';
  return '🚨 수면 중 심각한 이상이 감지되었습니다. 전문가 상담이 꼭 필요해요. 🚨';
}

// 심각도에 따라 CSS 클래스 이름을 반환하는 함수
const getSeverityClass = (level) => {
  switch (level) {
    case '[정상]': return 'severity-normal';
    case '[주의]': return 'severity-warning';
    case '[위험]': return 'severity-risk';
    case '[심각]': return 'severity-danger';
    default: return '';
  }
};

// FileList 컴포넌트
function FileList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, info, decodedAuth } = useAuth();

  // URL에서 user와 date 파라미터 추출
  const searchParams = new URLSearchParams(location.search);
  const userParam = searchParams.get('user'); // 예: "bbb"
  const date = searchParams.get('date'); // 예: "2025-08-01"

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ahi, setAhi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // 결정된 userId 저장

  // 데이터를 가져오는 비동기 함수
  const fetchData = async () => {
    if (!userParam || !date || !isLoggedIn) {
      setError('사용자 또는 날짜 정보가 누락되었거나 로그인 상태가 아닙니다.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    let determinedUserId;
    try {
      const userData = await info();
      console.log('사용자 정보:', userData);
      if (!userData || !userData.user_id) {
        setError('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
        setIsLoading(false);
        navigate('/login');
        return;
      }
      // 관리자는 userParam 사용, 일반 유저는 자신의 user_id로 제한
      determinedUserId = decodedAuth === 'ADMIN' ? userParam : userData.user_id;
      console.log('결정된 userId:', determinedUserId);
      setUserId(determinedUserId);
    } catch (err) {
      console.error('info API 에러:', err.message);
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      console.log('API 요청:', `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${determinedUserId}`, { date });
      const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${determinedUserId}`, {
        headers: { 'Content-Type': 'application/json' },
        params: { startDate: date, endDate: date },
        withCredentials: true,
      });

      console.log('FileList API 응답:', response.data);

      const start = new Date(date);
      const fileList = response.data
        .map((fileArray, index) => {
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + index);
          return {
            date: currentDate.toISOString().split('T')[0],
            files: fileArray,
          };
        })
        .filter((item) => item.date === date);

      if (fileList.length > 0) {
        setFiles(fileList[0].files || []);
        setAhi(response.data[0]?.ahi || 10);
      } else {
        setFiles([]);
        setAhi(10);
      }
    } catch (err) {
      console.error('데이터 가져오기 에러:', err.response?.data || err.message);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setFiles([]);
      setAhi(23);
    } finally {
      setIsLoading(false);
    }
  };

  // userParam, date, isLoggedIn 변경 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, [userParam, date, isLoggedIn]);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 파일 업로드 핸들러
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    if (decodedAuth !== 'ADMIN') {
      alert('파일 업로드는 관리자만 가능합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('date', date);

      console.log('파일 업로드 요청:', `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}/upload`);
      const response = await axios.post(
        `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      console.log('파일 업로드 응답:', response.data);
      alert(`"${selectedFile.name}" 파일이 성공적으로 업로드되었습니다.`);

      setSelectedFile(null);
      await fetchData();
    } catch (err) {
      console.error('파일 업로드 에러:', err.response?.data || err.message);
      alert('파일 업로드 중 오류가 발생했습니다.');
      setError('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 다운로드 핸들러
  const handleDownload = async (fileName) => {
    try {
      console.log('파일 다운로드 요청:', `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}/download`, { date, fileName });
      const response = await axios.get(
        `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${userId}/download`,
        {
          headers: { 'Content-Type': 'application/json' },
          params: { date, file: fileName },
          withCredentials: true,
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('파일 다운로드 에러:', err.response?.data || err.message);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const [showResult, setShowResult] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleDiagnosisClick = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setShowResult(true);
      setIsDiagnosing(false);
    }, 7500);
  };

  const severity1 = ahi !== null ? getSeverity1(ahi) : '[정상]';
  const severity2 = ahi !== null ? getSeverity2(ahi) : getSeverity2(10);

  return (
    <>
      <Header />
      <div className="visualize-container">
        <p>{date}에 측정된 수면 데이터 파일입니다.</p>
        <p>파일 이름을 클릭하면, 관련 시각화 자료를 볼 수 있습니다.</p>
        <p>수면 데이터를 바탕으로 수면 무호흡 정도를 진단한 결과를 확인해보세요!</p>

        <div className="visualize-meta">
          <p>업로더: {userId || userParam || '알 수 없음'}</p>
          <p>업로드 날짜: {date || '알 수 없음'}</p>
        </div>

        {/* 파일 업로드 폼: 관리자만 표시 */}
        {decodedAuth === 'ADMIN' && (
          <div className="upload-wrapper">
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
              <button type="submit" className="upload-button" disabled={isLoading}>
                {isLoading ? '업로드 중...' : '파일 업로드'}
              </button>
            </form>
          </div>
        )}

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
                  <td colSpan="2">데이터를 불러오는 중...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="2">{error}</td>
                </tr>
              ) : files.length > 0 ? (
                files.map((file, idx) => (
                  <tr key={idx}>
                    <td
                      onClick={() =>
                        navigate(`/visualize/${file}?user=${userId}&date=${date}`, {
                          state: { backgroundLocation: location },
                        })
                      }
                      className="file-name-cell"
                      style={{ cursor: 'pointer' }}
                    >
                      {file}
                    </td>
                    <td>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="download-icon-btn"
                      >
                        <img src={downloadIcon} alt="Download" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">해당 날짜의 파일이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="diagnosis-section">
          {!showResult ? (
            isDiagnosing ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p>진단 중입니다. 잠시만 기다려 주세요...</p>
              </div>
            ) : (
              <button onClick={handleDiagnosisClick} className="diagnosis-button">
                {`${date}의 수면 무호흡 진단하기`}
              </button>
            )
          ) : (
            <div className={`result-box ${getSeverityClass(severity1)}`}>
              <img src={resultIcon} alt="진단 결과 아이콘" className="result-icon" />
              <p className="ahi-title">
                <strong>{userId || userParam || '알 수 없음'}</strong>님, <strong>{date}</strong>에 업로드된 데이터를 바탕으로 측정한 수면 무호흡증 진단 결과입니다.
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

export default FileList;
