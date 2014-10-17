import Ember from 'ember';

var c = Ember.Object.extend({
  getData: function(dataType) {
    return this.get('payload');
  },

  setData: function(dataType,payload) {
    this.set("data", {dataType: dataType, payload: payload});
  }
});

c.reopenClass({
  makeMockEvent: function(payload) {
    var transfer = this.create({payload: payload});
    var res = {dataTransfer: transfer};
    res.originalEvent = res;
    return res;
  },

  createDomEvent: function(type) {
    var event = document.createEvent("CustomEvent");
    event.initCustomEvent(type, true, true, null);
    event.dataTransfer = {
      data: {},
      setData: function(type, val){
        this.data[type] = val;
      },
      getData: function(type){
        return this.data[type];
      }
    };
    return event;
  }
});

export default c;