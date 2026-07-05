import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/config";

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 页面加载时检查本地 token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setUser(data.user);
        } catch (e) {
          console.error("fetchUser JSON parse error, response text:", text);
          localStorage.removeItem("token");
        }
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("服务器返回: " + text.substring(0, 50));
    }
    if (!res.ok) throw new Error(data.error || "登录失败");
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, username: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error || "注册失败");
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error("register JSON parse error, response text:", text);
      }
      throw e;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未登录");

    const res = await fetch(`${API_BASE_URL}/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("服务器返回: " + text.substring(0, 50));
    }
    if (!res.ok) throw new Error(data.error || "修改失败");
  };

  const forgotPassword = async (email: string) => {
    // 暂不支持，后续可通过 Workers 实现
    throw new Error("密码重置功能暂未开放");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        changePassword,
        forgotPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
