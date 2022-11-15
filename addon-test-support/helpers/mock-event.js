class DataTransfer {
  constructor() {
    this.data = {};
  }

  setData(type, value) {
    this.data[type] = value;
    return this;
  }

  getData(type = 'Text') {
    return this.data[type];
  }

  setDragImage() {}
}

export default class MockEvent {
  constructor(options = {}) {
    this.dataTransfer = new DataTransfer();
    this.dataTransfer.setData('Text', options.dataTransferData);
    this.setProperties(options);
  }

  useDataTransferData(otherEvent) {
    this.dataTransfer.setData('Text', otherEvent.dataTransfer.getData());
    return this;
  }

  setProperties(props) {
    for (let prop in props) {
      this[prop] = props[prop];
    }
    return this;
  }

  preventDefault() {}

  stopPropagation() {}
}

export function createDomEvent(type) {
  let event = document.createEvent('CustomEvent');
  event.initCustomEvent(type, true, true, null);
  event.dataTransfer = new DataTransfer();
  return event;
}
