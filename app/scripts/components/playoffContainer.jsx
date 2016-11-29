var React = require('react');
var Tournament = require('../models/tournament.js').Tournament;
var Team = require('../models/team.js').Team;
var TeamCollection = require('../models/team.js').TeamCollection;
var Game = require('../models/game.js').Game;
var GameCollection = require('../models/game.js').GameCollection;
var LocationCollection = require('../models/location.js').LocationCollection;

var PlayoffContainer = React.createClass({
  getInitialState: function(){
    return{
      playoffTeams: new TeamCollection(),
      locations: new LocationCollection(),
      games: new GameCollection()
    }
  },
  componentWillMount: function(){
    var tournament = new Tournament(), self = this, locations = this.state.locations;

    locations.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(
      function(){
        self.setState({locations: locations});
      }
    );

    tournament.set('objectId', this.props.tournamentId).fetch().then(function(){
      var teams = tournament.get('playoff_teams');

      teams.forEach(function(team){
        self.state.playoffTeams.add(team);
      });

      self.setState({playoffTeams: self.state.playoffTeams});
    });

  },
  createGames: function(){
    var game1, game2, game3, game4;
    var games = [game1, game2, game3, game4];
    var teams = this.state.playoffTeams;
    var self = this;

    games.forEach(function(game){
      var newGame = new Game();
      var home_team = teams.shift();
      var away_team = teams.pop();

      newGame.set({
        home_team: newGame.toPointer('Teams', home_team.get('objectId')),
        home_team_name: home_team.get('name'),
        away_team: newGame.toPointer('Teams', away_team.get('objectId')),
        away_team_name: away_team.get('name'),
        tournament: newGame.toPointer('Tournaments', self.props.tournamentId),
        location: undefined
      });

      self.state.games.add(newGame);
      self.setState({games: self.state.games});

      // newGame.save();

    });
  },
  editGame: function(game){
    console.log(game);
  },
  render: function(){
    var self = this;

    var teams = this.state.playoffTeams.map(function(team){
      return(
        <tr key={team.cid}>{team.get('name')}
          <td>{team.get('name')}</td>
          <td>{team.get('points')}</td>
        </tr>
      );
    });

    var gamesList = this.state.games.map(function(game){
      return(
        <tr key={game.cid}>
          <td>{game.get('home_team_name')}</td>
          <td>{game.get('away_team_name')}</td>
          <td>{game.get('location_name')}</td>
          <td>{game.get('time')}</td>
          <td><button onClick={function(){self.editGame(game)}} type="button" className="btn btn-primary">Edit Details</button></td>
        </tr>
      );
    });

    return(
      <div className="row">
        <div className="col-md-3">
          <h3>Playoff Teams</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {teams}
            </tbody>
          </table>
          <p>If this is correct, click below to create playoff games!</p>
          <button type="button" onClick={this.createGames} className="btn btn-success">Create Games</button>
        </div>
        <div className="col-md-9">
          <div className="col-md-12">
            <h2>Quarters</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Update Game</th>
                </tr>
              </thead>
              <tbody>
                {gamesList}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  PlayoffContainer: PlayoffContainer
};
