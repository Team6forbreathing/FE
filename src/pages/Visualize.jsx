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

  // 예시 파일 리스트
  const fileList = [
    { name: 'PPG_0.csv'},
    { name: 'ACC_0.csv'},
    { name: 'PPG_1.csv'},
    { name: 'ACC_1.csv'},
    { name: 'PPG_2.csv'},
    { name: 'ACC_2.csv'},
    { name: 'PPG_3.csv'},
    { name: 'ACC_3.csv'},
    { name: 'PPG_4.csv'},
    { name: 'ACC_4.csv'},
  ];

  useEffect(() => {
    fetch(`/files/${filename}`)
      .then(res => res.text())
      .then(text => {
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
          <p>업로더: {user}</p>
          <p>업로드 날짜: {date}</p>
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
                  <td>
                    {file.name}
                  </td>
                  <td>
                    <a href={`/files/${file.name}`} download className="download-icon-btn">
                      <img src={downloadIcon} alt="다운로드" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="chart-wrapper">
          <div>{/* chart 1 */}</div>
          <div>{/* chart 2 */}</div>
          <div>{/* chart 3 */}</div>
          <div>{/* chart 4 */}</div>
        </div>
      </div>
    </>
  );
}

export default VisualizePage;
