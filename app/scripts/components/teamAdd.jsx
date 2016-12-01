var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var User = require('../models/user.js').User;
var Team = require('../models/team.js').Team;
var setUpParse = require('../parseUtilities.js').setUpParse;
var FileModel = require('../models/file.js').FileModel;
require('../3rd-party-plugins/masks.js');

var TeamAddContainer = React.createClass({
  getInitialState: function(){
    var currentUser = new User();
    var newTeam = new Team();
    var logo = new FileModel();

    return{
      currentUser: currentUser,
      newTeam: newTeam,
      'name': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'phone_number':'',
      'logo': logo,
      isLoading: false
    }
  },
  handleInput: function(e){
    e.preventDefault();

    var target = e.target;

    var newData = {};
    newData[target.id] = target.value;

    this.setState(newData);
  },
  componentWillMount: function(){
    var currentUser = this.state.currentUser;
    var userData = localStorage.getItem('userSession');

    currentUser.set(JSON.parse(userData));
  },
  hanleCheckedInput: function(e){
    if(e.target.checked){
      this.setState(this.state.currentUser.toJSON());
    }else{
      this.setState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'phone_number':''
      });
    }
  },
  handleSubmit: function(e){
    e.preventDefault();
    var newTeam = this.state.newTeam;
    var self = this;

    setUpParse('zugzwang', 'tosche station', localStorage.getItem('sessionToken'));
    this.setState({isLoading: true});

    this.state.logo.save().then(function(response){
      newTeam.set({
        team_admin: newTeam.toPointer('_User', localStorage.getItem('userID')),
        tournament: newTeam.toPointer('Tournaments', self.props.tournamentId),
        name: self.state.name,
        primary_contact: {
          first_name: self.state.first_name,
          last_name: self.state.last_name,
          email: self.state.email,
          phone_number: self.state.phone_number
        },
        logo: response.url
      });

      self.setState({newTeam: newTeam});

      newTeam.save().then(function(response){
        var teamId = response.objectId;
        var currentUser = self.state.currentUser;

        currentUser.set({team: currentUser.toPointer('Teams', teamId)});
        currentUser.unset('createdAt');
        currentUser.unset('updatedAt');
        currentUser.save().then(function(){
          Backbone.history.navigate('/tournaments/'+self.props.tournamentId+'/'+currentUser.get('team').objectId+'/', {trigger: true});
        });
      });
    });

  },
  handleLogo: function(e){
    e.preventDefault();
    var attachedLogo = e.target.files[0];
    var logo = this.state.logo;

    logo.set('name', attachedLogo.name);
    logo.set('data', attachedLogo);

    this.setState({logo: logo});
  },
  componentDidMount: function(){
    $('#phone_number').mask('(000) 000-0000');
  },
  render: function(){
    return(
      <div className="container-fluid bg-blue" id="team-add-body">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2 login-logo-div clearfix">
            <a href="#">
              <img className="login-logo" src="images/the-standings-logo-white.png" alt="The Standings Logo" />
            </a>
          </div>
          <form onSubmit={this.handleSubmit} className="form team-info-form col-sm-8 col-sm-offset-2 loading-parent">
            <h1>Register your team! <i className="fa fa-users white" aria-hidden="true"></i></h1>
            <div className="form-group">
              <label htmlFor="name"><h3>Team Name</h3></label>
              <input onChange={this.handleInput} type="text" className="form-control" id="name" placeholder="Team Name" value={this.state.name} required="required"/>
            </div>
            <div className="form-group">
              <h3>Primary Team Contact Info</h3>
              <label className="white"><input onChange={this.hanleCheckedInput} type="checkbox"/> I am the primary contact</label>
              <br/>
              <label htmlFor="first_name">First Name</label>
              <input onChange={this.handleInput} type="text" className="form-control" id="first_name" placeholder="First Name" value={this.state.first_name} required="required"/>
              <label htmlFor="last_name">Last Name</label>
              <input onChange={this.handleInput} type="text" className="form-control" id="last_name" placeholder="Last Name" value={this.state.last_name} required="required"/>
              <label htmlFor="email">Email</label>
              <input onChange={this.handleInput} type="email" className="form-control" id="email" placeholder="Email" value={this.state.email} required="required"/>
              <label htmlFor="phone_number">Contact Number</label>
              <input onChange={this.handleInput} type="text" className="form-control" id="phone_number" placeholder="(###) ###-####" value={this.state.phone_number} required="required"/>
            </div>
            <div className="form-group">
              <label htmlFor="team_logo"><h3>Team Logo</h3></label>
              <input onChange={this.handleLogo} type="file" id="team_logo" name="team_logo"/>
            </div>
            <button type="submit" className="btn btn-accent dark-blue">Submit Team Info</button>
            <div className={this.state.isLoading ? 'show loading-div' : 'hidden loading-div'}></div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = {
  TeamAddContainer: TeamAddContainer
};
