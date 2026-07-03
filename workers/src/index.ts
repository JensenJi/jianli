import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';

// ==================== 类型定义 ====================

interface User {
  email: string;
  password: string;
  username: string;
  createdAt: string;
}

interface VisitorInfo {
  country: string;
  province: string;
  city: string;
  device: string;     // Windows 7/10/11, macOS, Android, HarmonyOS, iOS
  browser: string;    // Chrome, Firefox, Safari, Edge, WeChat, etc.
  ip: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected'; // 审核状态
  visitor: VisitorInfo;
  createdAt: string;
  updatedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reply?: string; // 管理员回复
}

interface PageView {
  id: string;
  page: string;
  visitor: VisitorInfo;
  timestamp: string;
}

// 环境变量
interface Env {
  USERS: KVNamespace;
  MESSAGES: KVNamespace;
  VISITORS: KVNamespace;    // 访客去重（按 IP + 日期）
  PAGE_VIEWS: KVNamespace;  // PV 详细记录
  STATS: KVNamespace;       // 统计聚合数据
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
}

const app = new Hono<{ Bindings: Env }>();

// ==================== 中间件 ====================

function setCorsHeaders(c: any) {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

app.use('*', async (c, next) => {
  setCorsHeaders(c);
  if (c.req.method === 'OPTIONS') return c.text('', 204);
  try {
    await next();
  } finally {
    setCorsHeaders(c);
  }
});

app.onError((err, c) => {
  setCorsHeaders(c);
  console.error('Worker Error:', err);
  return c.json({ error: '服务器内部错误' }, 500);
});

// 管理员鉴权中间件
async function requireAdmin(c: any): Promise<boolean> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  try {
    const payload = await verify(authHeader.slice(7), c.env.JWT_SECRET);
    return payload.email === c.env.ADMIN_EMAIL;
  } catch {
    return false;
  }
}

// ==================== 工具函数 ====================

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'jianli-salt-2026');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash;
}

// 解析 User-Agent 提取设备信息
function parseDevice(ua: string): string {
  if (/HarmonyOS/i.test(ua)) return 'HarmonyOS';
  if (/Windows NT 6\.1/i.test(ua)) return 'Windows 7';
  if (/Windows NT 10\.0/i.test(ua)) return 'Windows 10';
  if (/Windows NT 11/i.test(ua)) return 'Windows 11';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

function parseBrowser(ua: string): string {
  if (/MicroMessenger/i.test(ua)) return 'WeChat';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua)) return 'Safari';
  return 'Unknown';
}

// 获取访客信息
function getVisitorInfo(c: any): VisitorInfo {
  const ua = c.req.header('User-Agent') || '';
  const cf = c.req.header('CF-IPCountry') || '';
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() || 'unknown';
  return {
    country: cf || 'unknown',
    province: c.req.header('CF-Region') || 'unknown',
    city: c.req.header('CF-IPCity') || 'unknown',
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    ip,
  };
}

// ==================== 认证 API ====================

app.post('/api/auth/register', async (c) => {
  const { email, password, username } = await c.req.json();
  if (!email || !password || !username) return c.json({ error: '请填写所有字段' }, 400);
  if (password.length < 6) return c.json({ error: '密码至少需要6位' }, 400);

  const existing = await c.env.USERS.get(email);
  if (existing) return c.json({ error: '该邮箱已被注册' }, 409);

  const user: User = {
    email,
    password: await hashPassword(password),
    username,
    createdAt: new Date().toISOString(),
  };

  await c.env.USERS.put(email, JSON.stringify(user));
  const token = await sign({ email, username }, c.env.JWT_SECRET, 'HS256');
  return c.json({ token, user: { email, username } });
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) return c.json({ error: '请填写邮箱和密码' }, 400);

  const userData = await c.env.USERS.get(email);
  if (!userData) return c.json({ error: '邮箱或密码错误' }, 401);

  const user: User = JSON.parse(userData);
  if (!(await verifyPassword(password, user.password))) return c.json({ error: '邮箱或密码错误' }, 401);

  const token = await sign({ email, username: user.username }, c.env.JWT_SECRET, 'HS256');
  return c.json({ token, user: { email, username: user.username } });
});

app.get('/api/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: '未登录' }, 401);
  try {
    const payload = await verify(authHeader.slice(7), c.env.JWT_SECRET);
    return c.json({ user: payload });
  } catch {
    return c.json({ error: '登录已过期' }, 401);
  }
});

// ==================== 留言 API（含审核）====================

// 获取留言（公开只看已审核的，管理员看全部）
app.get('/api/messages', async (c) => {
  const isAdmin = await requireAdmin(c);
  const status = c.req.query('status'); // pending/approved/rejected
  const messagesData = await c.env.MESSAGES.list();
  const messages: Message[] = [];

  for (const key of messagesData.keys) {
    const data = await c.env.MESSAGES.get(key.name);
    if (data) {
      const msg: Message = JSON.parse(data);
      if (isAdmin || msg.status === 'approved') {
        if (!status || msg.status === status) messages.push(msg);
      }
    }
  }

  messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return c.json({ messages });
});

// 发布留言（默认 pending 状态）
app.post('/api/messages', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: '请先登录' }, 401);

  let user;
  try {
    user = await verify(authHeader.slice(7), c.env.JWT_SECRET);
  } catch {
    return c.json({ error: '登录已过期' }, 401);
  }

  const { content } = await c.req.json();
  if (!content?.trim()) return c.json({ error: '留言内容不能为空' }, 400);

  const message: Message = {
    id: crypto.randomUUID(),
    userId: user.email,
    userName: user.username,
    userEmail: user.email,
    content: content.trim(),
    status: 'pending',
    visitor: getVisitorInfo(c),
    createdAt: new Date().toISOString(),
  };

  await c.env.MESSAGES.put(message.id, JSON.stringify(message));
  return c.json({ message });
});

