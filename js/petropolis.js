

function bounce(t) {
  var s = 7.5625, p = 2.75, l;
  if (t < (1 / p)) {
    l = s * t * t;
  } else {
    if (t < (2 / p)) {
      t -= (1.5 / p);
      l = s * t * t + 0.75;
    } else {
      if (t < (2.5 / p)) {
        t -= (2.25 / p);
        l = s * t * t + 0.9375;
      } else {
        t -= (2.625 / p);
        l = s * t * t + 0.984375;
      }
    }
  }
  return l;
}


$(".nav a").on("click", function(){
   $(".nav").find(".active").removeClass("active");
   $(this).parent().addClass("active");
});


/*
legend.expanded = false;

legend.addEventListener("click", function(e){
  legend.expanded = !legend.expanded;
  if (legend.expanded){
    legend.style.width = "130px";
  } else {
    legend.style.width = "60px";
  }
  alert("EVENT!!");

});*/


function elastic(t) {
  return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

var mapExtent = ol.proj.transformExtent([-89.15,41.215,-86.4,42.37], 'EPSG:4326', 'EPSG:3857');
var NAExtent = ol.proj.transformExtent([-167.2764,5.4995,-52.2330,83.1621], 'EPSG:4326', 'EPSG:3857');
var refinery = ol.proj.fromLonLat([-87.4820, 41.66950]);
var toxicwaste = ol.proj.fromLonLat([-87.5439, 41.7049]);
var industrialzone = ol.proj.fromLonLat([-87.534, 41.68432]);
var joliet = ol.proj.fromLonLat([-88.194040, 41.490778]);
var petropolis = ol.proj.fromLonLat([-87.8, 41.750832]);
var bakken = ol.proj.fromLonLat([-102.5903, 47.6030]);
var northamerica = ol.proj.fromLonLat([-95.2128, 39.8]);
var tarsands = ol.proj.fromLonLat([-111.5663, 57.2391]);
var gulf = ol.proj.fromLonLat([-90.0891, 28.9149]);
var world = ol.proj.fromLonLat([-25, 23]);

var view = new ol.View({
  // the view's initial state
  center: industrialzone,
  zoom: 13,
  minResolution: 0.25
});

var bingMapsAerial = new ol.layer.Tile({
    source: new ol.source.BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial',}),
            minResolution: 0,
            maxResolution: 2
});

// first overlay (well, actually last section of the map....)

var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([-34.086, 40.387], 'EPSG:4326', 'EPSG:3857'))
});


var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    src: 'overlays/oil_rig1.png'
  }))
 });

 iconFeature.setStyle(iconStyle);

 var vectorSource = new ol.source.Vector({
  features: [iconFeature]
 });

 var oilrig = new ol.layer.Vector({
  source: vectorSource,
            minResolution: 8000
 });


// fifth overlay (Gulf)

var iconFeature5 = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([-90.0871611, 28.9206694], 'EPSG:4326', 'EPSG:3857'))
});


var iconStyle5 = new ol.style.Style({
  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    src: 'overlays/burnoff.jpg'
  }))
 });

 iconFeature5.setStyle(iconStyle5);

 var vectorSource5 = new ol.source.Vector({
  features: [iconFeature5]
 });

 var burnoff = new ol.layer.Vector({
  source: vectorSource5,
            minResolution: 1,
            maxResolution: 80
 });



var tiles = []; // renamed from layers 


tiles[0] = new ol.layer.Tile({
    opacity: 0.8,
    source: new ol.source.XYZ({
    url: "tiles2/{z}/{x}/{y}.png"}),
            maxResolution: 8000
});

tiles[1] = new ol.layer.Tile({
    source: new ol.source.Stamen({layer: 'watercolor'}),
            extent: mapExtent,
            minResolution: 0,
            maxResolution: 160
});

tiles[2] = new ol.layer.Tile({
    opacity: 0.8,
    source: new ol.source.XYZ({
    url: "tiles/{z}/{x}/{y}.png"}),
            extent: mapExtent,
            minResolution: 0,
            maxResolution: 160
});

tiles[3] = new ol.layer.Tile({
    source: new ol.source.Stamen({layer: 'toner-lite'})
});


// Icons ----------------------------------

var icons = [];

icons[2] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/MetroGenerators.geojson'}),
            maxResolution: 160,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/electricity.gif'
        }))
    })
 });

icons[3] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/CalumetChemicals2.geojson'}),
            minResolution: 0,
            maxResolution: 20,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/chemical-industry.gif'
        }))
    })
 });

icons[5] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/CalumetRailyards.geojson'}),
            minResolution: 0,
            maxResolution: 20,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/Railroad.gif'
        }))
    })
 });

icons[6] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/CalumetSteelMills.geojson'}),
            minResolution: 0,
            maxResolution: 20,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/steelmill.gif'
        }))
    })
 });

