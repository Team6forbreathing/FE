import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; 

function VisualizePage() {
  const { filename } = useParams();
  const [data, setData] = useState([]);

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
    <div>
      <h2>{filename} 시각화</h2>
      {/* 데이터 시각화 */}
    </div>
  );
}

export default VisualizePage;
