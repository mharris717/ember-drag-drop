import Ember from 'ember';
import $ from 'jquery';
import Test from 'ember-test';
import MockDataTransfer from '../../tests/helpers/data-transfer';

function drop($dragHandle, dropCssPath, dragEvent) {
  let $dropTarget = $(dropCssPath);

  if ($dropTarget.length === 0) {
    throw(`There are no drop targets by the given selector: '${dropCssPath}'`);
  }

  Ember.run(() => {
    triggerEvent($dropTarget, 'dragover', MockDataTransfer.makeMockEvent());
  });

  Ember.run(() => {
    triggerEvent($dropTarget, 'drop', MockDataTransfer.makeMockEvent(dragEvent.dataTransfer.get('data.payload')));
  });

  Ember.run(() => {
    triggerEvent($dragHandle, 'dragend', MockDataTransfer.makeMockEvent());
  });
}

export function drag(cssPath, options={}) {
  let dragEvent = MockDataTransfer.makeMockEvent();
  let $dragHandle = $(cssPath);

  Ember.run(() => {
    triggerEvent($dragHandle, 'mouseover');
  });

  Ember.run(() => {
    triggerEvent($dragHandle, 'dragstart', dragEvent);
  });

  andThen(function() {
    if (options.beforeDrop) {
      options.beforeDrop.call();
    }
  });

  andThen(function() {
    if (options.drop) {
      drop($dragHandle, options.drop, dragEvent);
    }
  });
}
