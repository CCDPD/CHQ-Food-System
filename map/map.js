// standard leaflet map setup
var map = L.map('mapid');
map.setView([42.350, -79.306], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add ESRI Geocoder to Map
var searchControl = L.esri.Geocoding.geosearch().addTo(map);
var results = L.layerGroup().addTo(map);
searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

function getIcon(d) {
  for (var a in sectors) {
      if (sectors[a].section_title == d ){
        return "mdi " + sectors[a].section_icon_1;
    };
  };
};

function getColor(a,b,c) {
  if (b == "home") {
    for (var d in sectors) {
      if (sectors[d].section_title == a.properties.Sector) {
        return sectors[d].sector_color
      };
    };
  } else {
    for (var d in sectors) {
      for (var e in sectors[d].sub_sectors) {
        if (sectors[d].sub_sectors[e].sub_sector_name == a.properties.Subsector) {
          return sectors[d].sub_sectors[e].color
        };
      };
    };
  };
};

function geojsonMarkerOptions(feature, type, filter_list) {
  var icon_choice = getIcon(feature.properties.Sector);
  var color_choice = getColor(feature, type, filter_list);
  return L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:" + color_choice + ";' class='marker-pin'></div><i class='" + icon_choice + "'></i>",
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
};

// Points Popup Function
function pointPopup(feature, layer){
  var content = (
    "<p id='popup-header'>" + feature.properties.Trade_Name + "</p>" +
    "<p><a id='popup-address' href='https://www.google.com/maps/place/" + feature.properties.Match_addr +"'>" + feature.properties.Match_addr + "</a></p>" +
    "<p id='popup-sector'>" + feature.properties.Sector + "</p>" +
    "<p id='popup-subsector'>" + feature.properties.Subsector + "</p>"
  );
  var websiteHtml = "<p><a id='popup-website' href='" + feature.properties.Website + "'>" + feature.properties.Website + "</a></p>";
  if(feature.properties.Website != null){
    content = content + websiteHtml
  };
  layer.bindPopup(content, {
    offset: new L.Point(0,-20),
    }
  );
};

//Add Dynamic Legend to Map
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [];
  var labels = [];
  var icons = [];
  for (var a in sectors) {
    for (var b in sectors[a].sub_sectors) {
      if (sectors[a].sub_sectors[b].show_on_map == 'True'){
        grades.push(sectors[a].sub_sectors[b].color);
        labels.push(sectors[a].sub_sectors[b].sub_sector_name);
        icons.push(sectors[a].section_icon_1);
      };
    };
  };
  if (grades.length == 0){
    for (var a in sectors) {
      grades.push(sectors[a].sector_color);
      labels.push(sectors[a].section_title);
      icons.push(sectors[a].section_icon_1);
    };
  };
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += '<i style="border-color:' + grades[i] + '" class="mdi ' + icons[i] + '"></i> ' + labels[i] + '<br/>';
  };
  return div;
};
legend.addTo(map);

//Add GEOJSON Point Layer to Map
var geoJSON = L.geoJSON(points, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: geojsonMarkerOptions(feature, "home")});},
  onEachFeature: pointPopup
}).addTo(map);


//FILTER GEOJSON SIMPLE VERSION
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
            return true
          } else {
          return false
          };
        };
      };
    },
    pointToLayer: function (feature, latlng) {
      if (filter_list.length == 0){
        var type = "home"
      } else {
        var type = "layer"
      };
      return L.marker(latlng, {
        icon: geojsonMarkerOptions(feature, type, filter_list)
      });
    },
    onEachFeature: pointPopup
  }).addTo(map);
  legend.remove(map);
  legend.addTo(map);
};
