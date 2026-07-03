import Navbar from "@/components/Navbar";
import { Home, BookOpen, Briefcase, MessageCircle, List, ChevronRight } from "lucide-react";

const siteStructure = [
  {
    name: "我的简历",
    icon: Home,
    path: "/",
    description: "个人简历首页，包含个人信息、工作经历、教育背景等",
    children: [
      { name: "首页", path: "/" },
      { name: "个人简介", path: "#about" },
      { name: "工作经历", path: "#experience" },
      { name: "教育经历", path: "#education" },
      { name: "个人技能", path: "#skills" },
    ],
  },
  {
    name: "旅行日志",
    icon: BookOpen,
    path: "/travel",
    description: "记录旅行经历，包含攻略、美食、住宿等信息",
    children: [
      { name: "云南丽江古城之旅", path: "/travel#1" },
      { name: "新疆伊犁草原行", path: "/travel#2" },
    ],
  },
  {
    name: "我的作品",
    icon: Briefcase,
    path: "/works",
    description: "展示我制作的网页项目",
    children: [
      { name: "个人简历网站", path: "/works#1" },
      { name: "电商管理系统", path: "/works#2" },
      { name: "在线商城前端", path: "/works#3" },
      { name: "企业官网", path: "/works#4" },
    ],
  },
  {
    name: "好友留言",
    icon: MessageCircle,
    path: "/message",
    description: "注册成为好友并留言",
    children: [],
  },
  {
    name: "网站地图",
    icon: List,
    path: "/sitemap",
    description: "网站结构导航",
    children: [],
  },
];

export default function SiteMap() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">

        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">网站地图</h1>
            <p className="text-gray-600">帮助您快速了解网站结构</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteStructure.map((item) => (
              <div key={item.name} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#dbe08c] rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#89800c]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={item.path}
                    className="flex items-center gap-2 text-[#89800c] hover:text-[#6b6409] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {item.name}
                  </a>
                  {item.children.map((child) => (
                    <a
                      key={child.name}
                      href={child.path}
                      className="flex items-center gap-2 text-gray-600 hover:text-[#89800c] transition-colors pl-6"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {child.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">网站说明</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">关于网站地图</h3>
                <p>
                  网站地图是一个网站所有页面的列表，帮助用户快速了解网站结构和内容。虽然您的网站页面不多，但网站地图仍然有以下作用：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>帮助访客快速找到所需内容</li>
                  <li>帮助搜索引擎更好地索引网站</li>
                  <li>提供清晰的网站导航概览</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">建议</h3>
                <p>
                  对于您这样的个人网站，网站地图是可选的。如果未来网站内容增加，可以保留这个页面；如果觉得没必要，也可以随时移除。
                </p>
                <p className="mt-2">
                  目前保留这个页面可以让网站结构更完整，也体现了专业性。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
