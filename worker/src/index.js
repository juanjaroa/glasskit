import { handleContactForm } from './handlers/contact';
import { handleCV } from './handlers/cv';
import { handleCVRefresh } from './handlers/cv-refresh';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/api/contact')) {
			return handleContactForm(request, env, ctx);
		}

		if (url.pathname === '/api/cv/refresh') {
			return handleCVRefresh(request, env, ctx);
		}

		if (url.pathname === '/api/cv') {
			return handleCV(request, env, ctx);
		}

		

		return new Response('Not found', { status: 404 });
	},
};
