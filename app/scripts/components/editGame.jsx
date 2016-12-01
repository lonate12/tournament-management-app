var Backbone = require('backbone');
var React = require('react');
var Game = require('../models/game.js').Game;
var TeamCollection = require('../models/team.js').TeamCollection;
var LocationCollection = require('../models/location.js').LocationCollection;

var EditGame = React.createClass({
  getInitialState: function(){
    return {
      game: new Game(),
      teams: new TeamCollection(),
      locations: new LocationCollection(),
      home_team: '',
      away_team: '',
      location: '',
      time: ''
    }
  },
  componentWillMount: function(){
    var game = this.state.game
    , teams = this.state.teams
    , locations = this.state.locations
    , self = this;

    game.set({objectId: this.props.gameId});

    game.fetch().then(function(){
      self.setState({
        game: game,
        home_team: game.get('home_team').objectId,
        away_team: game.get('away_team').objectId,
        location: game.get('location').objectId,
        time: game.get('time')
      });
    });

    teams.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({teams: teams});
    });

    locations.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({locations: locations});
    });
  },
  handleTeam: function(e){
    var target = e.target, game = this.state.game, pointer, newState = {};
    pointer = game.toPointer('Teams', target.value);

    newState[target.name] = target.value;

    this.setState(newState);
    game.set(target.name, pointer);
    game.set(target.name + '_name', target.options[target.options.selectedIndex].text);
  },
  handleLocation: function(e){
    var target = e.target, game = this.state.game, pointer, newState = {};
    pointer = game.toPointer('Locations', target.value);

    newState[target.name] = target.value;

    this.setState(newState);
    game.set(target.name, pointer);
    game.set(target.name + '_name', target.options[target.options.selectedIndex].text);
  },
  handleDate: function(e){
    var target = e.target, game = this.state.game;

    game.set({time: target.value});
    this.setState({time: target.value});
  },
  updateGame: function(e){
    e.preventDefault();
    var self = this;

    this.state.game.save().then(function(){
      Backbone.history.navigate('tournaments/'+self.props.tournamentId+'/admin/', {trigger: true});
    });
  },
  render: function(){
    var teams = 'Teams Loading...', locations = 'Locations Loading...', game = this.state.game;

    teams = this.state.teams.map(function(team){
      return(
        <option key={team.get('objectId')} value={team.get('objectId')}>{team.get('name')}</option>
      );
    });

    locations = this.state.locations.map(function(location){
      return(
        <option key={location.get('objectId')} value={location.get('objectId')}>{location.get('name')}</option>
      );
    });

    var isPlayoff = function(){
      if (game.get('quarter_final') || game.get('semi_final') || game.get('final')){
        return true;
      }else{
        return false;
      }
    };

    return(
      <div className="container-fluid edit-game-container bg-blue">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <h1 id="edit-game-header">Edit game</h1>
            <form onSubmit={this.updateGame}>
              <div className="form-group">
                <label htmlFor="home_team">Home Team</label>
                <select disabled={isPlayoff ? "disabled" : false} value={this.state.home_team} onChange={this.handleTeam} className="form-control" name="home_team">
                  <option>--Home Team--</option>
                  {teams}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="away_team">Away Team</label>
                <select disabled={isPlayoff ? "disabled" : false} value={this.state.away_team} onChange={this.handleTeam} className="form-control" name="away_team">
                  <option>--Away Team--</option>
                  {teams}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <select value={this.state.location} onChange={this.handleLocation} className="form-control" name="location">
                  <option>--Location--</option>
                  {locations}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="time">Date and Time</label>
                <input value={this.state.time} onChange={this.handleDate} className="form-control" type="datetime-local" name="time" />
              </div>
              <button type="submit" className="btn btn-accent dark-blue">Add Game</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  EditGame: EditGame
};
