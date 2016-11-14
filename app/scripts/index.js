var $ = require('jquery');
var Backbone = require('backbone');

require('./router.js');

// Wait for DOM ready
$(function(){
  Backbone.history.start();
});
