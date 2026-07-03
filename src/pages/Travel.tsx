import Navbar from "@/components/Navbar";
import { useState, useMemo, useRef, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  X,
  Upload,
  Globe,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  Hotel,
  AlertTriangle,
  Plus,
  Home,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ==================== 类型定义 ====================
type OptionalTag = "food" | "accommodation" | "tips";
type StatusTab = "visited" | "wanted";
type RegionTab = "domestic" | "foreign";

interface TravelPhoto {
  id: string;
  url: string;
  status: StatusTab;
  country: string;
  region: string;
  city: string;
  county: string;
  optionalTags: OptionalTag[];
  description?: string;
  uploadDate?: string;
}

// ==================== 可选标签配置 ====================
const OPTIONAL_TAG_CONFIG: { key: OptionalTag; label: string; icon: ReactNode }[] = [
  { key: "food", label: "当地美食", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { key: "accommodation", label: "住宿推荐", icon: <Hotel className="w-3.5 h-3.5" /> },
  { key: "tips", label: "避坑指南", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
];

// ==================== 模拟数据 ====================
let mockId = 0;
const genId = () => `photo_${++mockId}`;

const MOCK_PHOTOS: TravelPhoto[] = [
  // 国内-云南-丽江-古城区
  { id: genId(), url: "https://picsum.photos/seed/lijiang1/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: ["food", "accommodation"], description: "丽江古城夜景" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang2/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: ["tips"], description: "四方街" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang3/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: [], description: "玉龙雪山" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang4/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: ["food"], description: "腊排骨火锅" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang5/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: [], description: "束河古镇" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang6/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: ["accommodation"], description: "客栈一角" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang7/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: [], description: "黑龙潭" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang8/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: [], description: "大研古镇" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang9/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: ["food", "tips"], description: "过桥米线" },
  { id: genId(), url: "https://picsum.photos/seed/lijiang10/300/300", status: "visited", country: "中国", region: "云南", city: "丽江", county: "古城区", optionalTags: [], description: "蓝月谷" },
  // 国内-云南-大理-大理市
  { id: genId(), url: "https://picsum.photos/seed/dali1/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: ["accommodation"], description: "洱海日出" },
  { id: genId(), url: "https://picsum.photos/seed/dali2/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: ["food"], description: "苍山雪" },
  { id: genId(), url: "https://picsum.photos/seed/dali3/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: [], description: "双廊古镇" },
  { id: genId(), url: "https://picsum.photos/seed/dali4/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: ["tips"], description: "喜洲粑粑" },
  { id: genId(), url: "https://picsum.photos/seed/dali5/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: [], description: "崇圣寺三塔" },
  { id: genId(), url: "https://picsum.photos/seed/dali6/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: ["food", "accommodation"], description: "白族民居" },
  { id: genId(), url: "https://picsum.photos/seed/dali7/300/300", status: "visited", country: "中国", region: "云南", city: "大理", county: "大理市", optionalTags: [], description: "蝴蝶泉" },
  // 国内-四川-成都-武侯区
  { id: genId(), url: "https://picsum.photos/seed/chengdu1/300/300", status: "visited", country: "中国", region: "四川", city: "成都", county: "武侯区", optionalTags: ["food"], description: "宽窄巷子" },
  { id: genId(), url: "https://picsum.photos/seed/chengdu2/300/300", status: "visited", country: "中国", region: "四川", city: "成都", county: "武侯区", optionalTags: ["food", "tips"], description: "火锅" },
  { id: genId(), url: "https://picsum.photos/seed/chengdu3/300/300", status: "visited", country: "中国", region: "四川", city: "成都", county: "武侯区", optionalTags: [], description: "锦里" },
  { id: genId(), url: "https://picsum.photos/seed/chengdu4/300/300", status: "visited", country: "中国", region: "四川", city: "成都", county: "武侯区", optionalTags: ["accommodation"], description: "大熊猫基地" },
  // 国内-北京-北京-朝阳区
  { id: genId(), url: "https://picsum.photos/seed/beijing1/300/300", status: "visited", country: "中国", region: "北京", city: "北京", county: "朝阳区", optionalTags: [], description: "故宫" },
  { id: genId(), url: "https://picsum.photos/seed/beijing2/300/300", status: "visited", country: "中国", region: "北京", city: "北京", county: "朝阳区", optionalTags: ["tips"], description: "长城" },
  { id: genId(), url: "https://picsum.photos/seed/beijing3/300/300", status: "visited", country: "中国", region: "北京", city: "北京", county: "朝阳区", optionalTags: ["food"], description: "烤鸭" },
  { id: genId(), url: "https://picsum.photos/seed/beijing4/300/300", status: "visited", country: "中国", region: "北京", city: "北京", county: "朝阳区", optionalTags: [], description: "天坛" },
  // 国外-日本-东京-新宿区
  { id: genId(), url: "https://picsum.photos/seed/tokyo1/300/300", status: "visited", country: "日本", region: "东京都", city: "东京", county: "新宿区", optionalTags: ["food", "accommodation"], description: "新宿夜景" },
  { id: genId(), url: "https://picsum.photos/seed/tokyo2/300/300", status: "visited", country: "日本", region: "东京都", city: "东京", county: "新宿区", optionalTags: ["tips"], description: "浅草寺" },
  { id: genId(), url: "https://picsum.photos/seed/tokyo3/300/300", status: "visited", country: "日本", region: "东京都", city: "东京", county: "新宿区", optionalTags: ["food"], description: "寿司" },
  { id: genId(), url: "https://picsum.photos/seed/tokyo4/300/300", status: "visited", country: "日本", region: "东京都", city: "东京", county: "新宿区", optionalTags: [], description: "涩谷十字路口" },
  { id: genId(), url: "https://picsum.photos/seed/tokyo5/300/300", status: "visited", country: "日本", region: "东京都", city: "东京", county: "新宿区", optionalTags: ["accommodation"], description: "明治神宫" },
  // 国外-日本-大阪-中央区
  { id: genId(), url: "https://picsum.photos/seed/osaka1/300/300", status: "visited", country: "日本", region: "大阪府", city: "大阪", county: "中央区", optionalTags: ["food"], description: "道顿堀" },
  { id: genId(), url: "https://picsum.photos/seed/osaka2/300/300", status: "visited", country: "日本", region: "大阪府", city: "大阪", county: "中央区", optionalTags: [], description: "大阪城" },
  { id: genId(), url: "https://picsum.photos/seed/osaka3/300/300", status: "visited", country: "日本", region: "大阪府", city: "大阪", county: "中央区", optionalTags: ["tips"], description: "章鱼烧" },
  // 国外-法国-巴黎-塞纳区
  { id: genId(), url: "https://picsum.photos/seed/paris1/300/300", status: "visited", country: "法国", region: "法兰西岛", city: "巴黎", county: "塞纳区", optionalTags: ["accommodation"], description: "埃菲尔铁塔" },
  { id: genId(), url: "https://picsum.photos/seed/paris2/300/300", status: "visited", country: "法国", region: "法兰西岛", city: "巴黎", county: "塞纳区", optionalTags: ["food"], description: "卢浮宫" },
  { id: genId(), url: "https://picsum.photos/seed/paris3/300/300", status: "visited", country: "法国", region: "法兰西岛", city: "巴黎", county: "塞纳区", optionalTags: [], description: "塞纳河畔" },
  // 想去-泰国-曼谷-巴吞哇区
  { id: genId(), url: "https://picsum.photos/seed/bangkok1/300/300", status: "wanted", country: "泰国", region: "曼谷", city: "曼谷", county: "巴吞哇区", optionalTags: ["food", "accommodation"], description: "大皇宫" },
  { id: genId(), url: "https://picsum.photos/seed/bangkok2/300/300", status: "wanted", country: "泰国", region: "曼谷", city: "曼谷", county: "巴吞哇区", optionalTags: ["tips"], description: "水上市场" },
  // 想去-中国-西藏-拉萨-城关区
  { id: genId(), url: "https://picsum.photos/seed/lhasa1/300/300", status: "wanted", country: "中国", region: "西藏", city: "拉萨", county: "城关区", optionalTags: ["tips", "accommodation"], description: "布达拉宫" },
  { id: genId(), url: "https://picsum.photos/seed/lhasa2/300/300", status: "wanted", country: "中国", region: "西藏", city: "拉萨", county: "城关区", optionalTags: [], description: "纳木错" },
  { id: genId(), url: "https://picsum.photos/seed/lhasa3/300/300", status: "wanted", country: "中国", region: "西藏", city: "拉萨", county: "城关区", optionalTags: ["food"], description: "八廓街" },
];

// ==================== 工具函数 ====================
function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

function getGroupKey(photo: TravelPhoto): string {
  return `${photo.country} / ${photo.region} / ${photo.city} / ${photo.county}`;
}

function getOptionalTagLabel(key: OptionalTag): string {
  return OPTIONAL_TAG_CONFIG.find((t) => t.key === key)?.label || key;
}

function getOptionalTagIcon(key: OptionalTag): React.ReactNode {
  return OPTIONAL_TAG_CONFIG.find((t) => t.key === key)?.icon || null;
}

// ==================== 上传弹窗组件 ====================
function UploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (photo: Omit<TravelPhoto, "id">) => void;
}) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [optionalTags, setOptionalTags] = useState<OptionalTag[]>([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<StatusTab>("visited");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: OptionalTag) => {
    setOptionalTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const isValid = filePreview && country.trim() && region.trim() && city.trim() && county.trim();

  const handleSubmit = () => {
    if (!isValid || !filePreview) return;
    onUpload({
      url: filePreview,
      status,
      country: country.trim(),
      region: region.trim(),
      city: city.trim(),
      county: county.trim(),
      optionalTags,
      description: description.trim() || undefined,
      uploadDate: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#dbe08c] p-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-lg font-bold text-[#89800c] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            上传照片
          </h2>
          <button onClick={onClose} className="text-[#89800c] hover:bg-[#d1d678] rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 照片预览 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#89800c] hover:bg-[#dbe08c]/20 transition-colors overflow-hidden"
          >
            {filePreview ? (
              <img src={filePreview} alt="预览" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <Camera className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">点击选择照片</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* 状态选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">归类</label>
            <div className="flex gap-2">
              {[
                { key: "visited" as StatusTab, label: "去过的地方" },
                { key: "wanted" as StatusTab, label: "想去的地方" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatus(s.key)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    status === s.key
                      ? "bg-[#89800c] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 必填项 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#89800c]" />
              必填项
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">国家 *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="如：中国"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#89800c]/30 focus:border-[#89800c]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">地区 / 省份 *</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="如：云南"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#89800c]/30 focus:border-[#89800c]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">市 *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="如：丽江"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#89800c]/30 focus:border-[#89800c]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">县 *</label>
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="如：古城区"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#89800c]/30 focus:border-[#89800c]"
                />
              </div>
            </div>
          </div>

          {/* 可选项 */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">可选项</h3>
            <div className="flex flex-wrap gap-2">
              {OPTIONAL_TAG_CONFIG.map((tag) => (
                <button
                  key={tag.key}
                  onClick={() => toggleTag(tag.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    optionalTags.includes(tag.key)
                      ? "bg-[#89800c] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag.icon}
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">描述（可选）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="写点什么..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#89800c]/30 focus:border-[#89800c] resize-none"
            />
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isValid
                  ? "bg-[#89800c] text-white hover:bg-[#6e660a]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              上传
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 主页面 ====================
export default function Travel() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<TravelPhoto[]>(MOCK_PHOTOS);
  const [activeStatus, setActiveStatus] = useState<StatusTab>("visited");
  const [regionTab, setRegionTab] = useState<RegionTab>("domestic");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedOptionalTags, setSelectedOptionalTags] = useState<OptionalTag[]>([]);
  const [expandedProvinces, setExpandedProvinces] = useState<Set<string>>(new Set());
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<TravelPhoto | null>(null);

  // 筛选后的照片
  const filteredPhotos = useMemo(() => {
    let result = photos.filter((p) => p.status === activeStatus);

    if (regionTab === "foreign") {
      if (selectedCountry) {
        result = result.filter((p) => p.country === selectedCountry);
      }
    } else {
      // domestic: 默认筛选中国，再按层级
      result = result.filter((p) => p.country === "中国");
      if (selectedProvince) {
        result = result.filter((p) => p.region === selectedProvince);
        if (selectedCity) {
          result = result.filter((p) => p.city === selectedCity);
          if (selectedCounty) {
            result = result.filter((p) => p.county === selectedCounty);
          }
        }
      }
    }

    if (selectedOptionalTags.length > 0) {
      result = result.filter((p) =>
        selectedOptionalTags.some((tag) => p.optionalTags.includes(tag))
      );
    }

    return result;
  }, [photos, activeStatus, regionTab, selectedCountry, selectedProvince, selectedCity, selectedCounty, selectedOptionalTags]);

  // 按路径分组
  const groupedPhotos = useMemo(() => {
    return groupBy(filteredPhotos, getGroupKey);
  }, [filteredPhotos]);

  // 构建左侧层级数据
  const domesticData = useMemo(() => {
    const domesticPhotos = photos.filter((p) => p.status === activeStatus && p.country === "中国");
    const provincesMap: Record<string, Record<string, Record<string, number>>> = {};
    for (const p of domesticPhotos) {
      if (!provincesMap[p.region]) provincesMap[p.region] = {};
      if (!provincesMap[p.region][p.city]) provincesMap[p.region][p.city] = {};
      provincesMap[p.region][p.city][p.county] = (provincesMap[p.region][p.city][p.county] || 0) + 1;
    }
    return provincesMap;
  }, [photos, activeStatus]);

  const foreignCountries = useMemo(() => {
    const foreignPhotos = photos.filter(
      (p) => p.status === activeStatus && p.country !== "中国"
    );
    const counts: Record<string, number> = {};
    for (const p of foreignPhotos) {
      counts[p.country] = (counts[p.country] || 0) + 1;
    }
    return counts;
  }, [photos, activeStatus]);

  const toggleProvince = (province: string) => {
    setExpandedProvinces((prev) => {
      const next = new Set(prev);
      if (next.has(province)) {
        next.delete(province);
      } else {
        next.add(province);
      }
      return next;
    });
  };

  const toggleCity = (city: string) => {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) {
        next.delete(city);
      } else {
        next.add(city);
      }
      return next;
    });
  };

  const toggleOptionalTag = (tag: OptionalTag) => {
    setSelectedOptionalTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleUpload = (newPhoto: Omit<TravelPhoto, "id">) => {
    setPhotos((prev) => [
      ...prev,
      { ...newPhoto, id: `photo_${Date.now()}` },
    ]);
  };

  const handleRegionTabChange = (tab: RegionTab) => {
    setRegionTab(tab);
    setSelectedCountry(null);
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedCounty(null);
    setExpandedProvinces(new Set());
    setExpandedCities(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-[56rem] mx-auto relative">
          {/* 左侧栏切换按钮 - 在内容区外部 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -left-14 top-4 z-50 bg-[#dbe08c] text-[#89800c] p-2 rounded-full shadow-lg hover:bg-[#d1d678] transition-colors"
            title={sidebarOpen ? "隐藏侧边栏" : "显示侧边栏"}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          <div className="flex gap-4">

            {/* 左侧标签栏 */}
            {sidebarOpen && (
              <div className="w-60 flex-shrink-0 transition-all duration-300">
                <div className="bg-[#dbe08c]/30 rounded-xl shadow-lg p-4 sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  {/* 一级标签：想去 / 去过 */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">目的地</h3>
                    <div className="flex gap-1 bg-white rounded-lg p-1">
                      {[
                        { key: "visited" as StatusTab, label: "去过的地方", icon: <MapPin className="w-3.5 h-3.5" /> },
                        { key: "wanted" as StatusTab, label: "想去的地方", icon: <Globe className="w-3.5 h-3.5" /> },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => {
                            setActiveStatus(tab.key);
                            setSelectedProvince(null);
                            setSelectedCity(null);
                            setSelectedCounty(null);
                            setSelectedCountry(null);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-colors ${
                            activeStatus === tab.key
                              ? "bg-[#89800c] text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 二级标签：国内 / 国外 */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">区域</h3>
                    <div className="flex gap-1 bg-white rounded-lg p-1">
                      {[
                        { key: "domestic" as RegionTab, label: "国内", icon: <Home className="w-3.5 h-3.5" /> },
                        { key: "foreign" as RegionTab, label: "国外", icon: <Globe className="w-3.5 h-3.5" /> },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => handleRegionTabChange(tab.key)}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-colors ${
                            regionTab === tab.key
                              ? "bg-[#89800c] text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 三级标签 */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {regionTab === "foreign" ? "国家" : "省份 / 市 / 县"}
                    </h3>
                    <div className="bg-white rounded-lg p-2 space-y-1">
                      {regionTab === "foreign" ? (
                        // 国外：国家列表
                        Object.entries(foreignCountries).length === 0 ? (
                          <p className="text-xs text-gray-400 py-2 text-center">暂无数据</p>
                        ) : (
                          Object.entries(foreignCountries)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([country, count]) => (
                              <button
                                key={country}
                                onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                                  selectedCountry === country
                                    ? "bg-[#89800c] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <span>{country}</span>
                                <span className={`text-xs ${selectedCountry === country ? "text-white/80" : "text-gray-400"}`}>
                                  {count}
                                </span>
                              </button>
                            ))
                        )
                      ) : (
                        // 国内：省份 -> 市 -> 县
                        Object.keys(domesticData).length === 0 ? (
                          <p className="text-xs text-gray-400 py-2 text-center">暂无数据</p>
                        ) : (
                          Object.entries(domesticData)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([province, cities]) => {
                              const isExpanded = expandedProvinces.has(province);
                              const isSelected = selectedProvince === province;
                              const provincePhotoCount = Object.values(cities).reduce(
                                (sum, counties) => sum + Object.values(counties).reduce((s, c) => s + c, 0),
                                0
                              );
                              return (
                                <div key={province}>
                                  <button
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedProvince(null);
                                        setSelectedCity(null);
                                        setSelectedCounty(null);
                                      } else {
                                        setSelectedProvince(province);
                                        setSelectedCity(null);
                                        setSelectedCounty(null);
                                      }
                                      toggleProvince(province);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                                      isSelected
                                        ? "bg-[#89800c] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                                      {province}
                                    </span>
                                    <span className={`text-xs ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                                      {provincePhotoCount}
                                    </span>
                                  </button>
                                  {isExpanded && (
                                    <div className="ml-4 mt-1 space-y-1">
                                      {Object.entries(cities)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([city, counties]) => {
                                          const cityExpanded = expandedCities.has(city);
                                          const citySelected = selectedCity === city;
                                          const cityCount = Object.values(counties).reduce((s, c) => s + c, 0);
                                          return (
                                            <div key={city}>
                                              <button
                                                onClick={() => {
                                                  if (citySelected) {
                                                    setSelectedCity(null);
                                                    setSelectedCounty(null);
                                                  } else {
                                                    setSelectedCity(city);
                                                    setSelectedCounty(null);
                                                  }
                                                  toggleCity(city);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
                                                  citySelected
                                                    ? "bg-[#dbe08c] text-[#89800c]"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                              >
                                                <span className="flex items-center gap-1">
                                                  {cityExpanded ? (
                                                    <ChevronDown className="w-3 h-3" />
                                                  ) : (
                                                    <ChevronUp className="w-3 h-3" />
                                                  )}
                                                  {city}
                                                </span>
                                                <span className={`text-xs ${citySelected ? "text-[#89800c]/70" : "text-gray-400"}`}>
                                                  {cityCount}
                                                </span>
                                              </button>
                                              {cityExpanded && (
                                                <div className="ml-4 mt-1 space-y-0.5">
                                                  {Object.entries(counties)
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([county, count]) => (
                                                      <button
                                                        key={county}
                                                        onClick={() =>
                                                          setSelectedCounty(selectedCounty === county ? null : county)
                                                        }
                                                        className={`w-full flex items-center justify-between px-3 py-1 rounded-md text-sm transition-colors ${
                                                          selectedCounty === county
                                                            ? "bg-[#dbe08c]/60 text-[#89800c]"
                                                            : "text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                      >
                                                        <span>{county}</span>
                                                        <span className={`text-xs ${selectedCounty === county ? "text-[#89800c]/70" : "text-gray-400"}`}>
                                                          {count}
                                                        </span>
                                                      </button>
                                                    ))}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                        )
                      )}
                    </div>
                  </div>

                  {/* 可选项标签 */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">筛选</h3>
                    <div className="bg-white rounded-lg p-2 space-y-1">
                      {OPTIONAL_TAG_CONFIG.map((tag) => (
                        <button
                          key={tag.key}
                          onClick={() => toggleOptionalTag(tag.key)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedOptionalTags.includes(tag.key)
                              ? "bg-[#89800c] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {tag.icon}
                          {tag.label}
                        </button>
                      ))}
                      {selectedOptionalTags.length > 0 && (
                        <button
                          onClick={() => setSelectedOptionalTags([])}
                          className="w-full text-center text-xs text-gray-400 hover:text-[#89800c] py-1 transition-colors"
                        >
                          清除筛选
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 统计 */}
                  <div className="bg-white rounded-lg p-3">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">统计</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <MapPin className="w-3 h-3 inline mr-1 text-[#89800c]" />
                        {activeStatus === "visited" ? "去过" : "想去"} {filteredPhotos.length} 张照片
                      </p>
                      <p>
                        <Camera className="w-3 h-3 inline mr-1 text-[#89800c]" />
                        共 {photos.filter((p) => p.status === activeStatus).length} 张
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 右侧内容区 */}
            <div className="flex-1 transition-all duration-300">
              {/* 照片分组展示 */}
              <div className="space-y-2">
                {Object.keys(groupedPhotos).length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">暂无照片</p>
                    <p className="text-gray-400 text-sm mt-1">点击左侧标签筛选或上传照片</p>
                  </div>
                ) : (
                  Object.entries(groupedPhotos)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([groupKey, groupPhotos]) => {
                      const hasOptional = groupPhotos.some((p) => p.optionalTags.length > 0);
                      const allOptionalTags = new Set<OptionalTag>();
                      groupPhotos.forEach((p) => p.optionalTags.forEach((t) => allOptionalTags.add(t)));
                      return (
                        <div key={groupKey} className="bg-white rounded-xl shadow-lg">
                          {/* 分组标题 */}
                          <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h3 className="text-base font-bold text-[#89800c] flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {groupKey}
                              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {groupPhotos.length}
                              </span>
                            </h3>
                            {hasOptional && (
                              <div className="flex gap-2">
                                {OPTIONAL_TAG_CONFIG.map((cfg) =>
                                  allOptionalTags.has(cfg.key) ? (
                                    <span
                                      key={cfg.key}
                                      className="flex items-center gap-1 text-xs px-2 py-1 bg-[#dbe08c]/40 text-[#89800c] rounded-full"
                                    >
                                      {cfg.icon}
                                      {cfg.label}
                                    </span>
                                  ) : null
                                )}
                              </div>
                            )}
                          </div>

                          {/* 4行8列缩略图 */}
                          <div className="grid grid-cols-8 gap-0">
                            {groupPhotos.map((photo) => (
                              <div
                                key={photo.id}
                                onClick={() => setSelectedPhoto(photo)}
                                className="aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#89800c] transition-all hover:scale-105"
                                title={photo.description || ""}
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.description || ""}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 上传按钮 */}
      <button
        onClick={() => {
          if (user) {
            setShowUploadModal(true);
          } else {
            setShowLoginPrompt(true);
          }
        }}
        className="fixed bottom-8 right-8 z-40 bg-[#89800c] text-white p-4 rounded-full shadow-lg hover:bg-[#6e660a] transition-all hover:scale-110 flex items-center gap-2"
        title="上传照片"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">上传照片</span>
      </button>

      {/* 上传弹窗 */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      {/* 登录提示弹窗 */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center">
            <div className="w-16 h-16 bg-[#dbe08c] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-[#89800c]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">请先登录</h3>
            <p className="text-gray-500 text-sm mb-6">登录后即可上传照片，记录你的旅行足迹</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  window.location.href = "/login";
                }}
                className="flex-1 py-2.5 bg-[#89800c] text-white rounded-lg text-sm font-medium hover:bg-[#6e660a] transition-colors"
              >
                去登录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 照片详情弹窗 */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#dbe08c] p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-lg font-bold text-[#89800c]">
                {selectedPhoto.country} · {selectedPhoto.region} · {selectedPhoto.city} · {selectedPhoto.county}
              </h2>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-[#89800c] hover:bg-[#d1d678] rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || ""}
                className="w-full aspect-video object-cover rounded-lg mb-4"
              />
              {selectedPhoto.description && (
                <p className="text-gray-700 text-sm mb-3">{selectedPhoto.description}</p>
              )}
              {selectedPhoto.optionalTags.length > 0 && (
                <div className="flex gap-2">
                  {selectedPhoto.optionalTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-[#dbe08c]/40 text-[#89800c] rounded-full"
                    >
                      {getOptionalTagIcon(tag)}
                      {getOptionalTagLabel(tag)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
