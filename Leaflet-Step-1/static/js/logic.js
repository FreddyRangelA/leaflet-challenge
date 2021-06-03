
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

}




  
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(d=>markerSize(d));
function markerSize(response){
  console.log(response);
  console.log(response.features[0].properties.mag);
  var stations= response.features;
  console.log(stations)
  

  var earthquakeMarker=[]
  
  for (var i = 0; i < stations.length; i++){
    var circle= L.circleMarker([response.features[i].geometry.coordinates[0],response.features[i].geometry.coordinates[1]], {
      fillOpacity: 0.75,
      color: chooseColor(response.features[i].properties.mag),
      fillColor: chooseColor(response.features[i].geometry.coordinates[2]),
      // Adjust radius
      radius: markerSize(response.features[i].properties.mag)
    }).bindPopup("<h1> Magnitud: " + response.features[i].properties.mag + "</h1> <hr> <h3>Depth in Km: " + response.features[i].geometry.coordinates[2]+ "</h3> <h3>Location: "+ response.features[i].properties.place+"</h3>");
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

/*
  // setting the magnitiud of the EQ as the zise for the markers
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  //define attriviutes for the marker
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "black",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  //fuction that defines the color based on the mag 
  function chooseColor(magnitude) {
    switch (true) {
    case magnitude > 5:
        return "#581845";
    case magnitude > 4:
        return "#900C3F";
    case magnitude > 3:
        return "#C70039";
    case magnitude > 2:
        return "#FF5733";
    case magnitude > 1:
        return "#FFC300";
    default:
        return "#DAF7A6";
    }
  }

    // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
    L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: styleInfo,
      // Function to Run Once For Each feature in the features Array
      // Give Each feature a Popup Describing the Place & Time of the Earthquake
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h4>Location: " + feature.properties.place + 
          "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
          "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
      }
    // Add earthquakeData to earthquakes LayerGroups 
  }).addTo(earthquakes);
      // Add earthquakes Layer to the Map
  earthquakes.addTo(myMap);

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
  // Add Legend to the Map
  legend.addTo(myMap);*/
