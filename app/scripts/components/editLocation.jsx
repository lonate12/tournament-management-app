var Backbone = require('backbone');
var React = require('react');
var LocationModel = require('../models/location.js').LocationModel;

var EditLocation = React.createClass({
  getInitialState: function(){
    var location = new LocationModel();
    return{
      location: location,
      name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: ''
    }
  },
  componentWillMount: function(){
    var location = this.state.location, self = this;
    location.set({objectId: this.props.locationId});

    location.fetch().then(function(){
      self.setState({
        location: location,
        name: location.get('name'),
        street_address: location.get('street_address'),
        city: location.get('city'),
        state: location.get('state'),
        zip_code: location.get('zip_code')
      });
    });
  },
  updateLocation: function(e){
    e.preventDefault();
    var location = this.state.location, self = this;

    location.set({
      name: this.state.name,
      street_address: this.state.street_address,
      city: this.state.city,
      state: this.state.state,
      zip_code: this.state.zip_code
    });

    location.setCoordinates(function(){
      location.save().then(function(response){
        Backbone.history.navigate('/tournaments/'+self.props.tournamentId+'/admin/', {trigger: true});
      });
    });
  },
  handleChange: function(e){
    var target = e.target, newObject = {};

    newObject[target.name] = target.value;
    this.setState(newObject);
  },
  render: function(){
    return(
      <form onSubmit={this.updateLocation}>
        <div className="form-group">
          <label htmlFor="name">Name and Sub-Location</label>
          <input value={this.state.name} onChange={this.handleChange} className="form-control" type="text" name="name" placeholder="Name of Location and Sub-Location (i.e. Nettles Park, Field 1)" required="required"/>
        </div>
        <div className="form-group">
          <label htmlFor="street_address">Street Address</label>
          <input value={this.state.street_address} onChange={this.handleChange} className="form-control" type="text" name="street_address" placeholder="Street Address" required="required"/>
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input value={this.state.city} onChange={this.handleChange} className="form-control" type="text" name="city" placeholder="City" required="required"/>
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <select value={this.state.state} onChange={this.handleChange} className="form-control" name="state" id="state" required="required">
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="zip_code">Zip Code</label>
          <input value={this.state.zip_code} onChange={this.handleChange} className="form-control" type="text" name="zip_code" placeholder="Zip Code" required="required"/>
        </div>
        <button type="submit" className="btn btn-success">Add Location</button>
      </form>
    );
  }
});

module.exports = {
  EditLocation: EditLocation
};
