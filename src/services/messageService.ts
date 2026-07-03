import { API_BASE_URL } from "@/config";

export interface VisitorInfo {
  country: string;
  province: string;
  city: string;
  device: string;
  browser: string;
  ip: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  visitor: VisitorInfo;
  createdAt: string;
  updatedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reply?: string;
}

export const getMessages = async (status?: string): Promise<Message[]> => {
  const token = localStorage.getItem("token");
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`${API_BASE_URL}/api/messages${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("获取留言失败");
  const data = await res.json();
  return data.messages || [];
};

export const saveMessage = async (
  userId: string,
  userName: string,
  userEmail: string,
  content: string
): Promise<string> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("请先登录");

  const res = await fetch(`${API_BASE_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "发布留言失败");
  return data.message.id;
};

export const updateMessage = async (id: string, content: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("请先登录");

  const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "编辑留言失败");
};

export const reviewMessage = async (
  id: string,
  status: "approved" | "rejected",
  reply?: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("请先登录");

  const res = await fetch(`${API_BASE_URL}/api/messages/${id}/review`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, reply }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "审核操作失败");
};

export const deleteMessage = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("请先登录");

  const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("删除留言失败");
};
