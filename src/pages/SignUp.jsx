import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/SignUp.css';
import Header from '../components/Header';

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
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 유효성 검사
    if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
      window.alert('필수 항목을 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      window.alert('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }


    // 숫자 필드 유효성 검사
    const height = formData.height ? parseFloat(formData.height) : null;
    const weight = formData.weight ? parseFloat(formData.weight) : null;
    const age = formData.age ? parseInt(formData.age) : null;

    if (height && (height <= 0 || isNaN(height))) {
      window.alert('유효한 키를 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (weight && (weight <= 0 || isNaN(weight))) {
      window.alert('유효한 몸무게를 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (age && (age <= 0 || isNaN(age))) {
      window.alert('유효한 나이를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting registration with data:', { ...formData, height, weight, age });
      const result = await register(
        formData.name,
        formData.username,
        formData.password,
        formData.gender,
        age,
        height,
        weight,
        formData.complication ? String(formData.complication) : null
      );

      if (result.success) {
        console.log('Registration successful, showing alert');
        window.alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        window.alert(result.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'ERR_NETWORK') {
        window.alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else if (err.response) {
        window.alert(err.response.data.message || '서버 오류가 발생했습니다.');
      } else {
        window.alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="signup-wrapper">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>   
        <h5>*은 필수 입력 항목입니다.</h5>

        <label>이름* <input name="name" type="text" value={formData.name} onChange={handleChange} required /></label>

        <label>성별
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="M">남</option>
            <option value="F">여</option>
            <option value="O">기타</option>
          </select>
        </label>

        <label>아이디* <input name="username" type="text" value={formData.username} onChange={handleChange} required /></label>

        <label>비밀번호* <input name="password" type="password" value={formData.password} onChange={handleChange} required /></label>

        <label>비밀번호 확인* <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required /></label>

        <label>키(cm) <input name="height" type="number" step="0.1" value={formData.height} onChange={handleChange} /></label>

        <label>몸무게(kg) <input name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} /></label>

        <label>나이 <input name="age" type="number" value={formData.age} onChange={handleChange} /></label>

        <label>합병증 유무
          <select name="complication" value={formData.complication} onChange={handleChange}>
            <option value="">선택</option>
            <option value="true">있음</option>
            <option value="false">없음</option>
            <option value="false">모름</option>
          </select>
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : '회원가입'}
        </button>

        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/Login">로그인</Link>
        </div>
      </form>
    </div>
    </>
  );
}

export default SignUp;