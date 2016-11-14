// Third Party Imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

// ****** Local Imports ******
// Functions
var setUpParse = require('./parseUtilities.js').setUpParse;
// Components
var Test = require('./components/test.jsx').Test;


var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index'
  },
  initialize: function(){
    setUpParse('zugzwang', 'tosche station');
  },
  index: function(){
    console.log('index fired');
    ReactDOM.render(
      React.createElement(Test),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
