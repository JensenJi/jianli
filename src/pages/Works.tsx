import Navbar from "@/components/Navbar";
import { ExternalLink, Code, Eye } from "lucide-react";

const works = [
  {
    id: 1,
    title: "个人简历网站",
    description: "使用 React + Vite + Tailwind CSS 构建的现代化个人简历网站，支持编辑模式和数据导出。",
    image: "https://picsum.photos/seed/work1/400/300",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    url: "#",
  },
  {
    id: 2,
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
                <div className="relative overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="flex items-center gap-1 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                      <Eye className="w-4 h-4" />
                      预览
                    </button>
                    <button className="flex items-center gap-1 px-4 py-2 bg-[#89800c] text-white rounded-lg hover:bg-[#6b6409] transition-colors">
                      <Code className="w-4 h-4" />
                      源码
                    </button>
                  </div>
                </div>
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
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#89800c] text-white rounded-lg hover:bg-[#6b6409] transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              联系我制作网站
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
