import EventEmitter from 'events';
import type { Options } from './section';
import Section from './section';

declare const Konva: any;

class EditableSectionManager extends EventEmitter {
  private _layer: any;
  private _sections: Section[] = [];
  private static _defaultOption: Options = {
    selectable: true,
    fill: '#ff9900',
    stroke: '#FF2233',
    strokeWidth: 1,
    opacity: 0.5,
    closed: true,
  };

  get layer() {
    return this._layer;
  }

  constructor(
    private _stage: any,
    private _options?: any,
  ) {
    super();
    if (!_options) {
      this._options = EditableSectionManager._defaultOption;
    }
    this.create();
    this.initEvents();
  }

  private create() {
    this._layer = new Konva.Layer();
    this._stage.add(this._layer);
  }

  private initEvents() {
    //
  }

  addSection(path, id?) {
    const section = new Section(this._layer, path, this._options);
    this._sections.push(section);

    section.on('select', () => {
      this.emit('select', section);
    });
  }

  destroy() {
    //
  }
}

export default EditableSectionManager;
