import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: Date;
}

export const saveMessage = async (
  userId: string,
  userName: string,
  userEmail: string,
  content: string
): Promise<string> => {
  if (!db) throw new Error("Firebase 未配置");
  const docRef = await addDoc(collection(db, "messages"), {
    userId,
    userName,
    userEmail,
    content,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// 模拟留言数据
const mockMessages: Message[] = [
  {
    id: "mock1",
    userId: "mock-user-1",
    userName: "张明",
    userEmail: "zhang@example.com",
    content: "非常优秀的个人主页！旅行经历很丰富，照片拍得很美！",
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "mock2",
    userId: "mock-user-2",
    userName: "李华",
    userEmail: "li@example.com",
    content: "看了您的旅行足迹，很羡慕！有机会一定要去西藏看看。",
    createdAt: new Date("2024-01-14T15:20:00"),
  },
  {
    id: "mock3",
    userId: "mock-user-3",
    userName: "王芳",
    userEmail: "wang@example.com",
    content: "简历做得很专业，工作经历很丰富！期待看到更多精彩内容。",
    createdAt: new Date("2024-01-13T09:45:00"),
  },
  {
    id: "mock4",
    userId: "mock-user-4",
    userName: "陈伟",
    userEmail: "chen@example.com",
    content: "去过这么多地方，真是令人敬佩！照片构图很棒！",
    createdAt: new Date("2024-01-12T14:10:00"),
  },
  {
    id: "mock5",
    userId: "mock-user-5",
    userName: "刘洋",
    userEmail: "liu@example.com",
    content: "从您的经历中学到了很多，希望以后也能像您一样到处旅行！",
    createdAt: new Date("2024-01-11T11:30:00"),
  },
];

export const getMessages = async (): Promise<Message[]> => {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const realMessages = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        content: data.content,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      };
    });

    // 如果没有真实数据，返回模拟数据
    if (realMessages.length === 0) {
      return mockMessages;
    }

    // 如果有真实数据，把模拟数据追加到后面
    return [...realMessages, ...mockMessages];
  } catch (error) {
    console.error("加载留言失败，使用模拟数据:", error);
    return mockMessages;
  }
};