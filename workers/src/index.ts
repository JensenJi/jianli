import { Hono } from 'hono';
import { jwt, sign, verify } from 'hono/jwt';

// 类型定义
interface User {
  email: string;
  password: string; // bcrypt hash
  username: string;
  createdAt: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
}

// 环境变量类型
interface Env {
  USERS: KVNamespace;
  MESSAGES: KVNamespace;
  JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS 中间件
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }
  await next();
});

// 密码哈希（简单版，生产环境建议用 bcrypt）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

// ========== 认证 API ==========

// 注册
app.post('/api/auth/register', async (c) => {
  const { email, password, username } = await c.req.json();
  
  if (!email || !password || !username) {
    return c.json({ error: '请填写所有字段' }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: '密码至少需要6位' }, 400);
  }
  
  // 检查用户是否已存在
  const existing = await c.env.USERS.get(email);
  if (existing) {
    return c.json({ error: '该邮箱已被注册' }, 409);
  }
  
  const user: User = {
    email,
    password: await hashPassword(password),
    username,
    createdAt: new Date().toISOString(),
  };
  
  await c.env.USERS.put(email, JSON.stringify(user));
  
  const token = await sign({ email, username }, c.env.JWT_SECRET);
  return c.json({ token, user: { email, username } });
});

// 登录
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  if (!email || !password) {
    return c.json({ error: '请填写邮箱和密码' }, 400);
  }
  
  const userData = await c.env.USERS.get(email);
  if (!userData) {
    return c.json({ error: '邮箱或密码错误' }, 401);
  }
  
  const user: User = JSON.parse(userData);
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return c.json({ error: '邮箱或密码错误' }, 401);
  }
  
  const token = await sign({ email, username: user.username }, c.env.JWT_SECRET);
  return c.json({ token, user: { email, username: user.username } });
});

// 获取当前用户
app.get('/api/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '未登录' }, 401);
  }
  
  const token = authHeader.slice(7);
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    return c.json({ user: payload });
  } catch {
    return c.json({ error: '登录已过期' }, 401);
  }
});

// ========== 留言 API ==========

// 获取所有留言
app.get('/api/messages', async (c) => {
  const messagesData = await c.env.MESSAGES.list();
  const messages: Message[] = [];
  
  for (const key of messagesData.keys) {
    const data = await c.env.MESSAGES.get(key.name);
    if (data) messages.push(JSON.parse(data));
  }
  
  messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return c.json({ messages });
});

// 发布留言
app.post('/api/messages', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '请先登录' }, 401);
  }
  
  const token = authHeader.slice(7);
  let user;
  try {
    user = await verify(token, c.env.JWT_SECRET);
  } catch {
    return c.json({ error: '登录已过期' }, 401);
  }
  
  const { content } = await c.req.json();
  if (!content?.trim()) {
    return c.json({ error: '留言内容不能为空' }, 400);
  }
  
  const message: Message = {
    id: crypto.randomUUID(),
    userId: user.email,
    userName: user.username,
    userEmail: user.email,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  
  await c.env.MESSAGES.put(message.id, JSON.stringify(message));
  return c.json({ message });
});

// 删除留言
app.delete('/api/messages/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '请先登录' }, 401);
  }

  const token = authHeader.slice(7);
  try {
    await verify(token, c.env.JWT_SECRET);
  } catch {
    return c.json({ error: '登录已过期' }, 401);
  }

  const id = c.req.param('id');
  await c.env.MESSAGES.delete(id);
  return c.json({ success: true });
});

// ========== 健康检查 ==========
app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;