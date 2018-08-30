/* global equal findWithAssert click */
import { registerAsyncHelper } from '@ember/test';
import $ from 'jquery';

var f = function() {
  registerAsyncHelper('hasActivePage', function(app, num, context) {
    var i = 0;
    findWithAssert(".pagination li.page-number", context).each(function() {
      var li = $(this);
      var active = num - 1 === i;
      equal(li.hasClass('active'), active, "Has active page");
      i += 1;
    });
  });

  registerAsyncHelper('hasButtons', function(app, ops) {
    for (var name in ops) {
      var present = ops[name];

      if(present) {
        equal(find(".pagination ." + name + ".enabled-arrow").length, 1);
      } else {
        equal(find(".pagination ." + name + ".disabled").length, 1);
      }
    }
  });

  registerAsyncHelper('hasTodos', function(app, l) {
    equal(find("table tr.todo").length, l);
  });

  registerAsyncHelper('hasPages', function(app, l) {
    equal(find(".pagination li.page-number").length, l);
  });

  registerAsyncHelper('clickPage', function(app, i) {
    if (i === "prev" || i === "next") {
      click(".pagination ." + i + " a");
    } else {
      click(".pagination li.page-number:eq(" + (i - 1) + ") a");
    }
  });
};

f();

export default f;
