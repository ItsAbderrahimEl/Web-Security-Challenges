import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        cors: true
    },
    plugins: [
        laravel({
            input: ['resources/js/Game-v1/app.js', 'resources/js/Game-v2/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ]
});
