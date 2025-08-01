import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

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

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [decodedAuth, setDecodedAuth] = useState(null);

  // 토큰 유효성 검사 및 사용자 정보 조회
  const validateTokenAndFetchInfo = async () => {
    console.log("토큰 유효성 검사 및 사용자 정보 조회 시작...");
    const accessToken = Cookies.get("accessToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      console.log("토큰이 없거나 만료됨. 로그아웃 처리...");
      setIsLoggedIn(false);
      setDecodedAuth(null);
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoading(false);
      return;
    }

    try {
      // 사용자 정보 조회
      const userInfo = await info();
      console.log("사용자 정보 조회 결과:", userInfo); // 디버깅
      if (userInfo && userInfo.user_role) {
        console.log("사용자 역할 설정:", userInfo.user_role);
        setIsLoggedIn(true);
        setDecodedAuth(userInfo.user_role); // user_role로 변경
      } else {
        console.log("사용자 정보에 user_role 없음. 로그아웃 처리...");
        setIsLoggedIn(false);
        setDecodedAuth(null);
        Cookies.remove("user_name");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }
    } catch (error) {
      console.error("토큰 유효성 검사 또는 정보 조회 에러:", error.message);
      setIsLoggedIn(false);
      setDecodedAuth(null);
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } finally {
      console.log("토큰 유효성 검사 및 정보 조회 완료. decodedAuth:", decodedAuth);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateTokenAndFetchInfo();
  }, [isLoggedIn]); // isLoggedIn 변경 시 재실행

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
      // 로그인 후 즉시 사용자 정보 조회
      const userInfo = await info();
      console.log("로그인 후 사용자 정보:", userInfo); // 디버깅
      if (userInfo && userInfo.user_role) {
        console.log("로그인 후 역할 설정:", userInfo.user_role);
        setDecodedAuth(userInfo.user_role); // user_role로 변경
      } else {
        console.log("로그인 후 user_role 없음.");
        setDecodedAuth(null);
      }
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

  const register = async (name, email, password, gender, age, height, weight, comp) => {
    try {
      console.log("회원가입 요청 URL:", import.meta.env.VITE_REGISTRATION_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_REGISTRATION_API_URL,
        {
          user_id: email,
          user_pw: password,
          user: name,
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

  const logout = async () => {
    try {
      console.log("로그아웃 처리...");
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setDecodedAuth(null);
    } catch (error) {
      console.error("로그아웃 에러:", error.response?.data || error.message);
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setDecodedAuth(null);
    }
  };

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

export const useAuth = () => useContext(AuthContext);
