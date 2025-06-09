//Guide.jsx
import React from 'react';
import '../styles/Guide.css'; // CSS 파일 import
import Header from '../components/Header';
import step1Img from '../assets/step1.webp';
import step2Img from '../assets/step2.webp';
import step3Img from '../assets/step3.webp';
import step4Img from '../assets/step4.webp';
import webstep1Img from '../assets/web_step1.png';
import webstep2Img from '../assets/web_step2.png';
import webstep3Img from '../assets/web_step3.png';
import webstep4Img from '../assets/web_step4.png';

function Guide() {
  const webguideSteps = [
    {
      id: 1,
      text: 'data 페이지에서 날짜별로 측정된 수면 데이터를 확인할 수 있습니다.',
      image: webstep1Img,
    },
    {
      id: 2,
      text: '조회하고 싶은 날짜를 클릭하면, 업로드된 수면 데이터 파일을 확인하고 다운받을 수 있습니다.',
      image: webstep2Img,
    },
    {
      id: 3,
      text: '데이터 파일을 클릭하면 파일의 시각화된 자료를 확인할 수 있습니다.',
      image: webstep3Img,
    },
    {
      id: 4,
      text: '날짜별로 수면 무호흡 정도를 진단할 수 있습니다.',
      image: webstep4Img,
    },
  ];

  const guideSteps = [
    {
      id: 1,
      text: '80% 이상 충전된 상태의 워치를 착용합니다.',
      image: step1Img,
    },
    {
      id: 2,
      text: 'Apnea Guard 어플에 접속하여 <시작> 버튼을 누른 후 숙면에 취합니다.',
      image: step2Img,
    },
    {
      id: 3,
      text: '기상 직후 Apnea Guard 어플에 접속하여 측정을 중단합니다.',
      image: step3Img,
    },
    {
      id: 4,
      text: '어플 내에서 수면 데이터 및 다양한 정보를 열람할 수 있습니다.',
      image: step4Img,
    },
  ];

  return (
    <>
      <Header />

      <div>
        <div className="guide-description">
          <h2>Apnea Guard 사용 가이드</h2>
          <p>
            이 페이지에서는 Apnea Guard의 웹과 앱 사용 방법을 단계별로
            안내합니다. <br />각 단계별 이미지와 설명을 참고하여 데이터를
            열람하고 측정하는 과정을 쉽게 익혀보세요.
          </p>
        </div>
        {/* 위쪽 텍스트 추가 */}
        <div className="webguide-title">웹 가이드</div>
        <div className="webguide-container">
          {/* guideSteps 배열을 순회하며 각 단계별 카드 생성*/}
          {webguideSteps.map((step) => (
            <div key={step.id} className="webguide-card">
              <div className="webguide-image">
                <img
                  src={step.image}
                  alt={`step${step.id}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="webguide-text">
                <p>
                  {step.id}. {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="guide-title">앱 가이드</div>
        <div className="guide-container">
          {/* guideSteps 배열을 순회하며 각 단계별 카드 생성*/}
          {guideSteps.map((step) => (
            <div key={step.id} className="guide-card">
              <div className="guide-image">
                <img
                  src={step.image}
                  alt={`step${step.id}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="guide-text">
                <p>
                  {step.id}. {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Guide;
