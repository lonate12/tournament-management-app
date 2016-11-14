var Backbone = require('backbone');

var Tournament = Backbone.Model.extend({
  default: {
    'tournament_name': '',
    'start_date': '',
    'end_date': '',
    'city': '',
    'state': ''
  },
  idAttribute: 'objectId'
});

module.exports = {
  Tournament: Tournament
};
