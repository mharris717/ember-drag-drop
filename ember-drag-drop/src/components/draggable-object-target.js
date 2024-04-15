import { getOwner } from '@ember/application';
import Component from '@ember/component';
import Droppable from '../mixins/droppable.js';

export default Component.extend(Droppable, {
  classNameBindings: ['overrideClass'],
  overrideClass: 'draggable-object-target',
  isOver: false,

  // idea taken from https://github.com/emberjs/rfcs/blob/master/text/0680-implicit-injection-deprecation.md#stage-1
  get coordinator() {
    if (this._coordinator === undefined) {
      this._coordinator = getOwner(this).lookup('drag:coordinator');
    }

    return this._coordinator;
  },
  set coordinator(value) {
    this._coordinator = value;
  },

  handlePayload(payload, event) {
    let obj = this.get('coordinator').getObject(payload,{target: this});
    this.get('action')(obj, { target: this, event: event });
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
      if(this.get('dragOverAction')) {
        this.get('dragOverAction')(event);
      }
    }
  },

  handleDragOut(event) {
    this.set('isOver', false);
    if(this.get('dragOutAction')) {
      this.get('dragOutAction')(event);
    }
  },

  click(e) {
    let onClick = this.get('onClick');
    if (onClick) {
      onClick(e);
    }
  },

  mouseDown(e) {
    let mouseDown = this.get('onMouseDown');
    if (mouseDown) {
      mouseDown(e);
    }
  },

  handleMouseEnter(e) {
    let mouseEnter = this.get('onMouseEnter');
    if (mouseEnter) {
      mouseEnter(e);
    }
  },

  didInsertElement() {
      this._super(...arguments);
      this.element.addEventListener('mouseenter', this.boundHandleMouseEnter);
  },

  willDestroyElement() {
      this._super(...arguments);
      this.element.removeEventListener('mouseenter', this.boundHandleMouseEnter);
  },

  actions: {
    acceptForDrop() {
      let hashId = this.get('coordinator.clickedId');
      this.handlePayload(hashId);
    }
  },

  init() {
    this._super(...arguments);

    this.set('boundHandleMouseEnter', this.handleMouseEnter.bind(this));
  }
});
