import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("posts");
  this.resource("simple");
  this.resource("sort");
  this.resource("sortdata");
  this.resource("handle");
});

export default Router;
