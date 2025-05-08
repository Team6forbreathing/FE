import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  const [user, setUser] = useState({ user_name: Cookies.get("user_name") || "" });

  // 초기 로드 시 토큰 유효성 검사
  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        try {
          await axios.get(import.meta.env.VITE_PROFILE_API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(true);
        } catch (error) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("user_name");
          setIsLoggedIn(false);
          setUser({ user_name: "" });
        }
      }
    };
    validateToken();
  }, []);

  const login = async (email, password) => {
    if (email === "test" && password === "1234") {
      Cookies.set("accessToken", "dummy-token", { expires: 7, secure: true });
      Cookies.set("refreshToken", "dummy-refresh-token", { expires: 30, secure: true });
      Cookies.set("user_name", "Test User", { expires: 7, secure: true });
      setIsLoggedIn(true);
      setUser({ user_name: "Test User" });
      return { success: true };
    }

    try {
      const response = await axios.post(import.meta.env.VITE_LOGIN_API_URL, {
        user_id: email,
        user_pw: password,
      });

      const { accessToken, refreshToken, user_name } = response.data;
      Cookies.set("accessToken", accessToken, { expires: 7, secure: true });
      Cookies.set("refreshToken", refreshToken, { expires: 30, secure: true });
      Cookies.set("user_name", user_name, { expires: 7, secure: true });

      setIsLoggedIn(true);
      setUser({ user_name });

      return { success: true };
    } catch (error) {
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
      console.log('Register API URL:', import.meta.env.VITE_REGISTRATION_API_URL);
      console.log('Register data:', {
        user_id: email,
        user_pw: password,
        user_name: name,
        user_gender: gender || null,
        user_age: age || null,
        user_height: height || null,
        user_weight: weight || null,
        user_comp: comp === 'true' ? true : comp === 'false' ? false : null,
      });

      const response = await axios.post(import.meta.env.VITE_REGISTRATION_API_URL, {
        user_id: email,
        user_pw: password,
        user_name: name,
        user_gender: gender || null,
        user_age: age || null,
        user_height: height || null,
        user_weight: weight || null,
        user_comp: comp === 'true' ? true : comp === 'false' ? false : null,
      });

      return { success: true, message: response.data.message || "회원가입 성공!" };
    } catch (error) {
      console.error('Register error:', error);
      if (error.code === 'ERR_NETWORK') {
        return { success: false, message: "서버에 연결할 수 없습니다. CORS 설정 또는 네트워크를 확인해주세요." };
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

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user_name");
    setIsLoggedIn(false);
    setUser({ user_name: "" });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);