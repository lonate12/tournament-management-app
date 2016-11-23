var Backbone = require('backbone');
var React = require('react');
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;
var Team = require('../models/team.js').Team;
var GameModels = require('../models/game.js'), Game = GameModels.Game, GameCollection = GameModels.GameCollection;
var LocationModels = require('../models/location.js'), LocationModel = LocationModels.LocationModel, LocationCollection = LocationModels.LocationCollection;
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Modal = require('react-modal');

var AddGameModal = React.createClass({
  getInitialState: function(){
    return {
      newGame: new GameModels.Game(),
      modalIsOpen: false,
    }
  },componentWillReceiveProps: function(nextProps){
    this.setState({modalIsOpen: nextProps.modalIsOpen});
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  closeModal: function(){
    this.setState({modalIsOpen: false});
  },
  handleChange: function(e){

  },
  addGame: function(e){
    e.preventDefault();

  },
  render: function(){
    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >
        <form onSubmit={this.addGame}>
          <label htmlFor="test">Test</label>
          <input type="text" name="test" placeholder="Test"/>
          <button type="submit" className="btn btn-success">Add Game</button>
        </form>
      </Modal>
    );
  }
});

var AddLocationModal = React.createClass({
  getInitialState: function(){
    return {
      newLocation: new LocationModels.LocationModel(),
      modalIsOpen: false,
    }
  },componentWillReceiveProps: function(nextProps){
    this.setState({modalIsOpen: nextProps.modalIsOpen});
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  closeModal: function(){
    this.setState({modalIsOpen: false});
  },
  handleChange: function(e){

  },
  addLocation: function(e){
    e.preventDefault();

  },
  render: function(){
    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >
        <form onSubmit={this.addLocation}>
          <label htmlFor="test">Test</label>
          <input type="text" name="test" placeholder="Test"/>
          <button type="submit" className="btn btn-success">Add Location</button>
        </form>
      </Modal>
    );
  }
});


