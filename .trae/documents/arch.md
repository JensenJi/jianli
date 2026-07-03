
## 1. 架构设计
```mermaid
graph TB
    A["前端应用"] --&gt; B["React组件层"]
    B --&gt; C["样式层 (Tailwind CSS)"]
    C --&gt; D["静态资源层"]
```

## 2. 技术描述
- 前端: React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具: Vite
- 后端: 无（纯前端项目）
- 数据库: 无（使用模拟数据）

## 3. 路由定义
| 路由 | 用途 |
|-------|---------|
| / | 首页，展示完整简历内容 |

## 4. 文件结构设计
```
/
├── src/
│   ├── components/       # 页面组件
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Contact.tsx
│   │   ├── Projects.tsx
│   │   └── Footer.tsx
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
