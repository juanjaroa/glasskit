import { getCacheKey } from './cv';

export async function handleCVRefresh(request, env, ctx) {
	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	const authHeader = request.headers.get('authorization');

	if (authHeader !== `Bearer ${env.CV_REFRESH_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const cache = caches.default;

	const url = new URL(request.url);
	url.pathname = '/api/cv';
	url.search = '';

	const fakeRequest = new Request(url.toString());

	const cacheKey = getCacheKey(fakeRequest);

	const deleted = await cache.delete(cacheKey);

	console.log('[CV] cache cleared via refresh endpoint');

	return new Response(JSON.stringify({ ok: true, deleted }), {
		headers: { 'Content-Type': 'application/json' },
	});
}