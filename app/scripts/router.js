// Third Party Imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

// ****** Local Imports ******
// Functions
var setUpParse = require('./parseUtilities.js').setUpParse;
// Components
var Template = require('./components/template.jsx').Template;
var AdminSignUpContainer = require('./components/adminSignUp.jsx').AdminSignUpContainer;
var AdminLoginContainer = require('./components/adminLogin.jsx').AdminLoginContainer;
var AddTournamentContainer = require('./components/addTournament.jsx').AddTournamentContainer;
var TeamSignUpContainer = require('./components/teamSignUp.jsx').TeamSignUpContainer;


var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'add/': 'addTournament',
    'sign-up/': 'adminSignUp',
    'login/': 'adminLogin',
    'tournaments/:id/sign-up/': 'teamSignUp'
  },
  initialize: function(){
    setUpParse('zugzwang', 'tosche station');
  },
  index: function(){
    console.log('index fired');
    ReactDOM.render(
      React.createElement(Template),
      document.getElementById('app')
    );
  },
  addTournament: function(){
    ReactDOM.render(
      React.createElement(AddTournamentContainer),
      document.getElementById('app')
    );
  },
  adminSignUp: function(){
    ReactDOM.render(
      React.createElement(AdminSignUpContainer),
      document.getElementById('app')
    );
  },
  adminLogin: function(){
    ReactDOM.render(
      React.createElement(AdminLoginContainer),
      document.getElementById('app')
    );
  },
  teamSignUp: function(tournamentId){
    console.log('Team sign up fired');
    ReactDOM.render(
      React.createElement(TeamSignUpContainer, {tournamentId: tournamentId}),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
