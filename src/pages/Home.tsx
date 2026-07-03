import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { MapPin, Mail, Phone, Globe, Building2, GraduationCap, MoreHorizontal, ChevronRight, Home as HomeIcon, Lock } from "lucide-react";
import { WechatIcon, QQIcon } from "@/components/CustomIcons";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import photo1 from "@/assets/1 (1).jpg";
import photo2 from "@/assets/1 (2).jpg";
import photo3 from "@/assets/1 (20).jpg";
import photo4 from "@/assets/1 (23).jpg";
import photo5 from "@/assets/1 (29).jpg";
import photo6 from "@/assets/1 (36).jpg";
import photo7 from "@/assets/1 (40).jpg";
import photo8 from "@/assets/1 (48).jpg";
import photo9 from "@/assets/1 (51).jpg";
import photo10 from "@/assets/1 (59).jpg";
import photo11 from "@/assets/1 (77).jpg";
import photo12 from "@/assets/128.jpg";
import photo13 from "@/assets/zaogong.jpg";
import avatar from "@/assets/avatar.jpg";
import company1Logo from "@/assets/company1.jpg";
import company2Logo from "@/assets/company2.jpg";
import company3Logo from "@/assets/company3.jpg";
import company4Logo from "@/assets/company4.jpg";
import company5Logo from "@/assets/company5.jpg";
import company6Logo from "@/assets/company6.jpg";
import school1Logo from "@/assets/company7.jpg";
import school2Logo from "@/assets/company6.jpg";
// 工作经历数据接口
interface WorkExperience {
  id: number;
  company: string;
  position: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
  logo: string;
}

// 计算工作年限的函数
const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate + "-01");
  const end = endDate === "现在" ? new Date() : new Date(endDate + "-01");
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years > 0 && months > 0) {
    return `${years}年${months}个月`;
  } else if (years > 0) {
    return `${years}年`;
  } else {
    return `${months}个月`;
  }
};

// 工作经历数据（按时间倒序排列，最新的在最前面）
const workExperiences: WorkExperience[] = [
  {
    id: 1,
    company: "詹森（济宁）服饰有限公司",
    position: "经理",
    employmentType: "全职",
    startDate: "2019-02",
    endDate: "现在",
    location: "山东·济宁",
    description: [
      "• 统筹管理公司整体运营，制定发展战略，直接向公司董事会汇报工作。",
      "• 负责供应链管理，优化采购流程。",
      "• 建立并维护与核心供应商的长期合作关系。",
      "• 负责产品研发及品质保证部门的管理部署工作。"
    ],
    logo: company1Logo
  },
  {
    id: 2,
    company: "美国雅姬柏瑞",
    position: "高级QC",
    employmentType: "全职",
    startDate: "2011-04",
    endDate: "2019-01",
    location: "广东·东莞",
    description: [
      "• 负责国内多省市区域、多工厂的品质控制及日常生产管理工作。",
      "• 负责供应链工厂及原材料的生产流程及品质控制的监督检查工作。",
      "• 主要工作地点在江浙沪及安徽的工厂。",
    ],
    logo: company2Logo
  },
  {
    id: 3,
    company: "美国CR",
    position: "经理",
    employmentType: "全职",
    startDate: "2010-03",
    endDate: "2011-03",
    location: "越南·海阳",
    description: [
      "• 负责美国CR品牌越南工厂的品质及全生产流程的管理工作。",
      "• 工作直接向美国销售部主管及韩国开发部主管汇报。",
      "• 负责从原材料、供应链的品质及全生产流程的管理工作。"
    ],
    logo: company3Logo
  },
  {
    id: 4,
    company: "美国嘉顿",
    position: "高级QC",
    employmentType: "全职",
    startDate: "2006-06",
    endDate: "2010-02",
    location: "广东·广州",
    description: [
      "• 负责国内多省市区域、多工厂的品质控制及日常生产管理工作。",
      "• 负责供应链工厂及原材料的生产流程及品质控制的监督检查工作。",
      "• 主要负责省内为福建泉州、山东青岛工厂"
    ],
    logo: company4Logo
  },
  {
    id: 5,
    company: "济宁爱丝制衣有限公司",
    position: "QC经理",
    employmentType: "全职",
    startDate: "2005-05",
    endDate: "2006-05",
    location: "山东·济宁",
    description: [
      "• 主要负责工厂品质管理员工的品质管理培训管理工作。",
      "• 品质管理员工的检查部署工作。",
    ],
    logo: company5Logo
  },
  {
    id: 6,
    company: "青岛泰光",
    position: "QC主管",
    employmentType: "全职",
    startDate: "1996-12",
    endDate: "2006-04",
    location: "山东·青岛",
    description: [
      "• 协助客户完成最终验货的管理工厂。",
      "• 负责完成制品部门的日常生产管理工作。",
      "• 负责成型车间的完成品检查及检查部门员工的管理工作。"
    ],
    logo: company6Logo
  }
];

