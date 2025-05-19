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

function Guide() {
    const webguideSteps = [
    {
        id: 1,
        text: '모든 사용자는 업로드된 수면 데이터를 열람 및 다운로드 할 수 있습니다.',
        image: webstep1Img,
    },
    {
        id: 2,
        text: '권한 사용자는 수면 데이터를 업로드 할 수 있습니다.',
        image: webstep2Img,
    },
    {
        id: 3,
        text: '마이페이지에서 가장 최근에 측정된 개인 수면 데이터를 3개를 다운로드 할 수 있습니다.',
        image: webstep3Img,
    },
    {
        id: 4,
        text: 'Data Result 페이지에서 개인 맞춤형 시각화 자료를 제공합니다.',
        image: step4Img,
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
