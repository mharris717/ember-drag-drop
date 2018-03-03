import Component from '@ember/component';
import { inject as service} from '@ember/service';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { scheduleOnce, next } from '@ember/runloop';
import { set } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  dragCoordinator: service(),
  overrideClass: 'draggable-object',
  classNameBindings: [':js-draggableObject','isDraggingObject:is-dragging-object:', 'overrideClass'],
  attributeBindings: ['dragReady:draggable'],
  isDraggable: true,
  dragReady: true,
  isSortable: false,
  sortingScope: 'drag-objects',
  title: alias('content.title'),

  draggable: computed('isDraggable', function() {
    let isDraggable = this.get('isDraggable');

    return isDraggable || null;
  }),

  init() {
    if (this.get('dragHandle')) {
      this.set('dragReady', false);
    }
    this._super(...arguments);
  },

  didInsertElement() {
    scheduleOnce('afterRender', () => {
      //if there is a drag handle watch the mouse up and down events to trigger if drag is allowed
      let dragHandle = this.get('dragHandle');
      if (dragHandle) {
        //only start when drag handle is activated
        if (this.$(dragHandle)) {
          this.$(dragHandle).on('mouseover', () => {
            this.set('dragReady', true);
          });
          this.$(dragHandle).on('mouseout', () => {
            this.set('dragReady', false);
          });
        }
      }
    });
  },

  willDestroyElement(){
    let dragHandle = this.get('dragHandle');
    if (this.$(dragHandle)) {
      this.$(dragHandle).off();
    }
  },

  dragStart(event) {
    if (!this.get('isDraggable') || !this.get('dragReady')) {
      event.preventDefault();
      return;
    }

    let dataTransfer = event.dataTransfer;

    let obj = this.get('content');
    let id = null;
    let coordinator = this.get('coordinator');
    if (coordinator) {
       id = coordinator.setObject(obj, { source: this });
    }

    dataTransfer.setData('Text', id);

    if (obj && typeof obj === 'object') {
      set(obj, 'isDraggingObject', true);
    }
    this.set('isDraggingObject', true);
    if (!this.get('dragCoordinator.enableSort') && this.get('dragCoordinator.sortComponentController')) {
      //disable drag if sorting is disabled this is not used for regular
      event.preventDefault();
      return;
    } else {
      next(()=> {
        this.dragStartHook(event);
      });
      this.get('dragCoordinator').dragStarted(obj, event, this);
    }

    if( this.get('dragStartAction')) {
      this.get('dragStartAction')(obj, event);
    }

    if (this.get('isSortable') && this.get('draggingSortItem')) {
      this.get('draggingSortItem')(obj, event);
    }
  },

  dragEnd(event) {
    if (!this.get('isDraggingObject')) {
      return;
    }

    let obj = this.get('content');

    if (obj && typeof obj === 'object') {
      set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
    this.dragEndHook(event);
    this.get('dragCoordinator').dragEnded();
    if(this.get('dragEndAction')) {
      this.get('dragEndAction')(obj, event);
    }
    if (this.get('dragHandle')) {
      this.set('dragReady', false);
    }
  },

  drag(event) {
    this.sendAction('dragMoveAction', event);
  },

  dragOver(event) {
   if (this.get('isSortable')) {
     this.get('dragCoordinator').draggingOver(event, this);
   }
    return false;
  },

  dragStartHook(event) {
    $(event.target).css('opacity', '0.5');
  },

  dragEndHook(event) {
    $(event.target).css('opacity', '1');
  },

  drop(event) {
    //Firefox is navigating to a url on drop, this prevents that from happening
    event.preventDefault();
  },

  actions: {
    selectForDrag() {
      let obj = this.get('content');
      let hashId = this.get('coordinator').setObject(obj, { source: this });
      this.set('coordinator.clickedId', hashId);
    }
  }
});
