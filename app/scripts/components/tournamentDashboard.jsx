var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;

var TournamentDashboardContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    var teams = new TeamCollection();
    console.log(tournament);
    return{
      tournament: tournament,
      teams: teams
    };
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, teams = this.state.teams;

    tournament.set('objectId', this.props.tournamentId);
    tournament.fetch().then(function(response){
      tournament.getWeather(function(){
        self.setState({tournament: tournament});
      });
    });

    teams.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(response){
      console.log(teams);
      self.setState({teams: teams});
    });
  },
  render: function(){
    var teams = this.state.teams;

    var teamsList = teams.map(function(team){
      return(
        <li key={team.get('objectId')}>{team.get('name')}</li>
      );
    });
    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <h1>Teams</h1>
        <ul>
          {teamsList}
        </ul>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TournamentDashboardContainer: TournamentDashboardContainer
};
