var $ = require('jquery');
var Backbone = require('backbone');
var setUpParse = require('../parseUtilities.js').setUpParse;

var User = Backbone.Model.extend({
  idAttribute: 'objectId',
  urlRoot: 'https://zugzwang.herokuapp.com/',
  parse: function(data){
    return data.results;
  },
  login: function(username, password){
    var url = this.urlRoot + 'login?username=' + username + '&password=' + encodeURI(password);

    $.ajax(url).then(function(response){
      localStorage.setItem({
        'sessionToken': response.sessionToken,
        'userSession': JSON.stringify(response),
        'userID': response.objectId,
        'name': response.name
      });

      setUpParse('zugzwang', 'tosche station', response.sessionToken);
    });
  },
  signUp: function(username, password, firstName, lastName, email){
    var self = this, url = this.urlRoot + 'users';
    $.post(url, {
      'username': username,
      'password': password,
      'first_name': firstName,
      'last_name': lastName,
      'email': email
    }).then(function()}{
      self.login(username, password)
    });
  },
});

module.exports = {
  User: User
};
