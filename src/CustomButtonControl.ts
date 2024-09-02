import {Map, Control, DomUtil, DomEvent, type ControlOptions} from 'leaflet';

export abstract class Icon {
    public abstract build(container?: HTMLElement): HTMLElement;
}

export class FontAwesomeIcon extends Icon {
    private readonly faIcon: string;

    constructor(icon: string) {
        super();

        this.faIcon = icon;
    }

    public build(container?: HTMLElement): HTMLElement {
        const mainDiv = DomUtil.create('div', 'leaflet-control-custom-button-icon', container);
        DomUtil.create('i', 'fa ' + this.faIcon, mainDiv);
        return mainDiv;
    }
}

export enum MaterialDesignIconTheme {
    Outlined = "outlined",
    TwoTone = "two-tone",
    Round = "round",
    Sharp = "sharp",
}

export class MaterialDesignIcon extends Icon {
    private readonly mdiIcon: string;
    private readonly mdiTheme?: MaterialDesignIconTheme;

    constructor(icon: string, theme?: MaterialDesignIconTheme) {
        super();

        this.mdiIcon = icon;
        this.mdiTheme = theme;
    }

    public build(container?: HTMLElement): HTMLElement {
        const mainDiv = DomUtil.create('div', 'leaflet-control-custom-button-icon', container);
        const span = DomUtil.create('span', this.mdiTheme ? 'material-icons-' + this.mdiTheme : 'material-icons', mainDiv);
        span.innerText = this.mdiIcon;
        return mainDiv;
    }
}

export interface IconButtonControlOptions extends ControlOptions {
    id?: string;
    title?: string;
    content: string | Icon;
    click: () => void;
}

export default class CustomButtonControl extends Control {
    private _options: IconButtonControlOptions;
    private _link?: HTMLAnchorElement;

    constructor(options: IconButtonControlOptions) {
        super(options);

        this._options = options;
    }

    public onAdd(map: Map): HTMLElement {
        const container = DomUtil.create('div', 'leaflet-control-custom-button');

        this._link = DomUtil.create('a', undefined, container);
        this._link.href = '#';
        this._link.role = 'button';
        if (this._options.id) {
            this._link.id = this._options.id;
        }
        if (this._options.title) {
            this._link.title = this._options.title;
        }
        if (typeof this._options.content === 'string') {
            const mainDiv = DomUtil.create('div', 'leaflet-control-custom-button-text', this._link);
            mainDiv.innerText = this._options.content;
        } else if (this._options.content instanceof Icon) {
            this._options.content.build(this._link);
        }
        if (this._options.click) {
            DomEvent.on(this._link, 'click', this._options.click);
        }

        return container;
    }

    public onRemove(map: Map): void {
        if (this._link && this._options.click) {
            DomEvent.off(this._link, 'click', this._options.click);
        }
    }
}
