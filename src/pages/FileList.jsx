import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const user = searchParams.get('user');
  const date = searchParams.get('date');

  const [selectedFile, setSelectedFile] = useState(null);

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

  // 예시 파일 리스트
  const fileList = [
    { name: 'PPG_0.csv' },
    { name: 'ACC_0.csv' },
    { name: 'PPG_1.csv' },
    { name: 'ACC_1.csv' },
    { name: 'PPG_2.csv' },
    { name: 'ACC_2.csv' },
    { name: 'PPG_3.csv' },
    { name: 'ACC_3.csv' },
    { name: 'PPG_4.csv' },
    { name: 'ACC_4.csv' },
  ];

  const [ahi] = useState(10); // AHI 임시 수치
  const severity1 = getSeverity1(ahi);
  const severity2 = getSeverity2(ahi);

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
              {fileList.map((file, idx) => (
                <tr key={idx}>
                  <td
                    onClick={() =>
                      navigate(`/visualize/${file.name}?user=${user}&date=${date}`, {
                        state: { backgroundLocation: location },
                      })
                    }
                    className="file-name-cell"
                    style={{ cursor: 'pointer' }}
                  >
                    {file.name}
                  </td>
                  <td>
                    <a
                      href={`/files/${file.name}`}
                      download
                      className="download-icon-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={downloadIcon} alt="다운로드" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`result-box ${getSeverityClass(severity1)}`}>
          <img src={resultIcon} alt="진단 결과 아이콘" className="result-icon" />
          <p className="ahi-title">
            <strong>{user}</strong>님, <strong>{date}</strong>에 업로드된 데이터를 바탕으로 측정한 수면 무호흡증 진단 결과입니다.
          </p>
          <p className="ahi-result">
            AHI 수치: <strong>{ahi}</strong><br />
            Apnea Guard 진단 결과: <span className={getSeverityClass(severity1)}><strong>{severity1}</strong></span>
          </p>
          <hr />
          <hr />
          <p className="ahi-description">
            {severity2}
          </p>
        </div>
      </div>
    </>
  );
}

export default FileList;
