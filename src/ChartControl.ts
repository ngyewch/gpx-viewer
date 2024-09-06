import {Map, Control, type ControlOptions, DomUtil} from 'leaflet';
import {Chart, type ChartConfiguration, type Point, type TooltipItem} from 'chart.js';
import {type Track, type Point as GPXPoint} from '@we-gold/gpxjs';

export interface ChartControlOptions extends ControlOptions {
    onHover?: (index: number) => void;
}

export default class ChartControl extends Control {
    private chartControlOptions: ChartControlOptions;
    private chart: Chart<'line'> | undefined;
    private track: Track | undefined;

    constructor(options: ChartControlOptions) {
        super(options);

        this.chartControlOptions = options;
    }

    private getEpochSeconds(p: GPXPoint): number {
        if (p.time === null) {
            return 0;
        }
        return p.time.getTime() / 1000;
    }

    public setTrack(track: Track): void {
        this.track = track;
        const points: Point[] = [];
        if (track.points && (track.points.length > 0)) {
            const t0 = this.getEpochSeconds(track.points[0]);
            for (let i = 0; i < track.points.length; i++) {
                const point = track.points[i];
                const distance = track.distance.cumulative[i];
                const t = this.getEpochSeconds(point);
                points.push({
                    x: t - t0,
                    y: distance,
                });
            }
        }
        if (this.chart) {
            this.chart.data.datasets[0].data = points;
            this.chart.update();
        }
    }

    public onAdd(map: Map): HTMLElement {
        const container = DomUtil.create('div', 'leaflet-control-chart');
        const canvas = DomUtil.create('canvas', undefined, container);
        const chartConfiguration: ChartConfiguration<'line'> = {
            type: 'line',
            data: {
                datasets: [{
                    data: [],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                    },
                    y: {
                        type: 'linear',
                    }
                },
                interaction: {
                    mode: 'nearest',
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            beforeTitle: (items: TooltipItem<'line'>[]) => {
                                if (this.chartControlOptions.onHover) {
                                    this.chartControlOptions.onHover(items[0].dataIndex);
                                }
                            },
                        },
                    },
                },
            },
        };
        try {
            this.chart = new Chart(canvas, chartConfiguration);
        } catch (e) {
            console.error(e);
        }
        return container;
    }

    public onRemove(map: Map): void {
    }
}
