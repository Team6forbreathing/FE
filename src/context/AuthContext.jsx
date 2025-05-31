import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const isTokenExpired = (token) => {
  if (!token) {
    console.log("No token found in cookies.");
    return true;
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Token expiration check:", { exp: decoded.exp, currentTime });
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token format:", error.message);
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [decodedAuth, setDecodedAuth] = useState(null); // Add state for decodedAuth

  useEffect(() => {
    const validateToken = async () => {
      console.log("Starting token validation...");
      const accessToken = Cookies.get("accessToken");

      if (!accessToken || isTokenExpired(accessToken)) {
        console.log("Token missing or expired. Logging out...");
        setIsLoggedIn(false);
        setDecodedAuth(null); // Reset decodedAuth
        Cookies.remove("user_name");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setIsLoading(false);
        return;
      }

      try {
        if (!import.meta.env.VITE_PROFILE_API_URL) {
          console.error("VITE_PROFILE_API_URL is not defined in .env");
          setIsLoggedIn(false);
          setDecodedAuth(null); // Reset decodedAuth
          setIsLoading(false);
          return;
        }

        console.log("Validating token with server:", import.meta.env.VITE_PROFILE_API_URL);
        const response = await axios.get(import.meta.env.VITE_PROFILE_API_URL, {
          withCredentials: true,
        });

        console.log("Server validation response:", response.data);
        if (response.data.valid) {
          console.log("Token is valid. User is logged in.");
          setIsLoggedIn(true);
          const userName = Cookies.get("user_name");
          setDecodedAuth(userName ? atob(userName) : null); // Set decodedAuth
        } else {
          console.log("Server says token is invalid. Logging out...");
          setIsLoggedIn(false);
          setDecodedAuth(null); // Reset decodedAuth
          Cookies.remove("user_name");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        }
      } catch (error) {
        console.error("Token validation error:", error.response?.data || error.message);
        setIsLoggedIn(false);
        setDecodedAuth(null); // Reset decodedAuth
        Cookies.remove("user_name");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      } finally {
        console.log("Token validation completed. Setting isLoading to false.");
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login request to:", import.meta.env.VITE_LOGIN_API_URL);
      const response = await axios.post(
        import.meta.env.VITE_LOGIN_API_URL,
        { user_id: email, user_pw: password },
        { withCredentials: true }
      );

      console.log("Login response:", response.data);
      setIsLoggedIn(true);
      const userName = Cookies.get("user_name");
      setDecodedAuth(userName ? atob(userName) : null); // Update decodedAuth on login
      await info();
      return { success: true, message: response.data.message || "로그인 성공!" };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
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
      console.log("Register request to:", import.meta.env.VITE_REGISTRATION_API_URL);
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
      console.log("Register response:", response.data);
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
      console.log("Logout skipped - No LOGOUT_API_URL defined.");
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setDecodedAuth(null); // Reset decodedAuth on logout
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      Cookies.remove("user_name");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setDecodedAuth(null); // Reset decodedAuth on logout
    }
  };

  const info = async () => {
    try {
      console.log("Fetching user info from:", import.meta.env.VITE_USER_INFO_API_URL);
      const response = await axios.get(import.meta.env.VITE_USER_INFO_API_URL, {
        withCredentials: true,
      });

      console.log("User info received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error.response?.data || error.message);
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