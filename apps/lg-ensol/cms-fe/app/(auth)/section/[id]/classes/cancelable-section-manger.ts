import EventEmitter from 'events';
import type { Options } from './section';
import Section from './section';

declare const Konva: any;

class CancelableSectionManager extends EventEmitter {
  private _layer: any;
  private _sections: Section[] = [];
  private _cancelSections: any = new Map();
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

  get cancelSections() {
    return this._cancelSections;
  }

  constructor(
    private _stage: any,
    private _options?: any,
  ) {
    super();
    if (!_options) {
      this._options = CancelableSectionManager._defaultOption;
    }
    this.create();
  }

  private create() {
    this._layer = new Konva.Layer();
    this._stage.add(this._layer);
  }

  addSection(path, id, options, facility) {
    const section = new Section(
      this._layer,
      path,
      { ...this._options, ...options },
      id,
    );
    this._sections.push(section);

    if (facility) {
      section.setFacility(facility);
    }

    section.on('select', () => {
      this.onSelect(section);
    });

    return section;
  }

  private onSelect(section: Section) {
    if (!section.facility) return;
    if (this._cancelSections.has(section.facility.id)) {
      this._cancelSections.delete(section.facility.id);
      section.polygon.fill(section.options!.fill);
    } else {
      this._cancelSections.set(section.facility.id, section);
      section.polygon.fill('red');
    }
  }

  destroy() {
    this._sections.forEach((s) => s.destroy());
    this._layer.remove();
    this._layer.destroy();
  }
}

export default CancelableSectionManager;
