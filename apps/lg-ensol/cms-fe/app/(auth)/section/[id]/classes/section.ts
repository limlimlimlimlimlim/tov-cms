import EventEmitter from 'events';

declare const Konva: any;

export interface Point {
  x: number;
  y: number;
}
export type Path = Point[];

export interface Options {
  fill?: string;
  opacity?: number;
  strokeWidth?: number;
  stroke?: string;
  strokeOpacity?: number;
  selectable?: boolean;
  closed?: boolean;
  draggable?: boolean;
}

class Section extends EventEmitter {
  protected _container: any;
  protected _polygon: any;
  protected _path: Path;
  protected static _defaultOption: Options = {
    selectable: false,
    fill: '#D2C60C',
    opacity: 0.3,
    strokeWidth: 1,
    stroke: '#D2C60C',
    strokeOpacity: 1,
    closed: true,
  };
  protected _facility: any;
  protected _facilityInfoIcon;
  protected _facilityAddIcon;
  protected _icon;

  get path() {
    return this._path;
  }

  get id() {
    return this._id;
  }

  get container() {
    return this._container;
  }

  get polygon() {
    return this._polygon;
  }

  get options() {
    return this._options;
  }

  get facility() {
    return this._facility;
  }

  constructor(
    private _layer,
    _path: Path | string,
    private _options?: Options,
    private _id?: string | number,
  ) {
    super();
    this._id = _id ? _id : Math.random().toString().split('.')[1];
    if (!_options) {
      this._options = Section._defaultOption;
    }
    this.create();
    this.update(_path);
    this.initEvent();
  }

  private create() {
    this._container = new Konva.Group();
    this._polygon = new Konva.Line({
      ...this._options,
      points: [],
    });
    this._layer.add(this._container);
    this._container.add(this._polygon);
  }

  private loadIcon(url) {
    return new Promise((res) => {
      Konva.Image.fromURL(url, (image) => {
        res(image);
      });
    });
  }

  private async createFacilityIcons() {
    this._facilityInfoIcon = await this.loadIcon('/info.png');
    this._facilityAddIcon = await this.loadIcon('/add.png');
    this._facilityInfoIcon.scaleX(0.05);
    this._facilityInfoIcon.scaleY(0.05);
    this._facilityAddIcon.scaleX(0.05);
    this._facilityAddIcon.scaleY(0.05);

    this._facilityInfoIcon.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
      this.emit('onfacility', this._facility);
    });

    this._facilityInfoIcon.on('mouseout', () => {
      document.body.style.cursor = 'default';
      this.emit('outfacility', this._facility);
    });

    this._facilityAddIcon.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });

    this._facilityAddIcon.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });

    this._facilityAddIcon.on('click', () => {
      this.emit('addfacility', this._id);
    });

    this._facilityInfoIcon.on('click', () => {
      this.emit('facilitydetail', this._facility.id);
    });
  }

  private initEvent() {
    if (this._options?.selectable) {
      this._container.on('mousedown', (e) => {
        if (!e.evt.altKey) {
          e.cancelBubble = true;
          this.emit('select');
        }
      });
    }

    if (this._options?.draggable) {
      this._container.on('dragstart', (e) => {
        this.emit('dragstart', e);
      });

      this._container.on('dragend', (e) => {
        this.emit('dragend', e);
      });
    }
  }

  private updateFacilityPosition() {
    const posX = this._path.map((p) => p.x);
    const posY = this._path.map((p) => p.y);
    const minX = Math.min(...posX);
    const maxX = Math.max(...posX);
    const minY = Math.min(...posY);
    const maxY = Math.max(...posY);
    const x = minX + (maxX - minX) / 2;
    const y = minY + (maxY - minY) / 2;
    this._facilityInfoIcon.x(x - 15);
    this._facilityInfoIcon.y(y - 15);
    this._facilityAddIcon.x(x - 15);
    this._facilityAddIcon.y(y - 15);
  }

  private updateIconPosition(icon, offsetX = -15, offsetY = -15) {
    const posX = this._path.map((p) => p.x);
    const posY = this._path.map((p) => p.y);
    const minX = Math.min(...posX);
    const maxX = Math.max(...posX);
    const minY = Math.min(...posY);
    const maxY = Math.max(...posY);
    const x = minX + (maxX - minX) / 2;
    const y = minY + (maxY - minY) / 2;
    icon.x(x - offsetX);
    icon.y(y - offsetY);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  update(path: Path | string) {
    this._path = this.converPath(path);
    this._polygon.points(this.flatPath());
    if (this._facility) {
      this.updateIconPosition(this._facilityAddIcon);
      this.updateIconPosition(this._facilityInfoIcon);
    }
  }

  updateAt(index, point) {
    this._path[index] = point;
    this._polygon.points(this.flatPath());
    if (this._facility) {
      this.updateIconPosition(this._facilityAddIcon);
      this.updateIconPosition(this._facilityInfoIcon);
    }
  }

  destroy() {
    this._polygon.destroy();
    this._container.destroy();
    if (this._facility) {
      this._facilityAddIcon.destroy();
      this._facilityInfoIcon.destroy();
    }
  }

  toArrayPath() {
    return this.flatPath();
  }

  updateOption(option): any {
    if (!this._options) return;
    this._options = { ...this._options, ...option };
    this._polygon.setAttrs(option);
    if (this._facility) {
      this.updateFacilityPosition();
    }
  }

  updateFacilityOption(option): any {
    if (!this._facility) return;
    this._facility = {
      ...this.facility,
      ...option,
    };
  }

  addIcon(icon, offsetX = 0, offsetY = 0) {
    this._icon = icon;
    this._container.add(this._icon);
    this.updateIconPosition(this._icon, offsetX, offsetY);
  }

  async setFacility(facility) {
    await this.createFacilityIcons();
    this._container.add(this._facilityInfoIcon);
    this._container.add(this._facilityAddIcon);

    this._facility = facility;
    if (this._facility) {
      this._facilityInfoIcon.show();
      this._facilityAddIcon.hide();
    } else {
      this._facilityInfoIcon.hide();
      this._facilityAddIcon.show();
    }
    this.updateFacilityPosition();
  }

  private flatPath() {
    return [...this._path.map((p) => [p.x, p.y]).flat()];
  }

  private converPath(path: Path | string) {
    if (typeof path !== 'string') {
      return path;
    }
    const pItems = path.split(',');
    const results: any[] = [];
    for (let i = 0; i < pItems.length; i += 2) {
      results.push({
        x: Number(pItems[i]),
        y: Number(pItems[i + 1]),
      });
    }
    return results;
  }
}

export default Section;
