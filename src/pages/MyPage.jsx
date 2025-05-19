import React from 'react';
import '../styles/MyPage.css';
import Header from '../components/Header';

function MyPage() {
  const user = {
    id: 'Honggildong',
    name: '홍길동',
    gender: '남',
    age: 28,
    height: 182,
    weight: 78,
    complication: '없음',
  };

  return (
    <>
        <Header /> 
        
        <div className="mypage-container">
        <div className="mypage-card">
            <div className="profile-icon">👤</div>

            <div className="user-id-box">
            <div className="id-label">ID</div>
            <div className="id-value">{user.id}</div>
            </div>

            <table className="user-info-table">
            <tbody>
                <tr>
                <td>이름</td>
                <td>{user.name}</td>
                </tr>
                <tr>
                <td>성별</td>
                <td>{user.gender}</td>
                </tr>
                <tr>
                <td>나이</td>
                <td>{user.age}</td>
                </tr>
                <tr>
                <td>키</td>
                <td>{user.height}</td>
                </tr>
                <tr>
                <td>몸무게</td>
                <td>{user.weight}</td>
                </tr>
                <tr>
                <td>합병증 여부</td>
                <td>{user.complication}</td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    </>
  );

}

export default MyPage;
