var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;

var Team = ParseModel.extend({
  defaults: {
    have_paid: false,
    have_waiver: false,
    points: 0,
    group: undefined
  },
  urlRoot: 'https://zugzwang.herokuapp.com/classes/Teams'
});

var TeamCollection = ParseCollection.extend({
  model: Team,
  baseUrl: 'https://zugzwang.herokuapp.com/classes/Teams',
  sortByPoints: function(){
    this.sortBy(function(team){
      return team.get('points');
    });

    return this;
  }
});

module.exports = {
  Team: Team,
  TeamCollection: TeamCollection
};
