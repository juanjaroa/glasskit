export default {
	async fetch(request, env, ctx) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://jroa.win', 'https://www.jroa.win'];

		const origin = request.headers.get('origin');

		if (!origin || !allowedOrigins.includes(origin)) {
			return new Response(JSON.stringify({ error: 'Forbidden' }), {
				status: 403,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		const contentType = request.headers.get('content-type') || '';

		if (!contentType.includes('application/json')) {
			return new Response(JSON.stringify({ error: 'Invalid content type' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		let body;

		// basic json validation
		try {
			body = await request.json();
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Main logic
		try {
			const { name, email, message, company } = body;

			if (company) {
				return new Response(null, { status: 200 });
			}

			function escapeHTML(str) {
				return str.replace(/[&<>"']/g, (char) => {
					const map = {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#039;',
					};
					return map[char];
				});
			}

			const EMAIL_REGEX =
				/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

			const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

			const trimmedName = typeof name === 'string' ? name.trim() : '';
			const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
			const trimmedMessage = typeof message === 'string' ? message.trim() : '';

			if (
				!trimmedName ||
				!trimmedEmail ||
				!trimmedMessage ||
				trimmedName.length < 2 ||
				trimmedMessage.length < 10 ||
				!EMAIL_REGEX.test(trimmedEmail)
			) {
				return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			const safeName = escapeHTML(trimmedName);
			const safeEmail = escapeHTML(trimmedEmail);
			const safeMessage = escapeHTML(trimmedMessage);

			// Email a Juan Roa
			const contactEmailResponse = await fetch(BREVO_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'api-key': env.BREVO_API_KEY,
				},
				body: JSON.stringify({
					sender: { name: 'Juan Roa', email: 'contact@jroa.win' },
					to: [{ email: 'contact@jroa.win' }],
					replyTo: { email: safeEmail, name: safeName },
					subject: `Nuevo mensaje de ${safeName}`,
					htmlContent: `
						<div style="
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
							line-height: 1.5;
							color: #222;
						">
							
							<h2 style="margin-bottom: 16px;">
							Nuevo mensaje desde el formulario
							</h2>
							
							<p><strong>Nombre:</strong><br>${safeName}</p>
							
							<p><strong>Email:</strong><br>
							<a href="mailto:${safeEmail}">${safeEmail}</a>
							</p>
							
							<p><strong>Mensaje:</strong><br>${safeMessage}</p>
							
							<hr style="margin: 24px 0;">
							
							<p style="font-size: 12px; color: #666;">
							Este mensaje fue enviado desde tu formulario web.
							</p>
							
						</div>
						`,
				}),
			});

			if (!contactEmailResponse.ok) {
				const err = await contactEmailResponse.json();
				console.error('Brevo error:', JSON.stringify(err));
				throw new Error(err.message || 'Error enviando email');
			}

			// Respuesta automática al visitante
			const autoReplyResponse = await fetch(BREVO_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'api-key': env.BREVO_API_KEY,
				},
				body: JSON.stringify({
					sender: { name: 'Juan Roa', email: 'contact@jroa.win' },
					to: [{ name: safeName, email: safeEmail }],
					subject: 'Thanks for reaching out!',
					htmlContent: `
						<div style="
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
							line-height: 1.6;
							color: #222;
						">
							
							<p>Hi ${safeName},</p>
							
							<p>
							Thanks for reaching out — I’ve received your message and I appreciate you taking the time to write.
							</p>
							
							<p>
							I’ll review it and get back to you as soon as possible.
							</p>
							
							<p>
							In the meantime, feel free to reply to this email if you’d like to add anything else.
							</p>
							
							<br/>
							
							<p>Best regards,</p>
							<p><strong>Juan Roa</strong></p>
							
						</div>
						`,
				}),
			});

			if (!autoReplyResponse.ok) {
				const err = await autoReplyResponse.json();
				console.error('Auto-reply error:', JSON.stringify(err));
				// No lanzamos error — el mensaje principal ya se envió
			}

			return new Response(JSON.stringify({ ok: true, message: 'Mensaje enviado' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}
	},
};
