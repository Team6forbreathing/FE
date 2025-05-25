import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; 
import '../styles/Visualize.css';
import Header from '../components/Header';
import downloadIcon from '../assets/download.png';

function VisualizePage() {
  const { filename } = useParams();
  const [data, setData] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const user = searchParams.get('user');
  const date = searchParams.get('date');

  useEffect(() => {
    fetch(`/files/${filename}`)
      .then(res => res.text())
      .then(text => {
        // CSV 파싱
        const lines = text.split('\n').filter(Boolean);
        const parsed = lines.map(line => line.split(','));
        setData(parsed);
      });
  }, [filename]);

  return (
    <>
      <Header />

      <div className="visualize-container">
        <h2>Data visualization</h2>
        <div className="visualize-meta">
          <p>파일명: {filename}</p>
          <p>업로더: {user}</p>
          <p>업로드 날짜: {date}</p>
          <a href={`/files/${filename}`} download className="download-icon-btn">
            <img src={downloadIcon} alt="다운로드" />
          </a>
        </div>
        <div className="chart-wrapper">
          {/* 시각화 자료 4개 넣을 수 있음 */}
          <div>
            {/* chart 1 */}
          </div>
          <div>
            {/* chart 2 */}
          </div>
          <div>
            {/* chart 3 */}
          </div>
          <div>
            {/* chart 4 */}
          </div>
        </div>
      </div>
    </>
  );
}

export default VisualizePage;
