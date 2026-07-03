import { API_BASE_URL } from "@/config";

// 访客自动上报（每次页面访问调用一次）
export function trackVisit(page: string = "/") {
  try {
    fetch(`${API_BASE_URL}/api/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page }),
    });
  } catch {
    // 静默失败
  }
}

// 获取统计数据
export interface SiteStats {
  totalPv: number;
  totalUv: number;
  todayUv: number;
  devices: Record<string, number>;
  regions: { country: string; province: string; city: string; count: number }[];
}

export const getStats = async (): Promise<SiteStats> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("获取统计失败");
  const data = await res.json();
  return data;
};

// 获取最近访问记录
export interface RecentVisitor {
  id: string;
  page: string;
  visitor: {
    country: string;
    province: string;
    city: string;
    device: string;
    browser: string;
    ip: string;
  };
  timestamp: string;
}

export const getRecentVisitors = async (): Promise<RecentVisitor[]> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/api/visitors/recent`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("获取访客记录失败");
  const data = await res.json();
  return data.visitors || [];
};
