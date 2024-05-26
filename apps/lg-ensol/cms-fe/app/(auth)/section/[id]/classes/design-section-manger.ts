import EventEmitter from 'events';
import type { Options } from './section';
import Section from './section';

declare const Konva: any;

class DesignSectionManager extends EventEmitter {
  private _layer: any;
  private _sections: Section[] = [];
  private _deleteSections: any = new Map();
  private static _defaultOption: Options = {
    selectable: true,
    fill: '#D2C60C',
    opacity: 0.3,
    strokeWidth: 1,
    stroke: '#D2C60C',
    strokeOpacity: 1,
    closed: true,
  };

  get layer() {
    return this._layer;
  }

  get sections() {
    return this._sections;
  }

  get deleteSections() {
    return this._deleteSections;
  }

  constructor(
    private _stage: any,
    private _options?: any,
  ) {
    super();
    if (!_options) {
      this._options = DesignSectionManager._defaultOption;
    }
    this.create();
  }

  private create() {
    this._layer = new Konva.Layer();
    this._stage.add(this._layer);
  }

  addSection(path, id?, options?) {
    const section = new Section(
      this._layer,
      path,
      { ...this._options, ...options },
      id,
    );
    this._sections.push(section);

    section.on('select', () => {
      this.emit('select', section);
    });
  }

  destroy() {
    this._sections.forEach((s) => s.destroy());
    this._layer.remove();
    this._layer.destroy();
  }
}

export default DesignSectionManager;
