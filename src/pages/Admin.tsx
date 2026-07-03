import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_EMAIL } from "@/config";
import {
  getMessages,
  Message,
  reviewMessage,
  deleteMessage,
  updateMessage,
} from "@/services/messageService";
import { getStats, SiteStats, getRecentVisitors, RecentVisitor } from "@/services/visitorService";
import * as echarts from "echarts";
import {
  MessageCircle,
  Eye,
  BarChart3,
  Users,
  Globe,
  Monitor,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Edit3,
  X,
  LogOut,
} from "lucide-react";

type Tab = "messages" | "pending" | "stats" | "visitors";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [visitors, setVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const deviceChartRef = useRef<HTMLDivElement>(null);
  const regionChartRef = useRef<HTMLDivElement>(null);
  const deviceChartInstance = useRef<echarts.ECharts | null>(null);
  const regionChartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.email !== ADMIN_EMAIL) { navigate("/"); return; }
    loadData();
  }, [user, navigate, activeTab]);

  useEffect(() => {
    if (activeTab !== "stats" || !stats) return;

    // 设备分布饼图
    if (deviceChartRef.current) {
      if (deviceChartInstance.current) deviceChartInstance.current.dispose();
      deviceChartInstance.current = echarts.init(deviceChartRef.current);
      const deviceData = Object.entries(stats.devices)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }));
      deviceChartInstance.current.setOption({
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        legend: { bottom: 0, left: "center", textStyle: { fontSize: 12 } },
        color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4"],
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
            label: { show: true, formatter: "{b}\n{d}%" },
            data: deviceData.length ? deviceData : [{ name: "暂无数据", value: 1 }],
          },
        ],
      });
    }

    // 地区分布饼图
    if (regionChartRef.current) {
      if (regionChartInstance.current) regionChartInstance.current.dispose();
      regionChartInstance.current = echarts.init(regionChartRef.current);
      const regionData = stats.regions
        .slice(0, 10)
        .map((r) => ({
          name: `${r.country} · ${r.province} · ${r.city}`,
          value: r.count,
        }));
      regionChartInstance.current.setOption({
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          textStyle: { fontSize: 11 },
        },
        color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#ff9f7f"],
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["35%", "50%"],
            itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
            label: { show: false },
            data: regionData.length ? regionData : [{ name: "暂无数据", value: 1 }],
          },
        ],
      });
    }

    const handleResize = () => {
      deviceChartInstance.current?.resize();
      regionChartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      deviceChartInstance.current?.dispose();
      regionChartInstance.current?.dispose();
      deviceChartInstance.current = null;
      regionChartInstance.current = null;
    };
  }, [activeTab, stats]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const data = await getMessages("pending");
        setMessages(data);
      } else if (activeTab === "messages") {
        const data = await getMessages();
        setMessages(data);
      } else if (activeTab === "stats") {
        const data = await getStats();
        setStats(data);
      } else if (activeTab === "visitors") {
        const data = await getRecentVisitors();
        setVisitors(data);
      }
    } catch (err) {
      console.error("加载失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try {
      await reviewMessage(id, status);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await reviewMessage(id, "approved", replyText.trim());
      setReplyTo(null);
      setReplyText("");
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这条留言？")) return;
    try {
      await deleteMessage(id);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return;
    try {
      await updateMessage(id, editText.trim());
      setEditId(null);
      setEditText("");
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const fmtDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const deviceIcon = (d: string) => {
    if (d.includes("Windows")) return "🖥️";
    if (d === "macOS") return "🍎";
    if (d === "iOS") return "📱";
    if (d === "Android") return "🤖";
    if (d === "HarmonyOS") return "🌸";
    return "💻";
  };

  const pendingCount = messages.filter((m) => m.status === "pending").length;

  if (!user) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "pending", label: "待审核", icon: <AlertTriangle className="w-4 h-4" />, badge: pendingCount },
    { key: "messages", label: "全部留言", icon: <MessageCircle className="w-4 h-4" /> },
    { key: "stats", label: "访问统计", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "visitors", label: "最近访客", icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <div className="bg-[#89800c] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">后台管理</h1>
            <p className="text-sm text-white/70">Jensen Ji 管理面板</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Tab 导航 */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-[#89800c] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#89800c] mx-auto mb-3"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : (
          <>
            {/* 待审核 / 全部留言 */}
            {(activeTab === "pending" || activeTab === "messages") && (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                    {activeTab === "pending" ? "暂无待审核留言" : "暂无留言"}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      {/* 留言头部 */}
                      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#dbe08c] rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-[#89800c]">{msg.userName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{msg.userName}</span>
                              <span className="text-xs text-gray-400">{msg.userEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />{fmtDate(msg.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {msg.visitor.country} · {msg.visitor.province} · {msg.visitor.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Monitor className="w-3 h-3" />
                                {deviceIcon(msg.visitor.device)} {msg.visitor.device}
                              </span>
                              <span className="text-xs text-gray-400">{msg.visitor.browser}</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            msg.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : msg.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {msg.status === "pending" ? "待审核" : msg.status === "approved" ? "已通过" : "已拒绝"}
                        </span>
                      </div>

                      {/* 留言内容 */}
                      <div className="px-5 py-4">
                        {editId === msg.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-[#dbe08c] rounded-lg focus:outline-none focus:border-[#89800c] resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditId(null); setEditText(""); }} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">取消</button>
                              <button onClick={() => handleEdit(msg.id)} className="px-3 py-1.5 text-sm bg-[#89800c] text-white rounded-lg hover:bg-[#6b6409]">保存</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                        )}

                        {/* 管理员回复 */}
                        {msg.reply && (
                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                            <p className="text-xs text-blue-500 mb-1 font-medium">管理员回复</p>
                            <p className="text-blue-800 text-sm">{msg.reply}</p>
                          </div>
                        )}

                        {/* 回复框 */}
                        {replyTo === msg.id && (
                          <div className="mt-3 space-y-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="输入管理员回复..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#89800c] resize-none text-sm"
                              rows={2}
                            />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setReplyTo(null); setReplyText(""); }} className="px-3 py-1 text-xs text-gray-500">取消</button>
                              <button onClick={() => handleReply(msg.id)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">回复并通过</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 操作栏 */}
                      <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-t">
                        {msg.status === "pending" && (
                          <>
                            <button onClick={() => handleReview(msg.id, "approved")} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
                              <CheckCircle className="w-3.5 h-3.5" /> 通过
                            </button>
                            <button onClick={() => handleReview(msg.id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">
                              <XCircle className="w-3.5 h-3.5" /> 拒绝
                            </button>
                            <button onClick={() => setReplyTo(msg.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                              <Reply className="w-3.5 h-3.5" /> 回复
                            </button>
                          </>
                        )}
                        {msg.status === "approved" && (
                          <button onClick={() => setReplyTo(msg.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            <Reply className="w-3.5 h-3.5" /> 回复
                          </button>
                        )}
                        <button onClick={() => { setEditId(msg.id); setEditText(msg.content); }} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                          <Edit3 className="w-3.5 h-3.5" /> 编辑
                        </button>
                        <div className="flex-1"></div>
                        <button onClick={() => handleDelete(msg.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" /> 删除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 访问统计 */}
            {activeTab === "stats" && stats && (
              <div className="space-y-6">
                {/* 总览卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={<Eye className="w-6 h-6 text-blue-600" />} label="总访问量 (PV)" value={stats.totalPv} bg="bg-blue-50" />
                  <StatCard icon={<Users className="w-6 h-6 text-green-600" />} label="总访客数 (UV)" value={stats.totalUv} bg="bg-green-50" />
                  <StatCard icon={<Globe className="w-6 h-6 text-purple-600" />} label="今日访客" value={stats.todayUv} bg="bg-purple-50" />
                  <StatCard icon={<MessageCircle className="w-6 h-6 text-yellow-600" />} label="设备类型" value={Object.keys(stats.devices).length} bg="bg-yellow-50" />
                </div>

                {/* 饼图 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 设备分布饼图 */}
                  <div className="bg-white rounded-xl shadow-lg p-5">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-[#89800c]" /> 设备分布
                    </h3>
                    <div ref={deviceChartRef} style={{ width: "100%", height: "320px" }} />
                  </div>

                  {/* 地区分布饼图 */}
                  <div className="bg-white rounded-xl shadow-lg p-5">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#89800c]" /> 地区分布 (Top 10)
                    </h3>
                    <div ref={regionChartRef} style={{ width: "100%", height: "320px" }} />
                  </div>
                </div>
              </div>
            )}

            {/* 最近访客 */}
            {activeTab === "visitors" && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  {visitors.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">暂无访问记录</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">时间</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">页面</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">地区</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">设备</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">浏览器</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitors.map((v) => (
                          <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(v.timestamp)}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium">{v.page}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{v.visitor.country} · {v.visitor.province} · {v.visitor.city}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{deviceIcon(v.visitor.device)} {v.visitor.device}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{v.visitor.browser}</td>
                            <td className="px-4 py-3 text-sm text-gray-400">{v.visitor.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) {
  return (
    <div className={`rounded-xl shadow-lg p-5 ${bg}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
