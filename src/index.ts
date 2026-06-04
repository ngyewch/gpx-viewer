import {Icon} from 'leaflet';
import {Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip} from 'chart.js';
import {mount} from 'svelte';
import App from './App.svelte';

import 'leaflet/dist/leaflet.css';
import 'sweetalert2/src/sweetalert2.scss';
import './global.css';
import './leaflet.css';
import './micromodal.css';

Icon.Default.imagePath = '/gpx-viewer/images/';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const app = mount(App, {
    target: document.getElementById('app')!,
});

export default app;
