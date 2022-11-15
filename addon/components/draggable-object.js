import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { scheduleOnce, next } from '@ember/runloop';
import { set } from '@ember/object';
import { wrapper } from 'ember-drag-drop/utils/proxy-unproxy-objects';

export default Component.extend({
  dragCoordinator: service('drag-coordinator'),
  overrideClass: 'draggable-object',
  classNameBindings: [
    ':js-draggableObject',
    'isDraggingObject:is-dragging-object:',
    'overrideClass',
  ],
  attributeBindings: ['dragReady:draggable'],
  isDraggable: true,
  dragReady: true,
  isSortable: false,
  sortingScope: 'drag-objects',
  title: alias('content.title'),

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

  draggable: computed('isDraggable', function () {
    let isDraggable = this.isDraggable;

    return isDraggable || null;
  }),

  proxyContent: computed('content', function () {
    return wrapper(this.content);
  }),

  init() {
    this._super(...arguments);
    if (this.dragHandle) {
      this.set('dragReady', false);
    }

    this.mouseOverHandler = function () {
      this.set('dragReady', true);
    }.bind(this);
    this.mouseOutHandler = function () {
      this.set('dragReady', false);
    }.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    scheduleOnce('afterRender', () => {
      //if there is a drag handle watch the mouse up and down events to trigger if drag is allowed
      let dragHandle = this.dragHandle;
      if (dragHandle) {
        //only start when drag handle is activated
        if (this.element.querySelector(dragHandle)) {
          this.element
            .querySelector(dragHandle)
            .addEventListener('mouseover', this.mouseOverHandler);
          this.element
            .querySelector(dragHandle)
            .addEventListener('mouseout', this.mouseOutHandler);
        }
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    let dragHandle = this.dragHandle;
    if (this.element.querySelector(dragHandle)) {
      this.element
        .querySelector(dragHandle)
        .removeEventListener('mouseover', this.mouseOverHandler);
      this.element
        .querySelector(dragHandle)
        .removeEventListener('mouseout', this.mouseOutHandler);
    }
  },

  dragStart(event) {
    if (!this.isDraggable || !this.dragReady) {
      event.preventDefault();
      return;
    }

    let dataTransfer = event.dataTransfer;

    let obj = this.proxyContent;
    let id = null;
    let coordinator = this.coordinator;
    if (coordinator) {
      id = coordinator.setObject(obj, { source: this });
    }

    dataTransfer.setData('Text', id);

    if (obj && typeof obj === 'object') {
      set(obj, 'isDraggingObject', true);
    }
    this.set('isDraggingObject', true);
    if (
      !this.get('dragCoordinator.enableSort') &&
      this.get('dragCoordinator.sortComponentController')
    ) {
      //disable drag if sorting is disabled this is not used for regular
      event.preventDefault();
      return;
    } else {
      next(() => {
        this.dragStartHook(event);
      });
      this.dragCoordinator.dragStarted(obj, event, this);
    }

    if (this.dragStartAction) {
      this.dragStartAction(obj, event);
    }

    if (this.isSortable && this.draggingSortItem) {
      this.draggingSortItem(obj, event);
    }
  },

  dragEnd(event) {
    if (!this.isDraggingObject) {
      return;
    }

    let obj = this.proxyContent;

    if (obj && typeof obj === 'object') {
      set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
    this.dragEndHook(event);
    this.dragCoordinator.dragEnded();
    if (this.dragEndAction) {
      this.dragEndAction(obj, event);
    }
    if (this.dragHandle) {
      this.set('dragReady', false);
    }
  },

  drag(event) {
    if (this.dragMoveAction) {
      this.dragMoveAction(event);
    }
  },

  dragOver(event) {
    if (this.isSortable) {
      this.dragCoordinator.draggingOver(event, this);
    }
    return false;
  },

  dragStartHook(event) {
    event.target.style.opacity = '0.5';
  },

  dragEndHook(event) {
    event.target.style.opacity = '1';
  },

  drop(event) {
    //Firefox is navigating to a url on drop, this prevents that from happening
    event.preventDefault();
  },

  actions: {
    selectForDrag() {
      let obj = this.proxyContent;
      let hashId = this.coordinator.setObject(obj, { source: this });
      this.set('coordinator.clickedId', hashId);
    },
  },
});
