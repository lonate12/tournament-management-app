var Backbone = require('backbone');
var React = require('react');
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;
var Team = require('../models/team.js').Team;
var GameModels = require('../models/game.js'), Game = GameModels.Game, GameCollection = GameModels.GameCollection;
var LocationModels = require('../models/location.js'), LocationModel = LocationModels.LocationModel, LocationCollection = LocationModels.LocationCollection;
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Modal = require('react-modal');
var Sortable = require('sortablejs');
var _ = require('underscore');


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
        onRequestClose={this.closeModal}
        className={'admin-team-modal'}
        overlayClassName={'admin-team-modal-overlay'}
      >
        <h2 className="modal-team-name">{team.get('name')}</h2>
        <form onSubmit={this.saveChanges}>
          <button type="submit" className="btn btn-accent dark-blue pull-right">Save Changes</button>
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
            <td><button onClick={function(){self.props.deleteTeam(team)}} className="btn btn-accent pull-right">Delete Team</button></td>
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
  handleTeam: function(e){
    var target = e.target, newGame = this.state.newGame, pointer;
    pointer = newGame.toPointer('Teams', target.value);

    newGame.set(target.name, pointer);
    newGame.set(target.name + '_name', target.options[target.options.selectedIndex].text);
  },
  handleLocation: function(e){
    var target = e.target, newGame = this.state.newGame, pointer;
    pointer = newGame.toPointer('Locations', target.value);

    newGame.set(target.name, pointer)
    newGame.set(target.name + '_name', target.options[target.options.selectedIndex].text);
  },
  handleDate: function(e){
    var target = e.target, newGame=this.state.newGame;

    newGame.set(target.name, target.value);
  },
  handleSubmit: function(e){
    e.preventDefault();

    this.props.addGame(this.state.newGame);
  },
  render: function(){
    var teams = 'Teams Loading...', locations = 'Locations Loading...';

    teams = this.props.teams.map(function(team){
      return(
        <option key={team.get('objectId')} value={team.get('objectId')}>{team.get('name')}</option>
      );
    });

    locations = this.props.locations.map(function(location){
      return(
        <option key={location.get('objectId')} value={location.get('objectId')}>{location.get('name')}</option>
      );
    });

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="home_team">Home Team</label>
            <select onChange={this.handleTeam} className="form-control" name="home_team">
              <option>--Home Team--</option>
              {teams}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="away_team">Away Team</label>
            <select onChange={this.handleTeam} className="form-control" name="away_team">
              <option>--Away Team--</option>
              {teams}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select onChange={this.handleLocation} className="form-control" name="location">
              <option>--Location--</option>
              {locations}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="time">Date and Time</label>
            <input onChange={this.handleDate} className="form-control" type="datetime-local" name="time" />
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
  addGame: function(newGame){
    this.props.addGame(newGame);
    this.setState({modalIsOpen: false});
  },
  editGame: function(game){
    Backbone.history.navigate('/tournaments/'+this.props.tournamentId+'/admin/edit-game/'+game.get('objectId')+'/' , {trigger: true});
  },
  updateScore: function(game){
    Backbone.history.navigate('/tournaments/'+this.props.tournamentId+'/admin/edit-game-score/'+game.get('objectId')+'/', {trigger: true});
  },
  render: function(){
    var games = this.state.games, gamesList, self=this;

    var groupGames = games.filter(function(game){
      return game.get('group_game') == true;
    });

    var quarterFinalGames = games.filter(function(game){
      return game.get('quarter_final');
    });

    var semiFinalGames = games.filter(function(game){
      return game.get('semi_final');
    });

    var finalGame = games.filter(function(game){
      return game.get('final');
    });

    if (games) {
      var groupGameList = groupGames.map(function(game){
        return(
          <tr key={game.cid}>
            <td>{game.get('objectId')}</td>
            <td>{game.get('home_team_name')}</td>
            <td>{game.get('away_team_name')}</td>
            <td>{game.get('location_name')}</td>
            <td>{game.get('time')}</td>
            <td><button className="btn btn-danger" onClick={function(){self.props.deleteGame(game)}}>Delete Game</button></td>
            <td><button className="btn btn-success" onClick={function(){self.editGame(game)}}>Edit Game</button></td>
            <td><button className="btn btn-primary" onClick={function(){self.updateScore(game)}}>Update Score</button></td>
          </tr>
        );
      });

      var quarterFinalGameList = quarterFinalGames.map(function(game){
        return(
          <tr key={game.cid}>
            <td>{game.get('objectId')}</td>
            <td>{game.get('home_team_name')}</td>
            <td>{game.get('away_team_name')}</td>
            <td>{game.get('location_name')}</td>
            <td>{game.get('time')}</td>
            <td><button className="btn btn-danger" onClick={function(){self.props.deleteGame(game)}}>Delete Game</button></td>
            <td><button className="btn btn-success" onClick={function(){self.editGame(game)}}>Edit Game</button></td>
            <td><button className="btn btn-primary" onClick={function(){self.updateScore(game)}}>Update Score</button></td>
          </tr>
        );
      });

      var semiFinalGameList = semiFinalGames.map(function(game){
        return(
          <tr key={game.cid}>
            <td>{game.get('objectId')}</td>
            <td>{game.get('home_team_name')}</td>
            <td>{game.get('away_team_name')}</td>
            <td>{game.get('location_name')}</td>
            <td>{game.get('time')}</td>
            <td><button className="btn btn-danger" onClick={function(){self.props.deleteGame(game)}}>Delete Game</button></td>
            <td><button className="btn btn-success" onClick={function(){self.editGame(game)}}>Edit Game</button></td>
            <td><button className="btn btn-primary" onClick={function(){self.updateScore(game)}}>Update Score</button></td>
          </tr>
        );
      });

      var finalGameList = finalGame.map(function(game){
        return(
          <tr key={game.cid}>
            <td>{game.get('objectId')}</td>
            <td>{game.get('home_team_name')}</td>
            <td>{game.get('away_team_name')}</td>
            <td>{game.get('location_name')}</td>
            <td>{game.get('time')}</td>
            <td><button className="btn btn-danger" onClick={function(){self.props.deleteGame(game)}}>Delete Game</button></td>
            <td><button className="btn btn-success" onClick={function(){self.editGame(game)}}>Edit Game</button></td>
            <td><button className="btn btn-primary" onClick={function(){self.updateScore(game)}}>Update Score</button></td>
          </tr>
        );
      });


    }
    return(
      <div className="col-sm-12">
        <div className="row">
          <div className="col-sm-12">
            <h3>Games</h3>
            <p onClick={this.openModal} className="glyphicon glyphicon-plus-sign"></p>
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
                <tr colSpan="5"><td><strong>Final Games</strong></td></tr>
                {finalGameList}
                <tr colSpan="5"><td><strong>Semi-Final Games</strong></td></tr>
                {semiFinalGameList}
                <tr colSpan="5"><td><strong>Quarter-Final Games</strong></td></tr>
                {quarterFinalGameList}
                <tr colSpan="5"><td><strong>Group Games</strong></td></tr>
                {groupGameList}
              </tbody>
            </table>
          </div>
        </div>
        <AddGameModal
          modalIsOpen={this.state.modalIsOpen}
          addGame={this.addGame}
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
            <label htmlFor="name">Name and Sub-Location</label>
            <input onChange={this.handleChange} className="form-control" type="text" name="name" placeholder="Name of Location and Sub-Location (i.e. Nettles Park, Field 1)" required="required"/>
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
  toEdit: function(location){
    Backbone.history.navigate('tournaments/' + this.props.tournamentId + '/admin/edit-location/' + location.get('objectId') + '/', {trigger: true});
  },
  render: function(){
    var locations = this.state.locations, locationsList, self = this;

    if (locations) {
      locationsList = locations.map(function(location){
        return(
          <tr key={location.cid}>
            <td>{location.get('name')}</td>
            <td>{location.get('street_address')}</td>
            <td>{location.get('city')}</td>
            <td>{location.get('state')}</td>
            <td>{location.get('zip_code')}</td>
            <td><button className="btn btn-danger" onClick={function(){self.props.deleteLocation(location)}}>Delete Location</button></td>
            <td><button className="btn btn-success" onClick={function(){self.toEdit(location)}}>Edit Location</button></td>
          </tr>
        );
      });
    }
    return(
      <div className="col-sm-12">
        <div className="row">
          <div className="col-sm-12">
            <h3>Locations</h3>
            <p onClick={this.openModal} className="glyphicon glyphicon-plus-sign"></p>
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

/*
********************************************************************************
********************************************************************************
  Draggable Component
********************************************************************************
********************************************************************************
*/

var GroupsDraggable = React.createClass({
  getInitialState: function(){
    return{
      teams: this.props.teams,
      groupA: [],
      groupB: [],
      groupC: [],
      groupD: []
    }
  },
  componentWillReceiveProps: function(nextProps){
    var teams = nextProps.teams
    , teamList = teams.filter(function(team){return !team.get('group')})
    , groupA = teams.filter(function(team){return team.get('group') == 'A'})
    , groupB = teams.filter(function(team){return team.get('group') == 'B'})
    , groupC = teams.filter(function(team){return team.get('group') == 'C'})
    , groupD = teams.filter(function(team){return team.get('group') == 'D'});

    this.setState({
      teams: teamList,
      groupA: groupA,
      groupB: groupB,
      groupC: groupC,
      groupD: groupD
    });
  },
  render: function(){
    var groupA = this.state.groupA
    , groupB = this.state.groupB
    , groupC = this.state.groupC
    , groupD = this.state.groupD
    , teams = this.state.teams
    , noGroup, listA, listB, listC, listD;

    noGroup = teams.map(function(team){
      return(
        <li key={team.get('objectId')} id={team.get('objectId')} className="list-group-item col-sm-3">{team.get('name')}<i className="fa fa-arrows pull-right"></i></li>
      );
    });

    listA = groupA.map(function(team){
      return(
        <li key={team.get('objectId')} id={team.get('objectId')} className="list-group-item">{team.get('name')}<i className="fa fa-arrows pull-right"></i></li>
      );
    });

    listB = groupB.map(function(team){
      return(
        <li key={team.get('objectId')} id={team.get('objectId')} className="list-group-item">{team.get('name')}<i className="fa fa-arrows pull-right"></i></li>
      );
    });

    listC = groupC.map(function(team){
      return(
        <li key={team.get('objectId')} id={team.get('objectId')} className="list-group-item">{team.get('name')}<i className="fa fa-arrows pull-right"></i></li>
      );
    });

    listD = groupD.map(function(team){
      return(
        <li key={team.get('objectId')} id={team.get('objectId')} className="list-group-item">{team.get('name')}<i className="fa fa-arrows pull-right"></i></li>
      );
    });

    return(
      <div className="col-md-12">
        <div className="row">
          <ul id="team-list" className="col-sm-12 list-group">
            {noGroup}
          </ul>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="col-sm-3">
              <ul id="A" className="col-sm-12 list-group draggable-list">
                Group A
                {listA}
              </ul>
            </div>
            <div className="col-sm-3">
              <ul id="B" className="col-sm-12 list-group draggable-list">
                Group B
                {listB}
              </ul>
            </div>
            <div className="col-sm-3">
              <ul id="C" className="col-sm-12 list-group draggable-list">
                Group C
                {listC}
              </ul>
            </div>
            <div className="col-sm-3">
              <ul id="D" className="col-sm-12 list-group draggable-list">
                Group D
                {listD}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount: function(){
    var teams = document.getElementById('team-list')
    , groupA = document.getElementById('A')
    , groupB = document.getElementById('B')
    , groupC = document.getElementById('C')
    , groupD = document.getElementById('D')
    , teamCollection = this.state.teams
    , self = this;

    Sortable.create(teams, {
      group: 'teamGroups',
      pull: true,
      put: true,
      onRemove: function(e){
        e.item.classList.remove('col-sm-3');
      }
    });

    Sortable.create(groupA, {
      group: 'teamGroups',
      pull: true,
      put: true,
      onAdd: function(e){
        var selectedTeam = teamCollection.get(e.item.id);
        var tableId =
        selectedTeam.set('group','A');
        selectedTeam.save().then(function(){
          // teamCollection.set(selectedTeam, {remove: false});
          // self.setState({teams: teamCollection});
        });
      }
    });

    Sortable.create(groupB, {
      group: 'teamGroups',
      pull: true,
      put: true,
      onAdd: function(e){
        var selectedTeam = teamCollection.get(e.item.id);
        var tableId =
        selectedTeam.set('group','B');
        selectedTeam.save().then(function(){
          teamCollection.set(selectedTeam, {remove: false});
          // self.setState({teams: teamCollection});
        });
      }
    });

    Sortable.create(groupC, {
      group: 'teamGroups',
      pull: true,
      put: true,
      onAdd: function(e){
        var selectedTeam = teamCollection.get(e.item.id);
        var tableId =
        selectedTeam.set('group','C');
        selectedTeam.save().then(function(){
          teamCollection.set(selectedTeam, {remove: false});
          // self.setState({teams: teamCollection});
        });
      }
    });

    Sortable.create(groupD, {
      group: 'teamGroups',
      pull: true,
      put: true,
      onAdd: function(e){
        var selectedTeam = teamCollection.get(e.item.id);
        var tableId =
        selectedTeam.set('group','D');
        selectedTeam.save().then(function(){
          teamCollection.set(selectedTeam, {remove: false});
          // self.setState({teams: teamCollection});
        });
      }
    });
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
    var teams = this.state.teams;
    teams.set(selectedTeam, {remove: false});
    this.setState({teams: teams});
  },
  addGame: function(newGame){
    var games = this.state.games, self = this;
    newGame.set('tournament', newGame.toPointer('Tournaments', this.props.tournamentId));
    newGame.save().then(function(){
      games.set(newGame, {remove: false});
      self.setState({games: games});
    });
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
  deleteTeam: function(team){
    team.destroy();
    this.setState({teams: this.state.teams});
  },
  deleteLocation: function(location){
    location.destroy();
    this.setState({locations: this.state.locations});
  },
  deleteGame: function(game){
    game.destroy();
    this.setState({games: this.state.games});
  },
  startPlayoffs: function(){
    var teams = this.state.teams, self = this;
    var groupA = [], groupB = [], groupC = [], groupD = [];
    var arrayOfGroups = [groupA, groupB, groupC, groupD];

    teams.forEach(function(team){
      var group = team.get('group');

      if (group == 'A'){
        groupA.push(team);
      }else if(group == 'B'){
        groupB.push(team);
      }else if(group == 'C'){
        groupC.push(team);
      }else{
        groupD.push(team);
      }
    });

    arrayOfGroups.forEach(function(group){
      group.sort(function(a, b){

        if (a.get('points') > b.get('points')) {
          return 1;
        }

        if (a.get('points') < b.get('points')) {
          return -1;
        }

        return 0;
      });
    });

    var playOffArray = [];

    arrayOfGroups.forEach(function(group){
      var newArray = group.reverse().slice(0,2);
      playOffArray.push(newArray);
    });

    playOffArray = _.flatten(playOffArray, true);

    this.createGame(playOffArray[0], playOffArray[5], 1, 'quarter');
    this.createGame(playOffArray[1], playOffArray[4], 2, 'quarter');
    this.createGame(playOffArray[2], playOffArray[7], 3, 'quarter');
    this.createGame(playOffArray[3], playOffArray[6], 4, 'quarter');
  },
  createGame: function(team1, team2, gameNum, stage){
    var newGame = new Game(), self = this;

    var stageKey, stageValue;

    if(stage == 'quarter') {
      stageKey = 'quarter_final';
      stageValue = 'QF' + gameNum;
    }else if(stage == 'semi') {
      stageKey = 'semi_final';
      stageValue = 'SF' + gameNum;
    }else if(stage == 'final') {
      stageKey = 'final';
      stageValue = 'F' + gameNum;
    }else{
      throw "Please check parameter 'stage', must be a string and can either be 'quarter', 'semi', or 'final'."
      return;
    }



    newGame.set({
      home_team: newGame.toPointer('Teams', team1.get('objectId')),
      home_team_name: team1.get('name'),
      away_team: newGame.toPointer('Teams', team2.get('objectId')),
      away_team_name: team2.get('name'),
      tournament: newGame.toPointer('Tournaments', this.props.tournamentId),
      location: undefined,
      group_game: false,
    });
    newGame.set(stageKey, stageValue);

    newGame.save().then(function(){
      self.state.games.add(newGame);
      self.setState({games: self.state.games});
    });
  },
  findWinner: function(gameId){
    var game = this.state.games.get(gameId), winner = {}, homeScore = game.get('home_team_score')
    , awayScore = game.get('away_team_score'), homeTeamId = game.get('home_team').objectId
    , homeTeamName = game.get('home_team_name'), awayTeamId = game.get('away_team').objectId
    , awayTeamName = game.get('away_team_name');

    if (homeScore > awayScore) {
      winner.objectId = homeTeamId;
      winner.name = homeTeamName;
    } else {
      winner.objectId = awayTeamId;
      winner.name = awayTeamName;
    }

    return winner;
  },
  createSemis: function(){
    var quarters = this.state.games.filter(function(game){return game.get('quarter_final')});
    var self = this;

    quarters = new GameCollection(quarters);

    quarters = quarters.sortBy(function(game){return game.get('quarter_final')});

    //Check to see if all quarter final scores have been submitted
    var quarterCheck = 0;
    quarters.forEach(function(game){
      if (game.get('has_been_played')){
        quarterCheck += 1
      }
    });

    if(quarterCheck < 4){
      alert('Not all quarter final scores have been updated. Please update all scores to proceed.')
      return
    }

    var q1 = {}, q2 = {}, q3 = {}, q4 = {}, quartersArray = [q1, q2, q3, q4];
    quarters.forEach(function(game, i){
      var winner = self.findWinner(game.get('objectId'));
      var team = self.state.teams.get(winner.objectId);
      quartersArray[i].winner = team;
    });



    this.createGame(q1.winner, q3.winner, 1, 'semi');
    this.createGame(q2.winner, q4.winner, 2, 'semi');
  },
  createFinal: function(){
    var semis = this.state.games.filter(function(game){return game.get('semi_final')})
    , self = this;

    semis = new GameCollection(semis);

    semis = semis.sortBy(function(game){return game.get('semi_final')});

    // Check to see if all semi final games have been submitted
    var semiCheck = 0;
    semis.forEach(function(game){
      if (game.get('has_been_played')){
        semiCheck += 1
      }
    });

    if(semiCheck < 2){
      alert('Not all semi-final scores have been updated. Please update all scores to proceed.')
      return
    }

    var s1 = {}, s2 = {}, semisArray = [s1, s2];
    semis.forEach(function(game, i){
      var winner = self.findWinner(game.get('objectId'));
      var team = self.state.teams.get(winner.objectId);
      semisArray[i].winner = team;
    });



    this.createGame(s1.winner, s2.winner, 1, 'final');
  },
  render: function(){
    return(
      <TournamentDashTemplate teams={this.state.teams} tournament={this.state.tournament}>
        <div className="container-fluid admin-dash-container">
          <h1>AdminTournamentDash</h1>
          <button onClick={this.startPlayoffs} type="button" className="btn btn-accent dark-blue playoff-btn">Create Quarter Finals</button>
          <button onClick={this.createSemis} type="button" className="btn btn-accent dark-blue playoff-btn">Create Semi-Finals</button>
          <button onClick={this.createFinal} type="button" className="btn btn-accent dark-blue playoff-btn">Create Final</button>
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <TeamsTable
                deleteTeam={this.deleteTeam}
                teams={this.state.teams}
                updateSelected={this.updateSelected}
              />
            </div>
          </div>
          <div className="row">
            {this.state.teams.length == 16 ? <GroupsDraggable teams={this.state.teams} /> : null}
            <GamesTable
              deleteGame={this.deleteGame}
              teams={this.state.teams}
              locations={this.state.locations}
              games={this.state.games}
              addGame={this.addGame}
              tournamentId={this.props.tournamentId}
            />
          </div>
          <div className="row">
            <LocationsTable
              tournamentId={this.props.tournamentId}
              deleteLocation={this.deleteLocation}
              locations={this.state.locations}
              addLocation={this.addLocation}
            />
          </div>
        </div>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  AdminTournamentDash: AdminTournamentDash
};
