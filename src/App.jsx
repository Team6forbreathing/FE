
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FindID from './pages/FindID';
import FindPassword from './pages/FindPassword';
import MyPage from './pages/MyPage';
import Guide from './pages/Guide';
import Data from './pages/Data';
import FileList from './pages/FileList';

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
        <Route path="/Data" element={<Data />} />
        <Route path="/FileList/:filename" element={<FileList />} />
      </Routes>
    </Router>
  );
}

export default App;
