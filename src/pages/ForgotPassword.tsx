import Navbar from "@/components/Navbar";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "发送失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbe08c]/20 to-[#89800c]/20">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-md mx-auto mt-8 mb-8 px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-[#dbe08c] p-4">
              <h2 className="text-2xl font-bold text-center text-[#89800c]">
                找回密码
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 mx-6 mt-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600">{error}</span>
              </div>
            )}

            {success ? (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">发送成功！</h3>
                  <p className="text-gray-600">
                    密码重置链接已发送到您的邮箱
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    请登录邮箱 <strong className="text-[#89800c]">{email}</strong> 点击链接重置密码
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-700">
                    💡 <strong>提示：</strong>如果没有收到邮件，请检查：
                  </p>
                  <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                    <li>邮箱地址是否正确</li>
                    <li>垃圾邮件文件夹</li>
                    <li>稍后再试或联系管理员</li>
                  </ul>
                </div>

                <Link
                  to="/login"
                  className="block w-full py-3 bg-[#dbe08c] text-[#89800c] font-bold rounded-lg hover:bg-[#89800c] hover:text-white transition-all duration-300 text-center"
                >
                  返回登录
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="text-center mb-4">
                  <p className="text-gray-600">
                    输入您注册时使用的邮箱地址，我们会发送密码重置链接
                  </p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89800c]" />
                  <input
                    type="email"
                    placeholder="请输入注册邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#dbe08c] rounded-lg focus:outline-none focus:border-[#89800c] transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#dbe08c] text-[#89800c] font-bold rounded-lg hover:bg-[#89800c] hover:text-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "发送中..." : "发送重置链接"}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-[#89800c] hover:text-[#d1d678] font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    返回登录
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
