import Ember from 'ember';

export default Ember.Component.extend({
  dragCoordinator: Ember.inject.service(),
  tagName: "div",
  overrideClass: 'draggable-object',
  classNameBindings: [':js-draggableObject','isDraggingObject:is-dragging-object:', 'overrideClass'],
  attributeBindings: ['dragReady:draggable'],
  isDraggable: true,
  dragReady: true,
  isSortable: false,
  sortingScope: 'drag-objects',
  title: Ember.computed.alias('content.title'),

  draggable: Ember.computed('isDraggable', function() {
    var isDraggable = this.get('isDraggable');

    if (isDraggable) {
      return true;
    }
    else {
      return null;
    }
  }),

  init() {
    if (this.get('dragHandle')) {
      this.set('dragReady', false);
    }
    this._super(...arguments);
  },

  didInsertElement() {
    let self = this;
    //if there is a drag handle watch the mouse up and down events to trigger if drag is allowed
    if (this.get('dragHandle')) {
      //only start when drag handle is activated
      if (this.$(this.get('dragHandle'))) {
        this.$(this.get('dragHandle')).on('mouseover', function(){
          self.set('dragReady', true);
        });
        this.$(this.get('dragHandle')).on('mouseout', function(){
          self.set('dragReady', false);
        });
      }
    }
  },

  willDestroyElement(){
    if (this.$(this.get('dragHandle'))) {
      this.$(this.get('dragHandle')).off();
    }
  },

  dragStart(event) {
    if (!this.get('isDraggable') || !this.get('dragReady')) {
      event.preventDefault();
      return;
    }

    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = null;
    if (this.get('coordinator')) {
       id = this.get('coordinator').setObject(obj, { source: this });
    }


    dataTransfer.setData('Text', id);

    if (obj && typeof obj === 'object') {
      Ember.set(obj, 'isDraggingObject', true);
    }
    this.set('isDraggingObject', true);
    if (!this.get('dragCoordinator.enableSort') && this.get('dragCoordinator.sortComponentController')) {
      //disable drag if sorting is disabled this is not used for regular
      event.preventDefault();
      return;
    } else {
      Ember.run.later(()=> {
        this.dragStartHook(event);
      });
      this.get('dragCoordinator').dragStarted(obj, event, this);
    }
    this.sendAction('dragStartAction', obj, event);
    if (this.get('isSortable')) {
      this.sendAction('draggingSortItem', obj, event);
    }
  },

  dragEnd(event) {
    if (!this.get('isDraggingObject')) {
      return;
    }

    var obj = this.get('content');

    if (obj && typeof obj === 'object') {
      Ember.set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
    this.dragEndHook(event);
    this.get('dragCoordinator').dragEnded();
    this.sendAction('dragEndAction', obj, event);
    if (this.get('dragHandle')) {
      this.set('dragReady', false);
    }
  },

  drag: function(event) {
    this.sendAction('dragMoveAction', event);
  },

  dragOver(event) {
   if (this.get('isSortable')) {
     this.get('dragCoordinator').draggingOver(event, this);
   }
    return false;
  },

  dragStartHook(event) {
    Ember.$(event.target).css('opacity', '0.5');
  },

  dragEndHook(event) {
    Ember.$(event.target).css('opacity', '1');
  },

  drop(event) {
    //Firefox is navigating to a url on drop, this prevents that from happening
    event.preventDefault();
  },

  actions: {
    selectForDrag() {
      var obj = this.get('content');
      var hashId = this.get('coordinator').setObject(obj, { source: this });
      this.set('coordinator.clickedId', hashId);
    }
  }
});
