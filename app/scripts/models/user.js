var $ = require('jquery');
var Backbone = require('backbone');
var setUpParse = require('../parseUtilities.js').setUpParse;

var User = Backbone.Model.extend({
  defaults: {
    'first_name': '',
    'last_name': '',
    'email': '',
    'phone_number': '',
    'password': '',
    'username': ''
  },
  idAttribute: 'objectId',
  urlRoot: 'https://zugzwang.herokuapp.com/',
  parse: function(data){
    return data.results;
  },
  login: function(username, password){
    var url = this.urlRoot + 'login?username=' + username + '&password=' + encodeURI(password);
    var self = this;

    $.ajax(url).then(function(response){
      localStorage.setItem('sessionToken', response.sessionToken);
      localStorage.setItem('userSession', JSON.stringify(response));
      localStorage.setItem('userID', response.objectId);
      localStorage.setItem('name', response.first_name);

      setUpParse('zugzwang', 'tosche station', response.sessionToken);
    });
  },
  signUp: function(){
    var self = this, url = this.urlRoot + 'users';
    console.log(this.get('email'));
    $.post(url, {
      'username': this.get('email'),
      'password': this.get('password'),
      'first_name': this.get('first_name'),
      'last_name': this.get('last_name'),
      'email': this.get('email'),
      'phone_number': this.get('phone_number')
    }).then(function(){
      self.login(self.get('username'), self.get('password'));
    });
  },
});

module.exports = {
  User: User
};
