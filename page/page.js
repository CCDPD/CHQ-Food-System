function checked_subsector(a,b) {
  if(sectors[a].sub_sectors[b].show_on_map == "True") {
    sectors[a].sub_sectors[b].show_on_map = "False";
  } else if (sectors[a].sub_sectors[b].show_on_map == "False"){
    sectors[a].sub_sectors[b].show_on_map = "True"
  };
  filterPoints();
};


for ( var a in sectors) {
  var sidebar = document.getElementById("sidebar-left");
  // Create Sector Section
  var section = document.createElement("BUTTON");
  section.type = "button";
  section.className = "collapsible";
  section.idName = sectors[a].sector_name;
  sidebar.appendChild(section);
  // Add Sector Icon
  var section_icon = document.createElement("I");
  section_icon.className = "mdi " + sectors[a].section_icon_1;
  section.appendChild(section_icon);
  // Add Sector Title
  var section_title = document.createElement("P");
  section_icon.innerHTML = sectors[a].section_title;
  section.appendChild(section_title)
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
  };
};

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    // this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
};
