var React = require('react');
var Map = require('./map');
var Modal = require('boron/DropModal');
var DynamicForm = require('./DynamicForm');

var App = React.createClass({
  getInitialState: function() {
    return {
      modalContent: [],
      submitGlyphCoordinates: {}
    }
  },

  showModal: function() {
    this.refs.modal.show();
  },

  showSubmitGlyphModal: function(latitude, longitude) {
    this.setState({
      submitGlyphCoordinates: {
        latitude: latitude,
        longitude: longitude
      }
    })
    this.refs.submitGlyph.show();
  },

  setModalContents: function(content) {
    this.setState({
      modalContent: content
    });
  },

  componentDidMount: function() {
    // this.showModal();
  },

  render: function() {
    return (
      <div>
        <h1 className="red">
          GlyphBase!
        </h1>
        <Map 
          showModal={this.showModal} 
          setModalContents={this.setModalContents} 
          showSubmitGlyphModal={this.showSubmitGlyphModal}
        />
        <Modal ref="modal" id="modal">
          {this.state.modalContent.map(function(item, index) {
            return <div key={item.key}> {item.key}: {item.data} </div>
          })}
        </Modal>
        <Modal ref="submitGlyph">
          <DynamicForm coordinates={this.state.submitGlyphCoordinates}></DynamicForm>
        </Modal>
      </div>
    )
  }
});

var element = React.createElement(App, {});
React.render(element, document.querySelector('#container'));