icons[7] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/OpenPiles.geojson'}),
            minResolution: 0,
            maxResolution: 20,
            updateWhileAnimating: true,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/piles.gif'
        }))
    })
 });


var energy = [];

energy[0] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/Bakken.geojson'}),
            minResolution: 1,
            maxResolution: 4000,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(134,82,63,0.4)',
            width: 0.4
          }),
          fill: new ol.style.Fill({
            color: 'rgba(134,82,63,0.4)'
          })
        })
        });

energy[1] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/CrudePipelines.geojson'}),
            minResolution: 1,
            maxResolution: 16000,
            updateWhileAnimating: true,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#c21313',
            width: 3.5
          })
        })
        });

energy[2] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/NArefineries.geojson'}),
            minResolution: 1,
            maxResolution: 8000,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/refinery-red.gif',

        }))
    })
 });

energy[4] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/airport.geojson'}),
            minResolution: 10,
            maxResolution: 160,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/airport.gif'
        }))
    })
 });

energy[5] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/Deepwater.geojson'}),
            minResolution: 600,
            maxResolution: 800,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'overlays/leak.png'
        }))
    })
});

energy[6] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/OilHubs.geojson'}),
            minResolution: 1,
            maxResolution: 16000,
            updateWhileAnimating: true,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/OilTerminal.gif'
        }))
    })
});

energy[9] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/GlobalRefineries3.geojson'}),
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/refinery-red-sm.gif'
        }))
    })
});

energy[10] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/NARR.geojson'}),
            minResolution: 1,
            maxResolution: 16000,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 1
          })
        })
        });

energy[11] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/TarSandsFootprints.geojson'}),
            minResolution: 0.25,
            maxResolution: 4000,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 0.6
          }),
          fill: new ol.style.Fill({
            color: 'rgba(244, 164, 96, 0.4)'
          })
        })
        });

energy[12] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'continent/GulfOilPipelines.geojson'}),
            minResolution: 40,
            maxResolution: 8000,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#db0000',
            width: 1.2
          })
        })
        });

//overlays -------------------------------

var overlay = [];

overlay[0] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/RefineryOverlay.geojson'}),
            minResolution: 0.25,
            maxResolution: 4,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'overlays/oil_rig3.png'
        }))
    })
 });

overlay[1] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/BombTrainOverlay.geojson'}),
            minResolution: 140,
            maxResolution: 160,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/1267-lg.gif'
        }))
    })
 });

//photosets ---------------------------------

var photoset = [];

photoset[0] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/Riverside.geojson'}),
            minResolution: 0,
            maxResolution: 20,
            updateWhileAnimating: true,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/turtle.gif'
        }))
    })
});

photoset[1] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/Burns_Harbor.geojson'}),
            minResolution: 0,
            maxResolution: 20,
            updateWhileAnimating: true,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/heron.gif'
        }))
    })
});

photoset[2] = new ol.layer.Vector({
          source: new ol.source.Vector({
			 format: new ol.format.GeoJSON(),
             url: 'lib/Redtail.geojson'}),
            minResolution: 0,
            maxResolution: 20,
            updateWhileAnimating: true,
        style: new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'icons/redtail.gif'
        }))
    })
});

//map created here -----------------------

var map = new ol.Map({
  controls: ol.control.defaults().extend([
    new ol.control.FullScreen()
 ]),

    layers: [ tiles[3], burnoff, energy[9], energy[10], energy[1], tiles[1], tiles[2], overlay[1], energy[0], energy[11], icons[2], overlay[0], photoset[0], icons[7], energy[12], energy[2], energy[6], burnoff, energy[5], bingMapsAerial, icons[3], icons[5], icons[6], photoset[1], photoset[2], oilrig ],

  // Improve user experience by loading tiles while animating. Will make
  // animations stutter on mobile or slow devices.
  loadTilesWhileAnimating: true,
  target: 'map',
  view: view
});

// animations -----------------------------------

var panToRefinery = document.getElementById('pan-to-refinery');
panToRefinery.addEventListener('click', function() {
  var pan = ol.animation.pan({
    duration: 1000,
    source: /** @type {ol.Coordinate} */ (view.getCenter())
  });
  map.beforeRender(pan);
  view.setCenter(refinery);
  view.setZoom(16);
}, false);

var panToIndustrialZone = document.getElementById('pan-to-industrialzone');
panToIndustrialZone.addEventListener('click', function() {
  var pan = ol.animation.pan({
    duration: 1000,
    source: /** @type {ol.Coordinate} */ (view.getCenter())
  });
  map.beforeRender(pan);
  view.setCenter(industrialzone);
  view.setZoom(13);
}, false);

