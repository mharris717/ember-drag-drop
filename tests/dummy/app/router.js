import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("posts");
  this.route("simple");
  this.route("sort");
  this.route("sortdata");
  this.route("handle");
  this.route("horizontal");
  this.route("multiple");
});

export default Router;
