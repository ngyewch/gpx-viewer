import 'leaflet/dist/leaflet.css';
import 'sweetalert2/src/sweetalert2.scss';

import App from './App.svelte';

let app = new App({
    target: document.body,
});

export default app;
