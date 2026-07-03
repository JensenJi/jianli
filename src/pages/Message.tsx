import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { User, Phone, MessageCircle, Mail, MapPin, Eye, Monitor, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMessages, saveMessage, Message as MessageType } from "@/services/messageService";

export default function Message() {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

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

  const handleSubmitMessage = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!messageContent.trim()) return;

    setSubmitting(true);
    try {
      await saveMessage(
        user.email,
        user.username || user.email?.split("@")[0] || "用户",
        user.email,
        messageContent.trim()
      );
      setMessageContent("");
      await loadMessages();
      alert("留言提交成功！");
    } catch (error) {
      console.error("提交留言失败:", error);
      alert("留言提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">好友留言</h1>
            <p className="text-gray-600">查看网友留言并参与讨论</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-[#89800c]" />
              <h3 className="font-bold text-gray-800">发表留言</h3>
            </div>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#89800c] resize-none"
              placeholder="写下您想说的话..."
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitMessage}
                disabled={submitting}
                className="px-6 py-2 bg-[#89800c] text-white font-bold rounded-lg hover:bg-[#6b6409] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "提交中..." : "发表留言"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">最新留言 ({messages.length})</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#89800c] mx-auto mb-2"></div>
                <p className="text-gray-500">加载中...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无留言，快来发表第一条吧！
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#dbe08c] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-[#89800c]">
                            {msg.userName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{msg.userName}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="text-gray-600">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#dbe08c] rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#89800c]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">需要登录</h3>
                <p className="text-sm text-gray-500">请先注册登录后再留言</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              为了更好地管理留言内容，我们需要您先注册一个账号。注册后您可以：
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-2">
              <li>✓ 发表留言和评论</li>
              <li>✓ 查看留言回复</li>
              <li>✓ 管理您的留言</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <Link
                to="/login"
                className="flex-1 px-4 py-2 bg-[#89800c] text-white font-bold rounded-lg hover:bg-[#6b6409] transition-colors text-center"
              >
                去注册/登录
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}