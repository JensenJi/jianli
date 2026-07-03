import Navbar from "@/components/Navbar";
import { User, Lock, Mail, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("两次密码输入不一致！");
          return;
        }
        if (formData.password.length < 6) {
          setError("密码至少需要6位！");
          return;
        }
        await register(formData.email, formData.password, formData.username);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbe08c]/20 to-[#89800c]/20">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto mt-8 mb-8 px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-[#dbe08c] p-4">
              <h2 className="text-2xl font-bold text-center text-[#89800c]">
                {isLogin ? "登录" : "注册"}
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 mx-8 mt-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89800c]" />
                  <input
                    type="text"
                    name="username"
                    placeholder="用户名"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#dbe08c] rounded-lg focus:outline-none focus:border-[#89800c] transition-colors"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89800c]" />
                <input
                  type="email"
                  name="email"
                  placeholder="电子邮箱"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#dbe08c] rounded-lg focus:outline-none focus:border-[#89800c] transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89800c]" />
                <input
                  type="password"
                  name="password"
                  placeholder="密码（至少6位）"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#dbe08c] rounded-lg focus:outline-none focus:border-[#89800c] transition-colors"
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89800c]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="确认密码"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#dbe08c] rounded-lg focus:outline-none focus:border-[#89800c] transition-colors"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#dbe08c] text-[#89800c] font-bold rounded-lg hover:bg-[#89800c] hover:text-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isLogin ? "登录中..." : "注册中...") : (isLogin ? "登录" : "注册")}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#89800c] hover:text-[#d1d678] font-medium transition-colors"
                >
                  {isLogin ? "还没有账号？立即注册" : "已有账号？立即登录"}
                </button>

                {isLogin && (
                  <div className="flex justify-between items-center">
                    <Link to="/" className="text-sm text-gray-500 hover:text-[#89800c] transition-colors">
                      返回首页
                    </Link>
                    <Link to="/forgot-password" className="text-sm text-[#89800c] hover:text-[#d1d678] transition-colors">
                      忘记密码？
                    </Link>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
