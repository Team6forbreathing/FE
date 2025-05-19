import React from 'react';
import '../styles/Home.css';
import Header from '../components/Header';
import StatsSection from '../components/StatsSection';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Header />
      <main className="home-main">

        {/* Hero Section */}
        <section className="hero">
          <h1>Apnea Guard</h1>
          <p>수면 무호흡 탐지를 위한 스마트 헬스 플랫폼</p>
        </section>


        <section className="description">
          <p>
            Apnea Guard는 스마트워치를 활용해 수면 중 발생하는 무호흡 증상을 감지하고, 그 데이터를 공유 및 분석하는 플랫폼입니다.<br />
            사용자는 별도의 복잡한 장비 없이 스마트워치만 착용하면, 수면 중 호흡 이상 패턴을 자동으로 추적하고 기록할 수 있으며, 기록된 데이터는 추후 분석 및 의료 상담 등에 활용될 수 있습니다.<br />
            수면 건강이 중요한 시대, Apnea Guard는 누구나 손쉽게 사용할 수 있는 수면 무호흡 감지 솔루션으로 사용자들의 더 나은 삶의 질을 지원합니다.
          </p>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="feature-card">
            <h3>실시간 접근성</h3>
            <p>웨어러블 기기를 통해 저렵하고 간편한 수면 데이터 모니터링을 제공합니다.</p>
          </div>
          <div className="feature-card">
            <h3>개인 맞춤 피드백</h3>
            <p>사용자 맞춤형 수면 관리 기능을 통해 효율적인 수면 무호흡 관리가 가능합니다.</p>
          </div>
          <div className="feature-card">
            <h3>데이터 공유 플랫폼</h3>
            <p>다양한 사용자가 실시간으로 업데이트되는 수면 데이터를 활용할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>자료 제공</h3>
            <p>수면 데이터를 분석하여 다양한 시각화 자료를 제공합니다.</p>
          </div>
        </section>

        {/* Status Section*/}
        <StatsSection />

        {/* CTA Section */}
        <section className="cta">
          <h2>지금 바로 Apnea Guard를 시작하세요</h2>
          <Link to="/SignUp">
            <button className="btn-solid">무료 회원가입</button>
          </Link>
        </section>

      </main>
    </>
  );
}

export default Home;
