var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;
var GameCollection = require('../models/game.js').GameCollection;

var TournamentDashboardContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    var teams = new TeamCollection();
    var games = new GameCollection();

    return{
      tournament: tournament,
      teams: teams,
      games: games
    };
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, teams = this.state.teams
    , games = this.state.games;

    tournament.set('objectId', this.props.tournamentId);
    tournament.fetch().then(function(response){
      tournament.getWeather(function(){
        self.setState({tournament: tournament});
      });
    });

    teams.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({teams: teams});
    });

    games.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({games: games});
    });
  },
  render: function(){
    var self = this, teams = this.state.teams, games = this.state.games, standings = "Placeholder";

    var teamsList = teams.map(function(team){
      return (
        <li key={team.get('objectId')} className="list-group-item"><a>{team.get('name')}</a></li>
      );
    });

    var games = games.map(function(game){
      console.log(game);
      return (
        <tr key={game.get('objectId')}>
          <td><a href={'#/tournaments/'+self.props.tournamentId+'/'+game.get('home_team').objectId+'/'}>{game.get('home_team_name')}</a> {game.get('home_team_score')}</td>
          <td><a href={'#/tournaments/'+self.props.tournamentId+'/'+game.get('home_team').objectId+'/'}>{game.get('away_team_name')}</a> {game.get('away_team_score')}</td>
          <td><a href={'#/tournaments/'+self.props.tournamentId+'/fields/'+game.get('location').objectId+'/'}>{game.get('location_name')}</a></td>
        </tr>
      );
    });

    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <div className="col-md-4">
          <h1>Teams</h1>
          <ul className="list-group">
            {teamsList}
          </ul>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <h1>Standings</h1>
                <div className="col-md-4">
                  <h4>Group A</h4>
                  <ul>
                    <li>Group A</li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h4>Group B</h4>
                  <ul>
                    <li>Group B</li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h4>Group C</h4>
                  <ul>
                    <li>Group C</li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h4>Group D</h4>
                  <ul>
                    <li>Group D</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h1>Games</h1>
              <table className="table">
                <thead>
                  <tr>
                    <th>Home Team</th>
                    <th>Away Team</th>
                    <th>Location</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {games}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TournamentDashboardContainer: TournamentDashboardContainer
};
