var $ = require('jquery');
var Backbone = require('backbone');

var Tournament = Backbone.Model.extend({
  default: {
    'tournament_name': '',
    'start_date': '',
    'end_date': '',
    'city': '',
    'state': ''
  },
  idAttribute: 'objectId',
  urlRoot: 'https://zugzwang.herokuapp.com/classes/Tournaments/',
  createTournament: function(){
    console.log(this.toJSON());
    $.post(this.urlRoot, this.toJSON()).then(function(response){
      console.log(response);
    });
  },
  getCoordinates: function(){
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.get('city')+ ',+' + this.get('state') +'&key=AIzaSyDNYfO_C-Ok2iMSLiCUf_5nT8Ftuu5rAKU').then(function(response){
      console.log(response);
    });
  }
});

module.exports = {
  Tournament: Tournament
};
