import EventEmitter from 'events';
import type { Options, Path } from './section';
import Section from './section';
import EditableSection from './editable-section';

declare const Konva: any;

class EditableSectionManager extends EventEmitter {
  private _layer: any;
  private _sections: Section[] = [];
  private _editSections: any = new Map();
  private _editableSectoin: EditableSection;
  private _selectedSection: Section;
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

  get editSections() {
    return this._editSections;
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

    section.on('select', () => {
      this.onSelect(section);
    });

    if (facility) {
      section.setFacility(facility);
    }
    return section;
  }

  private onSelect(section: Section) {
    this.emit('select', section);
    if (this._editableSectoin) {
      this._editableSectoin.destroy();
    }
    if (this._selectedSection) {
      this._selectedSection.show();
    }

    this._editableSectoin = new EditableSection(this._stage, section);
    this._selectedSection = section;
    this._selectedSection.hide();

    this._editableSectoin.on('cancel', () => {
      this._selectedSection.show();
      this._editableSectoin.destroy();
    });

    this._editableSectoin.on('update', (path: Path) => {
      this._selectedSection.update(path);
      this._editSections.set(this._selectedSection.id, this._selectedSection);
    });

    this._editableSectoin.on('complete', (path: Path) => {
      this._selectedSection.show();
      this._selectedSection.update(path);
      this._editableSectoin.destroy();
      this._editSections.set(this._selectedSection.id, this._selectedSection);
    });
  }

  destroy() {
    if (this._editableSectoin) {
      this._editableSectoin.destroy();
    }

    this._sections.forEach((s) => s.destroy());
    this._layer.remove();
    this._layer.destroy();
  }
}

export default EditableSectionManager;
