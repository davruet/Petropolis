

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
var joliet = ol.proj.fromLonLat([-88.184191, 41.415955]);
var citgo = ol.proj.fromLonLat([-88.054394, 41.645987]);
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
tiles[0].name = "tiles2";

tiles[1] = new ol.layer.Tile({
	source: new ol.source.Stamen({layer: 'watercolor'}),
	extent: mapExtent,
	minResolution: 0,
	maxResolution: 160
});

tiles[1].name = "watercolor";

tiles[2] = new ol.layer.Tile({
	opacity: 0.8,
	source: new ol.source.XYZ({
		url: "tiles/{z}/{x}/{y}.png"}),
	extent: mapExtent,
	minResolution: 0,
	maxResolution: 160
});
tiles[2].name = "tiles";

tiles[3] = new ol.layer.Tile({
	source: new ol.source.Stamen({layer: 'toner-lite'})
});

tiles[3].name="toner-lite";


// Icons ----------------------------------

// Note - Refactored a number of duplicate operations into this reusable function
function makeGeoJSONPointVectorLayer(url, iconPath, label, minResolution, maxResolution){
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: url}),
		minResolution: minResolution,
		maxResolution: maxResolution,
		style: new ol.style.Style({
			image: new ol.style.Icon({
				src: iconPath
			})
		})
	});
	layer.label = label;
	layer.legendImgSrc = iconPath;
	return layer;
}

function makeGeoJSONFillVectorLayer(url, label, minResolution, maxResolution, strokeColor, width, fillColor ){
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: url}),
		minResolution: minResolution,
		maxResolution: maxResolution,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: width
			}),
			fill: new ol.style.Fill({
				color: fillColor
			})
		})
	});
	layer.label = label;
	return layer;
}

var icons = [];

icons[2] = makeGeoJSONPointVectorLayer('lib/MetroGenerators.geojson', 'icons/electricity.gif',"power plants", 0, 160);
icons[3] = makeGeoJSONPointVectorLayer('lib/CalumetChemicals2.geojson', 'icons/chemical-industry.gif', "chemicals", 0, 20);
icons[5] = makeGeoJSONPointVectorLayer('lib/CalumetRailyards.geojson','icons/Railroad.gif',"rail yards", 0, 20);
icons[6] = makeGeoJSONPointVectorLayer('lib/CalumetSteelMills.geojson','icons/steelmill.gif','steel mills', 0, 20);
icons[7] = makeGeoJSONPointVectorLayer('lib/OpenPiles.geojson','icons/piles.gif','stockpiles',0, 20);
icons[8] = makeGeoJSONPointVectorLayer('lib/TRI.geojson','icons/TRI.gif','toxics release',0, 80);

/** Example of how to specify a layer - including properties 'label' and 'legendImgSrc':
*/

icons[9] = new ol.layer.Vector({
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: 'lib/Fortune1000Chicagoland.geojson'}),
	minResolution: 0,
	maxResolution: 80,
	updateWhileAnimating: true,
	style: new ol.style.Style({
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({color: '#216C2A'})
		})
	})
});

icons[9].label = "Fortune 1000"
icons[9].legendImgSrc = 'icons/Fortunedot.gif';

icons[10] = makeGeoJSONPointVectorLayer('lib/XXX.geojson','icons/airport.gif','airports',79, 80);

var energy = [];

energy[0] = makeGeoJSONFillVectorLayer('continent/Bakken.geojson', "bakken", 1, 4000, 'rgba(134,82,63,0.4)', 0.4, 'rgba(134,82,63,0.4)');

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

energy[1].label = "pipelines"
energy[1].legendImgSrc = 'icons/Pipelines.gif';

energy[2] = makeGeoJSONPointVectorLayer('continent/NArefineries.geojson', 'icons/refinery-red.gif', 'refineries', 1, 8000);

energy[3] = new ol.layer.Vector({
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: 'continent/NAcokers.geojson'}),
	minResolution: 0,
	maxResolution: 8000,
	style: new ol.style.Style({
		image: new ol.style.Icon(({
			src: 'icons/Coker6.gif',
			offset: [0, -3],

		}))
	})
});
energy[3].label = "coking unit"
energy[3].legendImgSrc = 'icons/Coker5.gif';

