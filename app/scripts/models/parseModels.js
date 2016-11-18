var Backbone = require('backbone');

var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',
  toPointer: function(className, objectId){
    var pointerObject = {
      '__type': 'Pointer',
      className: className,
      objectId: objectId
    };

    return pointerObject;
  }
});

var ParseCollection = Backbone.Collection.extend({
  parse: function(data){
    return data.results;
  },
  parseWhere: function(field, className, objectId){
    this.whereClause = {
      field: field,
      '__type': 'Pointer',
      className: className,
      objectId: objectId
    };
    return this;
  },
  url: function(){
    var url = this.baseUrl;

    if(this.whereClause.field){
      var field = this.whereClause.field;
      delete this.whereClause.field;
      url += '?where={"' + field + '":' + JSON.stringify(this.whereClause) + '}';
    }

    return url;
  }
});

module.exports = {
  ParseModel: ParseModel,
  ParseCollection: ParseCollection
};
