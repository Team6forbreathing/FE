import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import '../styles/Visualize.css';

function Visualize() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const user = searchParams.get('user');
  const date = searchParams.get('date');
  // filename을 URL 파라미터에서 가져오지 않고, PPG 또는 ACC로 고정
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataType, setDataType] = useState('PPG'); // 기본적으로 PPG로 설정 (또는 ACC로 변경 가능)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 파일 경로를 하드코딩
        const filePath = dataType === 'PPG' ? '/data/PPG_0.csv' : '/data/ACC_0.csv';
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('파일을 찾을 수 없습니다.');
        const text = await response.text();
        const result = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        let parsedData = [];

        if (dataType === 'PPG') {
          parsedData = result.data
            .filter(
              (row) =>
                row['timestamp'] != null &&
                !isNaN(row['timestamp']) &&
                row['ppgG'] != null &&
                !isNaN(row['ppgG']) &&
                row['ppgIR'] != null &&
                !isNaN(row['ppgIR']) &&
                row['ppgR'] != null &&
                !isNaN(row['ppgR'])
            )
            .map((row) => ({
              timestamp: Number(row['timestamp']),
              ppgG: Number(row['ppgG']),
              ppgIR: Number(row['ppgIR']),
              ppgR: Number(row['ppgR']),
            }));
          setColumns(['ppgG', 'ppgIR', 'ppgR']);
        } else if (dataType === 'ACC') {
          parsedData = result.data
            .filter(
              (row) =>
                row['timestamp'] != null &&
                !isNaN(row['timestamp']) &&
                row['accX'] != null &&
                !isNaN(row['accX']) &&
                row['accY'] != null &&
                !isNaN(row['accY']) &&
                row['accZ'] != null &&
                !isNaN(row['accZ'])
            )
            .map((row) => ({
              timestamp: Number(row['timestamp']),
              accX: Number(row['accX']),
              accY: Number(row['accY']),
              accZ: Number(row['accZ']),
            }));
          setColumns(['accX', 'accY', 'accZ']);
        }

        setData(parsedData);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    fetchData();
  }, [dataType]);

  // 다운로드 함수
  const handleDownload = () => {
    const chartArea = document.getElementById('chart-container');
    if (!chartArea) {
      alert('그래프를 찾을 수 없습니다.');
      return;
    }

    html2canvas(chartArea, { backgroundColor: '#ffffff' }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `${dataType}_0-graph.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // 데이터 타입 전환 버튼 (PPG <-> ACC)
  const toggleDataType = () => {
    setDataType((prev) => (prev === 'PPG' ? 'ACC' : 'PPG'));
  };

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => navigate(-1)}>
          ×
        </button>

        <h2>{dataType}_0.csv Visualization</h2>

        {/* 데이터 타입 전환 버튼 */}
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button onClick={toggleDataType} className="toggle-button">
            {dataType === 'PPG' ? 'ACC 데이터 보기' : 'PPG 데이터 보기'}
          </button>
        </div>

        {/* 그래프 다운로드 버튼 */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
          <button onClick={handleDownload} className="download-button">
            그래프 다운로드 (PNG)
          </button>
        </div>

        {/* 그래프 영역 */}
        <div id="chart-container" style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString('ko-KR', { hour12: false })
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {columns.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={['#8884d8', '#82ca9d', '#ff7300'][idx % 3]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* 설명 텍스트 */}
          <div className="graph-description">
            {dataType === 'PPG' && (
              <div>
                <p>
                  PPG 데이터는 혈류량 변화를 측정한 생체신호로, 심박수와
                  산소포화도 등을 추정할 수 있습니다. 그래프의 파형은 심장
                  박동의 주기와 강도를 반영하며, 각 곡선은 다른 파장의 빛(ppgG:
                  녹색, ppgIR: 적외선, ppgR: 적색)을 나타냅니다.
                </p>
                <ul>
                  <li>
                    그래프의 X축: timestamp (측정 시간, 밀리초 단위 → 시간
                    변환됨)
                  </li>
                  <li>
                    그래프의 Y축: PPG 신호 값 (ppgG, ppgIR, ppgR 각각 다른 파장)
                  </li>
                  <li>ppgG: 녹색 광을 통한 PPG 값</li>
                  <li>ppgIR: 적외선(IR) 광을 통한 PPG 값</li>
                  <li>ppgR: 적색 광을 통한 PPG 값</li>
                  <li>
                    주기적으로 오르내리는 파형: 심장 박동 주기를 의미 (맥박)
                  </li>
                  <li>파형의 높이(진폭) 변화: 심박수, 혈류량의 변화</li>
                  <li>
                    잡음이나 이상 신호: 측정 중 움직임, 센서 문제 등을 나타낼 수
                    있음
                  </li>
                </ul>
              </div>
            )}
            {dataType === 'ACC' && (
              <div>
                <p>
                  ACC 데이터는 착용자의 움직임을 나타내는 가속도 데이터로, 각
                  곡선은 X, Y, Z 축 방향의 움직임을 보여줍니다. 그래프의 진폭이
                  클수록 움직임이 크며, 평평한 구간은 움직임이 적음을
                  의미합니다.
                </p>
                <ul>
                  <li>그래프의 X축: timestamp(측정시간)</li>
                  <li>그래프의 Y축: 각 축의 가속도 값(accX, axxY, accZ)</li>
                  <li>accX: X축 방향의 움직임(예: 왼쪽-오른쪽)</li>
                  <li>accY: Y축 방향의 움직임(예: 앞뒤)</li>
                  <li>accZ: Z축 방향의 움직임(예: 위아래)</li>
                  <li>
                    진폭이 큰 구간: 몸을 크게 움직였음을 의미(뒤척임, 활동)
                  </li>
                  <li>
                    진폭이 작은 구간: 움직임이 거의 없는 상태(수면 중 안정 상태)
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Visualize;