energy[5] = makeGeoJSONPointVectorLayer('continent/Deepwater.geojson', 'overlays/leak.png', 'BP-deepwater', 600, 800);

// FIXME!!! Used to set updateWhileAnimating: true  - this is now false. Question - is this necessary?
energy[6] = makeGeoJSONPointVectorLayer('continent/OilHubs.geojson', 'icons/OilTerminal.gif', 'oil hubs', 1, 16000);

energy[9] = makeGeoJSONPointVectorLayer('continent/GlobalRefineries3.geojson', 'icons/refinery-red-sm.gif', 'global refineries', 0, 1300000);

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

energy[11].label = "tar sands lease"
energy[11].legendImgSrc = 'icons/tarsands.gif';

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

energy[13] = makeGeoJSONPointVectorLayer('continent/XXX.geojson', 'icons/NARR.gif', 'railroads', 1, 8000);
energy[14] = makeGeoJSONPointVectorLayer('continent/XXX.geojson', 'icons/BlastZone.gif', 'bomb trains', 1, 8000);
energy[15] = makeGeoJSONPointVectorLayer('continent/XXX.geojson', 'icons/gas.gif', 'gas stations', 1, 8000);

var superfund = makeGeoJSONFillVectorLayer('lib/Superfund.geojson', 'superfund', 0.25, 40, 'rgba(134, 40, 26, 0.7)', 3, 'rgba(134, 40, 26, 0.3)');
superfund.legendImgSrc = 'icons/superfund.gif';

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

//contributors ---------------------------------

var contributors = [];

contributors[1] = makeGeoJSONPointVectorLayer('lib/Riverside.geojson', 'icons/turtle.gif', 'Claire Pentecost', 0, 40);
contributors[2] = makeGeoJSONPointVectorLayer('lib/Burns_Harbor.geojson', 'icons/heron.gif', 'Brian Holmes', 0, 40);
contributors[3] = makeGeoJSONPointVectorLayer('lib/Redtail.geojson', 'icons/redtail.gif', 'Terry Evans', 0, 40);

//map created here -----------------------

var map = new ol.Map({
	controls: ol.control.defaults().extend([
		new ol.control.FullScreen()
		]),

	layers: [ tiles[3], energy[9], energy[10], energy[1], tiles[1], tiles[2], overlay[1], energy[0], energy[11], icons[8], icons[2], overlay[0], contributors[1], icons[7], energy[12], energy[2], energy[6], energy[3], energy[5], bingMapsAerial, icons[3], icons[5], icons[6], icons[9], contributors[2], contributors[3], oilrig ],

  // Improve user experience by loading tiles while animating. Will make
  // animations stutter on mobile or slow devices.
  loadTilesWhileAnimating: true,
  target: 'map',
  view: view
});


// Create a popup overlay --
var popup = new ol.Overlay.Popup();
map.addOverlay(popup);


// Event handler for the map "singleclick" event --
map.on('singleclick', function(evt) {
	popup.hide();
	popup.setOffset([0, 0]);


	function makeGallery(options){
		var maxImages = 4; // Default of 10 for max images.
		if (options.maxImages) maxImages = options.maxImages;
		options = options || {};
		var container = document.createElement("div");
		container.setAttribute("id", "lightgallery");
		container.setAttribute("class", "petropolis-gallery row");
		var images = options.images;

		var i = 0;

		var galleryData = images.map(function (image){
			var a = document.createElement("a");
			a.setAttribute("class", "col-sm-6");
			
			var img = document.createElement("img");
			img.setAttribute("class","img-responsive");
			a.setAttribute("href", image.src);
		 
		    img.setAttribute("src", image.thumb);
		    a.appendChild(img);

		    /*var captionID = "caption" + i++;
			a.setAttribute("data-sub-html", "#" + captionID);
			var caption = document.createElement("div");
			caption.setAttribute("id", captionID);
			caption.innerHTML = "Some sample caption.";
			caption.setAttribute("style", "display:none");*/

			//container.appendChild(caption);
			if (img.caption) a.setAttribute("data-sub-html", img.caption);

			if (i++ >= maxImages){
				a.setAttribute("style", "display:none");
			}
		    container.appendChild(a);

		    //return [caption,a];
		});
/*
		galleryData.map(function(item){
			container.appendChild(item[0]);
		});
		galleryData.map(function(item){
			container.appendChild(item[1]);
		});*/



		return container;

	}

// Attempt to find a feature in one of the visible vector layers --

var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
	return feature;
});

