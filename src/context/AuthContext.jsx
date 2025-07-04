import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// 인증 Context
const AuthContext = createContext();

// 토큰 만료 확인
const isTokenExpired = (token) => {
  if (!token) {
    console.log("쿠키에 토큰이 없습니다.");
    return true;
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("토큰 만료 확인:", { exp: decoded.exp, currentTime });
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("잘못된 토큰 형식:", error.message);
    return true;
  }
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [decodedAuth, setDecodedAuth] = useState(null);

  // 토큰 유효성 검사
  useEffect(() => {
    const validateToken = async () => {
      console.log("토큰 유효성 검사 시작...");
      const accessToken = Cookies.get("accessToken");

      if (!accessToken || isTokenExpired(accessToken)) {
        console.log("토큰이 없거나 만료됨. 로그아웃 처리...");
        setIsLoggedIn(false);
        setDecodedAuth(null);
        Cookies.remove("user_role");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setIsLoading(false);
        return;
      }

      try {
        // TODO: 서버 유효성 검사 API 호출 필요 (현재 주석 처리됨)
        // const response = await axios.get('유효성 검사 API URL', { withCredentials: true });
        // if (response.data.valid) {
        console.log("토큰 유효. 사용자 로그인 상태 유지 (서버 검사 미구현).");
        setIsLoggedIn(true);
        const userName = Cookies.get("user_role");
        setDecodedAuth(userName ? atob(userName) : null);
        // } else {
        //   console.log("서버에서 토큰이 유효하지 않다고 응답...");
        //   setIsLoggedIn(false);
        //   setDecodedAuth(null);
        //   Cookies.remove("user_role");
        //   Cookies.remove("accessToken");
        //   Cookies.remove("refreshToken");
        // }
      } catch (error) {
        console.error("토큰 유효성 검사 에러:", error.message);
        setIsLoggedIn(false);
        setDecodedAuth(null);
        Cookies.remove("user_role");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      } finally {
        console.log("토큰 유효성 검사 완료.");
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // 로그인
  const login = async (email, password) => {
    try {
      console.log("로그인 요청 URL:", import.meta.env.VITE_LOGIN_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_LOGIN_API_URL,
        { user_id: email, user_pw: password },
        { withCredentials: true }
      );

      console.log("로그인 응답:", response.data);
      setIsLoggedIn(true);
      const userName = Cookies.get("user_role");
      setDecodedAuth(userName ? atob(userName) : null);
      await info();
      return { success: true, message: response.data.message || "로그인 성공!" };
    } catch (error) {
      console.error("로그인 에러:", error.response?.data || error.message);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          return { success: false, message: data.message || "잘못된 비밀번호입니다." };
        }
        if (status === 404) {
          return { success: false, message: data.message || "사용자를 찾을 수 없습니다." };
        }
        return { success: false, message: data.message || "서버 오류가 발생했습니다." };
      }
      return { success: false, message: "로그인 중 오류가 발생했습니다. 네트워크를 확인해주세요." };
    }
  };

  // 회원가입
  const register = async (name, email, password, gender, age, height, weight, comp) => {
    try {
      console.log("회원가입 요청 URL:", import.meta.env.VITE_REGISTRATION_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_REGISTRATION_API_URL,
        {
          user_id: email,
          user_pw: password,
          user_role: name,
          user_gender: gender || null,
          user_age: age || null,
          user_height: height || null,
          user_weight: weight || null,
          user_comp: comp === "true" ? true : comp === "false" ? false : null,
        },
        { withCredentials: true }
      );
      console.log("회원가입 응답:", response.data);
      return { success: true, message: response.data.message || "회원가입 성공!" };
    } catch (error) {
      console.error("회원가입 에러:", error.response?.data || error.message);
      if (error.code === "ERR_NETWORK") {
        return { success: false, message: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요." };
      }
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          return { success: false, message: data.message || "필수 필드가 누락되었거나 ID가 이미 존재합니다." };
        }
        return { success: false, message: data.message || "서버 오류가 발생했습니다." };
      }
      return { success: false, message: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      console.log("로그아웃 처리 - LOGOUT_API_URL 미정의로 건너뜀.");
      Cookies.remove("user_role");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setDecodedAuth(null);
    } catch (error) {
      console.error("로그아웃 에러:", error.response?.data || error.message);
      Cookies.remove("user_role");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setDecodedAuth(null);
    }
  };

  // 사용자 정보 가져오기
  const info = async () => {
    try {
      console.log("사용자 정보 요청 URL:", import.meta.env.VITE_USER_INFO_API_URL);
      const response = await axios.get(import.meta.env.VITE_USER_INFO_API_URL, {
        withCredentials: true,
      });
      console.log("사용자 정보 수신:", response.data);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 가져오기 에러:", error.response?.data || error.message);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, decodedAuth, info, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = () => useContext(AuthContext);
