import { create } from "zustand";

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

export interface ExperienceItem {
  period: string;
  company: string;
  position: string;
  description: string;
}

export interface ProjectItem {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ResumeState {
  // 基础信息
  avatarUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTags: string[];

  // 关于我
  aboutMe: string;
  aboutPhilosophy: string;

  // 联系方式
  contactItems: ContactItem[];
  socialItems: ContactItem[];
  qrCodeUrl: string;

  // 技术技能
  frontendSkills: string[];
  styleSkills: string[];
  designSkills: string[];

  // 工作经历
  experienceItems: ExperienceItem[];

  // 项目展示
  projectItems: ProjectItem[];

  // 编辑模式
  isEditMode: boolean;

  // Actions
  setAvatarUrl: (url: string) => void;
  setHeroTitle: (title: string) => void;
  setHeroSubtitle: (subtitle: string) => void;
  setHeroTags: (tags: string[]) => void;
  setAboutMe: (text: string) => void;
  setAboutPhilosophy: (text: string) => void;
  setContactItems: (items: ContactItem[]) => void;
  setSocialItems: (items: ContactItem[]) => void;
  setQrCodeUrl: (url: string) => void;
  setFrontendSkills: (skills: string[]) => void;
  setStyleSkills: (skills: string[]) => void;
  setDesignSkills: (skills: string[]) => void;
  setExperienceItems: (items: ExperienceItem[]) => void;
  setProjectItems: (items: ProjectItem[]) => void;
  toggleEditMode: () => void;
  setEditMode: (mode: boolean) => void;
}

type ResumeStateWithoutMethods = {
  [K in keyof ResumeState as ResumeState[K] extends Function ? never : K]: ResumeState[K];
};

const initialState: ResumeStateWithoutMethods = {
  avatarUrl: "",
  heroTitle: "你好，我是一名前端开发者",
  heroSubtitle: "打造优雅、高效且以用户为中心的 Web 体验。",
  heroTags: ["React", "TypeScript", "Vue.js", "Next.js", "Tailwind CSS"],
  aboutMe: "我是一名充满热情的前端开发者，拥有 5 年以上构建现代化 Web 应用的经验。我专注于创建响应式、可访问且高性能的用户界面，提供卓越的用户体验。",
  aboutPhilosophy: "我的开发理念以干净的代码、基于组件的架构和紧跟最新 Web 技术为中心。我坚信优秀的前端开发是艺术与工程的完美结合。",
  contactItems: [
    { icon: "Mail", label: "邮箱", value: "hello@example.com" },
    { icon: "Phone", label: "电话", value: "+86 138 0000 0000" },
    { icon: "MapPin", label: "位置", value: "中国，北京" },
  ],
  socialItems: [
    { icon: "Github", label: "GitHub", value: "github.com/yourusername" },
    { icon: "Linkedin", label: "LinkedIn", value: "linkedin.com/in/yourprofile" },
    { icon: "Globe", label: "作品集", value: "yourportfolio.dev" },
  ],
  qrCodeUrl: "",
  frontendSkills: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Vue.js", "Angular", "TypeScript", "Next.js", "Nuxt.js"],
  styleSkills: ["Tailwind CSS", "Sass", "CSS-in-JS", "Webpack", "Vite", "Babel", "Jest", "Testing Library", "Cypress"],
  designSkills: ["Figma", "Adobe XD", "Sketch", "响应式设计", "可访问性", "性能优化", "跨浏览器兼容性"],
  experienceItems: [
    {
      period: "2022 - 至今",
      company: "科技创新公司",
      position: "高级前端开发者",
      description: "领导为服务 50 万+ 用户的 SaaS 平台开发前端架构。实施设计系统并指导初级开发人员。",
    },
    {
      period: "2020 - 2022",
      company: "数字解决方案代理",
      position: "前端开发者",
      description: "为各行各业的多样化客户开发响应式 Web 应用，包括电子商务、金融科技和医疗保健行业。",
    },
  ],
  projectItems: [
    {
      icon: "Code2",
      title: "数据分析仪表板",
      description: "一个实时分析仪表板，使用 React、D3.js 和 WebSocket 进行实时数据可视化。",
      tags: ["React", "TypeScript", "D3.js"],
    },
    {
      icon: "ShoppingCart",
      title: "电商平台",
      description: "使用 Vue.js 构建的全栈电商解决方案，包含产品筛选、购物车和结账流程。",
      tags: ["Vue.js", "Next.js", "Stripe"],
    },
    {
      icon: "Smartphone",
      title: "移动端优先 PWA",
      description: "渐进式 Web 应用，具备离线功能、推送通知和原生般的用户体验。",
      tags: ["Next.js", "PWA", "Workbox"],
    },
  ],
  isEditMode: false,
};

export const useResumeStore = create<ResumeState>((set) => ({
  ...initialState,

  setAvatarUrl: (url: string) => set({ avatarUrl: url }),
  setHeroTitle: (title: string) => set({ heroTitle: title }),
  setHeroSubtitle: (subtitle: string) => set({ heroSubtitle: subtitle }),
  setHeroTags: (tags: string[]) => set({ heroTags: tags }),
  setAboutMe: (text: string) => set({ aboutMe: text }),
  setAboutPhilosophy: (text: string) => set({ aboutPhilosophy: text }),
  setContactItems: (items: ContactItem[]) => set({ contactItems: items }),
  setSocialItems: (items: ContactItem[]) => set({ socialItems: items }),
  setQrCodeUrl: (url: string) => set({ qrCodeUrl: url }),
  setFrontendSkills: (skills: string[]) => set({ frontendSkills: skills }),
  setStyleSkills: (skills: string[]) => set({ styleSkills: skills }),
  setDesignSkills: (skills: string[]) => set({ designSkills: skills }),
  setExperienceItems: (items: ExperienceItem[]) => set({ experienceItems: items }),
  setProjectItems: (items: ProjectItem[]) => set({ projectItems: items }),
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setEditMode: (mode: boolean) => set({ isEditMode: mode }),
}));