if (feature) {

	var coord = feature.getGeometry().getCoordinates();
	var props = feature.getProperties();
	var info;

	if (props.images){
		var gallery = makeGallery(props);
		$(gallery).lightGallery({
			thumbnail: true
		});
		var container = document.createElement("div");
		var h4 = document.createElement("h4");
		h4.innerHTML = props.Name;
		container.appendChild(h4);
		container.appendChild(gallery);

		info = container;

	} else {
		info = "<h4>" + props.Name + "</h4>";
		info += props.Image;
		info += props.website + '<br>';
		info += props.EPA + '<br>';
		info += props.Notes;
	}

	// Offset the popup so it points at the middle of the marker not the tip

	popup.setOffset([10, -15]);
	popup.show(coord, info);

	$(document).delegate('*[data-toggle="lightbox"]:not([data-gallery="navigateTo"])', 'click', function(event) {
		event.preventDefault();
		return $(this).ekkoLightbox({
			onShown: function() {
				if (window.console) {
					return console.log('Checking our the events huh?');
				}
			},
			onNavigate: function(direction, itemIndex) {
				if (window.console) {
					return console.log('Navigating '+direction+'. Current item: '+itemIndex);
				}
			}
		});
	});

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



/*****************
    MAP STATES
    ******************/
    var mapStates = [];


// default layers -- individual map states may use a different set of layers.
var defaultLayers = [energy[9],
energy[10],
energy[1], 
tiles[1], 
tiles[2], 
overlay[1], 
energy[0], 
energy[11], 
icons[2], 
overlay[0], 
icons[7], 
energy[12], 
energy[2],
energy[6],
energy[3], 
energy[5], 
bingMapsAerial, 
icons[3], 
icons[5], 
icons[6], 
icons[9], 
oilrig ];

// initialize this to the map state that is the starting point.
var calumetState = {
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
	layers: [ energy[10], tiles[1], tiles[2], overlay[1], energy[0], energy[6], energy[2], energy[3], superfund, icons[8], icons[9], overlay[0], icons[7], energy[12], bingMapsAerial, icons[3], icons[6], icons[5], oilrig, icons[2] ],
	extraLayers: [ contributors[1], contributors[2], contributors[3] ]
}

mapStates.push({
	name: "BP",
	transitionAction: function() {
		var pan = ol.animation.pan({
			duration: 1000,
			source: /** @type {ol.Coordinate} */ (view.getCenter())
		});
		map.beforeRender(pan);
		view.setCenter(refinery);
		view.setZoom(16);
	},
	layers: [ energy[10], tiles[1], tiles[2], overlay[1], energy[0], energy[6], icons[2], energy[2], energy[3], superfund, icons[8], icons[9], overlay[0], icons[7], energy[12], bingMapsAerial, icons[3], icons[6], icons[5], oilrig ],
	extraLayers: [ contributors[1], contributors[2], contributors[3] ]
});

mapStates.push({
	name: "Exxon",
	transitionAction: function() {
		var pan = ol.animation.pan({
			duration: 2000,
			easing: bounce,
			source: /** @type {ol.Coordinate} */ (view.getCenter())
		});
		map.beforeRender(pan);
		view.setCenter(joliet);
		view.setZoom(17)
	},
	layers: [ energy[10], tiles[1], tiles[2], overlay[1], energy[0], energy[6], icons[2], energy[2], energy[3], superfund, icons[8], icons[9], overlay[0], icons[7], energy[12], bingMapsAerial, icons[3], icons[6], icons[5], oilrig ],
	extraLayers: [ contributors[1], contributors[2], contributors[3] ]
});

mapStates.push({
	name: "Citgo",
	transitionAction: function() {
		var pan = ol.animation.pan({
			duration: 2000,
			easing: bounce,
			source: /** @type {ol.Coordinate} */ (view.getCenter())
		});
		map.beforeRender(pan);
		view.setCenter(citgo);
		view.setZoom(17)
	},
	layers: [ energy[10], tiles[1], tiles[2], overlay[1], energy[0], energy[6], icons[2], energy[2], energy[3], superfund, icons[8], icons[9], overlay[0], icons[7], energy[12], bingMapsAerial, icons[3], icons[6], icons[5], oilrig ],
	extraLayers: [ contributors[1], contributors[2], contributors[3] ]
});

/** Calumet Basin State **/
mapStates.push(calumetState);
setActiveMapState(calumetState);

mapStates.push({
	name: "Chicago Metro",
	transitionAction: function() {
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
	},
	layers: [ energy[6], icons[2], energy[2], energy[3], icons[10], energy[15], energy[14], bingMapsAerial ]
});

mapStates.push({
	name: "North America",
	transitionAction: function() {
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
	},
	layers: [ energy[1], energy[13], energy[6], icons[2], energy[2], energy[3], bingMapsAerial ]
});

mapStates.push({
	name: "Bakken",
	transitionAction: function() {
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
	},
	layers: [ energy[1], energy[13], energy[6], icons[2], energy[2], energy[3], bingMapsAerial ]
});

mapStates.push({
	name: "Tar Sands",
	transitionAction: function() {
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
	},
	layers: [ energy[11], energy[1], energy[13], energy[6], icons[2], energy[2], energy[3], bingMapsAerial ]
});

mapStates.push({
	name: "Gulf",
	transitionAction: function() {
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
	},
	layers: [ energy[10], energy[1], energy[13], tiles[1], tiles[2], overlay[1], energy[0], overlay[0], energy[12], energy[6], energy[2], energy[3], energy[5], bingMapsAerial, oilrig ]
});

mapStates.push({
	name: "World System",
	transitionAction: function() {
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
	},
	layers: [ energy[6], icons[2], energy[9], bingMapsAerial ]
});


var navList = document.getElementById("navList");

// generate map nav bar based on map states
mapStates.map(function (mapState){
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.setAttribute("href", "#");
	a.innerHTML = mapState.name;
	li.appendChild(a);
	navList.appendChild(li);
	a.mapState = mapState;
  // handle active map state
  if (mapState == activeMapState) li.setAttribute("class", "active");
});

// enable navbar click logic - activate the link's mapState, call its transition action, and update layers.
$(".nav a").on("click", function(){
	$(".nav").find(".active").removeClass("active");
	$(this).parent().addClass("active");
	if (this.mapState){
		setActiveMapState(this.mapState);
	} 
});

function setActiveMapState(state){
	activeMapState = state;

  // reset map's current layers
  if (map.layers){
  	for (var i = map.layers.length - 1; i >= 0; i--) { 
  		map.removeLayer(map.layers[i]); 
  	}     
  }
  for (var i = 0; i < state.layers.length; i++){
  	map.addLayer(state.layers[i]);
  }

  if (state.extraLayers){
  	for (var i = 0; i < state.extraLayers.length; i++){
  		map.addLayer(state.extraLayers[i]);
  	}
  }

  state.transitionAction();
  // refresh list of layers
  var legendBasic = document.getElementById("legend-basic");
  var legendExtras = document.getElementById("legend-extras")
  refreshLayers(state.layers, legendBasic);
  refreshLayers(state.extraLayers, legendExtras);
}

/** Create layer legend + icon _+ checkbox for each layer that has a label and legendImgSrc property.
**/
function refreshLayers(layers, legendElement){

  // clear existing legend div
  while (legendElement.firstChild){
  	legendElement.removeChild(legendElement.firstChild);
  }

  //legendElement.parentNode.parentNode.visible = layers != null; FIXME - make node invisible if there are no layers.

  if (!layers) return;

  var mapLayers = layers.map(function (layer){
  	if (layer.label && layer.legendImgSrc){
  		var div = document.createElement("div");
  		div.setAttribute("class", "checkbox legend-img-container");
  		var label = document.createElement("label");
  		var input = document.createElement("input");
  		input.setAttribute("type", "checkbox");
  		input.layer = layer;
  		input.checked = true;

  		input.addEventListener("click", function() {
  			this.layer.setVisible(this.checked);
  		});
  		label.appendChild(input);

  		var img = document.createElement("img");
  		img.setAttribute("src", layer.legendImgSrc);
  		img.setAttribute("class", "legend-img");
  		label.appendChild(img);

  		var labelText = document.createElement("div");
  		labelText.setAttribute("class", "legend-text");

  		labelText.innerHTML = layer.label;
  		label.appendChild(labelText);

  		div.appendChild(label);

  		legendElement.appendChild(div);
  	}

  });

   //$("input[type='checkbox']")

}

/* Lightbox */

$(document).ready(function ($) {
    // delegate calls to data-toggle="lightbox"
    $(document).delegate('*[data-toggle="lightbox"]:not([data-gallery="navigateTo"])', 'click', function(event) {
    	event.preventDefault();
    	return $(this).ekkoLightbox({
    		onShown: function() {
    			if (window.console) {
    				return console.log('Checking our the events huh?');
    			}
    		},
    		onNavigate: function(direction, itemIndex) {
    			if (window.console) {
    				return console.log('Navigating '+direction+'. Current item: '+itemIndex);
    			}
    		}
    	});
    });
    
// navigateTo
$(document).delegate('*[data-gallery="navigateTo"]', 'click', function(event) {
	event.preventDefault();
	var lb;
	return $(this).ekkoLightbox({
		onShown: function() {
			lb = this;
			$(lb.modal_content).on('click', '.modal-footer a', function(e) {
				e.preventDefault();
				lb.navigateTo(2);
			});
		}
	});
});
});

/** Popup */

// var container = document.getElementById('popup');
// var content = document.getElementById('popup-content');
// var closer = document.getElementById('popup-closer');


  /**
   * Create an overlay to anchor the popup to the map.
   */
  // var popupOverlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
  //   element: container,
  //   autoPan: true,
  //   autoPanAnimation: {
  //     duration: 250
  //   }
  // }));

   /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  // closer.onclick = function() {
  //   popupOverlay.setPosition(undefined);
  //   closer.blur();
  //   return false;
  // };

  // map.addOverlay(popupOverlay);
  // map.on('singleclick', function(evt) {
  //     var coordinate = evt.coordinate;
  //     var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
  //         coordinate, 'EPSG:3857', 'EPSG:4326'));

  //     content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
  //         '</code>';
  //     popupOverlay.setPosition(coordinate);
  //   });


/*
var mapLayers = [];
var prefix = "icons/";
mapLayers.push({iconPath: prefix + "refinery-red.gif", label: "refineries"});
mapLayers.push({iconPath: prefix + "OilTerminal.gif", label: "oil hubs"});
mapLayers.push({iconPath: prefix + "Railroad.gif", label: "rail yards"});
mapLayers.push({iconPath: prefix + "piles.gif", label: "stockpiles"});
mapLayers.push({iconPath: prefix + "steelmill.gif", label: "steel mills"});
mapLayers.push({iconPath: prefix + "chemical-industry.gif", label: "chemicals"});
mapLayers.push({iconPath: prefix + "star.gif", label: "gas stations"});
mapLayers.push({iconPath: prefix + "airport.gif", label: "airports"});
mapLayers.push({iconPath: prefix + "electricity.gif", label: "power plants"});
*/



/** Copied from openlayers template: https://jumpinjackie.github.io/bootstrap-viewer-template/2-column/index.html#
**/
/*
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
});*/