interface Sticker {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isFlipped: boolean;
}

const generateRandomStickers = (): Sticker[] => {
  const stickers: Sticker[] = [];
  const photos = [
    photo1, photo2, photo3, photo4, photo5,
    photo6, photo7, photo8, photo9, photo10,
    photo11, photo12, photo13,
  ];
  
  photos.forEach((src, index) => {
    stickers.push({
      id: index + 1,
      src: src,
      x: Math.random() * 700,
      y: Math.random() * 160,
      rotation: (Math.random() - 0.5) * 45,
      scale: 1.0 + Math.random() * 0.6,
      isFlipped: Math.random() > 0.5,
    });
  });
  return stickers;
};

const contactInfo = [
  { icon: HomeIcon, label: "山东省济南市市中区", color: "#1a73e8", isPrivate: false },
  { icon: WechatIcon, label: "jensenji", color: "#07C160", isPrivate: true },
  { icon: Phone, label: "19206261356", color: "#1a73e8", isPrivate: true },
  { icon: Mail, label: "jensenji@jensenji.cn", color: "#ea4335", isPrivate: false },
  { icon: GraduationCap, label: "山东经济学院", color: "#6610f2", isPrivate: true },
  { icon: QQIcon, label: "116671583", color: "#12b7f5", isPrivate: true },
  { icon: Building2, label: "广东省深圳市南山区", color: "#34a853", isPrivate: false },
  { icon: Globe, label: "https://www.jensenji.cn", color: "#f57c00", isPrivate: false },
];

// 教育经历数据接口
interface Education {
  id: number;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string[];
  logo?: string;
}

// 教育经历数据（按时间倒序排列，最新的在最前面）
const educations: Education[] = [
  {
    id: 1,
    school: "山东经济学院",
    degree: "本科",
    major: "工商管理",
    startDate: "1992-09",
    endDate: "1996-06",
    description: [
      "• 主修课程：管理学、市场营销、会计学、财务管理",
      "• 获得管理学学士学位",
    ],
    logo: school1Logo,
  },
  {
    id: 2,
    school: "青岛泰光制鞋有公司",
    degree: "结业",
    major: "内部培训",
    startDate: "1998-04",
    endDate: "2004-04",
    description: [
      "•2004 ERP 生产管理系统培训",
      "•2004 NIKE ID 定单生产管理系统培训",
      "•2004 Toyata 精益生产管理系统培训",
      "•2002 OHSAS 18001 职业健康安全管理体系规范管理培训",
      "•1998 ISO9001/1400 质量/环境管理体系培训"
    ],
    logo: school2Logo,
  },
];

const skills = [
  { name: "Office办公应用", level: "精通", percentage: 90 },
  { name: "Photoshop应用", level: "精通", percentage: 90 },
  { name: "Html前端编程", level: "熟悉", percentage: 80 },
  { name: "学习 创新力", level: "优秀", percentage: 90 },
  { name: "沟通 领导力", level: "优秀", percentage: 90 },
  { name: "英语", level: "熟练", percentage: 80 },
];

const hobbies = [
  { name: "户外运动", nameEn: "Outdoor" },
  { name: "网页设计", nameEn: "Web design" },
  { name: "音乐", nameEn: "Music" },
  { name: "电影", nameEn: "Cinema" },
  { name: "乒乓球", nameEn: "Ping Pong" },
  { name: "游泳", nameEn: "Swimming" },
];

