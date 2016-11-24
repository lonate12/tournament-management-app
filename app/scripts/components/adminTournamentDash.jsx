var Backbone = require('backbone');
var React = require('react');
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;
var Team = require('../models/team.js').Team;
var GameModels = require('../models/game.js'), Game = GameModels.Game, GameCollection = GameModels.GameCollection;
var LocationModels = require('../models/location.js'), LocationModel = LocationModels.LocationModel, LocationCollection = LocationModels.LocationCollection;
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Modal = require('react-modal');


/*
********************************************************************************
********************************************************************************
  Teams Component and Modal
********************************************************************************
********************************************************************************
*/

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


var TeamsTable = React.createClass({
  getInitialState: function(){
    return {
      teams: this.props.teams,
      modalIsOpen: false,
      selectedTeam: new Team()
    }
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  closeModal: function(){
    this.setState({modalIsOpen: false});
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({games: nextProps.teams});
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
  render: function(){
    var teams = this.state.teams, teamTableData, self = this;

    if (teams) {
      teamTableData = teams.map(function(team){
        return(
          <tr key={team.get('objectId')}>
            <td onClick={self.selectTeam} id={team.get('objectId')}>{team.get('name')}</td>
            <td className={team.get('have_paid') ? 'success' : 'danger'}>{team.get('have_paid') ? 'Have Paid' : 'Have Not Paid'}</td>
            <td className={team.get('have_waiver') ? 'success' : 'danger'}>{team.get('have_waiver') ? 'Have Turned in Waiver' : 'Have not turned in Waiver'}</td>
          </tr>
        );
      });
    }

    return(
      <div className="col-sm-12">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Payment</th>
              <th>Waiver</th>
            </tr>
          </thead>
          <tbody>
            {teamTableData ? teamTableData : <tr colspan="3"><td>Teams Loading...</td></tr>}
          </tbody>
        </table>
        <TeamUpdateModal tournamentId={this.props.tournamentId} updateSelected={this.props.updateSelected} selectedTeam={this.state.selectedTeam}/>
      </div>
    );
  }
});

/*
********************************************************************************
********************************************************************************
  Games Component and Modal
********************************************************************************
********************************************************************************
*/

var FormOption = React.createClass({
  render: function(){
    return(
      <option>{this.props.team.get('name')}</option>
    );
  }
});

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
    var teams = 'Teams Loading...', locations = 'Locations Loading...';

    teams = this.props.teams.map(function(team){
      return(
        <FormOption key={team.get('objectId')} team={team}/>
      );
    });

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >
        <form onSubmit={this.addGame}>
          <div className="form-group">
            <label htmlFor="home_team">Home Team</label>
            <select className="form-control" name="home_team">
              {teams}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="away_team">Away Team</label>
            <select className="form-control" name="away_team">
              {teams}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select className="form-control" name="location">
              {locations}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="time">Date and Time</label>
            <input className="form-control" type="datetime-local" name="time" />
          </div>
          <button type="submit" className="btn btn-success">Add Game</button>
        </form>
      </Modal>
    );
  }
});

var GamesTable = React.createClass({
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
        <AddGameModal
          modalIsOpen={this.state.modalIsOpen}
          addGame={this.props.addGame}
          teams={this.props.teams}
          locations={this.props.locations}
        />
      </div>
    );
  }
});

/*
********************************************************************************
********************************************************************************
  Locations Component and Modal
********************************************************************************
********************************************************************************
*/

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
    var target = e.target;

    this.state.newLocation.set(e.target.name, e.target.value);
  },
  addLocation: function(e){
    e.preventDefault();

    this.setState({newLocation: this.state.newLocation});
    this.props.addLocation(this.state.newLocation);
    this.props.closeModal();
  },
  render: function(){
    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >
        <form onSubmit={this.addLocation}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input onChange={this.handleChange} className="form-control" type="text" name="name" placeholder="Name of Location" required="required"/>
          </div>
          <div className="form-group">
            <label htmlFor="street_address">Street Address</label>
            <input onChange={this.handleChange} className="form-control" type="text" name="street_address" placeholder="Street Address" required="required"/>
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input onChange={this.handleChange} className="form-control" type="text" name="city" placeholder="City" required="required"/>
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select onChange={this.handleChange} className="form-control" name="state" id="state" required="required">
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="zip_code">Zip Code</label>
            <input onChange={this.handleChange} className="form-control" type="text" name="zip_code" placeholder="Zip Code" required="required"/>
          </div>
          <button type="submit" className="btn btn-success">Add Location</button>
        </form>
      </Modal>
    );
  }
});

var LocationsTable = React.createClass({
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
  closeModal: function(closeModal){
    this.setState({modalIsOpen: false});
  },
  addLocation: function(newLocation){
    this.setState({modalIsOpen: false});
    this.props.addLocation(newLocation);
  },
  render: function(){
    var locations = this.state.locations, locationsList;

    if (locations) {
      locationsList = locations.map(function(location){
        return(
          <tr key={location.cid}>
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
        <AddLocationModal closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} addLocation={this.props.addLocation}/>
      </div>
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
    var locations = this.state.locations
    , tournamentPointer = newLocation.toPointer('Tournaments', this.props.tournamentId)
    , self = this;

    newLocation.set({tournament: tournamentPointer});

    newLocation.setCoordinates(function(){
      locations.create(newLocation);
      self.setState({locations: locations});
    });
  },
  render: function(){
    return(
      <TournamentDashTemplate tournament={this.state.tournament}>
        <h1>AdminTournamentDash</h1>
        <div className="row">
          <TeamsTable teams={this.state.teams} updateSelected={this.updateSelected}/>
        </div>
        <div className="row">
          <GamesTable teams={this.state.teams} locations={this.state.locations} games={this.state.games} addGame={this.addGame}/>
        </div>
        <div className="row">
          <LocationsTable locations={this.state.locations} addLocation={this.addLocation}/>
        </div>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  AdminTournamentDash: AdminTournamentDash
};
