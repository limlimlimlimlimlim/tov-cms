import EventEmitter from 'events';
import { Scada } from 'next/font/google';
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
  private _icons: any = new Map();

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

  addSection(path, id?, options?, facility?) {
    const section = new Section(
      this._layer,
      path,
      { ...this._options, ...options },
      id,
    );
    this._sections.push(section);

    if (facility) {
      section.setFacility(facility);
      const scale = 0.7;
      const icon = new Konva.Path({
        x: 0,
        y: 0,
        data: 'M32 30.668A6.667 6.667 0 0 1 25.332 24 6.667 6.667 0 0 1 32 17.332 6.667 6.667 0 0 1 38.668 24 6.667 6.667 0 0 1 32 30.668m0-25.336c-10.309 0-18.668 8.36-18.668 18.668C13.332 38 32 58.668 32 58.668S50.668 38 50.668 24c0-10.309-8.36-18.668-18.668-18.668Zm0 0',
        fill: facility.iconColor,
        scaleX: scale,
        scaleY: scale,
      });
      this._icons.set(facility.id, icon);
      setTimeout(() => {
        section.addIcon(icon, 35 * scale, 70 * scale);
      }, 500);
    }

    section.on('select', () => {
      this.emit('select', section);
    });

    return section;
  }

  getIconById(id) {
    return this._icons.get(id);
  }

  destroy() {
    this._sections.forEach((s) => s.destroy());
    this._layer.remove();
    this._layer.destroy();
  }
}

export default DesignSectionManager;
