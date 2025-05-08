import '../styles/Home.css';
import Header from '../components/Header';

function Home() {
  return (
    <>
      <Header /> 

      <main className="hero">
        <h1>Apnea Guard</h1>
        <p className="subtitle">Apnea Guard에서 운영하는 웹 페이지입니다.</p>
        <div className="button-group">
          <button className="btn-outline">Button</button>
          <button className="btn-solid">Button</button>
        </div>
      </main>
    </>
  );
}

export default Home;
