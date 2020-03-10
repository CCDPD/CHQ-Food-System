// standard leaflet map setup
var map = L.map('mapid');
map.setView([42.350, -79.306], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add Muni-Bounds layer from ArcGIS Online
var muni_bounds = L.esri.featureLayer({
  url: 'https://maps.chautauquacounty.com/server/rest/services/Public/PV_Boundary/MapServer/0',
  style: {
    color: "grey",
    weight: 2,
    fillColor: 'hsl(0, 0%, 75%)',
    fillOpacity: 0.1,
  }
}).addTo(map);
muni_bounds.bindTooltip("Test");


// Add ESRI Geocoder to Map
var searchControl = L.esri.Geocoding.geosearch().addTo(map);
var results = L.layerGroup().addTo(map);
searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

// Add Locator to map
L.control.locate({
  icon: "mdi mdi-home",
  strings: {
    title: "Show Current Location",
    popup: "Your Current Location",
  },
  showPopup: true,

}).addTo(map);

// Determine Layer Color and Icon, and add layer to map
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
    "<p id='popup-title'>" + feature.properties.Trade_Name + "</p>" +
    "<div id=popup_content>" +
    "<p id='popup-header'>Address: </p>" +
    "<a id='popup-address' href='https://www.google.com/maps/place/'" + feature.properties.Match_addr +"'>" + feature.properties.Match_addr + "</a>" +
    "<p id='popup-header'>Sector: </p>" +
    "<p id='popup-sector'> " + feature.properties.Sector + "</p>" +
    "<p id='popup-header'>Sub-Sectors: </p>" +
    "<p id='popup-subsector'>" + feature.properties.Subsector + "</p>" +
    "<p id='popup-header'>Certifications:</p>" +
    "<p><img src='./img/Organic Badge.svg' id='badges'>" +
    "<img src='./img/GAP-Logo-300x260.png' id='badges'>" +
    "<img src='./img/Chautauqua Grown Badge.svg' id='badges'>" +
    "<img src='./img/Food Safety Plan Badge.svg'id='badges'>" +
    "<p id='popup-header'>Payment Methods:</p>" +
    "<p><img src='./img/Cash Only Badge.svg' id='badges'>" +
    "<img src='./img/DoubleUpFoodBucks.png' id='badges'>" +
    "<img src='./img/Supplemental_Nutrition_Assistance_Program_logo.svg' id='badges'>" +
    "<img src='./img/wicnystate.jpg' id='badges'>" +
    "<img src='./img/shoptauqua-gift-card-image.jpg' id='badges' style='width: 100px'>"
  );
  var websiteHtml = "<p id='popup-header'> Website:</p><a id='popup-website' href='" + feature.properties.Website + "'>" + feature.properties.Website + "</a></div>";
  if(feature.properties.Website != null){
    content = content + websiteHtml
  } else {
    content = content + "</div>"
  };
  layer.bindPopup(content, {
    offset: new L.Point(0,-20),
    }
  );
};

//Add Dynamic Legend to Map
var legend = L.control({position: 'bottomright'});
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
