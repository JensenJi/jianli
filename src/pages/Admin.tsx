import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Users, Mail, Calendar, Shield, LogOut, BarChart3, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMessages, Message } from "@/services/messageService";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.email !== import.meta.env.VITE_ADMIN_EMAIL) {
      navigate("/");
      return;
    }

    loadMessages();
  }, [user, navigate]);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error("加载留言失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89800c] mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">后台管理</h1>
              <p className="text-gray-600 mt-2">查看网站用户统计和管理</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              退出登录
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">总留言数</p>
                  <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">留言用户数</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {new Set(messages.map(m => m.userId)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">本月留言</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {messages.filter(m => {
                      const now = new Date();
                      const msgDate = new Date(m.createdAt);
                      return msgDate.getMonth() === now.getMonth() && msgDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">管理员</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-[#dbe08c] px-6 py-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#89800c]" />
                <h2 className="font-bold text-[#89800c]">留言列表</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无留言
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">用户名</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">邮箱</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">留言内容</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#dbe08c] rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-[#89800c]">
                                {msg.userName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">{msg.userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{msg.userEmail}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{msg.content}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(msg.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}