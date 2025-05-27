import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Visualize.css';

function Visualize() {
  const { filename } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const user = searchParams.get('user');
  const date = searchParams.get('date');

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{filename} Visualization</h2>
        <p>---------------------------------- 해당 시각화 자료 설명 ----------------------------------</p>

        {/* 차트 등 추가 가능 */}
        <div></div>
      </div>
    </div>
  );
}

export default Visualize;
