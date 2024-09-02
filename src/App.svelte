<script lang="ts">
    import {onMount} from 'svelte';
    import {TileLayer, Map as LeafletMap, type MapOptions, Control} from 'leaflet';
    import CustomButtonControl, {FontAwesomeIcon, MaterialDesignIcon} from './CustomButtonControl.js';

    let mapElement: HTMLDivElement;
    let map: LeafletMap;

    onMount(() => {
        if (!mapElement) {
            return;
        }

        const mapOptions: MapOptions = {
            center: [1.3521, 103.8198],
            zoom: 3,
        };

        map = new LeafletMap(mapElement, mapOptions);

        const scaleControl = new Control.Scale({
            maxWidth: 200,
        });
        scaleControl.addTo(map);

        const openStreetMapsTileLayer = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })

        openStreetMapsTileLayer.addTo(map);

        const openSeaMapTileLayer = new TileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
            opacity: 0.2,
            attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
        });
        const baseMaps = {
            "OpenStreetMaps": openStreetMapsTileLayer,
        };
        const overlayMaps = {
            "OpenSeaMap": openSeaMapTileLayer,
        };

        const layersControl = new Control.Layers(baseMaps, overlayMaps, {});
        layersControl.addTo(map);

        const buttonControl1 = new CustomButtonControl({
            position: 'topright',
            content: new FontAwesomeIcon('fa-book'),
            click: () => {
                console.log('Hello #1');
            },
        });
        buttonControl1.addTo(map);

        const buttonControl2 = new CustomButtonControl({
            position: 'topright',
            content: 'Hello, world!',
            click: () => {
                console.log('Hello #2');
            },
        });
        buttonControl2.addTo(map);

        const buttonControl3 = new CustomButtonControl({
            position: 'topright',
            content: new MaterialDesignIcon('home'),
            click: () => {
                console.log('Hello #3');
            },
        });
        buttonControl3.addTo(map);

    });
</script>

<div bind:this={mapElement} id="map">
</div>

<style>
    div#map {
        width: 100%;
        height: 100%;
    }
</style>
