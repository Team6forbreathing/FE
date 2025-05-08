import { Link } from 'react-router-dom';
import '../styles/Header.css';
import apnealogo from '../assets/apnea-logo.png';

function Header() {
  return (
    <header className="header">
      <div className="nav-left">
        <img src={apnealogo} alt="Apnea Guard Logo" className="logo-img" />  
        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/Guide">Guide</Link>
          <Link to="/DataResult">Data Result</Link>
          <Link to="/MyPage">My page</Link>
        </nav>
      </div>
      <div className="nav-right">
        <Link to="/Login"><button className="btn-outline">Sign in</button></Link>
        <Link to="/SignUp"><button className="btn-solid">Register</button></Link>
      </div>
    </header>
  );
}

export default Header;
