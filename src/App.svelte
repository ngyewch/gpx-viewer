<script lang="ts">
    import {onMount} from 'svelte';
    import {
        TileLayer,
        Map as LeafletMap,
        type MapOptions,
        Control,
        LayerGroup,
        Polyline,
        type LatLngExpression, LatLng, LatLngBounds, type ControlOptions, Marker, Circle
    } from 'leaflet';
    import MicroModal from 'micromodal';
    import Dropzone from 'svelte-file-dropzone';
    import {ParsedGPX, parseGPX} from '@we-gold/gpxjs';
    import Swal from 'sweetalert2';
    import CustomButtonControl, {FontAwesomeIcon} from './CustomButtonControl.js';
    import ChartControl from './ChartControl.js';

    let mapElement: HTMLDivElement;
    let map: LeafletMap;
    let layerGroup: LayerGroup;
    let gpx: ParsedGPX | undefined;
    let marker: Marker | undefined;
    let chartControl: ChartControl | undefined;

    onMount(() => {
        if (!mapElement) {
            return;
        }
        initMap();
    });

    function initMap(): void {
        const mapOptions: MapOptions = {
            center: [1.3521, 103.8198],
            zoom: 3,
        };

        map = new LeafletMap(mapElement, mapOptions);

        chartControl = new ChartControl({
            position: 'bottomright',
            onHover: (index: number) => {
                if (marker && gpx && (gpx.tracks.length > 0) && (index < gpx.tracks[0].points.length)) {
                    const point = gpx.tracks[0].points[index];
                    marker.setLatLng(new LatLng(point.latitude, point.longitude, (point.elevation !== null) ? point.elevation : undefined));
                }
            },
        });
        chartControl.addTo(map);

        const scaleControl = new Control.Scale({
            position: 'bottomright',
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

        const openButton = new CustomButtonControl({
            position: 'topright',
            content: new FontAwesomeIcon('fa-folder-open'),
            click: () => {
                MicroModal.show('modal-1');
            },
        });
        openButton.addTo(map);

        layerGroup = new LayerGroup();
        layerGroup.addTo(map);
    }

    function handleFilesSelect(e: CustomEvent) {
        MicroModal.close('modal-1');
        gpx = undefined;
        const {acceptedFiles} = e.detail;
        acceptedFiles.forEach((file: File) => {
            file.text()
                .then((s: string) => {
                    const [gpx1, e] = parseGPX(s);
                    if (e) {
                        console.error(e);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error parsing GPX',
                            text: e.toString(),
                        });
                    } else {
                        gpx = gpx1;
                        console.log(gpx);
                        layerGroup.clearLayers();
                        if (marker) {
                            marker.remove();
                        }
                        marker = undefined;
                        let bounds: LatLngBounds = new LatLngBounds([]);
                        for (let i = 0; i < gpx.tracks.length; i++) {
                            const track = gpx.tracks[i];
                            let latLngs: LatLngExpression[] = [];
                            for (let j = 0; j < track.points.length; j++) {
                                const point = track.points[j];
                                const latLng = new LatLng(point.latitude, point.longitude, (point.elevation !== null) ? point.elevation : undefined);
                                if ((i == 0) && (j == 0)) {
                                    marker = new Marker(latLng);
                                    marker.addTo(map);
                                }
                                latLngs.push(latLng);
                            }
                            const polyline = new Polyline(latLngs, {
                                opacity: 0.5,
                            });
                            polyline.addTo(layerGroup);
                            bounds = bounds.extend(polyline.getBounds());
                            if (chartControl) {
                                chartControl.setTrack(track);
                            }
                            break; // NOTE only handle first track
                        }
                        for (let i = 0; i < gpx.tracks.length; i++) {
                            const track = gpx.tracks[i];
                            for (let j = 0; j < track.points.length; j++) {
                                const point = track.points[j];
                                const latLng = new LatLng(point.latitude, point.longitude, (point.elevation !== null) ? point.elevation : undefined);
                                new Circle(latLng, {
                                    radius: 1,
                                }).addTo(layerGroup);
                            }
                            break; // NOTE only handle first track
                        }
                        if (bounds) {
                            map.fitBounds(bounds);
                        }
                    }
                })
                .catch((e: any) => {
                    console.error(e);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error loading GPX',
                        text: e.toString(),
                    });
                });
        });
    }
</script>

<div bind:this={mapElement} id="map">
</div>

<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            <header class="modal__header">
                <h2 class="modal__title" id="modal-1-title">
                    Load GPX file
                </h2>
                <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
            </header>
            <main class="modal__content" id="modal-1-content">
                <p>
                    <Dropzone multiple={false} on:drop={handleFilesSelect}/>
                </p>
            </main>
        </div>
    </div>
</div>

<style>
    div#map {
        width: 100%;
        height: 100%;
    }
</style>
