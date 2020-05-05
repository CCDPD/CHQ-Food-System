// standard leaflet map setup
var map = L.map('mapid');
map.setView([42.350, -79.306], 10);
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add Muni-Bounds layer from ArcGIS Online
var muni_bounds = L.geoJSON(muniBounds, {
  style: {
    color: "grey",
    weight: 2,
    fillColor: 'hsl(0, 0%, 75%)',
    fillOpacity: 0.1,
  }
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
function getIcon(feature, filter_list) {
  if (filter_list != null) {
    var check_list = [];
    var subsectors = getSubSectors(feature);
    for (var b in filter_list){
      for (var c in subsectors){
        if (subsectors[c].trim() == filter_list[b]) {
          check_list.push("check")
        };
      };
    };
    // console.log(filter_list, check_list);
    if (check_list.length == filter_list.length && filter_list.length>1) {
      return "mdi mdi-star"
    } else {
      for (var a in sectors) {
        if (sectors[a].section_title == feature.properties.Primary_Food_System_Category) {
          return "mdi " + sectors[a].section_icon_1;
        };
      };
    };
  } else {
    for (var a in sectors) {
      if (sectors[a].section_title == feature.properties.Primary_Food_System_Category) {
        return "mdi " + sectors[a].section_icon_1;
      };
    };
  };
};
function getColor(a,b,c) {
  for (var d in sectors) {
    if (sectors[d].section_title == a.properties.Primary_Food_System_Category) {
      return sectors[d].sector_color
    };
  };
};
function getDescrip(feature) {
  var descrip = feature.properties.If_you_would_like_to_provide_a_;
  var final_list = ["<p id='popup-header'>Description: </p>"];
  if (descrip != null && descrip != "0" && descrip != 0) {
    final_list.push("<p>" + descrip + "</p>")
    var final_html = final_list.join("");
    return final_html;
  } else {
    return "";
  };
};
function getAddress(feature) {
  address = feature.properties.Full_Address;
  final_list = ["<p id='popup-header'>Address:</p>"];
  final_list.push("<a id='popup-address' target='_blank' href='https://www.google.com/maps/place/" + address + "'>" + address + "</a>");
  return final_list.join("");
};
function getPhone(feature){
  phone = feature.properties.Organization_Phone_Number;
  final_list = ["<p id='popup-header'>Phone:</p>"];
  if (phone != null && phone != "0" && phone != 0) {
    final_list.push("<p>" + phone + "</p>");
    return final_list.join("");
  } else {
    return "";
  };
};

function getSocial(feature){
  social = feature.properties.Organization_Social_Media;
  final_list = ["<p id='popup-header'>Social Media:</p>"]
  if (social != null && social != 0 && social != "0"){
    final_list.push("<a id='popup-website' target='_blank' href='" + social + "'>" + social + "</a>")
    return final_list.join("")
  } else {
    return ""
  };
};
function getWebsite(feature) {
  var website = feature.properties.Organization_Website;
  var final_list = ["<p id='popup-header'> Website:</p>"];
  if (website != null && website != 0 && website != "0") {
    final_list.push("<a id='popup-website' target='_blank' href='" + website + "'>" + website + "</a>")
    var final_html = final_list.join("");
    return final_html;
  } else {
    return "";
  };
};
function getSubSectors(feature) {
  var subsectors_list = feature.properties.Subsectors_Joined.split(',');
  var final_list = [];
  for (var a in subsectors_list){
    if (subsectors_list[a] == " ") {
      delete subsectors_list[a]
    } else if (subsectors_list[a] == "") {
      delete subsectors_list[a]
    } else {
      final_list.push(subsectors_list[a])
    };
  };
  return final_list;
};
function getCerts(feature) {
  var point_cert = feature.properties.Please_indicate_any_certificati;
  if (point_cert != "Not applicable" && point_cert != "" && point_cert != 0 && point_cert !="0"  && point_cert != null){
  certs_list = point_cert.split(',');
    final_list = ["<p id='popup-header'>Certifications:</p>"];
    check_list = [];
    for (var a in certs_list){
      for (var b in certifications_badges){
        if (certs_list[a].trim() == certifications_badges[b].cert_name){
          final_list.push(certifications_badges[b].cert_html);
          check_list.push(certifications_badges[b].cert_name);
        };
      };
      if (check_list.includes(certs_list[a].trim())){} else {
        final_list.push("<p>" + certs_list[a].trim() + "</p>");
      };
    };
  var final_html = final_list.join("");
  return final_html;
  } else {
    return "<p></p>"
  };
};
function getPayments(feature) {
  var point_pay = feature.properties.Please_indicate_what_payment_me;
  if (point_pay != "" && point_pay != null && point_pay != 0 && point_pay != "0"){
    final_list = ["<p id='popup-header'>Payment Methods:</p>"];
    final_list.push("<p>" + point_pay + "</p>")
    return final_list.join("");
  } else {
    return "";
  };
};
function geojsonMarkerOptions(feature, type, filter_list) {
  var icon_choice = getIcon(feature, filter_list);
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
    "<p id='popup-title'>" + feature.properties.Organization_Name + "</p>" +
    "<div id=popup_content>" +
    getDescrip(feature) +
    getAddress(feature) +
    getPhone(feature) +
    getWebsite(feature) +
    getSocial(feature) +
    "<p id='popup-header'>Sector: </p>" +
    "<p id='popup-sector'> " + feature.properties.Primary_Food_System_Category + "</p>" +
    "<p id='popup-header'>Sub-Sectors: </p>" +
    "<p id='popup-subsector'>" + getSubSectors(feature) + "</p>" +
    getCerts(feature) +
    getPayments(feature) +
    "</div>"
  );
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
      grades.push(sectors[a].sector_color);
      labels.push(sectors[a].section_title);
      icons.push(sectors[a].section_icon_1);
  };
  for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="border-color:' + grades[i] + '" class="mdi ' + icons[i] + '"></i> ' + labels[i] + '<br/>';
  };
  return div;
};
legend.addTo(map);

//Selection Legend
var selection = L.control({position: 'bottomleft'});
selection.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [];
  var labels = [];
  var icons = [];
  for (var a in sectors) {
    for (var b in sectors[a].sub_sectors) {
      if (sectors[a].sub_sectors[b].show_on_map == 'True'){
        // grades.push(sectors[a].sub_sectors[b].color);
        labels.push(sectors[a].sub_sectors[b].sub_sector_name);
        // icons.push(sectors[a].section_icon_1);
      };
    };
  };
  if (labels.length > 1){
    div.innerHTML += '<i style="border-color:White" class="mdi mdi-star"></i>Selection Match<br/>';
  };
  div.innerHTML += '<h4>Active Selection</h4>';
  for (var i = 0; i < labels.length; i++) {
    div.innerHTML += labels[i] + '<br/>';
  };
  return div;
};

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
        var c = getSubSectors(feature);
        for (var d in c) {
          if (filter_list.includes(c[d])) {
            return true;
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
  selection.remove(map);
  if (filter_list.length != 0){
    selection.addTo(map);
  };
};
