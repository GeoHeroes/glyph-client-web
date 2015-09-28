var React = require('react');
var DynamicForm = require('./DynamicForm');
var circleDraw = require('./helpers/circleDraw');

var Map = React.createClass({

  getInitialState: function() {
    return {
      map: null,
      location: null,
      markers: [],
      serverAddress: 'http://ec2-52-11-76-55.us-west-2.compute.amazonaws.com'
    }
  },

  render: function() {
    return (
      <div id="map-container">
        <input id="pac-input" class="controls" type="text" placeholder="Search Box" />
        <div ref="mapRef" id="map-canvas">
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    var map;

    this.getUserLocation(function(location) {
      map = this.createMap(location);
      this.setState({location: location});
      this.setState({map: map});
      this.getGlyphs(this.renderGlyphs, true);
      this.renderUserGlyph(location);
      this.renderUserLocation(map, location);
    }.bind(this));

    // Not sure this is necessary
    window.addEventListener("resize", function() {google.maps.event.trigger(map, 'resize')});

    //map event listeners go here

  },

  // dropMarker: function(map) {
  //    // This event listener will call addMarker() when the map is clicked.
  //   google.maps.event.addListener(map, 'click', function(event) {
  //     this.addMarker(event.latLng);
  //   }.bind(this));
  // },

  // addMarker: function(location) {
  //   var marker = new google.maps.Marker({
  //     position: location,
  //     map: this.state.map
  //   });
  //   this.setState({markers: this.state.markers.concat([marker])});
  // },

  ////////////////////////////////////////////////
  ////// Helper Methods for the map markers //////
  ////////////////////////////////////////////////

  // // Sets the map on all markers in the array.
  // setAllMap: function(map) {
  //   var markers = this.state.markers;
  //   var map = this.state.map;
  //   for (var i = 0; i < markers.length; i++) {
  //     markers[i].setMap(map);
  //   }
  // },

  // // Removes the markers from the map, but keeps them in the array.
  // clearMarkers: function() {
  //   this.setAllMap(null);
  // },

  // // Shows any markers currently in the array.
  // showMarkers: function() {
  //   var map = this.state.map;
  //   this.setAllMap(map);
  // },

  // // Deletes all markers in the array by removing references to them.
  // deleteMarkers: function() {
  //   this.clearMarkers();
  //   this.setState({
  //     markers: []
  //   });
  // },

  createMap: function(location) {
    var mapOptions = {
      draggable: true,
      zoom: 10,
      center: new google.maps.LatLng(location.latitude, location.longitude)
    }

    var map = new google.maps.Map(this.refs.mapRef.getDOMNode(), mapOptions);
  
    var input = document.getElementById('pac-input');
    // Create autocomplete and link it to the UI element.
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Set the map controls to render in the to left position of the map.
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // SearchBox is initialized as hidden, until google maps is loaded.
    google.maps.event.addListenerOnce(map, 'idle', function() {
      $('#pac-input').css('display', 'block');
    });

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    autocomplete.addListener('place_changed', function() { 
      var newPlace = autocomplete.getPlace();

      new google.maps.Marker({
        map: map,
        position: newPlace.geometry.location
      });
    });

    return map;
  },

  getGlyphs: function(callback) {
    $.ajax({
      url: this.state.serverAddress + '/api/findGlyphsRadius',
      method: 'POST',
      data: JSON.stringify({
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,
        radius: 1
      }),
      contentType: "application/json",
      success: function(response) {
        callback(response.glyphs);
      }
    });
  },

  renderGlyphs: function(glyphs, infoWindow) {
    var map = this.state.map;
    // Might need to load markers into state
    glyphs.forEach(function(glyph) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(glyph.latitude, glyph.longitude),
        map: map,
        title: glyph._id
      });

      var glyphInfo = $('<div></div>');
      for (var key in glyph.data) {
        glyphInfo.append('<div>' + key + ': ' + glyph.data[key] + '</div>');
      }

      var hoverWindow = new google.maps.InfoWindow({
        content: glyphInfo[0]
      });

      marker.addListener('mouseover', function() {
        hoverWindow.open(map, marker);
      });

      marker.addListener('mouseout', function() {
        hoverWindow.close(map, marker);
      });

    }.bind(this));
  },

  getUserLocation: function(callback) {
    navigator.geolocation.getCurrentPosition(function(location) {
      callback(location.coords);
    });
  },

  renderUserLocation: function(map, location) {
    // Append the users location as a circle to the map
    var userLocationDot = new google.maps.Circle({
      strokeOpacity: 0,
      fillOpacity: 1,
      fillColor: 'blue',
      map: map,
      center: {lat: location.latitude, lng: location.longitude},
      radius: 700
    });

    // Another circle that animates a "pulse"
    var userLocationPulse = new google.maps.Circle({
      strokeColor: 'LightBlue',
      strokeWeight: 2,
      fillOpacity: 0,
      map: map,
      center: {lat: location.latitude, lng: location.longitude},
      radius: 700
    });

    // Helper functions that animate the circles and update their
    // rendering when the zoom of the map is changed
    circleDraw.radiusOnZoom(map, userLocationDot);
    circleDraw.animateOnZoom(map, userLocationPulse);
  },

  createGlyph: function(latitude, longitude, data, callback) {
    $.ajax.call(this, {
      url: this.state.serverAddress + '/api/createGlyph',
      method: 'POST',
      data: JSON.stringify({
        latitude: latitude || this.state.location.latitude,
        longitude: longitude || this.state.location.longitude,
        data: data || {
          name: 'test name'
        }
      }),
      contentType: "application/json",
      success: callback
    });
  },

  renderUserGlyph: function(location) {
    var map = this.state.map;

    var latitude = location.latitude;
    var longitude = location.longitude;


    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      animation: google.maps.Animation.BOUNCE,
      draggable: true,
      title: 'Give me a better name!'
    });

    var dataInput = new DynamicForm();

    var createGlyphButton = $('<div class="data-input"><div id="save-glyph-button"> Save glyph! </div></div>')[0];
    var clickWindow = new google.maps.InfoWindow({
      // We can put any DOM node here.
      content: createGlyphButton
    });

    marker.addListener('dragend', function(dragData) {
      latitude = dragData.latLng.H;
      longitude = dragData.latLng.L;
    });

    marker.addListener('click', function() {
      clickWindow.open(map, marker);
      dataInput.render('.data-input');
      $('#save-glyph-button').on('click', function() {
        this.createGlyph(latitude, longitude, dataInput.data());
      }.bind(this));
    }.bind(this));
  } 
});

module.exports = Map;