var ScheduleComponent = React.createClass({
  getInitialState: function(){
    return{
      games: this.props.games,
      modalIsOpen: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({games: nextProps.games});
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  render: function(){
    var games = this.state.games, gamesList;

    if (games) {
      gamesList = games.map(function(game){
        return(
          <tr key={game.get('objectId')}>
            <td>{game.get('objectId')}</td>
            <td>{game.get('home_team_name')}</td>
            <td>{game.get('away_team_name')}</td>
            <td>{game.get('location_name')}</td>
            <td>{game.get('time')}</td>
          </tr>
        );
      });
    }
    return(
      <div className="col-sm-12">
        <div className="row">
          <div className="col-sm-12">
            <h3>Games</h3>
            <p onClick={this.openModal}>+</p>
            <table className="table">
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Game Location</th>
                  <th>Game Time</th>
                </tr>
              </thead>
              <tbody>
                {gamesList ? gamesList : <tr><td colspan="5"><h1>Games Loading...</h1></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <AddGameModal modalIsOpen={this.state.modalIsOpen} addGame={this.props.addGame}/>
      </div>
    );
  }
});

var LocationComponent = React.createClass({
  getInitialState: function(){
    return{
      locations: this.props.locations,
      modalIsOpen: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({locations: nextProps.locations});
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  render: function(){
    var locations = this.state.locations, locationsList;

    if (locations) {
      locationsList = locations.map(function(location){
        return(
          <tr key={location.get('objectId')}>
            <td>{location.get('name')}</td>
            <td>{location.get('street_address')}</td>
            <td>{location.get('city')}</td>
            <td>{location.get('state')}</td>
            <td>{location.get('zip_code')}</td>
          </tr>
        );
      });
    }
    return(
      <div className="col-sm-12">
        <div className="row">
          <div className="col-sm-12">
            <h3>Locations</h3>
            <p onClick={this.openModal}>+</p>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Street</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zip Code</th>
                </tr>
              </thead>
              <tbody>
                {locationsList ? locationsList : <tr><td colspan="5"><h1>Locations Loading...</h1></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <AddLocationModal modalIsOpen={this.state.modalIsOpen} addLocation={this.props.addGame}/>
      </div>
    );
  }
});

var TeamUpdateModal = React.createClass({
  getInitialState: function(){
    return {
      selectedTeam: this.props.selectedTeam,
      modalIsOpen: false,
    }
  },componentWillReceiveProps: function(nextProps){
    this.setState({selectedTeam: nextProps.selectedTeam});

    if(nextProps.selectedTeam.get('objectId')){
      this.openModal();
    }
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  closeModal: function(){
    this.setState({modalIsOpen: false});
  },
  handleChange: function(e){
    var selectedTeam = this.state.selectedTeam;

    selectedTeam.set(e.target.name, e.target.checked);
  },
  saveChanges: function(e){
    e.preventDefault();
    var self = this;

    this.state.selectedTeam.save().then(function(){
      self.props.updateSelected(self.state.selectedTeam);
      self.closeModal();
    });
  },
  render: function(){
    var team = this.props.selectedTeam;

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >
        <h2>{team.get('name')}</h2>
        <form onSubmit={this.saveChanges}>
          <div className="form-group">
            <label htmlFor="have_paid">
              Paid <input onChange={this.handleChange} defaultChecked={team.get('have_paid')} type="checkbox" name="have_paid"/>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="have_waiver">
              Submitted Waiver <input onChange={this.handleChange} defaultChecked={team.get('have_waiver')} type="checkbox" name="have_waiver"/>
            </label>
          </div>
          <button type="submit" className="btn btn-success">Save Changes</button>
        </form>
      </Modal>
    );
  }
});

var AdminTournamentDash = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    var teams = new TeamCollection();
    var selectedTeam = new Team();
    var games = new GameCollection();
    var locations = new LocationCollection();

    return{
      tournament: tournament,
      teams: teams,
      selectedTeam: selectedTeam,
      games: games,
      locations: locations
    }
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, teams = this.state.teams
    , games = this.state.games, locations = this.state.locations;

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

    locations.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({locations: locations});
    });
  },
  selectTeam: function(e){
    e.preventDefault();
    var selectedTeam = this.state.selectedTeam, self = this;

    selectedTeam.set({objectId: e.target.id});
    selectedTeam.fetch().then(function(){
      self.setState({
        selectedTeam: selectedTeam
      });
    });
  },
  updateSelected: function(selectedTeam){
    var teams = this.state.teams, self = this;
    teams.set(selectedTeam, {remove: false});
    this.setState({teams: teams});
  },
  addGame: function(newGame){
    var games = this.state.games;
    games.create(newGame);
    this.setState({games: games});
  },
  addLocation: function(newLocation){
    var locations = this.state.locations;
    locations.create(newLocation);
    this.setState({locations: locations});
  },
  render: function(){
    var teams = this.state.teams, teamTableData, self = this;

    teamTableData = teams.map(function(team){
      return(
        <tr key={team.get('objectId')}>
          <td onClick={self.selectTeam} id={team.get('objectId')}>{team.get('name')}</td>
          <td className={team.get('have_paid') ? 'success' : 'danger'}>{team.get('have_paid') ? 'Have Paid' : 'Have Not Paid'}</td>
          <td className={team.get('have_waiver') ? 'success' : 'danger'}>{team.get('have_waiver') ? 'Have Turned in Waiver' : 'Have not turned in Waiver'}</td>
        </tr>
      );
    });

    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <h1>AdminTournamentDash</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Payment</th>
              <th>Waiver</th>
            </tr>
          </thead>
          <tbody>
            {teamTableData}
          </tbody>
        </table>
        <div className="row">
          <ScheduleComponent games={this.state.games} addGame={this.addGame}/>
        </div>
        <div className="row">
          <LocationComponent locations={this.state.locations}/>
        </div>
        <TeamUpdateModal tournamentId={this.props.tournamentId} updateSelected={this.updateSelected} selectedTeam={this.state.selectedTeam}/>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  AdminTournamentDash: AdminTournamentDash
};
