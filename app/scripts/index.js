var $ = window.jQuery = window.$ = require('jquery');
require('bootstrap-sass/assets/javascripts/bootstrap.min.js');
require('./3rd-party-plugins/dropdown.js');
var Backbone = require('backbone');

require('./router.js');

// Wait for DOM ready
$(function(){
  Backbone.history.start();
});
