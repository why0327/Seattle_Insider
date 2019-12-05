// Global variables
var mapCenter = [-122.3, 47.62];
var mapZoom = 10.5;


// --------------------------------------------------------
// 1. Initialize map
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2h5MDMyNyIsImEiOiJjaW00ZDh6ZmkwMWY2dTFtM3dzcXVjYXoxIn0.sdFJtWGkCRNlJn402OdHlQ'; // replace this value with your own access token from Mapbox Studio

    // for more mapboxgl.Map options, see https://docs.mapbox.com/mapbox-gl-js/api/#map)
    var map = new mapboxgl.Map({
    	container: 'map', // this is the ID of the div in index.html where the map should go
        center: mapCenter, // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
        zoom: mapZoom, // set the default zoom programatically
    	style: 'mapbox://styles/why0327/ck38e7gyy69r21cp6nmefzyk5', // replace this value with the style URL from Mapbox Studio
    	customAttribution: 'City of Seattle Open Data Portal (https://data.seattle.gov/)', // Custom text used to attribute data source(s)
    });


// --------------------------------------------------------
// 2. Show a modal window when About button is clicked
// A modal window is an element that sits on top of an application's main window. It can be opened and closed without reloading the page

    $("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
        $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
        $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
    });

    $(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
        $("#screen").fadeToggle();
        $(".modal").fadeToggle();
    });

// --------------------------------------------------------
// 3. Creating a legend
// See example tutorial at https://docs.mapbox.com/help/tutorials/choropleth-studio-gl-pt-2/#create-arrays-of-intervals-and-colors

    var layers = [ // an array of the possible values you want to show in your legend
        'Parks', // Civic Spaces.png
        'Olmsted Parks', // Community Park.png
        'Spray Parks',
        'Gardens',
        'Trails',
        'Boat Ramps',
        'Environmental Education Centers',
        'Community Centers',
        'Swimming Pools'    
        


    ];

    var colors = [ // an array of the color values for each legend item
        '#5c6c42',
        '#b2b533',
        '#ffc105',
        '#36c4b6',
        '#f0e9c1',
        '#b6fcfc',
        '#f3d720',
        '#e79088',
        '#d87a22'
    ];

    // for loop to create individual legend items
    for (i=0; i<layers.length; i++) {
        var layer =layers[i]; // name of the current legend item, from the layers array
        var color =colors[i]; // color value of the current legend item, from the colors array 
        
        var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added

        var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
        var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
        legendKey.css("background", color); // change the background color of the legend key
    }


// --------------------------------------------------------
// 4. Info window 
// See example tutorial at https://docs.mapbox.com/help/tutorials/choropleth-studio-gl-pt-2/#add-the-information-window
/*
    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var parks = map.queryRenderedFeatures(e.point, {    
            layers: ['cville-parks']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-window-body').html('<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><img class="park-image" src="img/' + parks[0].properties.PARKNAME + '.jpg">');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#info-window-body').html('<p>Hover over a park or click on a bus stop to learn more about it.');
            
        }

    });
*/

// -------------------------------------------------------- 
// 5. Popups
// See tutorial at https://docs.mapbox.com/help/tutorials/add-points-pt-3/
// See example of popups on click at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/ 
// See example of popups on hover at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['environmental-education-cente-2m29le (1)']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stops.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(stops[0].geometry.coordinates);

      // Set the contents of the popup window
      //popup.setHTML('<h3>Stop ID: ' + stops[0].NAME);
      popup.setHTML('<h3>' + stops[0].properties.NAME + '</h3><p>' + 'Address:' + stops[0].properties.ADDRESS + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// -------------------------------------------------------- 
// 6. Show/hide layers
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['park-boundary-ac7wpn', 'Parks'],                      // layers[0]
        ['olmsted-parks-24iez9', 'Olmsted Parks'],                              // layers[1][1] = 'Parks'
        ['spray-park-72daqj','Spray Parks'],
        ['gardens-6robrt', 'Gardens'],     
        ['trails-3uhts7', 'Trails'],
        ['boat-ramps-04r921','Boat Ramps'],
        ['environmental-education-cente-2m29le (1)','Environmental Education Centers'],
        ['community-center-dz5jcm', 'Community Centers'],
        ['swimming-pools-9o8qx5', 'Swimming Pools'],
        
        
        

        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });

