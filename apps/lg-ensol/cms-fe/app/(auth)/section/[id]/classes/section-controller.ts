import EventEmitter from 'events';
import type Section from './section';
import { shiftMove } from '../utils/utils';

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
      draggable: true,
    });

    this._container.add(controller);
    const index = this._controllers.length;
    this._controllers.push(controller);

    controller.on('mousedown', (e) => {
      e.cancelBubble = true;
      if (this.isFirst(e.target)) {
        this.emit('complete');
      }
    });

    controller.on('mousemove', (e) => {
      e.cancelBubble = true;
      this.emit('oncontroller');
    });

    controller.on('dragmove', (e) => {
      const { x: relX, y: relY } = this._layer
        .getStage()
        .getRelativePointerPosition();

      if (e.evt.shiftKey) {
        const prevContoller = this.prevContoller(controller);
        const { x, y } = shiftMove(
          prevContoller.x(),
          prevContoller.y(),
          relX,
          relY,
        );
        this.emit('update', index, { x, y });
        controller.x(x);
        controller.y(y);
      } else {
        this.emit('update', index, { x: relX, y: relY });
      }
    });
  }

  private prevContoller(contoller) {
    const index = this._controllers.findIndex((c) => c === contoller);
    let prevIndex = 0;
    if (index === 0) {
      prevIndex = this._controllers.length - 1;
    } else {
      prevIndex = index - 1;
    }
    return this._controllers[prevIndex];
  }

  clear() {
    this._controllers.forEach((c) => {
      c.destroy();
      this._controllers = [];
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
