import { API_BASE_URL } from "@/config";

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
}

export const getMessages = async (): Promise<Message[]> => {
  const res = await fetch(`${API_BASE_URL}/api/messages`);
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

// 删除留言（管理员使用）
export const deleteMessage = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("请先登录");

  const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("删除留言失败");
};
