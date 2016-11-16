var $ = require('jquery');
var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;
var setUpParse = require('../parseUtilities.js').setUpParse;

var Tournament = ParseModel.extend({
  default: {
    'tournament_name': '',
    'start_date': '',
    'end_date': '',
    'city': '',
    'state': '',
    'owner': {},
    'teams': [],
    'lng': '',
    'lat': ''
  },
  urlRoot: 'https://zugzwang.herokuapp.com/classes/Tournaments/',
  createTournament: function(tournament){
    var self = this;
    $.post(this.urlRoot, tournament).then(function(response){
      console.log(response);
      self.getCoordinates();
    });
  },
  getCoordinates: function(){
    var self = this;
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.get('city')+ ',+' + this.get('state') +'&key=AIzaSyDNYfO_C-Ok2iMSLiCUf_5nT8Ftuu5rAKU',
      beforeSend: function(xhr){
      }
    }).then(function(response){
      self.set({
        lat: response.results[0].geometry.location.lat,
        lng: response.results[0].geometry.location.lng
      });

      setUpParse('zugzwang', 'tosche station', localStorage.getItem('sessionToken'));
      self.save();
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
