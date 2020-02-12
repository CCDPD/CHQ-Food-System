for ( var a in sectors) {
  var sidebar = document.getElementById("sidebar-left");
  var section = document.createElement("BUTTON");
  section.type = "button";
  section.className = "collapsible";
  section.idName = sectors[a].sector_name;
  section.innerHTML = sectors[a].section_title;
  sidebar.appendChild(section);
  var section_content = document.createElement("DIV");
  section_content.className = "content";
  sidebar.appendChild(section_content);

  for ( var b in sectors[a].sub_sectors) {
    var sub_sections = document.createElement("DIV");
    sub_sections.className = "switch_label";
    section_content.appendChild(sub_sections);
    sub_sections.innerHTML = sectors[a].sub_sectors[b].sub_sector_name;
    var input_element = document.createElement("INPUT");
    input_element.type = "checkbox";
    sub_sections.appendChild(input_element);
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
}
