import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FindID from './pages/FindID';
import FindPassword from './pages/FindPassword';
import MyPage from './pages/MyPage';
import Guide from './pages/Guide';
import Data from './pages/Data';
import FileList from './pages/FileList';
import Visualize from './pages/Visualize';

// 별도 컴포넌트로 분리하여 location 감지
function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {/* 평소처럼 렌더링하되, backgroundLocation 있으면 해당 위치를 기준으로 페이지 유지 */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/findid" element={<FindID />} />
        <Route path="/findpassword" element={<FindPassword />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/Data" element={<Data />} />
        <Route path="/FileList/:filename" element={<FileList />} />
      </Routes>

      {/* 모달로 뜨는 경우 */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/visualize/:filename" element={<Visualize />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
