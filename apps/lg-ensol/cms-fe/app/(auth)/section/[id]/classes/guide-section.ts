import EventEmitter from 'events';
import { shiftMove } from '../utils/utils';
import type { Options, Path, Point } from './section';
import Section from './section';
import SectionController from './section-controller';

declare const Konva: any;

class GuideSection extends EventEmitter {
  private _layer: any;
  private _section: Section;
  private _path: Path = [];
  private _downHandler;
  private _moveHandler;
  private _keydownHandler;
  private _mousePoint: Point | null = null;
  private _controller;
  private static _defaultOption: Options = {
    selectable: false,
    fill: '',
    stroke: '#FF2233',
    strokeWidth: 1,
    closed: true,
  };

  get layer() {
    return this._layer;
  }

  constructor(
    private _stage: any,
    private _options?: Options,
  ) {
    super();
    if (!_options) {
      this._options = GuideSection._defaultOption;
    }
    this.create();
    this.initEvents();
  }

  private create() {
    this._layer = new Konva.Layer();
    this._section = new Section(this._layer, this._path, this._options);
    this._stage.add(this._layer);

    this._controller = new SectionController(this._layer, this._section);
  }

  private initEvents() {
    this._downHandler = (e) => {
      this.onMouseDown(e);
    };

    this._moveHandler = (e) => {
      this.onMouseMove(e);
    };
    this._keydownHandler = (e) => {
      this.onEscKeyDown(e);
    };
    this._stage.on('mousedown', this._downHandler);
    this._stage.on('mousemove', this._moveHandler);
    document.addEventListener('keydown', this._keydownHandler);

    this._controller.on('complete', () => {
      this.emit('complete', this._path);
      this.clearPolygon();
      this._controller.clear();
    });

    this._controller.on('oncontroller', () => {
      this._mousePoint = null;
      this.updateSection();
    });

    this._controller.on('update', (i, pos) => {
      this.updatePoint(i, pos);
      this.updateSection();
    });
  }

  private onMouseDown(e) {
    if (e.evt.altKey) return;
    if (this.isEmptyPath()) {
      this._mousePoint = this._stage.getRelativePointerPosition();
    }
    if (this._mousePoint) {
      this.addPoint({
        x: this._mousePoint.x,
        y: this._mousePoint.y,
      });
    }
  }

  private onMouseMove(e) {
    if (this.isEmptyPath()) return;
    const { shiftKey } = e.evt;
    const { x: mouseX, y: mouseY } = this._stage.getRelativePointerPosition();
    if (shiftKey) {
      const { x, y } = this.lastPoint();
      this._mousePoint = shiftMove(x, y, mouseX, mouseY);
    } else {
      this._mousePoint = { x: mouseX, y: mouseY };
    }
    this.updateSection();
  }

  private onEscKeyDown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.clear();
    }
  }

  private isEmptyPath() {
    return this._path.length === 0;
  }

  private lastPoint(offset = 0) {
    return this._path[this.lastPointIndex() - offset];
  }

  private lastPointIndex() {
    return this._path.length - 1;
  }

  private updatePoint = (index, point: Point) => {
    this._path[index] = point;
  };

  private addPoint(point: Point) {
    this._path.push(point);
    this._controller.addController(point);
  }

  private startPoint(point: Point) {
    this.addPoint(point);
    this.addPoint({ x: point.x, y: point.y });
  }

  private updateSection() {
    if (this._mousePoint) {
      this._section.update([
        ...this._path,
        { x: this._mousePoint.x, y: this._mousePoint.y },
      ]);
      return;
    }
    this._section.update([...this._path]);
  }

  private clearPolygon() {
    this._section.update([]);
    this._path = [];
  }

  clear() {
    this.clearPolygon();
    this._controller.clear();
  }

  destroy() {
    this._stage.off('mousedown', this._downHandler);
    this._stage.off('mousemove', this._moveHandler);
    document.removeEventListener('keydown', this._keydownHandler);
    this._section.destroy();
    this._controller.destroy();
    this._layer.destroy();
    this._layer.remove();
  }
}

export default GuideSection;
