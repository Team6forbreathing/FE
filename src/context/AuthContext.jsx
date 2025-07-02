import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // 쿠키 관리 라이브러리
import { jwtDecode } from "jwt-decode"; // JWT 토큰 디코딩 라이브러리

// 인증 상태를 관리하기 위한 React Context 생성
const AuthContext = createContext();

// 토큰 만료 여부를 확인하는 함수
const isTokenExpired = (token) => {
  if (!token) {
    console.log("쿠키에 토큰이 없습니다.");
    return true; // 토큰이 없으면 만료된 것으로 간주
  }
  try {
    const decoded = jwtDecode(token); // JWT 토큰 디코딩
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초 단위)
    console.log("토큰 만료 확인:", { exp: decoded.exp, currentTime });
    return decoded.exp < currentTime; // 토큰 만료 시간(exp)이 현재 시간보다 작으면 true 반환
  } catch (error) {
    console.error("잘못된 토큰 형식:", error.message);
    return true; // 토큰 형식이 잘못된 경우 만료된 것으로 간주
  }
};

// AuthProvider 컴포넌트: 인증 상태와 기능을 제공하는 Context Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [decodedAuth, setDecodedAuth] = useState(null); // 디코딩된 사용자 역할 정보

  // 컴포넌트 마운트 시 토큰 유효성 검사
  useEffect(() => {
    const validateToken = async () => {
      console.log("토큰 유효성 검사 시작...");
      const accessToken = Cookies.get("accessToken"); // 쿠키에서 액세스 토큰 가져오기

      if (!accessToken || isTokenExpired(accessToken)) {
        console.log("토큰이 없거나 만료됨. 로그아웃 처리...");
        setIsLoggedIn(false); // 로그인 상태 해제
        setDecodedAuth(null); // 사용자 역할 정보 초기화
        Cookies.remove("user_role"); // 쿠키에서 user_role 제거
        Cookies.remove("accessToken"); // 쿠키에서 accessToken 제거
        Cookies.remove("refreshToken"); // 쿠키에서 refreshToken 제거
        setIsLoading(false); // 로딩 종료
        return;
      }

      try {
        // 서버에서 토큰 유효성 검사 (주석 처리된 코드로 추정됨)
        console.log("서버 유효성 검사 응답:", response.data);
        if (response.data.valid) {
          console.log("토큰 유효. 사용자 로그인 상태 유지.");
          setIsLoggedIn(true); // 로그인 상태 설정
          const userName = Cookies.get("user_role"); // 쿠키에서 사용자 역할 가져오기
          setDecodedAuth(userName ? atob(userName) : null); // 사용자 역할 디코딩 후 설정
        } else {
          console.log("서버에서 토큰이 유효하지 않다고 응답. 로그아웃 처리...");
          setIsLoggedIn(false); // 로그인 상태 해제
          setDecodedAuth(null); // 사용자 역할 정보 초기화
          Cookies.remove("user_role"); // 쿠키에서 user_role 제거
          Cookies.remove("accessToken"); // 쿠키에서 accessToken 제거
          Cookies.remove("refreshToken"); // 쿠키에서 refreshToken 제거
        }
      } catch (error) {
        console.error("토큰 유효성 검사 에러:", error.response?.data || error.message);
        setIsLoggedIn(false); // 로그인 상태 해제
        setDecodedAuth(null); // 사용자 역할 정보 초기화
        Cookies.remove("user_role"); // 쿠키에서 user_role 제거
        Cookies.remove("accessToken"); // 쿠키에서 accessToken 제거
        Cookies.remove("refreshToken"); // 쿠키에서 refreshToken 제거
      } finally {
        console.log("토큰 유효성 검사 완료. isLoading을 false로 설정.");
        setIsLoading(false); // 로딩 종료
      }
    };

    validateToken();
  }, []); // 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  // 로그인 함수
  const login = async (email, password) => {
    try {
      console.log("로그인 요청 URL:", import.meta.env.VITE_LOGIN_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_LOGIN_API_URL,
        { user_id: email, user_pw: password }, // 로그인 요청 데이터
        { withCredentials: true } // 인증 정보 포함
      );

      console.log("로그인 응답:", response.data);
      setIsLoggedIn(true); // 로그인 상태 설정
      const userName = Cookies.get("user_role"); // 쿠키에서 사용자 역할 가져오기
      setDecodedAuth(userName ? atob(userName) : null); // 사용자 역할 디코딩 후 설정
      await info(); // 사용자 정보 가져오기
      return { success: true, message: response.data.message || "로그인 성공!" }; // 성공 응답
    } catch (error) {
      console.error("로그인 에러:", error.response?.data || error.message);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          return { success: false, message: data.message || "잘못된 비밀번호입니다." }; // 401 에러 처리
        }
        if (status === 404) {
          return { success: false, message: data.message || "사용자를 찾을 수 없습니다." }; // 404 에러 처리
        }
        return { success: false, message: data.message || "서버 오류가 발생했습니다." }; // 기타 서버 에러
      }
      return { success: false, message: "로그인 중 오류가 발생했습니다. 네트워크를 확인해주세요." }; // 네트워크 에러
    }
  };

  // 회원가입 함수
  const register = async (name, email, password, gender, age, height, weight, comp) => {
    try {
      console.log("회원가입 요청 URL:", import.meta.env.VITE_REGISTRATION_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_REGISTRATION_API_URL,
        {
          user_id: email, // 사용자 ID (이메일)
          user_pw: password, // 비밀번호
          user_role: name, // 사용자 역할 (이름)
          user_gender: gender || null, // 성별
          user_age: age || null, // 나이
          user_height: height || null, // 키
          user_weight: weight || null, // 몸무게
          user_comp: comp === "true" ? true : comp === "false" ? false : null, // 합병증 여부
        },
        { withCredentials: true } // 인증 정보 포함
      );
      console.log("회원가입 응답:", response.data);
      return { success: true, message: response.data.message || "회원가입 성공!" }; // 성공 응답
    } catch (error) {
      console.error("회원가입 에러:", error.response?.data || error.message);
      if (error.code === "ERR_NETWORK") {
        return { success: false, message: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요." }; // 네트워크 에러
      }
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          return { success: false, message: data.message || "필수 필드가 누락되었거나 ID가 이미 존재합니다." }; // 400 에러 처리
        }
        return { success: false, message: data.message || "서버 오류가 발생했습니다." }; // 기타 서버 에러
      }
      return { success: false, message: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." }; // 일반 에러
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      console.log("로그아웃 처리 - LOGOUT_API_URL 미정의로 건너뜀.");
      Cookies.remove("user_role"); // 쿠키에서 user_role 제거
      Cookies.remove("accessToken"); // 쿠키에서 accessToken 제거
      Cookies.remove("refreshToken"); // 쿠키에서 refreshToken 제거
      setIsLoggedIn(false); // 로그인 상태 해제
      setDecodedAuth(null); // 사용자 역할 정보 초기화
    } catch (error) {
      console.error("로그아웃 에러:", error.response?.data || error.message);
      Cookies.remove("user_role"); // 쿠키에서 user_role 제거
      Cookies.remove("accessToken"); // 쿠키에서 accessToken 제거
      Cookies.remove("refreshToken"); // 쿠키에서 refreshToken 제거
      setIsLoggedIn(false); // 로그인 상태 해제
      setDecodedAuth(null); // 사용자 역할 정보 초기화
    }
  };

  // 사용자 정보 가져오기 함수
  const info = async () => {
    try {
      console.log("사용자 정보 요청 URL:", import.meta.env.VITE_USER_INFO_API_URL);
      const response = await axios.get(import.meta.env.VITE_USER_INFO_API_URL, {
        withCredentials: true, // 인증 정보 포함
      });

      console.log("사용자 정보 수신:", response.data);
      return response.data; // 사용자 정보 반환
    } catch (error) {
      console.error("사용자 정보 가져오기 에러:", error.response?.data || error.message);
      return null; // 에러 시 null 반환
    }
  };

  // Context Provider로 인증 상태와 함수 제공
  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, decodedAuth, info, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅: AuthContext를 쉽게 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