var bounceToJoliet = document.getElementById('bounce-to-joliet');
bounceToJoliet.addEventListener('click', function() {
  var pan = ol.animation.pan({
    duration: 2000,
    easing: bounce,
    source: /** @type {ol.Coordinate} */ (view.getCenter())
  });
  map.beforeRender(pan);
  view.setCenter(joliet);
  view.setZoom(12)
}, false);

var spiralToPetropolis = document.getElementById('spiral-to-petropolis');
spiralToPetropolis.addEventListener('click', function() {
  var duration = 1000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 2 * view.getResolution(),
    start: start
  });
  var rotate = ol.animation.rotate({
    duration: duration,
    rotation: -6 * Math.PI,
    start: start
  });
  map.beforeRender(pan, bounce, rotate);
  view.setCenter(petropolis);
  view.setZoom(10);
}, false);

var flyToBakken = document.getElementById('fly-to-bakken');
flyToBakken.addEventListener('click', function() {
  var duration = 2000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 4 * view.getResolution(),
    start: start
  });
  map.beforeRender(pan, bounce);
  view.setCenter(bakken);
  view.setZoom(7);
}, false);


    var flyToTarSands = document.getElementById('fly-to-tarsands');
flyToTarSands.addEventListener('click', function() {
  var duration = 2000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 4 * view.getResolution(),
    start: start
  });
  map.beforeRender(pan, bounce);
  view.setCenter(tarsands);
  view.setZoom(17);
}, false);


var flyToNorthAmerica = document.getElementById('fly-to-northamerica');
flyToNorthAmerica.addEventListener('click', function() {
  var duration = 2000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 4 * view.getResolution(),
    start: start
  });
  map.beforeRender(pan, bounce);
  view.setCenter(northamerica);
  view.setZoom(5);
}, false);

var flyToGulf = document.getElementById('fly-to-gulf');
flyToGulf.addEventListener('click', function() {
  var duration = 2000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 4 * view.getResolution(),
    start: start
  });
  map.beforeRender(pan, bounce);
  view.setCenter(gulf);
  view.setZoom(8);
}, false);


var spiralToWorld = document.getElementById('spiral-to-world');
spiralToWorld.addEventListener('click', function() {
  var duration = 1000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: /** @type {ol.Coordinate} */ (view.getCenter()),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 2 * view.getResolution(),
    start: start
  });
  var rotate = ol.animation.rotate({
    duration: duration,
    rotation: -4 * Math.PI,
    start: start
  });
  map.beforeRender(pan, bounce, rotate);
  view.setCenter(world);
  view.setZoom(3);
}, false);



// Create a popup overlay --

var popup = new ol.Overlay.Popup();
map.addOverlay(popup);


// Event handler for the map "singleclick" event --

map.on('singleclick', function(evt) {
popup.hide();
popup.setOffset([0, 0]);

// Attempt to find a feature in one of the visible vector layers --

var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
});

    if (feature) {

        var coord = feature.getGeometry().getCoordinates();
        var props = feature.getProperties();
        var info = "<h4>" + props.Name + "</h4>";
            info += props.Image;
            info += props.website + '<br>';
            info += props.EPA + '<br>';
            info += props.Notes;



// Offset the popup so it points at the middle of the marker not the tip

        popup.setOffset([10, -15]);
        popup.show(coord, info);
    }
});


//Add Spyglass --

var radius = 320;
$(document).keydown(function(evt) {
  if (evt.which === 38) {
    radius = Math.min(radius + 5, 800);
    map.render();
  } else if (evt.which === 40) {
    radius = Math.max(radius - 5, 0);
    map.render();
  }
});

// Get the pixel position with every move --

var mousePosition = null;
$(map.getViewport()).on('mousemove', function(evt) {
  mousePosition = map.getEventPixel(evt.originalEvent);
  map.render();
}).on('mouseout', function() {
  mousePosition = null;
  map.render();
});



// Before rendering the layer, do some clipping --

bingMapsAerial.on('precompose', function(event) {
  var ctx = event.context;
  var pixelRatio = event.frameState.pixelRatio;
  ctx.save();
  ctx.beginPath();
  if (mousePosition) {

// Only show a circle around the mouse --

    ctx.arc(mousePosition[0] * pixelRatio, mousePosition[1] * pixelRatio,
        radius * pixelRatio, 0, 2 * Math.PI);
    ctx.lineWidth = 5 * pixelRatio;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  }
  ctx.clip();
});



// After rendering the layer, restore the canvas context --

bingMapsAerial.on('postcompose', function(event) {
  var ctx = event.context;
  ctx.restore();
});

var target = map.getTarget();
        var jTarget = typeof target === "string" ? $("#" + target) : $(target);
        // change mouse cursor when over marker
        $(map.getViewport()).on('mousemove', function (e) {
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                return true;
            });
            if (hit) {
                jTarget.css("cursor", "pointer");
            } else {
                jTarget.css("cursor", "");
            }
        });

