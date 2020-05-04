function checked_subsector(a,b) {
  if(sectors[a].sub_sectors[b].show_on_map == "True") {
    sectors[a].sub_sectors[b].show_on_map = "False";
  } else if (sectors[a].sub_sectors[b].show_on_map == "False"){
    sectors[a].sub_sectors[b].show_on_map = "True"
  };
  filterPoints();
};


// Dynamically create sector sections
// first create subsectors_list
var subsectors_list = [];
for (var a in points.features){
  var c = points.features[a].properties.Subsectors_Joined.split(",");
  for (var b in c) {
    if (subsectors_list.includes(c[b].trim())) {
      continue
    } else {
      subsectors_list.push(c[b].trim());
    };
  };
};
for ( var a in sectors) {
  var sidebar = document.getElementById("sidebar-left");
  // Create Sector Section
  var section = document.createElement("BUTTON");
  section.type = "button";
  section.className = "collapsible";
  section.id = "sector_section";
  sidebar.appendChild(section);
  // Add Sector Icon
  var section_icon_p = document.createElement("P");
  section_icon_p.className = "section_left";
  section.appendChild(section_icon_p)
  var section_icon = document.createElement("I");
  section_icon.className = "mdi " + sectors[a].section_icon_1;
  section_icon_p.appendChild(section_icon);
  // Add Sector Title
  var section_title = document.createElement("P");
  section_title.innerHTML = sectors[a].section_title;
  section_title.className = "section_middle";
  section.appendChild(section_title);
  // Add plus icon
  var section_toggle = document.createElement("P");
  section_toggle.innerHTML = "+";
  section_toggle.className = "section_right";
  section_toggle.id = sectors[a].section_title;
  section.appendChild(section_toggle);
  // Add Sector Content DIV
  var section_content = document.createElement("DIV");
  section_content.className = "content";
  sidebar.appendChild(section_content);
  // Add Sector Description to Content div
  var section_descrip = document.createElement("DIV");
  section_descrip.className = "description";
  section_content.appendChild(section_descrip);
  section_descrip.innerHTML = sectors[a].section_description;

  // Dynamically add sub-sectors to sector content div
  for ( var b in sectors[a].sub_sectors) {
    // if the sub_sector is not in the points dataset
    if (subsectors_list.includes(sectors[a].sub_sectors[b].sub_sector_name)){
      var sub_sections = document.createElement("DIV");
      sub_sections.className = "switch_label";
      section_content.appendChild(sub_sections);
      var sub_sector = sectors[a].sub_sectors[b].sub_sector_name
      sub_sections.innerHTML = sub_sector;
      var input_element = document.createElement("INPUT");
      input_element.type = "checkbox";
      sub_sections.appendChild(input_element);
      input_element.setAttribute("onclick","checked_subsector(" + a + "," +b + ")");
      // var span_element = document.createElement("SPAN");
      // span_element.className = "slider round";
      // input_element.appendChild(span_element);
    } else {
      continue
    };
  };
};

// Add additional resources
var add_resources_bttn = document.createElement("BUTTON");
add_resources_bttn.type = "button";
add_resources_bttn.id = "non-collapsible";
add_resources_bttn.className = "collapsible";
sidebar.appendChild(add_resources_bttn);
var add_resources_title = document.createElement("I");
add_resources_title.innerHTML = "Contact Us";
add_resources_bttn.appendChild(add_resources_title);
var add_resources_content = document.createElement("DIV");
add_resources_content.className = "content";
add_resources_content.style = "display: block;";
add_resources_content.innerHTML = (
  "<ul style:'list-style-type: none;'>" +
  "<li><a href='http://planningchautauqua.com' class='add_resources'><span class='mdi mdi-web'></span></a>" +
  "<a href='https://www.google.com/maps/place/Chautauqua+County+Department+of+Planning/@42.3218653,-79.5806164,17z/data=!4m13!1m7!3m6!1s0x882d461215a00489:0x519024237137596a!2s2+S+Portage+St,+Westfield,+NY+14787!3b1!8m2!3d42.3218614!4d-79.5784277!3m4!1s0x882d47348b60ada9:0xc6f49db434674350!8m2!3d42.3218614!4d-79.5784277' class='add_resources'><span class='mdi mdi-map-marker'></span></a>" +
  "<a href='mailto:kellerm@co.chautauqua.ny.us' class='add_resources'><span class='mdi mdi-email'></span></a>" +
  "<a href='tel:7167534066' class='add_resources'><span class='mdi mdi-phone'></span></a>" +
  "<a href='https://github.com/bren96/CHQ-Food-System' class='add_resources'><span class='mdi mdi-github-circle'></span></a></li>" +
  "<li>Chautauqua County Division of Planning & Community Development</li>" +
  "<li>2 South Portage St., Westfield NY 14787</li>" +
  "<li>(716) 753 4066 </li>" +
  "<li>KellerM@co.chautauqua.ny.us</li>" +
  "<li>" +
  "<a href='https://chqgov.com/'><img src='img/Chautauqua_County_ny_seal.png' alt='Chautauqua County' style='width: 100px'></a>" +
  "<a href='http://planningchautauqua.com/planning/food-policy-council/'><img src='img/2---Food-policy-council-logo.gif' alt='Food Policy Council' style='width: 150px'></a>" +
  "</li>" +
  "</ul>"
);
sidebar.appendChild(add_resources_content);


// Collapsible section functions
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    // this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      if (this.lastChild.innerHTML == "-"){
        this.lastChild.innerHTML = "+";
      };
    } else {
      content.style.display = "block";
      if (this.lastChild.innerHTML == "+"){
        this.lastChild.innerHTML = "-";
      };
    };
  });
};

document.getElementById("collapsed_sidebar").style.display = "none";
function openNav() {
  document.getElementById("sidebar-left").style.width = "480px";
  document.getElementById("sidebar-left").style.display = "block";
  document.getElementById("mapid").style.left = "480px";
};

function closeNav() {
  document.getElementById("sidebar-left").style.display = "none";
  document.getElementById("collapsed_sidebar").style.display = "block";
  document.getElementById("mapid").style.left = "30px";
  map.invalidateSize();
};

function toggleLegend() {
  var legend_button = document.getElementById("layer_toggle");
  if (legend_button.className == "mdi mdi-layers-remove"){
    legend.remove(map);
    legend_button.className = "mdi mdi-layers-plus";
  } else {
    legend.addTo(map);
    legend_button.className = "mdi mdi-layers-remove";
  };
};
