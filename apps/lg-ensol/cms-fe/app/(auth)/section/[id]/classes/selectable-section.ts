import Section from './section';

class SelectableSection extends Section {
  onSelect(handler) {
    this._container.on('mousedown', handler);
  }
}

export default SelectableSection;
