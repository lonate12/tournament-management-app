var $ = require('jquery');
var React = require('react');
var Sortable = require('sortablejs');

var Test = React.createClass({
  componentDidMount: function(){
    var testList = document.getElementById('test')
    , groupA = document.getElementById('Group A')
    , groupB = document.getElementById('Group B');

    Sortable.create(testList, {
      group: 'teamGroups',
      pull: true,
      put: true
    });

    Sortable.create(groupA, {
      group: 'teamGroups',
      pull: true,
      put: true
    });

    Sortable.create(groupB, {
      group: 'teamGroups',
      pull: true,
      put: true
    });
  },
  render: function(){
    return(
      <div>
        <ul id="test">
          <li>Things</li>
          <li>These</li>
          <li>Something</li>
        </ul>
        <ul id="Group A">
          Group A

        </ul>
        <ul id="Group B">
          Group B

        </ul>
      </div>
    );
  }
});

module.exports = {
  Test: Test
};