export default function Home() {
  const { user } = useAuth();
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const [showAllWork, setShowAllWork] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>(generateRandomStickers);
  const [draggedSticker, setDraggedSticker] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const photoWallRef = useRef<HTMLDivElement>(null);
  
  // 气泡追逐游戏状态
  const [bubblePositions, setBubblePositions] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 100, y: 5 },
    { x: 50, y: 80 },
    { x: 180, y: 30 },
    { x: 30, y: 130 },
    { x: 150, y: 140 },
  ]);
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  
  // 技能血条状态
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const [skillBars, setSkillBars] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!photoWallRef.current) return;
      const rect = photoWallRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setStickers(generateRandomStickers());
  }, []);

  // 气泡躲避鼠标的函数 - 轻盈飘浮效果
  const handleBubbleHover = (index: number) => {
    setHoveredBubble(index);
    
    // 在框内随机移动气泡，计算新位置避免重叠
    const containerWidth = 280;
    const containerHeight = 220;
    const bubbleSize = 80;
    
    // 生成新位置，尽量远离其他气泡
    let newX = Math.random() * (containerWidth - bubbleSize);
    let newY = Math.random() * (containerHeight - bubbleSize);
    
    // 检查是否与其他气泡重叠，如果重叠则重新生成位置
    const positions = bubblePositions;
    let attempts = 0;
    while (attempts < 10) {
      let hasOverlap = false;
      for (let i = 0; i < positions.length; i++) {
        if (i !== index) {
          const dx = Math.abs(newX - positions[i].x);
          const dy = Math.abs(newY - positions[i].y);
          if (dx < bubbleSize * 0.7 && dy < bubbleSize * 0.7) {
            hasOverlap = true;
            break;
          }
        }
      }
      if (!hasOverlap) break;
      newX = Math.random() * (containerWidth - bubbleSize);
      newY = Math.random() * (containerHeight - bubbleSize);
      attempts++;
    }
    
    setBubblePositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = { x: newX, y: newY };
      return newPositions;
    });
  };

  const handleBubbleLeave = () => {
    setHoveredBubble(null);
  };

  // 技能血条悬停效果
  const handleSkillHover = (index: number, targetPercentage: number) => {
    setHoveredSkill(index);
    
    // 血条从0增加到目标百分比
    setSkillBars(prev => {
      const newBars = [...prev];
      newBars[index] = targetPercentage;
      return newBars;
    });
  };

  const handleSkillLeave = (index: number) => {
    setHoveredSkill(null);
    
    // 血条恢复到0
    setSkillBars(prev => {
      const newBars = [...prev];
      newBars[index] = 0;
      return newBars;
    });
  };

  const handleMouseDown = (e: React.MouseEvent, sticker: Sticker) => {
    e.stopPropagation();
    setDraggedSticker(sticker.id);
  };

  const handleMouseMoveDrag = (e: React.MouseEvent) => {
    if (!draggedSticker || !photoWallRef.current) return;
    const rect = photoWallRef.current.getBoundingClientRect();
    
    setStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === draggedSticker
          ? {
              ...sticker,
              x: e.clientX - rect.left - 30,
              y: e.clientY - rect.top - 30,
            }
          : sticker
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedSticker(null);
  };

  const handlePhotoClick = (src: string) => {
    setSelectedPhoto(src);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const getWindEffect = (sticker: Sticker) => {
    if (!photoWallRef.current) return {};
    
    const distance = Math.sqrt(
      Math.pow(mousePos.x - sticker.x, 2) + Math.pow(mousePos.y - sticker.y, 2)
    );
    
    if (distance < 150) {
      const force = (150 - distance) / 150;
      const angle = Math.atan2(mousePos.y - sticker.y, mousePos.x - sticker.x);
      
      return {
        transform: `rotate(${sticker.rotation + force * 20}deg) scale(${sticker.scale + force * 0.2}) translate(${Math.cos(angle) * force * 20}px, ${Math.sin(angle) * force * 20}px) ${sticker.isFlipped ? 'scaleX(-1)' : ''}`,
        transition: "transform 0.3s ease-out",
        zIndex: 100,
      };
    }
    
    return {
      transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale}) ${sticker.isFlipped ? 'scaleX(-1)' : ''}`,
      transition: "transform 0.5s ease-out",
      zIndex: 1,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <Navbar />

        <div
          ref={photoWallRef}
          className="relative bg-[#dbe08c] border-b border-white shadow-sm"
          style={{ minHeight: "220px" }}
          onMouseMove={handleMouseMoveDrag}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {stickers.map((sticker) => (
            <img
              key={sticker.id}
              src={sticker.src}
              alt={`sticker ${sticker.id}`}
              className="absolute object-cover rounded-sm shadow-md cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-white hover:ring-opacity-80"
              style={{
                left: `${sticker.x}px`,
                top: `${sticker.y}px`,
                width: `${50 * sticker.scale}px`,
                height: `${50 * sticker.scale}px`,
                ...getWindEffect(sticker),
                ...(draggedSticker === sticker.id && { zIndex: 1000 }),
              }}
              onMouseDown={(e) => handleMouseDown(e, sticker)}
              onClick={(e) => {
                e.stopPropagation();
                handlePhotoClick(sticker.src);
              }}
            />
          ))}

          <div className="absolute bottom-4 right-6 text-left z-[1001] bg-[#dbe08c] rounded-lg px-4 py-3 shadow-md">
            <p className="text-3xl font-bold text-gray-800">
              欢迎光临我的个人站点
            </p>
            <p className="text-base text-gray-700 mt-1">
              一个做了30多年鞋服爱好编程退休老灯的主页
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-r-4 border-[#dbe08c] relative">
          <div className="absolute -top-20 left-20 z-20">
            <div className="w-40 h-40 rounded-full border-4 border-[#dbe08c] overflow-hidden shadow-xl">
              <img
                src={avatar}
                alt="我的头像"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex min-h-[160px]">
            <div className="w-1/2 p-4 pl-20">
              <h1 className="text-xl font-bold text-gray-800 mt-20">Jensen Ji</h1>
              <p className="text-gray-600 text-sm mt-1">经理, 研发部 | JensenJi</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                <span>山东·济宁</span>
                <span>|</span>
                <span className="text-[#89800c]">{calculateDuration(workExperiences[0].startDate, workExperiences[0].endDate)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  to="/message"
                  className="bg-[#89800c] text-white px-4 py-1.5 text-xs rounded font-medium hover:bg-[#6b6409] transition-colors"
                >
                  添加好友
                </Link>
                <Link
                  to="/message"
                  className="border border-gray-300 text-gray-600 px-4 py-1.5 text-xs rounded hover:bg-gray-50 transition-colors"
                >
                  发消息
                </Link>
                <button className="border border-gray-300 text-gray-600 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-1/2 p-4">
              <div className="flex flex-col gap-3">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" style={{ color: item.color }} />
                    {item.isPrivate && !user ? (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        登录后可见
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <h2 className="text-base font-bold text-gray-800 mb-2">个人简介</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              • 拥有 30 年品牌商品、授权衍生品及促销礼品全球采购从业经验。
              {showMoreAbout && (
                <>
                  <br />• 鞋服、饰品、玩具全品类新品开发与货源寻源、开发、生产部署工作。
                  <br />• 代工、生产统筹与品控全流程生产及品质管理工作。
                  <br />• 跨区域生产、品质管理、跨职能团队工作统筹管理工作。
                  <br />• 管理全国多省市、规模超 150 人的鞋服箱包开发团队管理工作。
                </>
              )}
              <button
                onClick={() => setShowMoreAbout(!showMoreAbout)}
                className="text-[#89800c] hover:underline ml-1"
              >
                {showMoreAbout ? "收起" : "更多"}
              </button>
            </p>
          </div>

          <div className="border-t border-gray-200 p-4">
            <h2 className="text-base font-bold text-gray-800 mb-4">工作经历</h2>
            
            {workExperiences.slice(0, showAllWork ? workExperiences.length : 1).map((work, index) => (
              <div key={work.id} className={`flex items-start gap-3 ${index > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`}>
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-200">
                  <img 
                    src={work.logo} 
                    alt={work.company}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-gray-800">{work.position}</span>
                  <p className="text-xs text-gray-600 mt-1">{work.company} | {work.employmentType}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                    <span>{work.startDate.replace('-', '年')}月 - {work.endDate === '现在' ? '现在' : work.endDate.replace('-', '年') + '月'}</span>
                    <span>|</span>
                    <span>{work.location}</span>
                    <span>|</span>
                    <span className="text-[#89800c]">{calculateDuration(work.startDate, work.endDate)}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {work.description.map((desc, i) => (
                      <p key={i}>{desc}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div 
              className="text-center text-[#89800c] text-xs cursor-pointer hover:underline mt-4"
              onClick={() => setShowAllWork(!showAllWork)}
            >
              {showAllWork ? '收起 -' : `显示全部 (${workExperiences.length}条) +`}
            </div>
          </div>

          {user && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <h2 className="text-base font-bold text-gray-800 mb-4">教育培训</h2>
              
              {educations.slice(0, showAllEducation ? educations.length : 1).map((education, index) => (
                <div key={education.id} className={`flex items-start gap-3 ${index > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`}>
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-200">
                    {education.logo ? (
                      <img src={education.logo} alt={education.school} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-[#6610f2] flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-gray-800">{education.school}</span>
                    <p className="text-xs text-gray-600 mt-1">{education.degree} | {education.major}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      <span>{education.startDate.replace('-', '年')}月 - {education.endDate.replace('-', '年')}月</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {education.description.map((desc, i) => (
                        <p key={i}>{desc}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div 
                className="text-center text-[#89800c] text-xs cursor-pointer hover:underline mt-4"
                onClick={() => setShowAllEducation(!showAllEducation)}
              >
                {showAllEducation ? '收起 -' : `显示全部 (${educations.length}条) +`}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-800">技能特长</h2>
              </div>
              <div 
                className="relative w-full h-[220px] overflow-hidden flex items-center justify-center"
                style={{ 
                  border: '1px dashed transparent',
                  borderRadius: '8px'
                }}
              >
                <div className="space-y-2 w-full">
                  {skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="cursor-pointer"
                      onMouseEnter={() => handleSkillHover(index, skill.percentage)}
                      onMouseLeave={() => handleSkillLeave(index)}
                    >
                      <div 
                        className="w-full rounded-sm h-6 relative overflow-hidden"
                        style={{
                          background: '#dbe08c',
                          border: '1px solid #c9ce7a'
                        }}
                      >
                        {/* 血条 */}
                        <div
                          className="h-full rounded-sm transition-all duration-3000 ease-out relative"
                          style={{ 
                            width: `${skillBars[index]}%`,
                            background: '#89800c'
                          }}
                        ></div>
                        {/* 文字 */}
                        <div 
                          className="absolute inset-0 flex items-center justify-between px-2"
                        >
                          <span className="text-xs font-bold text-gray-700 z-10">
                            {skill.name}
                          </span>
                          <span className="text-xs font-bold text-gray-600 z-10">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-800">兴趣爱好</h2>
              </div>
              <div 
                ref={bubbleContainerRef}
                className="relative w-full h-[220px] bubble-container"
                style={{ 
                  border: '1px dashed transparent',
                  borderRadius: '8px'
                }}
              >
                {hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className={`absolute rounded-full flex flex-col items-center justify-center opacity-90 cursor-pointer bubble-float`}
                    style={{ 
                      width: '80px',
                      height: '80px',
                      background: `radial-gradient(circle at 30% 30%, #f5f8c0 0%, #dbe08c 40%, #89800c 100%)`,
                      left: `${bubblePositions[index].x}px`,
                      top: `${bubblePositions[index].y}px`,
                      zIndex: hoveredBubble === index ? 10 : index + 1,
                      boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.1), inset 2px 2px 6px rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                    onMouseEnter={() => handleBubbleHover(index)}
                    onMouseLeave={handleBubbleLeave}
                  >
                    <span className="text-xs font-bold text-gray-800">{hobby.name}</span>
                    <span className="text-[10px] text-gray-600">{hobby.nameEn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t-4 border-[#dbe08c] bg-[#dbe08c] py-8">
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-gray-700">欢迎您的光临，谢谢您的留言！</p>
            </div>
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
          >
            ×
          </button>
          <img
            src={selectedPhoto}
            alt="放大的照片"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-white text-sm">点击任意位置或按 ESC 关闭</p>
        </div>
      )}
    </div>
  );
}