// -------------------------------------------------------- 
// 7. Change a layer's style
// See example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
/*

    var swatches = $("#swatches");

    var colors = [  // an array of color options for the bus stop ponts
        '#ffd000',
        '#f00',
    ]; 

    var layer = 'cville-bus-stops';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
        });

        $(swatches).append(swatch);
    });
*/
// -------------------------------------------------------- 
// 8. Scroll to zoom through sites
// See example at https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'The-Olmsted-Plan': {
            name: "The Olmsted Plan",
            description: "In 1903, on the recommendation of the Board of Park Commissioners, Council contracted with the Olmsted Brothers of Brookline, Massachusetts to conduct a thorough survey of Seattle\'s park possibilities, and to submit a comprehensive plan that could be used to guide future work. This move was largely brought on by the public interest generated through the purchase of two large tracts, Woodland and Washington Parks, in 1900; and by the desire to prepare Seattle for the 1909 Alaska-Yukon-Pacific Exposition.",
            imagepath: "img/The Olmsted Plan.jpg",
            bearing: 0,
            center: [-122.33, 47.64],
            zoom: 12,
            pitch: 0
        },
        'Kerry-Park': {
            name: "Kerry Park",
            description: "Kerry Park is a small public park and viewpoint on the south slope of Queen Anne Hill in Seattle, Washington, United States. It overlooks Downtown Seattle and is located along West Highland Drive between 2nd Avenue West and 3rd Avenue West. The park's view is considered to be the most iconic view of the city skyline, with the prominent Space Needle at the center, Elliott Bay to the west, and Mount Rainier in the background. The park encompasses 1.26 acres (0.51 ha) and includes a railing and several benches facing south towards the skyline. A stairway on the west end of the park connects below to West Prospect Street and the Bayview-Kinnear Park, which has a small playground. Kerry Park is named after the couple lumberman and business magnate Albert S. Kerry and his wife Catherine. They lived nearby, and donated the land to the city in 1927 \" so that all who stop here may enjoy its view.\"",
            imagepath: "img/Kerry Park.jpg",
            bearing: 0,
            center: [ -122.3599, 47.62913],
            zoom: 16.5,
            pitch: 60
        },
        'Gas-Works-Park': {
            name: "Gas Works Park",
            description: "Gas Works Park, in Seattle, Washington, is a 19.1-acre public park on the site of the former Seattle Gas Light Company gasification plant, located on the north shore of Lake Union at the south end of the Wallingford neighborhood. The park was added to the National Register of Historic Places on January 2, 2013, more than a decade after being nominated. Gas Works park contains remnants of the sole remaining coal gasification plant in the United States. The plant operated from 1906 to 1956 and was bought by the City of Seattle for park purposes in 1962. The park opened to the public in 1975. The park was designed by Seattle landscape architect Richard Haag, who won the American Society of Landscape Architects Presidents Award of Design Excellence for the project. The plant's conversion into a park was completed by Daviscourt Construction Company of Seattle.",
            imagepath: "img/Gas Works Park.jpg",
            bearing: 0,
            center: [ -122.3348, 47.6455],
            zoom: 15,
            pitch: 60
        }
    };

    console.log(chapters['The-Olmsted-Plan']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" + chapters[key]['name'] + "</h3><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }
    

// -------------------------------------------------------- 
// 9. Reset map button
    
    $("#reset").click(function() {
        map.setCenter(mapCenter);
        map.setZoom(mapZoom);
        map.setPitch(0);
        map.setBearing(0);
        map.setFilter("cville-building-permits", null); // reset building permits filters
        
        // Reset all layers to visible
        for (i=0; i<layers.length; i++) {
            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
            $("#" + layers[i][0]).addClass('active');
        }                   

    });

