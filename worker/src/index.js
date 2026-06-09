import { handleContactForm } from './handlers/contact';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/api/contact')) {
			return handleContactForm(request, env, ctx);
		}

		return new Response('Not found', { status: 404 });
	},
};
