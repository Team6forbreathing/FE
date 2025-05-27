import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import '../styles/FileList.css';
import Header from '../components/Header';
import downloadIcon from '../assets/download.png';

function FileList() {
  const { filename } = useParams();
  const [data, setData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const user = searchParams.get('user');
  const date = searchParams.get('date');

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
        <p>{date}에 측정된 수면 데이터 파일입니다. </p>
        <p>파일 이름을 클릭하면, 관련 시각화 자료를 볼 수 있습니다. </p>

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
                  <td
                    onClick={() =>
                      navigate(`/visualize/${file.name}?user=${user}&date=${date}`, {
                        state: { backgroundLocation: location },
                      })
                    }
                    className="file-name-cell"
                  >
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

export default FileList;
