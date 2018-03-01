import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
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
