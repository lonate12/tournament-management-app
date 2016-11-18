var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;

var TeamViewContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();

    return{
      tournament: tournament
    }
  },
  componentWillMount: function(){
    var self = this;

    this.state.tournament.set('objectId', this.props.tournamentId);
    this.state.tournament.fetch().then(function(response){
      console.log(self.state.tournament);
      self.state.tournament.getWeather(function(){
        self.setState({tournament: self.state.tournament});
      });
    });
  },
  render: function(){
    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <h1>TeamViewContainer</h1>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TeamViewContainer: TeamViewContainer
};
