import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ user_name: Cookies.get("user_name") || "" });

  useEffect(() => {
    const validateToken = async () => {
      try {
        // VITE_PROFILE_API_URL이 없으므로 주석 처리, 필요 시 서버 문의
        // console.log('Validating token with URL:', import.meta.env.VITE_PROFILE_API_URL);
        // const response = await axios.get(import.meta.env.VITE_PROFILE_API_URL, { withCredentials: true });
        console.log("Validation skipped - No PROFILE_API_URL defined. Check with server.");
        setIsLoggedIn(false); // 기본값으로 로그인 안 된 상태 유지
        setUser({ user_name: Cookies.get("user_name") || "" });
      } catch (error) {
        console.error("Token validation failed:", error.response?.data || error.message);
        setIsLoggedIn(false);
        setUser({ user_name: "" });
        Cookies.remove("user_name");
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
      console.log('Login response:', response.data);

      const user_name = response.data.user_name || Cookies.get("user_name") || "";
      if (user_name) {
        Cookies.set("user_name", user_name, { expires: 7, secure: true });
        setUser({ user_name });
      }
      setIsLoggedIn(true);
      console.log('Login state updated, user_name:', user_name);

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
      // VITE_LOGOUT_API_URL이 없으므로 주석 처리, 필요 시 서버 문의
      // console.log('Logout request to:', import.meta.env.VITE_LOGOUT_API_URL);
      // await axios.post(import.meta.env.VITE_LOGOUT_API_URL, {}, { withCredentials: true });
      console.log("Logout skipped - No LOGOUT_API_URL defined. Check with server.");
      Cookies.remove("user_name");
      setIsLoggedIn(false);
      setUser({ user_name: "" });
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      Cookies.remove("user_name");
      setIsLoggedIn(false);
      setUser({ user_name: "" });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);