# Current Status of Food System Map

## Current Issues
1. Filter System
2. Data Collection & Formatting
3. Content
4. User-friendliness


### Filter System
- The filtering of map points function and overall system needs to be worked out.
- Currently I have it set up to filter by sector, not sub-sector.
- From a user perspective, if they select Vegetables it is assumed they will see all points that have the Vegetable tag. In the same line of thinking, if they select Organic, it is assumed they will see all points that have the Organic tag. However, if they select Vegetables and Organic, should they see only points that have contain both tags or see all Vegetable points and all Organic points?

### Data Collection & Formatting
- Points may be in multiple sectors and will mostly likely have multiple sub-sectors.
- How should I parse the Google sheet form data into the Geocoded geojson data for the map.
- I need to write script to both automatically parse and geocode the data into a format that aligns with the filter system described previously


### Content
- I think it would be beneficial to include more content about Food Systems, Chautauqua County.
- We should create and add some more written and graphic content to the webmap

### User-friendliness
- We should add some more user-friendly features like a google-like search bar for addresses and places.
- I need to create symbols for the different map points
- Maybe a box that shows the names of the farms that are being filtered
