const WORKER_URL = 'https://jianli-api.i-jensenji.workers.dev';

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const targetUrl = `${WORKER_URL}${url.pathname}${url.search}`;
    const headers = new Headers(context.request.headers);
    const keep = ['content-type', 'authorization', 'user-agent', 'cf-connecting-ip', 'x-forwarded-for'];
    for (const key of headers.keys()) {
      if (!keep.includes(key.toLowerCase())) headers.delete(key);
    }
    const body = context.request.method === 'GET' || context.request.method === 'HEAD'
      ? null
      : await context.request.text();
    return await fetch(targetUrl, { method: context.request.method, headers, body });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 502 });
  }
}
