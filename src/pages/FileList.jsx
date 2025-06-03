import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FileList.css';
import Header from '../components/Header';
import downloadIcon from '../assets/download.png';
import resultIcon from '../assets/result.png';
import uploadIcon from '../assets/upload.png';

function getSeverity1(ahi) {
  if (ahi < 5) return '[정상]';
  if (ahi < 15) return '[주의]';
  if (ahi < 30) return '[위험]';
  return '[심각]';
}

function getSeverity2(ahi) {
  if (ahi < 5) return '😊 걱정하지 마세요! 수면 상태가 아주 양호합니다. 😊';
  if (ahi < 15) return '😐 수면 중 가벼운 문제가 관찰되었어요. 생활습관을 점검해보면 좋아요. 😐';
  if (ahi < 30) return '😟 수면 질이 떨어지고 있어요. 개선이 필요할 수 있습니다. 😟';
  return '🚨 수면 중 심각한 이상이 감지되었습니다. 전문가 상담이 꼭 필요해요. 🚨';
}

const getSeverityClass = (level) => {
  switch (level) {
    case '[정상]':
      return 'severity-normal';
    case '[주의]':
      return 'severity-warning';
    case '[위험]':
      return 'severity-risk';
    case '[심각]':
      return 'severity-danger';
    default:
      return '';
  }
};

function FileList() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const user = searchParams.get('user'); // 예: "admin"
  const date = searchParams.get('date'); // 예: "2025-05-31"

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ahi, setAhi] = useState(null); // AHI 값을 API에서 가져옴
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !date) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            startDate: date, // 단일 날짜로 요청
            endDate: date,
          },
          withCredentials: true,
        });

        console.log('FileList API response:', response.data);

        // API 응답은 2D 배열이므로, 해당 날짜 인덱스에 맞는 데이터를 추출
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
          .filter((item) => item.date === date); // 해당 날짜 데이터만 필터링

        if (fileList.length > 0) {
          setFiles(fileList[0].files || []);
          setAhi(response.data[0]?.ahi || 10); // AHI 값은 API 응답에서 가져오도록 수정 가능
        } else {
          setFiles([]);
          setAhi(10); // 기본값
        }
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setFiles([]);
        setAhi(10); // 에러 시 기본값
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, date]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      alert(`"${selectedFile.name}" 파일이 업로드되었습니다.`);
    } else {
      alert('파일을 선택해주세요.');
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_DATA_LIST_API_URL}${user}/download`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            date: date, // 쿼리 파라미터로 date 추가
            file: fileName, // 쿼리 파라미터로 file 추가
          },
          withCredentials: true,
          responseType: 'blob', // 파일 다운로드를 위해 blob 타입으로 설정
        }
      );

      // Blob 데이터를 다운로드 링크로 변환
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 파일명 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // 메모리 해제
    } catch (err) {
      console.error('Error downloading file:', err.response?.data || err.message);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
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
          <p>업로더: {user}</p>
          <p>업로드 날짜: {date}</p>
        </div>

        {/* 인가 사용자만 업로드 가능 */}
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
            <button type="submit" className="upload-button">
              파일 업로드
            </button>
          </form>
        </div>

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
                        navigate(`/visualize/${file}?user=${user}&date=${date}`, {
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
      </div>
    </>
  );
}

export default FileList;
