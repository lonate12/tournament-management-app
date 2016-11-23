var ParseModels = require('./parseModels.js');


var LocationModel = ParseModels.ParseModel.extend({

});

var LocationCollection = ParseModels.ParseCollection.extend({
  model: LocationModel,
  url: 'https://zugzwang.herokuapp.com/classes/Locations/'
});

module.exports = {
  LocationModel: LocationModel,
  LocationCollection: LocationCollection
};