// 审核留言（管理员）
app.put('/api/messages/:id/review', async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: '无权限' }, 403);

  const id = c.req.param('id');
  const { status, reply } = await c.req.json();

  const data = await c.env.MESSAGES.get(id);
  if (!data) return c.json({ error: '留言不存在' }, 404);

  const message: Message = JSON.parse(data);
  message.status = status || message.status;
  message.reviewedAt = new Date().toISOString();
  message.reviewedBy = c.env.ADMIN_EMAIL;
  message.updatedAt = new Date().toISOString();
  if (reply !== undefined) message.reply = reply;

  await c.env.MESSAGES.put(id, JSON.stringify(message));
  return c.json({ message });
});

// 编辑留言（用户或管理员）
app.put('/api/messages/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: '请先登录' }, 401);

  let user;
  try {
    user = await verify(authHeader.slice(7), c.env.JWT_SECRET);
  } catch {
    return c.json({ error: '登录已过期' }, 401);
  }

  const id = c.req.param('id');
  const { content } = await c.req.json();

  const data = await c.env.MESSAGES.get(id);
  if (!data) return c.json({ error: '留言不存在' }, 404);

  const message: Message = JSON.parse(data);
  if (message.userId !== user.email && user.email !== c.env.ADMIN_EMAIL) {
    return c.json({ error: '无权限' }, 403);
  }

  message.content = content.trim();
  message.updatedAt = new Date().toISOString();
  await c.env.MESSAGES.put(id, JSON.stringify(message));
  return c.json({ message });
});

// 删除留言
app.delete('/api/messages/:id', async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: '无权限' }, 403);
  const id = c.req.param('id');
  await c.env.MESSAGES.delete(id);
  return c.json({ success: true });
});

// ==================== 访客 / PV API ====================

// 记录页面访问
app.post('/api/visit', async (c) => {
  const { page } = await c.req.json();
  const visitor = getVisitorInfo(c);
  const today = new Date().toISOString().split('T')[0];
  const visitorKey = `${visitor.ip}_${today}`;

  // 去重：同一 IP 同一天只算一次 UV
  const visited = await c.env.VISITORS.get(visitorKey);
  const isNew = !visited;
  if (isNew) {
    await c.env.VISITORS.put(visitorKey, '1', { expirationTtl: 86400 * 30 }); // 30天过期
  }

  // 记录 PV
  const pvId = crypto.randomUUID();
  const pv: PageView = { id: pvId, page: page || '/', visitor, timestamp: new Date().toISOString() };
  await c.env.PAGE_VIEWS.put(pvId, JSON.stringify(pv), { expirationTtl: 86400 * 30 });

  // 更新统计
  const pvCount = parseInt(await c.env.STATS.get('total_pv') || '0') + 1;
  await c.env.STATS.put('total_pv', pvCount.toString());

  if (isNew) {
    const uvCount = parseInt(await c.env.STATS.get('total_uv') || '0') + 1;
    await c.env.STATS.put('total_uv', uvCount.toString());
  }

  // 更新设备统计
  const deviceKey = `device_${visitor.device}`;
  const deviceCount = parseInt(await c.env.STATS.get(deviceKey) || '0') + 1;
  await c.env.STATS.put(deviceKey, deviceCount.toString());

  // 更新地区统计
  const regionKey = `region_${visitor.country}_${visitor.province}_${visitor.city}`;
  const regionCount = parseInt(await c.env.STATS.get(regionKey) || '0') + 1;
  await c.env.STATS.put(regionKey, regionCount.toString());

  return c.json({ isNew });
});

// 获取统计数据（管理员）
app.get('/api/stats', async (c) => {
  const totalPv = parseInt(await c.env.STATS.get('total_pv') || '0');
  const totalUv = parseInt(await c.env.STATS.get('total_uv') || '0');

  // 设备统计
  const devices: Record<string, number> = {};
  const browserStats: Record<string, number> = {};
  const regions: Record<string, { country: string; province: string; city: string; count: number }> = {};

  const statsList = await c.env.STATS.list();
  for (const key of statsList.keys) {
    const val = parseInt(await c.env.STATS.get(key.name) || '0');
    if (key.name.startsWith('device_')) {
      devices[key.name.replace('device_', '')] = val;
    } else if (key.name.startsWith('region_')) {
      const parts = key.name.replace('region_', '').split('_');
      const label = `${parts[0]} / ${parts[1]} / ${parts[2]}`;
      regions[label] = { country: parts[0], province: parts[1], city: parts[2], count: val };
    }
  }

  // 今天的 PV/UV
  const today = new Date().toISOString().split('T')[0];
  const visitorsList = await c.env.VISITORS.list({ prefix: '' });
  let todayUv = 0;
  for (const key of visitorsList.keys) {
    if (key.name.endsWith(`_${today}`)) todayUv++;
  }

  return c.json({
    totalPv,
    totalUv,
    todayUv,
    devices,
    regions: Object.values(regions).sort((a, b) => b.count - a.count).slice(0, 20),
  });
});

// 获取最近访问记录（管理员）
app.get('/api/visitors/recent', async (c) => {
  const pvList = await c.env.PAGE_VIEWS.list({ limit: 50 });
  const visitors: PageView[] = [];
  for (const key of pvList.keys) {
    const data = await c.env.PAGE_VIEWS.get(key.name);
    if (data) visitors.push(JSON.parse(data));
  }
  visitors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return c.json({ visitors });
});

// ==================== 健康检查 ====================
app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;
