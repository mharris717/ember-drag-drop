/* eslint-disable prettier/prettier */
import Coordinator from '../models/coordinator.js';

export default {
  name: "setup coordinator",

  initialize: function() {
    let app = arguments[1] || arguments[0];
    app.register("drag:coordinator",Coordinator);
  }
};
