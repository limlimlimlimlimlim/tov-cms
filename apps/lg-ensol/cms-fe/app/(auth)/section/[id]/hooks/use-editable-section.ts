import { useCallback, useState } from 'react';

declare const Konva: any;

const useEditableSection = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const createEditableSection = useCallback((path) => {
    const group = new Konva.Group();
    const controlPointsGtoup = new Konva.Group();
    const section = new Konva.Line({
      points: path.map((p) => p.toArray()).flat(),
      fill: '#ff9900',
      stroke: '#FF2233',
      strokeWidth: 1,
      opacity: 0.5,
      closed: true,
    });

    section.on('mousedown', (e) => {
      console.log('mousedown');
      e.cancelBubble = true;
      setSelectedSection(section);
    });

    group.add(section);
    group.add(controlPointsGtoup);
    return group;
  }, []);
  return {
    selectedSection,
    setSelectedSection,
    createEditableSection,
  };
};

export default useEditableSection;

class EditableSection extends Konva.Group {
  private mode: EditableSectionMode = EditableSectionMode.View;

  constructor(path) {
    super();
    const controlPointsGtoup = new Konva.Group();
    const section = new Konva.Line({
      points: path.map((p) => p.toArray()).flat(),
      fill: '#ff9900',
      stroke: '#FF2233',
      strokeWidth: 1,
      opacity: 0.5,
      closed: true,
    });

    this.add(section);
    this.add(controlPointsGtoup);
    addEvents();
  }

  setMode(mode: EditableSectionMode) {
    this.mode = mode;
  }

  private addEvents() {}
}

enum EditableSectionMode {
  View,
  Edit,
}
