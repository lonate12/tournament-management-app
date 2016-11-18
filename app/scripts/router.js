// Third Party Imports
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

// ****** Local Imports ******
// Functions
var setUpParse = require('./parseUtilities.js').setUpParse;
// Components
var AdminSignUpContainer = require('./components/adminSignUp.jsx').AdminSignUpContainer;
var AdminLoginContainer = require('./components/adminLogin.jsx').AdminLoginContainer;
var AddTournamentContainer = require('./components/addTournament.jsx').AddTournamentContainer;
var TeamAdminSignUpContainer = require('./components/teamAdminSignUp.jsx').TeamAdminSignUpContainer;
var TeamAdminLoginContainer = require('./components/teamAdminLogin.jsx').TeamAdminLoginContainer;
var TeamAddContainer = require('./components/teamAdd.jsx').TeamAddContainer;
var TournamentListView = require('./components/tournamentListView.jsx').TournamentListView;
var TeamViewContainer = require('./components/teamView.jsx').TeamViewContainer;
var TournamentDashboardContainer = require('./components/tournamentDashboard.jsx').TournamentDashboardContainer;
var AdminTournamentDash = require('./components/adminTournamentDash.jsx').AdminTournamentDash;
var LandingPage = require('./components/landingPage.jsx').LandingPage;

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'add-tournament/': 'addTournament',
    'sign-up/': 'adminSignUp',
    'login/': 'adminLogin',
    'tournaments/:id/admin/': 'adminDash',
    'tournaments/:id/sign-up/': 'teamAdminSignUp',
    'tournaments/:id/login/': 'teamAdminLogin',
    'tournaments/:id/add-team/': 'teamAdd',
    'tournaments/:id/:teamId/': 'teamView',
    'tournaments/:id/': 'tournamentDashboard',
    'tournaments/': 'tournamentView'
  },
  initialize: function(){
    setUpParse('zugzwang', 'tosche station');
  },
  adminSessionCheck: function(){
    if (!localStorage.getItem('sessionToken')){
      this.navigate('/login/', {trigger: true});
    }
  },
  sessionCheck: function(tournamentId){
    if (!localStorage.getItem('sessionToken')){
      this.navigate('/tournaments/'+tournamentId+'/sign-up/', {trigger: true});
    }
  },
  index: function(){
    console.log('index fired');
    ReactDOM.render(
      React.createElement(LandingPage),
      document.getElementById('app')
    );
  },
  addTournament: function(){
    ReactDOM.render(
      React.createElement(AddTournamentContainer),
      document.getElementById('app')
    );

    this.adminSessionCheck();
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
  teamAdminSignUp: function(tournamentId){
    ReactDOM.render(
      React.createElement(TeamAdminSignUpContainer, {tournamentId: tournamentId}),
      document.getElementById('app')
    );
  },
  teamAdminLogin: function(tournamentId){
    ReactDOM.render(
      React.createElement(TeamAdminLoginContainer, {tournamentId: tournamentId}),
      document.getElementById('app')
    );
  },
  teamAdd: function(tournamentId){
    ReactDOM.render(
      React.createElement(TeamAddContainer, {tournamentId: tournamentId}),
      document.getElementById('app')
    );

    this.sessionCheck(tournamentId);
  },
  tournamentView: function(){
    ReactDOM.render(
      React.createElement(TournamentListView),
      document.getElementById('app')
    );
  },
  teamView: function(tournamentId, teamId){
    ReactDOM.render(
      React.createElement(TeamViewContainer, {tournamentId: tournamentId, teamId: teamId}),
      document.getElementById('app')
    );
  },
  tournamentDashboard: function(tournamentId){
    ReactDOM.render(
      React.createElement(TournamentDashboardContainer, {tournamentId: tournamentId}),
      document.getElementById('app')
    );
  },
  adminDash: function(tournamentId){
    ReactDOM.render(
      React.createElement(AdminTournamentDash, {tournamentId: tournamentId}),
      document.getElementById('app')
    );
  }

});

var router = new AppRouter();

module.exports = router;
