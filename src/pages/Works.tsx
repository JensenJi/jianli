import Navbar from "@/components/Navbar";
import { ExternalLink, Eye, MessageCircle, Mail, X } from "lucide-react";
import { useState } from "react";

const works = [
  {
    id: 1,
    title: "我要找到你",
    description: "我们帮助重逢，连接牵挂，找回故人，重拾情谊，让思念落地。心有所念，终能相见。",
    image: "https://images.pexels.com/photos/415351/pexels-photo-415351.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["重逢", "牵挂", "思念"],
    url: "https://www.wyzdn.com",
  },
  {
    id: 2,
    title: "个人简历网站",
    description: "使用 React + Vite + Tailwind CSS 构建的现代化个人简历网站，支持编辑模式和数据导出。",
    image: "https://picsum.photos/seed/work1/400/300",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    url: "https://www.jensenji.cn",
  },
  {
    id: 3,
    title: "电商管理系统",
    description: "基于 React 和 Node.js 的电商后台管理系统，包含订单管理、商品管理、用户管理等功能。",
    image: "https://picsum.photos/seed/work2/400/300",
    tags: ["React", "Node.js", "MongoDB"],
    url: "#",
  },
  {
    id: 3,
    title: "在线商城前端",
    description: "响应式电商前端页面，支持商品浏览、购物车、订单结算等功能。",
    image: "https://picsum.photos/seed/work3/400/300",
    tags: ["Vue.js", "Element UI", "Axios"],
    url: "#",
  },
  {
    id: 4,
    title: "企业官网",
    description: "为某服装企业设计的现代化官网，展示企业形象和产品系列。",
    image: "https://picsum.photos/seed/work4/400/300",
    tags: ["HTML", "CSS", "JavaScript"],
    url: "#",
  },
];

export default function Works() {
  const [showContact, setShowContact] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">

        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">我的作品</h1>
            <p className="text-gray-600">这里展示了我制作的一些网页项目</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <a href={work.url} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <Eye className="w-4 h-4" />
                      预览
                    </span>
                  </div>
                </a>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{work.title}</h3>
                  <p className="text-gray-600 mb-4">{work.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#dbe08c] text-[#89800c] text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowContact(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#89800c] text-white rounded-lg hover:bg-[#6b6409] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-5 h-5" />
              联系我制作网站
            </button>
          </div>

          {showContact && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowContact(false)}>
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">联系我</h3>
                  <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <a
                    href="/message"
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-[#89800c]" />
                    <div>
                      <p className="font-medium text-gray-800">让我回复您</p>
                      <p className="text-xs text-gray-500">我会尽快回复</p>
                    </div>
                  </a>
                  <a
                    href="mailto:jensenji@jensenji.cn"
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">发邮件给我</p>
                      <p className="text-xs text-gray-500">jensenji@jensenji.cn</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
