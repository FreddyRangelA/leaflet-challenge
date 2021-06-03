
function createMap(earthquakes){

  var lightmap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Grayscale": lightmap,
    
  };
  var overlayMaps = {
    "Earthquakes": earthquakes,
      
  };


  var myMap = L.map("mapid", {
    center: [29.7604, -95.3698],
    zoom: 10,
    layers: [lightmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"), 
      magnitudeLevels = [0,-10,10,30,50,70];
  
      div.innerHTML += "<h3>Magnitude</h3>"
  
      /*for (var i = 0; i < magnitudeLevels.length; i++) {
          div.innerHTML +=
              '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
              magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
      }*/
      return div;
  }
  legend.addTo(myMap);

}




  
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(d=>markerSize(d));
function markerSize(response){
  console.log(response);
  console.log(response.features[0].properties.mag);
  var stations= response.features;
  console.log(stations)
  

  var earthquakeMarker=[]
  
  for (var i = 0; i < stations.length; i++){
    var circle= L.circleMarker([response.features[i].geometry.coordinates[1],response.features[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: chooseColor(response.features[i].properties.mag),
      fillColor: chooseColor(response.features[i].geometry.coordinates[2]),
      // Adjust radius
      radius: markerSize(response.features[i].properties.mag)
    }).bindPopup("<h1> Magnitude: " + response.features[i].properties.mag + "</h1> <hr> <h3>Depth in Km: " + response.features[i].geometry.coordinates[2]+ "</h3> <h3>Location: "+ response.features[i].properties.place+"</h3>");
    earthquakeMarker.push(circle)

    //console.log(response.features[i].geometry.coordinates[0])
    //console.log(response.features[i].geometry.coordinates[1])
    // setting the magnitiud of the EQ as the zise for the markers
    function markerSize(magnitude) {
      
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
    }
    //fuction that defines the color based on the mag 
    function chooseColor(depth) {
      
      switch (true) {
      case depth > 70:
          return "red";
      case depth >50:
          return "orange";
      case depth > 30:
          return "yellow";
      case depth > 10:
          return "lime";
      case depth > -10:
          return "green";
      default:
          return "#DAF7A6";
      }
      
      
    }

    
    
  }

  // Set Up Legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"), 
      magnitudeLevels = [0, 1, 2, 3, 4, 5];
  
      div.innerHTML += "<h3>Magnitude</h3>"
  
      for (var i = 0; i < magnitudeLevels.length; i++) {
          div.innerHTML +=
              '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
              magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
      }
      return div;
  };


  createMap(L.layerGroup(earthquakeMarker));
  
  
}

