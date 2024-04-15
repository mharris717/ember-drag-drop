/* global triggerEvent , andThen */
import { run } from '@ember/runloop';
import MockDataTransfer from './helpers/data-transfer.js';

function drop($dragHandle, dropCssPath, dragEvent) {
  let dropTarget = document.querySelector(dropCssPath);

  if (dropTarget.length === 0) {
    throw new Error(`There are no drop targets by the given selector: '${dropCssPath}'`);
  }

  run(() => {
    triggerEvent(dropTarget, 'dragover', MockDataTransfer.makeMockEvent());
  });

  run(() => {
    triggerEvent(dropTarget, 'drop', MockDataTransfer.makeMockEvent(dragEvent.dataTransfer.get('data.payload')));
  });

  run(() => {
    triggerEvent($dragHandle, 'dragend', MockDataTransfer.makeMockEvent());
  });
}

export function drag(cssPath, options={}) {
  let dragEvent = MockDataTransfer.makeMockEvent();
  let dragHandle = document.querySelector(cssPath);

  run(() => {
    triggerEvent(dragHandle, 'mouseover');
  });

  run(() => {
    triggerEvent(dragHandle, 'dragstart', dragEvent);
  });

  andThen(function() {
    if (options.beforeDrop) {
      options.beforeDrop.call();
    }
  });

  andThen(function() {
    if (options.drop) {
      drop(dragHandle, options.drop, dragEvent);
    }
  });
}
