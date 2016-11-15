var React = require('react');
var Modal = require('react-modal');
var Tournament = require('../models/tournament.js').Tournament;
var TournamentCollection = require('../models/tournament.js').TournamentCollection;
var setUpParse = require('../parseUtilities.js').setUpParse;

var ModalView = React.createClass({
  getInitialState: function(){
    var currentTournament = new Tournament();

    return{
      modalIsOpen: false,
      tournamentId: ''
    }
  },
  openModal: function(){
    this.setState({modalIsOpen: true});
  },
  afterOpenModal: function(){

  },
  closeModal: function(){
    this.setState({modalIsOpen: false});
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({tournamentId: nextProps.tournamentId, modalIsOpen: nextProps.modalIsOpen});
  },
  render: function(){
    return(
      <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal}>
        <ul>
          <li>Hey</li>
          <li>You</li>
        </ul>
      </Modal>
    );
  }
});

var TournamentListView = React.createClass({
  getInitialState: function(){
    var tournamentCollection = new TournamentCollection();

    return{
      tournamentCollection: tournamentCollection,
      tournamentId: '',
      modalIsOpen: false
    }
  },
  componentWillMount: function(){
    var tournamentCollection = this.state.tournamentCollection;
    var self = this;

    setUpParse('zugzwang', 'tosche station', localStorage.getItem('sessionToken'));

    tournamentCollection.fetch().then(function(response){
      console.log(response);
      self.setState({tournamentCollection: tournamentCollection});
    });
  },
  setCurrentTournament: function(tournamentId){
    this.setState({tournamentId: tournamentId, modalIsOpen: true});
    console.log(this.state);
  },
  render: function(){
    var self = this;
    console.log(this.state);
    var tournaments = this.state.tournamentCollection.map(function(tournament){
      console.log(tournament);
      return (
        <li onClick={function(){self.setCurrentTournament(tournament.get('objectId'))}} key={tournament.cid} id={tournament.get('objectId')}>{tournament.get('tournament_name')}</li>
      );
    });
    return(
      <div>
        <ul>
          {tournaments}
        </ul>
        <ModalView modalIsOpen={this.state.modalIsOpen} tournamentId={this.state.tournamentId}/>
      </div>
    );
  }
});

module.exports = {
  TournamentListView: TournamentListView
};
