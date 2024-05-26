import EventEmitter from 'events';
import type { Options, Path } from './section';
import Section from './section';
import EditableSection from './editable-section';

declare const Konva: any;

class EditableSectionManager extends EventEmitter {
  private _layer: any;
  private _sections: Section[] = [];
  private _editableSectoin: EditableSection;
  private _selectedSection: Section;
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

  get sections() {
    return this._sections;
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
      this.onSelect(section);
    });
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

    this._editableSectoin.on('complete', (path: Path) => {
      this._selectedSection.show();
      this._selectedSection.update(path);
      this._editableSectoin.destroy();
    });
  }

  destroy() {
    if (this._editableSectoin) {
      this._editableSectoin.destroy();
    }

    this._sections.forEach((s) => s.destroy());
  }
}

export default EditableSectionManager;
