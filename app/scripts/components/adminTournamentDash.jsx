var Backbone = require('backbone');
var React = require('react');
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;
var Team = require('../models/team.js').Team;
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Modal = require('react-modal');

var ModalComponent = React.createClass({
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

    return{
      tournament: tournament,
      teams: teams,
      selectedTeam: selectedTeam
    }
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, teams = this.state.teams

    tournament.set('objectId', this.props.tournamentId);
    tournament.fetch().then(function(response){
      tournament.getWeather(function(){
        self.setState({tournament: tournament});
      });
    });

    teams.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({teams: teams});
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
        <ModalComponent tournamentId={this.props.tournamentId} updateSelected={this.updateSelected} selectedTeam={this.state.selectedTeam}/>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  AdminTournamentDash: AdminTournamentDash
};
