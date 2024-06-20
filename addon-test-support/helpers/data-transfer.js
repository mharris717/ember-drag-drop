import EmberObject from '@ember/object';

var c = EmberObject.extend({
  getData: function () {
    return this.payload;
  },

  setData: function (dataType, payload) {
    this.set('data', { dataType: dataType, payload: payload });
  },
});

c.reopenClass({
  makeMockEvent: function (payload) {
    var transfer = this.create({ payload: payload });
    var res = { dataTransfer: transfer };
    res.preventDefault = function () {
      console.log('prevent default');
    };
    res.stopPropagation = function () {
      console.log('stop propagation');
    };
    return res;
  },

  createDomEvent: function (type) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, true, true, null);
    event.dataTransfer = {
      data: {},
      setData: function (type, val) {
        this.data[type] = val;
      },
      getData: function (type) {
        return this.data[type];
      },
    };
    return event;
  },
});

export default c;
