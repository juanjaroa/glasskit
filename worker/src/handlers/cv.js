export function getCacheKey(request) {
	const url = new URL(request.url);
	url.search = '';
	return new Request(url.toString());
}

export async function handleCV(request, env, ctx) {
	if (request.method !== 'GET') {
		return new Response('Method not allowed', { status: 405 });
	}

	const cache = caches.default;
	const cacheKey = getCacheKey(request);

	const cachedResponse = await cache.match(cacheKey);

	if (cachedResponse) {
		console.log('[CV] cache HIT');

		const response = new Response(cachedResponse.body, {
			status: cachedResponse.status,
			headers: cachedResponse.headers,
		});
		response.headers.set('X-Cache', 'HIT');

		return response;
	}

	const DOC_ID = '1pXrtiqP6OwaJbhNbreHqkex7SJHENCwAfmELpnifsvM';
	const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=pdf`;

	try {
		const response = await fetch(DOC_URL);

		if (!response.ok) {
			throw new Error(`Failed to fetch CV: ${response.statusText}`);
		}

		const buffer = await response.arrayBuffer();

		const newResponse = new Response(buffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline',
				'Cache-Control': 'public, max-age=3600, s-maxage=3600',
				'X-Cache': 'MISS',
				'X-Source': 'google-docs',
			},
		});

		ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));

		console.log('[CV] cache MISS - fetched from Google Docs');
		return newResponse;
	} catch (error) {
		return new Response(`Internal Error: ${error.message}`, { status: 500 });
	}
}
