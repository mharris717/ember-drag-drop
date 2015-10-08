import Coordinator from '../models/coordinator';

export default {
  name: "setup coordinator",

  initialize: function() {
    let app = arguments[1] || arguments[0];
    app.register("drag:coordinator",Coordinator);
    app.inject("component","coordinator","drag:coordinator");
  }
};
