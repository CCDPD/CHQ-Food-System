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



function filterPoints(){
  map.removeLayer(geoJSON);
  var filter_list = [];
  for ( var a in sectors ){
    for ( var b in sectors[a].sub_sectors ){
      if(sectors[a].sub_sectors[b].show_on_map == "True") {
        filter_list.push(sectors[a].sub_sectors[b].sub_sector_name);
      };
    };
  };
  geoJSON = L.geoJSON(points, {
    filter: function(feature) {
      if (filter_list.length == 0){
        return true;
      } else {
        var true_list = [];
        var c = feature.properties.Subsector.split(',');
        for (var d in c) {
          if (filter_list.includes(c[d])) {
            true_list.push(c);
          }
        };
        if (true_list.length == filter_list.length) {
          return true
        } else {
          return false
        }
      }
    },
    style: pointStyle,
    onEachFeature: pointPopup
  }).addTo(map);
};
