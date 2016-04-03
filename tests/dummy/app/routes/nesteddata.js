import Ember from 'ember';

export default Ember.Route.extend({
  createdStore: false,
  model: function() {
    if (!this.get('createdStore')) {

      let page5 = this.store.createRecord('page', {
        id: 5,
        title: 'Page 5'
      });
      let page6 = this.store.createRecord('page', {
        id: 6,
        title: 'Page 6'
      });
      let page7 = this.store.createRecord('page', {
        id: 7,
        title: 'Page 7'
      });
      let page8 = this.store.createRecord('page', {
        id: 8,
        title: 'Page 8'
      });

      let book1 = this.store.createRecord('book', {
        id: 1,
        title: 'Book 1',
        pages: [page5, page6, page7, page8]
      });

      let page9 = this.store.createRecord('page', {
        id: 9,
        title: 'Page 9'
      });
      let page10 = this.store.createRecord('page', {
        id: 10,
        title: 'Page 10'
      });
      let page11 = this.store.createRecord('page', {
        id: 11,
        title: 'Page 11'
      });
      let page12 = this.store.createRecord('page', {
        id: 12,
        title: 'Page 12'
      });

      let book2 = this.store.createRecord('book', {
        id: 2,
        title: 'Book 2',
        pages: [page9, page10, page11, page12]
      });

      this.set('createdStore', true);

      let books = Ember.A();
      books.pushObject(book1);
      books.pushObject(book2);

      return books;
    }
  }
});