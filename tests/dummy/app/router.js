import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("posts");
  this.route("simple");
  this.route("sort");
  this.route("sortdata");
  this.route("handle");
});

export default Router;
