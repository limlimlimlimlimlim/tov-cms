import EventEmitter from 'events';
import type Section from './section';

declare const Konva: any;

class SectionController extends EventEmitter {
  private _container;
  private _controllers: any[] = [];
  constructor(
    private _layer,
    private _section: Section,
  ) {
    super();
    this.create();
  }

  private create() {
    this._container = new Konva.Group();
    this._layer.add(this._container);
    this._container.on('mousedown', (e) => {
      console.log(e.target);
      console.log(e.currentTarget);
    });
  }

  addController(point) {
    const controller = new Konva.Circle({
      ...point,
      radius: 6,
      fill: this.isEmpty() ? 'red' : 'yellow',
      stroke: 'black',
      draggble: true,
    });

    this._container.add(controller);
    this._controllers.push(controller);
    controller.on('mousedown', (e) => {
      e.cancelBubble = true;
      if (this.isFirst(e.target)) {
        this.emit('complete');
      }
    });
  }

  destroy() {
    this._controllers = [];
    this._container.destroyChildren();
  }

  private isEmpty() {
    return this._controllers.length === 0;
  }

  private isFirst(contoller) {
    return this._controllers[0] === contoller;
  }
}

export default SectionController;
