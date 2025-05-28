import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Data.css';
import Header from '../components/Header';
import uploadIcon from '../assets/upload.png';

function Data() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const uploadedFiles = [
    { id: 1, uploadedBy: 'user1', date: '2025-05-01' },
    { id: 2, uploadedBy: 'user2', date: '2025-05-02' },
    { id: 3, uploadedBy: 'user3', date: '2025-05-03' },
    { id: 4, uploadedBy: 'user4', date: '2025-05-07' },
  ];

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

  const navigate = useNavigate();

  // 날짜 필터링된 파일 목록 생성
  const filteredFiles = uploadedFiles.filter((file) => {
    const fileDate = new Date(file.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && fileDate < start) return false;
    if (end && fileDate > end) return false;
    return true;
  });

  // 정렬된 + 필터링된 파일 목록
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

          {/* 날짜 검색창 */}
          <div className="date-filter">
            <label>
              시작일:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
            <ul>
              {sortedFiles.length > 0 ? (
                sortedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="file-item clickable-box"
                    onClick={() =>
                      navigate(
                        `/FileList?user=${file.uploadedBy}&date=${file.date}`
                      )
                    }
                  >
                    <span className="file-name">{file.date}</span>
                    <span className="file-user">{file.uploadedBy}</span>
                  </li>
                ))
              ) : (
                <p>해당 날짜 범위의 파일이 없습니다.</p>
              )}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

export default Data;