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

  get path() {
    return this._path;
  }

  get id() {
    return this._id;
  }

  constructor(
    private _layer,
    _path: Path | string,
    private _options?: Options,
    private _id?,
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
        e.cancelBubble = true;
        this.emit('select');
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
  }
  updateAt(index, point) {
    this._path[index] = point;
    this._polygon.points(this.flatPath());
  }
  destroy() {
    this._polygon.destroy();
    this._container.destroy();
  }
  toArrayPath() {
    return this.flatPath();
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
