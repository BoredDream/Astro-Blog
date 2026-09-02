// Vercel Serverless Function：点赞计数持久化（Upstash Redis REST API）。
//
// 环境变量（Vercel 项目 Settings → Environment Variables 中配置）：
//   UPSTASH_REDIS_REST_URL   Upstash 控制台 REST API 地址
//   UPSTASH_REDIS_REST_TOKEN Upstash 控制台 REST API Token
//
// 接口（同源，无需 CORS）：
//   GET  /api/like?id=<文章id>            → { count } 当前动态计数
//   POST /api/like  body { id, action }   → { count } action: 'like' | 'unlike'
//
// 未配置环境变量或 Upstash 请求失败时返回 { count: null }，
// 前端收到 null 会自动回退为仅 localStorage 记忆（原行为）。
const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function send(res, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(body);
}

export default async function handler(req, res) {
  const body = req.method === 'POST' ? req.body || {} : {};
  const id = req.method === 'POST' ? body.id : req.query.id;
  const action = req.method === 'POST' ? body.action : 'get';

  // 文章 id 即 content 集合的 slug，仅允许字母数字下划线连字符
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(String(id || ''))) {
    return res.status(400).json({ error: 'invalid id' });
  }
  if (!REST_URL || !REST_TOKEN) return send(res, { count: null });

  const key = `likes:${id}`;
  const headers = { Authorization: `Bearer ${REST_TOKEN}` };
  try {
    if (action === 'like') {
      const r = await fetch(`${REST_URL}/incr/${key}`, { headers });
      const { result } = await r.json();
      return send(res, { count: result });
    }
    if (action === 'unlike') {
      const r = await fetch(`${REST_URL}/decr/${key}`, { headers });
      const { result } = await r.json();
      // 计数不为负：减到 0 以下时归零
      if (result < 0) await fetch(`${REST_URL}/set/${key}/0`, { headers });
      return send(res, { count: Math.max(0, result) });
    }
    const r = await fetch(`${REST_URL}/get/${key}`, { headers });
    const { result } = await r.json();
    return send(res, { count: result == null ? 0 : parseInt(result, 10) });
  } catch (e) {
    return send(res, { count: null });
  }
}
