import React, { useState } from 'react';
import '../styles/DataResult.css';
import Header from '../components/Header';
import uploadIcon from '../assets/upload.png'; 

function DataResult() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
  const uploadedFiles = [
    { id: 1, name: 'a.csv', uploadedBy: 'user1',date: '2025-05-01',},
    { id: 2, name: 'b.csv', uploadedBy: 'user2',date: '2025-05-02',},
    { id: 3, name: 'c.csv', uploadedBy: 'user3',date: '2025-05-03',},
    { id: 4, name: 'd.csv', uploadedBy: 'user4',date: '2025-05-07',},
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


  const sortedFiles = [...uploadedFiles].sort((a, b) =>
    sortOrder === 'latest'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  return (
    <>
        <Header />
        <main className = "data-main">
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
              <button type="submit" className="upload-button">파일 업로드</button>
          </form>

          <div className="file-list">
              <h3>업로드된 파일 목록</h3>
              <div className="sort-toggle">
                <button onClick={toggleSortOrder}>
                  {sortOrder === 'latest' ? '최신순' : '오래된순'}
                </button>
              </div>
              <ul>
              {sortedFiles.map(file => (
                  <li key={file.id} className = 'file-item'>
                    <span className="file-name">{file.name}</span>
                    <span className="file-user">{file.uploadedBy}</span>
                    <span className="file-date">{file.date}</span>
                    <button onClick={() => alert(`"${file.name}" 다운로드 예정`)}>다운로드</button>
                  </li>
              ))}
              </ul>
          </div>
          </section>
        </main>
    </>
  );
}

export default DataResult;

