
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';   
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FindID from './pages/FindID';
import FindPassword from './pages/FindPassword';
import MyPage from './pages/MyPage';
import Guide from './pages/Guide';
import DataResult from './pages/DataResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/findid" element={<FindID />} />
        <Route path="/findpassword" element={<FindPassword />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/DataResult" element={<DataResult />} />
      </Routes>
    </Router>
  );
}

export default App;
