var $ = require('jquery');
var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;

var Tournament = ParseModel.extend({
  default: {
    'tournament_name': '',
    'start_date': '',
    'end_date': '',
    'city': '',
    'state': '',
    'owner': {},
    'teams': []
  },
  urlRoot: 'https://zugzwang.herokuapp.com/classes/Tournaments/',
  createTournament: function(tournament){
    $.post(this.urlRoot, tournament).then(function(response){
      console.log(response);
    });
  },
  getCoordinates: function(){
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.get('city')+ ',+' + this.get('state') +'&key=AIzaSyDNYfO_C-Ok2iMSLiCUf_5nT8Ftuu5rAKU').then(function(response){
      console.log(response);
    });
  }
});

var TournamentCollection = ParseCollection.extend({
  model: Tournament,
  url: 'https://zugzwang.herokuapp.com/classes/Tournaments/'
});

module.exports = {
  Tournament: Tournament,
  TournamentCollection: TournamentCollection
};
