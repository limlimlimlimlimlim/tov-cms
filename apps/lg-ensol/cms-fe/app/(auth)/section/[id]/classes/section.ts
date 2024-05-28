import EventEmitter from 'events';
import addFacilityIconPath from './add-facility-path';
import infoFacilityIconPath from './info-facility-path';

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
  protected _facilityInfoPath;
  protected _facilityAddPath;

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
    if (_options?.selectable) {
      this._container.on('mousedown', (e) => {
        if (!e.evt.altKey) {
          e.cancelBubble = true;
          this.emit('select');
        }
      });
    }

    if (_options?.draggable) {
      this._container.on('dragstart', (e) => {
        this.emit('dragstart', e);
      });

      this._container.on('dragend', (e) => {
        this.emit('dragend', e);
      });
    }
  }

  private create() {
    this._container = new Konva.Group();
    this._polygon = new Konva.Line({
      ...this._options,
      points: [],
    });
    this._layer.add(this._container);
    this._container.add(this._polygon);
    this._facilityInfoPath = new Konva.Path({
      data: infoFacilityIconPath,
      fill: '#66bbff',
      stroke: 'black',
      strokeWidth: 2,
      scaleX: 0.5,
      scaleY: 0.5,
    });

    this._facilityAddPath = new Konva.Path({
      data: addFacilityIconPath,
      fill: '#88ddaa',
      stroke: 'black',
      strokeWidth: 2,
      scaleX: 0.5,
      scaleY: 0.5,
    });
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
    this._facilityInfoPath.x(x - 15);
    this._facilityInfoPath.y(y - 15);
    this._facilityAddPath.x(x - 15);
    this._facilityAddPath.y(y - 15);
  }

  show() {
    this._polygon.show();
  }

  hide() {
    this._polygon.hide();
  }

  update(path: Path | string) {
    this._path = this.converPath(path);
    this._polygon.points(this.flatPath());
    this.updateFacilityPosition();
  }

  updateAt(index, point) {
    this._path[index] = point;
    this._polygon.points(this.flatPath());
    this.updateFacilityPosition();
  }

  destroy() {
    this._polygon.destroy();
    this._container.destroy();
  }

  toArrayPath() {
    return this.flatPath();
  }

  updateOption(option): any {
    if (!this._options) return;
    this._options = { ...this._options, ...option };
    this._polygon.setAttrs(option);
  }

  setFacility(facility) {
    this._facility = facility;
    this._container.add(this._facilityInfoPath);
    this._container.add(this._facilityAddPath);

    if (this._facility) {
      this._facilityInfoPath.show();
      this._facilityAddPath.hide();
    } else {
      this._facilityInfoPath.hide();
      this._facilityAddPath.show();
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
