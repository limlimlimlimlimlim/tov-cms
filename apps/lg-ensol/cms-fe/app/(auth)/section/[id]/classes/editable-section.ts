import EventEmitter from 'events';
import type { Options, Path, Point } from './section';
import Section from './section';
import SectionController from './section-controller';

declare const Konva: any;

class EditableSection extends EventEmitter {
  private _layer: any;
  private _editableSection: Section;
  private _keydownHandler;
  private _mousePoint: Point | null = null;
  private _controller;
  private _path: Path;
  private static _defaultOption: Options = {
    selectable: true,
    fill: '#0CC6D2',
    opacity: 0.3,
    strokeWidth: 1,
    stroke: '#0000FF',
    strokeOpacity: 1,
    closed: true,
    draggable: true,
  };

  get layer() {
    return this._layer;
  }

  constructor(
    private _stage: any,
    private _targetSection: Section,
    private _options?: Options,
  ) {
    super();
    if (!_options) {
      this._options = EditableSection._defaultOption;
    }

    this._path = [..._targetSection.path];
    this.create();
    this.initEvents();
  }

  private create() {
    this._layer = new Konva.Layer();
    this._stage.add(this._layer);

    this.createEditableSection();
    this.createController();
  }

  private createEditableSection() {
    if (this._editableSection) this._editableSection.destroy();
    this._editableSection = new Section(this._layer, this._path, this._options);

    let startPoint: Point = { x: 0, y: 0 };
    this._editableSection.on('dragstart', (e) => {
      this._controller.clear();
      e.cancelBubble = true;
      startPoint = this._stage.getRelativePointerPosition();
    });

    this._editableSection.on('dragend', (e) => {
      e.cancelBubble = true;
      const endPoint = this._stage.getRelativePointerPosition();
      const offset = {
        x: endPoint.x - startPoint.x,
        y: endPoint.y - startPoint.y,
      };
      this.movePath(offset);

      this.createEditableSection();
      this.createController();
      this.emit('update', [...this._path]);
    });
  }

  private createController() {
    if (this._controller) this._controller.destroy();

    this._controller = new SectionController(
      this._layer,
      this._editableSection,
    );

    this._path.forEach((point) => {
      this._controller.addController(point);
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

  private initEvents() {
    this._keydownHandler = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.onEscKeyDown();
        return;
      }

      if (e.key === 'Enter') {
        this.onEnterKeyDown();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.cancelBubble = true;
        this.movePath({ x: e.shiftKey ? 10 : 1, y: 0 });
        this.createEditableSection();
        this.createController();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.cancelBubble = true;
        this.movePath({ x: e.shiftKey ? -10 : -1, y: 0 });
        this.createEditableSection();
        this.createController();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.cancelBubble = true;
        this.movePath({ x: 0, y: e.shiftKey ? -10 : -1 });
        this.createEditableSection();
        this.createController();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.cancelBubble = true;
        this.movePath({ x: 0, y: e.shiftKey ? 10 : 1 });
        this.createEditableSection();
        this.createController();
        return;
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
  }

  private movePath(offset) {
    this._path = this._path.map((p) => {
      return { x: p.x + offset.x, y: p.y + offset.y };
    });
  }

  private onEscKeyDown() {
    this.clearPolygon();
    this._controller.clear();
    this.emit('cancel');
  }

  private onEnterKeyDown() {
    this.emit('complete', [...this._path]);
    this.clearPolygon();
    this._controller.destroy();
  }

  private updatePoint = (index, point: Point) => {
    this._path[index] = point;
  };

  private updateSection() {
    if (this._mousePoint) {
      this._editableSection.update([
        ...this._path,
        { x: this._mousePoint.x, y: this._mousePoint.y },
      ]);
      return;
    }
    this._editableSection.update([...this._path]);
    this.emit('update', [...this._path]);
  }

  private clearPolygon() {
    this._editableSection.update([]);
    this._path = [];
  }

  destroy() {
    document.removeEventListener('keydown', this._keydownHandler);
    this._editableSection.destroy();
    this._controller.destroy();
    this._layer.destroyChildren();
    this._layer.destroy();
  }
}

export default EditableSection;
