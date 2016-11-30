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
var AdminTournamentList = require('./components/adminTournamentList.jsx').AdminTournamentList;
var EditGame = require('./components/editGame.jsx').EditGame;
var EditLocation = require('./components/editLocation.jsx').EditLocation;
var Test = require('./components/test.jsx').Test;
var EditGameScore = require('./components/editGameScore.jsx').EditGameScore;
var PlayoffContainer = require('./components/playoffContainer.jsx').PlayoffContainer;

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'test/': 'test',
    'admin/tournaments/': 'adminTournamentList',
    'add-tournament/': 'addTournament',
    'sign-up/': 'adminSignUp',
    'login/': 'adminLogin',
    'tournaments/:id/admin/': 'adminDash',
    'tournaments/:id/sign-up/': 'teamAdminSignUp',
    'tournaments/:id/login/': 'teamAdminLogin',
    'tournaments/:id/admin/playoffs-admin/': 'playoff',
    'tournaments/:id/add-team/': 'teamAdd',
    'tournaments/:id/admin/edit-game-score/:gameId/': 'editGameScore',
    'tournaments/:id/admin/edit-game/:gameId/': 'editGame',
    'tournaments/:id/admin/edit-location/:locationId/': 'editLocation',
    'tournaments/:id/:teamId/': 'teamView',
    'tournaments/:id/': 'tournamentDashboard',
    'tournaments/': 'tournamentView'
  },
  initialize: function(){
    setUpParse('zugzwang', 'tosche station');
  },
  adminSessionCheck: function(){
    if (!localStorage.getItem('userSession')){
      this.navigate('/login/', {trigger: true});
    }
    if (JSON.parse(localStorage.getItem('userSession')).isAdmin != 'true'){
      this.navigate('/login/', {trigger: true});
    }
  },
  sessionCheck: function(tournamentId){
    if (!localStorage.getItem('sessionToken')){
      this.navigate('/tournaments/'+tournamentId+'/sign-up/', {trigger: true});
    }
  },
  index: function(){
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
    ReactDOM.unmountComponentAtNode(document.getElementById('app'));
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

    this.adminSessionCheck();
  },
  adminTournamentList: function(){
    ReactDOM.render(
      React.createElement(AdminTournamentList),
      document.getElementById('app')
    );

    this.adminSessionCheck();
  },
  editGame: function(tournamentId, gameId){
    ReactDOM.render(
      React.createElement(EditGame, {tournamentId: tournamentId, gameId: gameId}),
      document.getElementById('app')
    );

    this.adminSessionCheck();
  },
  editLocation: function(tournamentId, locationId){
    ReactDOM.render(
      React.createElement(EditLocation, {tournamentId: tournamentId, locationId: locationId}),
      document.getElementById('app')
    );

    this.adminSessionCheck();
  },
  test: function(){
    ReactDOM.render(
      React.createElement(Test),
      document.getElementById('app')
    );
  },
  editGameScore: function(tournamentId, gameId){
    ReactDOM.render(
      React.createElement(EditGameScore, {tournamentId: tournamentId, gameId: gameId}),
      document.getElementById('app')
    );

    this.adminSessionCheck();
  },
  playoff: function(tournamentId){
    ReactDOM.render(
      React.createElement(PlayoffContainer, {tournamentId: tournamentId}),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
