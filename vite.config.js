import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiServer = 'http://localhost:3001';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			'/auth/github': apiServer,
			'/logout': apiServer,
		},
	},
	build: {
		outDir: 'build',
	},
});
