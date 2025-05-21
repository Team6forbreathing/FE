import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        console.log("Validation skipped - No PROFILE_API_URL defined. Check with server.");
        setIsLoggedIn(false);
        Cookies.remove("user_name"); 
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      } catch (error) {
        console.error("Token validation failed:", error.response?.data || error.message);
        setIsLoggedIn(false);
        Cookies.remove("user_name");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }
    };
    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login request to:', import.meta.env.VITE_LOGIN_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_LOGIN_API_URL,
        { user_id: email, user_pw: password },
        { withCredentials: true }
      );

      const valid = response.data;
      if (valid) {
        console.log('Login successful:', valid);
      }
      setIsLoggedIn(true);
      console.log('Login state updated, user_name:', Cookies.get('user_name'));
      console.log('accessToken from browser:', Cookies.get('accessToken'));
      console.log('refreshToken from browser:', Cookies.get('refreshToken'));
      info();
      return { success: true, message: response.data.message || "로그인 성공!" };

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
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
      console.log('Register request to:', import.meta.env.VITE_REGISTRATION_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_REGISTRATION_API_URL,
        {
          user_id: email,
          user_pw: password,
          user_name: name,
          user_gender: gender || null,
          user_age: age || null,
          user_height: height || null,
          user_weight: weight || null,
          user_comp: comp === "true" ? true : comp === "false" ? false : null,
        },
        { withCredentials: true }
      );
      console.log('Register response:', response.data);

      return { success: true, message: response.data.message || "회원가입 성공!" };
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
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
      console.log("Logout skipped - No LOGOUT_API_URL defined. Check with server.");
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
    }
  };

  const info = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_USER_INFO_API_URL, {
        withCredentials: true, // 쿠키 포함 요청
      });

      console.log("User info received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error.response?.data || error.message);
      return null;
    }
  };



  return (
    <AuthContext.Provider value={{ isLoggedIn, info, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);