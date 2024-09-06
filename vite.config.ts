import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    base: '/gpx-viewer/',
    plugins: [
        svelte(),
    ],
    build: {
        sourcemap: true,
    },
});
