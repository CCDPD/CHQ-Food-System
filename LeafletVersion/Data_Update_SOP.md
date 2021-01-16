# CHQ Food System Map
# Data Update Standard Operating Procedure
#### Brendan Cullen | Planning Technician
#### 04/14/2020

## Clean up response spreadsheet

1. Go to the google response spreadsheet[https://docs.google.com/spreadsheets/d/1ZHxOjExkEygakuvDRaJNpSlTF2rKhfNUJNUy00KH8m4/edit#gid=660156035].

2. Go to Sheet1.

3. Concantenate address information by copying the "Full Address" Column's (Column G) current formula to the new rows.

4. Concatenate Subsectors by copy the "Subsectors_Joined" Column's (Column X) current formula to the news rows.

5. Go through the Social Media and Website columns and clean up any broken links. Also, any links that do not begin with "https://" will need to be edited as well to include "https://".

6. Go through each column and correct any invalid answers. (Ex: replace any "n/a", "none", "dont haves" with blanks, fix any mispellings or grammar issues, etc.)

## Geocode addresses

1. Select any new rows of the "Full Address" column and the neighboring "Lat" (Column H) and "Long" (Column I) columns.

2. Click "Geocode" at the top of the page

3. Click "Gecode Selected Cells (Address to Lattitude, Longitude)". It may take a few minutes, but the "Lat" and "Long" columns should populate themeselves.

## Download processed spreadsheet

1. Go to Sheet2. Sheet2 is a copy of Sheet1 with all the the private information removed.

2. Click "File->Download->Microsoft Excel (.xlsx)"

3. Rename downloaded file "Responses_" + current date (Example: "Responses_4_17_2020")

4. Save the file in C:\Users\cullenb\Documents\ArcGIS\Projects\Food_System_Map

## Process data in ArcGIS Pro

1. In the same folder, open up the Food_System_Map ArcGIS Pro document.

2. In the catalog pane, add Sheet2 to the map.

3. Right click on Sheet2 in the contents pane. Select "Display X,Y"

4. Navigate to the Food_System_Map.gdb, save as "Assets_" + current date.

5. Open the Feature to JSON tool. Set input as the new feature class created on the map, set output as "I:\PED\Everyone\Growing Food Connections\Food Policy Council\Food System Asset Mapping\CHQ-Food-System\data\current_assets.geojson". Set Formatted JSON and Output GeoJSON to True (Check the checkboxes).

## Configure JSON file

1. Open the new JSON file using Atom. In front of the curly braket type "var points = "

2. Save the file.

## Github commit

1. In atom, fetch from remote.

2. Stage changes and name the committ.

3. Click committ.

4. Push commit to remote.

# Validate Update

1. Open up the webpage, may need to wait a few minutes. Double check map is updated and that there are no issues.



