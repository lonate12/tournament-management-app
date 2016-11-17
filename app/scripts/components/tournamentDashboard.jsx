var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;

var TournamentDashboardContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    console.log(tournament);
    return{
      tournament: tournament
    };
  },
  componentWillMount: function(){
    var self = this;

    this.state.tournament.set('objectId', this.props.tournamentId);
    this.state.tournament.fetch().then(function(response){
      self.state.tournament.getWeather(function(){
        self.setState({tournament: self.state.tournament});
      });    
    });
  },
  render: function(){
    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <h1>TournamentDashboardContainer</h1>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TournamentDashboardContainer: TournamentDashboardContainer
};
