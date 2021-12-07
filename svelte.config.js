import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			server: {
				proxy: {
					'/boards': {
						target: 'https://boards-api.greenhouse.io/v1/boards',
						changeOrigin: true,
						rewrite: path => path.replace('/boards', '')
					}
				}
			}
		}
	}
};

export default config;
