/*global module, equal */
import Em from 'ember';
import Coordinator from '../../models/coordinator';
import Equals from '../helpers/equals';
import startApp from '../helpers/start-app';
import { test } from 'ember-qunit';
import MockDataTransfer from '../helpers/data-transfer';

var App;

module('Integration - Drag', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Em.run(App, App.destroy);
  }
});

test("smoke", function() {
  equal(2,2);
});

// var postsTest = function(name,f) {
//   test(name, function() {
//     visit("/posts").then(f);
//   });
// };

// Em.Test.registerAsyncHelper('dispatchDomEvent', function(app, selector, eventType, eventCallback) {
//   var draggable = find(selector);
//   var event = MockDataTransfer.createDomEvent(eventType);
//   if (eventCallback) {
//     eventCallback(event);
//   }
//   //draggable.trigger(event);
//   draggable[0].dispatchEvent(event);
//   return event;
// });

// postsTest("smoke", function() {
//   var coordinator = App.__container__.lookup('drag:coordinator');

//   equal(find(".author").length,10);
//   equal(find(".title:eq(0)").text().trim(),"Title 1");
//   equalLength(find(".draggable-object"),10);
//   equalLength(find(".draggable-object-bin"),4);

//   equal(find(".draggable-object:eq(0) .title").text().trim(),"Title 1");
//   equal(find(".draggable-object:eq(0)").hasClass("is-dragging-object"),false);

//   var event = dispatchDomEvent(".draggable-object:eq(0)","dragstart");
//   var hashId = coordinator.get('objectMap').keys()[0];
//   equal(event.dataTransfer.getData('Text'),hashId);

//   equal(find(".draggable-object:eq(0) .title").text().trim(),"Title 1");
//   equal(find(".draggable-object:eq(0)").hasClass("is-dragging-object"),true);

//   dispatchDomEvent(".bin-1 .draggable-object-target","drop", function(event) {
//     event.dataTransfer.setData('Text',hashId);
//   });

//   equalLength(find("#posts .title"),9);
//   equalLength(find(".bin-1 .title"),1);
//   equalLength(find(".bin-2 .title"),0);
//   equalLength(find(".bin-3 .title"),1);
// });

