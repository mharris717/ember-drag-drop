import Component from '@ember/component';
import Droppable from 'ember-drag-drop/mixins/droppable';

export default Component.extend(Droppable, {
  classNameBindings: ['overrideClass'],
  overrideClass: 'draggable-object-target',
  isOver: false,

  handlePayload(payload, event) {
    let obj = this.get('coordinator').getObject(payload,{target: this});
    this.sendAction('action',obj,{target: this, event: event});
  },

  handleDrop(event) {
    let dataTransfer = event.dataTransfer;
    let payload = dataTransfer.getData("Text");
    if (payload === '') { return; }
    this.handlePayload(payload, event);
  },

  acceptDrop(event) {
    this.handleDrop(event);
    //Firefox is navigating to a url on drop sometimes, this prevents that from happening
    event.preventDefault();
  },

  handleDragOver(event) {
    if (!this.get('isOver')) {
      //only send once per hover event
      this.set('isOver', true);
      this.sendAction('dragOverAction', event);
    }
  },

  handleDragOut(event) {
    this.set('isOver', false);
    this.sendAction('dragOutAction', event);
  },

  click(e) {
    let onClick = this.get('onClick');
    if (onClick) {
      onClick(e.originalEvent);
    }
  },

  mouseDown(e) {
    let mouseDown = this.get('onMouseDown');
    if (mouseDown) {
      mouseDown(e.originalEvent);
    }
  },

  mouseEnter(e) {
    let mouseEnter = this.get('onMouseEnter');
    if (mouseEnter) {
      mouseEnter(e.originalEvent);
    }
  },

  actions: {
    acceptForDrop() {
      let hashId = this.get('coordinator.clickedId');
      this.handlePayload(hashId);
    }
  }
});
