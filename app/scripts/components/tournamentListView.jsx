var Backbone = require('backbone');
var React = require('react');
var Modal = require('react-modal');
var Tournament = require('../models/tournament.js').Tournament;
var TournamentCollection = require('../models/tournament.js').TournamentCollection;
var setUpParse = require('../parseUtilities.js').setUpParse;
var TeamCollection = require('../models/team.js').TeamCollection;

var ModalComponent = React.createClass({
  getInitialState: function(){
    return {
      teamCollection: this.props.teamCollection,
      modalIsOpen: false,
      tournamentId: null
    }
  },componentWillReceiveProps: function(nextProps){
    this.setState({teamCollection: nextProps.teamCollection, tournamentId: nextProps.tournamentId});

    if(nextProps.teamCollection){
      this.openModal();
    }
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  closeModal: function(){
    this.setState({modalIsOpen: false});
  },
  handleClick: function(e){
    e.preventDefault();

    Backbone.history.navigate('/tournaments/'+this.state.tournamentId+'/add-team/', {trigger: true});
  },
  render: function(){
    var teams;

    if(this.state.teamCollection){
      var self = this;
      teams = this.state.teamCollection.map(function(team){
        return(
          <li key={team.get('objectId')}><a href={'#/tournaments/'+self.props.tournamentId+'/'+team.get('objectId')+'/'}>{team.get('name')}</a></li>
        );
      });
    }

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal} >

        <ul className="tournament-ul-modal">
          <h1>Choose your team</h1>
          {teams ? teams : null}
        </ul>
        <button type="button" onClick={this.handleClick} className="btn btn-accent">Register Team</button>
      </Modal>
    );
  }
});

var TournamentListView = React.createClass({
  getInitialState: function(){
    var tournamentCollection = new TournamentCollection();

    return{
      tournamentCollection: tournamentCollection,
      teamCollection: null,
      tournamentId: null,
      isLoading: true
    }
  },
  componentWillMount: function(){
    var tournamentCollection = this.state.tournamentCollection;
    var self = this;

    setUpParse('zugzwang', 'tosche station', localStorage.getItem('sessionToken'));

    tournamentCollection.fetch().then(function(){
      self.setState({
        tournamentCollection: tournamentCollection,
        isLoading: false
      });
    });
  },
  loadTeams: function(e){
    var self = this;
    var target = e.target;
    var tournamentId = target.id;
    var teams = new TeamCollection();

    teams.parseWhere('tournament', 'Tournaments', tournamentId).fetch().then(function(){
      self.setState({teamCollection: teams, tournamentId: tournamentId});
    });

  },
  render: function(){
    var self = this;

    var tournaments = this.state.tournamentCollection.map(function(tournament){
      return (
        <li
          onClick={self.loadTeams}
          key={tournament.cid}
          id={tournament.get('objectId')}
          className="row tournament-li"
        >{tournament.get('tournament_name')}</li>
      );
    });

    return(
      <div className="container-fluid">
        <div className="row">
          <h1 className="col-sm-12 text-center list-view-header">Choose your tournament</h1>
        </div>
        <div className="row bg-light loading-parent">
          <div className={this.state.isLoading ? 'show loading-div' : 'hidden loading-div'}></div>
          <ul className="col-md-10 col-md-offset-1 bg-white tournament-ul">
            {tournaments}
          </ul>
        </div>
        <ModalComponent tournamentId={this.state.tournamentId} teamCollection = {this.state.teamCollection}/>
      </div>
    );
  }
});

module.exports = {
  TournamentListView: TournamentListView
};
