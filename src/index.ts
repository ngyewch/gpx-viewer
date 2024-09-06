import 'leaflet/dist/leaflet.css';
import 'sweetalert2/src/sweetalert2.scss';

import {Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip} from 'chart.js';
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

import App from './App.svelte';

let app = new App({
    target: document.body,
});

export default app;
