var ParseModels = require('./parseModels.js');
var $ = require('jquery');


var LocationModel = ParseModels.ParseModel.extend({
  urlRoot: 'https://zugzwang.herokuapp.com/classes/Locations/',
  setCoordinates: function(callback){
    var self = this;
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(this.get('street_address'))+',+'+encodeURI(this.get('city'))+',+'+encodeURI(this.get('state'))+'&key=AIzaSyDNYfO_C-Ok2iMSLiCUf_5nT8Ftuu5rAKU',
      beforeSend: function(xhr){
      }
    }).then(function(response){
      self.set({
        lat: response.results[0].geometry.location.lat,
        lng: response.results[0].geometry.location.lng
      });
      callback();
    });
  }
});

var LocationCollection = ParseModels.ParseCollection.extend({
  model: LocationModel,
  url: 'https://zugzwang.herokuapp.com/classes/Locations/'
});

module.exports = {
  LocationModel: LocationModel,
  LocationCollection: LocationCollection
};
