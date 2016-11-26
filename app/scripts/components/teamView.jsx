var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;
var Team = require('../models/team.js').Team;

var TeamViewContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    var currentTeam = new Team();

    return{
      tournament: tournament,
      currentTeam: currentTeam,
      isLoadingWeather: true,
      isLoadingTeam: true
    }
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, team = this.state.currentTeam;

    tournament.set('objectId', this.props.tournamentId);
    tournament.fetch().then(function(){
      tournament.getWeather(function(){
        self.setState({tournament: tournament, isLoadingWeather: false});
      });
    });

    team.set('objectId', this.props.teamId);
    team.fetch().then(function(response){
      self.setState({isLoadingTeam: false});
    });


  },
  render: function(){
    var currentTeam = this.state.currentTeam;

    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <div><img src="../../dist/images/ring-alt.svg"/></div>
        <div className="row">
          <div className="col-md-4">
            <h2 className="team-name">{currentTeam.get('name')}</h2>
            <img src={currentTeam.get('logo') ? currentTeam.get('logo') : '../../dist/images/default-logo.png'} />
          </div>
          <div className="col-md-8">

          </div>
        </div>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TeamViewContainer: TeamViewContainer
};
