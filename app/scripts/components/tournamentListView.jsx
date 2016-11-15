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
      currentTournament: currentTournament,
      teams: []
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
    this.setState({currentTournament: nextProps.currentTournament, modalIsOpen: nextProps.modalIsOpen});
    console.log(nextProps.currentTournament.get('teams'));
    $.ajax({url: 'https://zugzwang.herokuapp.com/classes/Teams/'})
  },
  render: function(){
    return(
      <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal}>
        <ul>

        </ul>
      </Modal>
    );
  }
});

var TournamentListView = React.createClass({
  getInitialState: function(){
    var tournamentCollection = new TournamentCollection();
    var currentTournament = new Tournament();
    return{
      tournamentCollection: tournamentCollection,
      currentTournament: currentTournament,
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
  setCurrentTournament: function(tournament){
    this.setState({currentTournament: tournament, modalIsOpen: true});
    console.log(this.state);
  },
  render: function(){
    var self = this;
    console.log(this.state);
    var tournaments = this.state.tournamentCollection.map(function(tournament){
      console.log(tournament);
      return (
        <li onClick={function(){self.setCurrentTournament(tournament)}} key={tournament.cid} id={tournament.get('objectId')}>{tournament.get('tournament_name')}</li>
      );
    });
    return(
      <div>
        <ul>
          {tournaments}
        </ul>
        <ModalView modalIsOpen={this.state.modalIsOpen} currentTournament={this.state.currentTournament}/>
      </div>
    );
  }
});

module.exports = {
  TournamentListView: TournamentListView
};