var mapStates = [];

mapStates.push({
  name: "Refinery",
  transitionAction: function() {
    var pan = ol.animation.pan({
      duration: 1000,
      source: /** @type {ol.Coordinate} */ (view.getCenter())
    });
    map.beforeRender(pan);
    view.setCenter(ol.proj.fromLonLat([-87.4820, 41.66950]));
    view.setZoom(16);
  },
  layers: [ burnoff, energy[9], energy[10], energy[1], tiles[1], tiles[2], overlay[1], energy[0], energy[11], icons[2], overlay[0], photoset[0], icons[7], energy[12], energy[2], energy[6], burnoff, energy[5], bingMapsAerial, icons[3], icons[5], icons[6], photoset[1], photoset[2], oilrig ],
});

/** Calumet Basin State **/
mapStates.push({
  name: "Calumet Basin",
  transitionAction: function() {
    var pan = ol.animation.pan({
      duration: 1000,
      source: /** @type {ol.Coordinate} */ (view.getCenter())
    });
    map.beforeRender(pan);
    view.setCenter(industrialzone);
    view.setZoom(13);
  },
  layers: [ burnoff, energy[9], energy[10], energy[1], tiles[1], tiles[2], overlay[1], energy[0], energy[11], icons[2], overlay[0], photoset[0], icons[7], energy[12], energy[2], energy[6], burnoff, energy[5], bingMapsAerial, icons[3], icons[5], icons[6], photoset[1], photoset[2], oilrig ],
});



var legendIcons = [];
var prefix = "icons/";
legendIcons.push({iconPath: prefix + "refinery-red.gif", label: "refineries"});
legendIcons.push({iconPath: prefix + "OilTerminal.gif", label: "oil hubs"});
legendIcons.push({iconPath: prefix + "Railroad.gif", label: "rail yards"});
legendIcons.push({iconPath: prefix + "piles.gif", label: "stockpiles"});
legendIcons.push({iconPath: prefix + "steelmill.gif", label: "steel mills"});
legendIcons.push({iconPath: prefix + "chemical-industry.gif", label: "chemicals"});
legendIcons.push({iconPath: prefix + "star.gif", label: "gas stations"});
legendIcons.push({iconPath: prefix + "airport.gif", label: "airports"});
legendIcons.push({iconPath: prefix + "electricity.gif", label: "power plants"});

var legend = document.getElementById("legend-basic");
legendIcons.map(function(icon){
  var div = document.createElement("div");
  div.setAttribute("class", "checkbox legend-img-container");
  var label = document.createElement("label");
  label.setAttribute("style", "btn active");
  var input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  label.appendChild(input);

  var img = document.createElement("img");
  img.setAttribute("src", icon.iconPath);
  img.setAttribute("class", "legend-img");
  label.appendChild(img);

   var labelText = document.createElement("div");
  labelText.setAttribute("class", "legend-text");

  labelText.innerHTML = icon.label;
  label.appendChild(labelText);

  div.appendChild(label);



  legend.appendChild(div);

});

$(document).ready(function(){
    $("input[type='checkbox']").change(function() {
      if(this.checked) {
          alert("checked: " + this.checked);
      }
    });
});

// init map nav bar states

mapStates.map(function (mapState){

});

/** Copied from openlayers template: https://jumpinjackie.github.io/bootstrap-viewer-template/2-column/index.html#
**/

function applyMargins() {
    var leftToggler = $(".mini-submenu-left");
    if (leftToggler.is(":visible")) {
      $("#map .ol-zoom")
        .css("margin-left", 0)
        .removeClass("zoom-top-opened-sidebar")
        .addClass("zoom-top-collapsed");
    } else {
      $("#map .ol-zoom")
        .css("margin-left", $(".sidebar-left").width())
        .removeClass("zoom-top-opened-sidebar")
        .removeClass("zoom-top-collapsed");
    }
  }

  function isConstrained() {
    return $(".sidebar").width() == $(window).width();
  }

  function applyInitialUIState() {
    if (isConstrained()) {
      $(".sidebar-left .sidebar-body").fadeOut('slide');
      $('.mini-submenu-left').fadeIn();
    }
  }

  $(function(){
    $('.sidebar-left .slide-submenu').on('click',function() {
      var thisEl = $(this);
      thisEl.closest('.sidebar-body').fadeOut('slide',function(){
        $('.mini-submenu-left').fadeIn();
        applyMargins();
      });
    });

    $('.mini-submenu-left').on('click',function() {
      var thisEl = $(this);
      $('.sidebar-left .sidebar-body').toggle('slide');
      thisEl.hide();
      applyMargins();
    });

    $(window).on("resize", applyMargins);

    var map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      })
    });
    applyInitialUIState();
    applyMargins();
  });