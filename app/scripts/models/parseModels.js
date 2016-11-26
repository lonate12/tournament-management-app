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
  },
  save: function(key, val, options){
    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;

    return Backbone.Model.prototype.save.apply(this, arguments);
  },
  deleteModel: function(){
    $.ajax({
      url: urlRoot + encodeURI(this.objectId) +'/',
      method: 'DELETE',
      success: function(){
        alert('Game Deleted');
      }
    });
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
    var self = this;
    var url = this.baseUrl;

    if (this.whereClause) {
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
