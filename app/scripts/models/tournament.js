var $ = require('jquery');
var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;
var setUpParse = require('../parseUtilities.js').setUpParse;
var moment = require('moment');

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
  createTournament: function(){
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
      self.save().then(function(response){
        Backbone.history.navigate('/tournaments/'+response.objectId+'/', {trigger: true});
      });
    });
  },
  getWeather: function(callback){
    var self = this;

    var lat = this.get('lat');
    var lng = this.get('lng');

    $.get('https://proxy-for-final.herokuapp.com/forecast/?lat='+ lat +'&lng='+ lng, function(forecastData){
      console.log(JSON.parse(forecastData));
      var forecastInfo = JSON.parse(forecastData);
      var todayWeather = forecastInfo.daily.data[0];
      var todayWeatherDate = moment.unix(todayWeather.time).format('dddd, MMMM Do YYYY');
      self.set({
        'weather_summary': forecastInfo.daily.summary,
        'weather_date': todayWeatherDate,
        'weather_high': todayWeather.temperatureMax.toFixed(0),
        'weather_low': todayWeather.temperatureMin.toFixed(0)
      });

      callback();
    });
  }
});

var TournamentCollection = ParseCollection.extend({
  model: Tournament,
  baseUrl: 'https://zugzwang.herokuapp.com/classes/Tournaments/'
});

module.exports = {
  Tournament: Tournament,
  TournamentCollection: TournamentCollection
};
