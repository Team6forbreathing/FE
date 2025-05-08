import React, { useState } from 'react';
import '../styles/SignUp.css';
import { Link } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    username: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    age: '',
    complication: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 유효성 검사 예시
    if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 여기에 실제 회원가입 로직 추가
    console.log('회원가입 완료:', formData);
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>   
        <h5>*은 필수 입력 항목입니다.</h5>

        <label>이름* <input name="name" type="text" value={formData.name} onChange={handleChange} required /></label>

        <label>성별
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="남">남</option>
            <option value="여">여</option>
            <option value="기타">기타</option>
          </select>
        </label>

        <label>아이디* <input name="username" type="text" value={formData.username} onChange={handleChange} required /></label>

        <label>비밀번호* <input name="password" type="password" value={formData.password} onChange={handleChange} required /></label>

        <label>비밀번호 확인* <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required /></label>

        <label>키(cm) <input name="height" type="number" value={formData.height} onChange={handleChange} /></label>

        <label>몸무게(kg) <input name="weight" type="number" value={formData.weight} onChange={handleChange} /></label>

        <label>나이 <input name="age" type="number" value={formData.age} onChange={handleChange} /></label>

        <label>합병증 유무
          <select name="complication" value={formData.complication} onChange={handleChange}>
            <option value="">선택</option>
            <option value="있음">있음</option>
            <option value="없음">없음</option>
            <option value="모름">모름</option>
          </select>
        </label>

        <button type="submit">회원가입</button>

        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/Login">로그인</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
