// standard leaflet map setup
var map = L.map('mapid');
map.setView([42.350, -79.306], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


//geocoded addresses

function pointStyle(){
  return {
    color: 'blue',
    opacity: 0.5,
    weight: 2,
  };
};

function pointPopup(feature, layer){
  var content = "<p>Name: " + feature.properties.Trade_Name + "<br />Sector: " + feature.properties.Sector + "<br />Sub-Sector: " + feature.properties.Subsector + "</p>";
  layer.bindPopup(content);
};

var geoJSON = L.geoJSON(points, {
  style: pointStyle(),
  onEachFeature: pointPopup
}).addTo(map);


function filterPoints(x){
  map.removeLayer(geoJSON);
  geoJSON = L.geoJSON(points, {
    filter: function(feature) {
      if (feature.properties.Sector == x) {
        return true;
      } else {
        return false;
      }
    },
    style: pointStyle,
    onEachFeature: pointPopup
  }).addTo(map);
};
