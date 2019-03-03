//1. Create home screen to show current location (you are here).
//a. Create a map instance and show it in the mapDiv
//b. Add the interior reference layer to show room numbers.
//c. Get the infodesk id from query search to determine the start positon
//d. Use symbols to draw current position

//2. Retreive push buttons from a table
//3. Show navigation buttons on screen dynamically with javascript

//4. Create an array object to hold the push buttons
//a. Create a div container in the html to hold push buttons
//b. Create event listener to listen to pushed button

//5. where clause to determine stops on push
//a. Use graphic symbol to draw stop point (destination)

//6. Create the route task to be initiated
//a. Add a network analysis layer to the map
//b. solve the route for the destination
//c. create a showRoute instance
//d. Call back the showRoute function (getRoute) on click event
//e. Display route as graphic


//7. Display map according to zoom extent
//a. Show floor layer of the stop point
//b. Show floor number on screen


//8. User decides to proceed to destination  OR
//a. repeat from 3 to 7b
//b. Keep route on screen until 60 seconds of inactivity (reset time out)
//c. Display home screen

//9. Create a reset button object
//a. Hide reset button on document load
//b. Show reset button on  click event on Navigation buttons
//c. hide reset button on  the click of the reset button
//d. Clear timeout function

//10. Create a dynamic button for travel mode options.

/***************************************************************************************** */
/**************************************************************************************** */

//1a. Crate a map instance using the require function
var map;
var mapLayers = [];
var stopPoints;
var travelModes;
var travelModeSelect;
var selectedTravelMode;
var travelMode;
var interiorReferenceRoomLayerMinScale; //Used to hide cluster layers
var minScale;
//var routes = [];

//Add classes to library and call the modules from it
dojo.require("dojox.form.DropDownSelect");
require(["esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dijit/form/Button",
    "dojo/dom",
    "dojo/on",
    "dojo/_base/array",
    "esri/urlUtils",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/Color",
    "esri/tasks/RouteTask",
    "esri/tasks/RouteParameters",
    "esri/tasks/RouteResult",
    "esri/tasks/FeatureSet",
    "esri/units",
    "esri/SpatialReference",
    "esri/graphic",
    "esri/symbols/SimpleLineSymbol",
    "dojo/_base/lang",
    "dijit/form/Select",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "esri/geometry/Extent",
    "esri/layers/LayerInfo",
    "dojo/domReady!"],
    function (Map, ArcGISDynamicMapServiceLayer, Button, dom, on, array, urlUtils, FeatureLayer, Query, QueryTask, SimpleRenderer, SimpleMarkerSymbol, PictureMarkerSymbol, TextSymbol, Font, Color, RouteTask, RouteParameters, RouteResult, FeatureSet, Units, SpatialReference, Graphic, SimpleLineSymbol, lang, Select, BorderContainer,
        ContentPane, Extent, LayerInfo) {

        //Add Proxy access for password protected layers. Uses the 'gisweb' Portal user account.
        urlUtils.addProxyRule({
            urlPrefix: "maps.byui.edu/arcgis/rest/services/interactive",
            proxyUrl: "https://maps.byui.edu/dotnet/proxy.ashx"
        });
        //create a map instance and center it based on query string parameters
        var initialZoomLevel = 21;
        map = new Map("mapDiv", {
            center: [-111.781509, 43.817379],
            zoom: initialZoomLevel,
            basemap: "streets",
            sliderStyle: "small",
            sliderPosition: "bottom-right"//,
            //infoWindow: infoWindow
        });

        ////Check the extent of map and show floor selection accordingly.
        map.on("extent-change", function () {
            mapExtentChanged();
        });

        //1b. Create the building interior layer to show room numbers
        var interiorReferenceURL = "https://maps.byui.edu/arcgis/rest/services/Interactive/InteriorReference/MapServer";
        var interiorReferenceLayerOptions = {
            "id": "interiorReferenceLayer",
            "showAttribution": true
        };
        // create a reference layer instance and pass it the url and the options
        var interiorReferenceLayer = new ArcGISDynamicMapServiceLayer(interiorReferenceURL, interiorReferenceLayerOptions);
        interiorReferenceLayer.on("load", function () {
            //Set the min scale for the "Building Interior Spaces" layer
            var filteredArr = new LayerInfo(array.filter(this.layerInfos, function (item) {
                return item.name === "Building Interior Spaces";
            }));

            interiorReferenceRoomLayerMinScale = filteredArr[0].minScale;
        });

        //Set the min scale for the "Building Interior Spaces" layer
        var filteredArr = new LayerInfo(array.filter(this.layerInfos, function (item) {
            return item.name === "Building Interior Spaces";
        }));

        interiorReferenceRoomLayerMinScale = filteredArr[0];

        // Add the layer to the map
        mapLayers.push(interiorReferenceLayer);
        map.addLayers(mapLayers);



        //1c. query task to generate start point
        //Construct a Select object to hold travel mode options.
        var travelModeDropDown = new Select();

        //Create route task object and (6a.) add network analysis layer (url) 
        var routeTask = new RouteTask("https://maps.byui.edu/arcgis/rest/services/Interactive/InteractiveRouting/NAServer/Route/");

        routeTask.getServiceDescription().then(lang.hitch(this, function (serviceInfo) {
            var travelModes = [];

            //Get travel mode options and pass it to the route params later in 6b.
            array.forEach(serviceInfo.supportedTravelModes, function (travelMode) {
                var travelModeOption = {
                    label: travelMode.name, value: travelMode,
                    class: "travelModeOptions"
                    
                };
                travelModes.push(travelModeOption);
            });
            //Add the options to the travel mode dropdown menu and pass travelModes as the parameter
            travelModeDropDown.addOption(travelModes);
            travelModeDropDown.startup();
            travelModeDropDown.placeAt(dom.byId("travelModeBtn"));
            
        }));


        /***********************Feature layer to draw start position********************/
        //1.d
        //Query string to determine start position
        // Gets the url of information desk stop

        let stringUrl = window.location.href.toLowerCase();
        //gets the query string's key-value pair
        let queryParams = location.search.substring(1);
        //check the validity of query string
        if (queryParams) {
            //splits key-value pair and return only the value
            infodeskId = queryParams.split('=');
            var infodeskId = infodeskId[1];
            console.log(infodeskId);
        }


        var startQuery, startQueryTask, startFeatureLayerUrl;

        startFeatureLayerUrl = "https://maps.byui.edu/arcgis/rest/services/Interactive/InformationDesk/FeatureServer/0";

        //var infoDeskName = "KIM1";

        //define query expression
        startQueryTask = new QueryTask(startFeatureLayerUrl);
        startQuery = new Query();
        startQuery.outFields = ["LONGNAME, GLOBALID"];
        startQuery.returnGeometry = true;
        startQuery.where = "NAME= '" + infodeskId + "'";
        //execute the query task
        startQueryTask.execute(startQuery, handleStartQueryResult);

        //var sms = SimpleMarkerSymbol().setColor(new Color([63, 191, 63])).setSize(10).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        var sps = new PictureMarkerSymbol("/images/start.png",
            48, 48).setOffset(0, 19);
        var font = new Font();
        font.setWeight(Font.WEIGHT_BOLD);
        font.setSize(27);
        font.setFamily("Times New Roman");
        var textSym = new TextSymbol();
        textSym.setFont(font);
        textSym.setKerning(true);
        textSym.setColor(new Color([26, 26, 26, 1]));
        textSym.setText("You Are Here");

        //Store the graphic in a global variable
        var startGraphic;
        var InfodeskGuid; //= '{6339A00F-2534-4213-97B5-9A65E5CB475F}';
        function handleStartQueryResult(results) {
            //Render the graphic from the result
            startGraphic = results.features[0];
            startGraphic.setSymbol(sps);
            map.graphics.add(startGraphic);

            map.centerAt(startGraphic.geometry);
            InfodeskGuid = results.features[0].attributes.GlobalID;
            NavigationButtons();
        }



        //2. Query task to generate navigation buttons on screen

        function NavigationButtons() {
            var queryTask, outFields, query, btnContainer;

            btnContainer = "https://maps.byui.edu/arcgis/rest/services/Interactive/InformationDesk/FeatureServer/1";
            outFields = ["*"];
            //define query expression
            queryTask = new QueryTask(btnContainer);
            query = new Query();
            query.outFields = outFields;
            query.returnGeometry = true;
            query.where = "INFORMATIONDESKGUID =  '" + InfodeskGuid + "'";
            query.orderByFields = ["STOPNAME"];
            //execute the query task
            queryTask.execute(query, createButtons, handleButtonQueryResults);
        }
        //define the handleButtonQueryResults
        function handleButtonQueryResults(button) {
            if (!button.hasOwnProperty("features") ||
                button.features.length === 0) {
                return; // no features, something went wrong
            }

        }

        //3. Create a function to loop through the buttons generated by the query to show on screen

        //5a. stop graphic point
        //var stopSymbol = SimpleMarkerSymbol().setColor(new Color([230, 0, 0])).setSize(10).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        var stopmkr = new PictureMarkerSymbol("/images/stop.png",
            48, 48).setOffset(0, 19);
        var stopGraphic;


        /***Show and hide buttons on click event**/

        //Hide all other buttons and keep the pushed one visible
        function hideButtons(button) {
            for (but = 0; but < container.childElementCount; but++) { 
                var showHideBtn = container.childNodes[but].firstChild.children[0].id;
                if (button.id !== showHideBtn) {
                    buttonToHide = container.childNodes[but];
                    //buttonToHide.hidden = true;

                    buttonToHide.style.display = "none";

                } 
            } 
            
        }

        //Show all buttons when reset button is clicked
        function showButtons() {
            for (but = 0; but < container.childElementCount; but++) {
                var showHideBtn = container.childNodes[but].firstChild.children[0].id;
                
                    buttonToHide = container.childNodes[but];
                    //buttonToHide.hidden = true;

                    buttonToHide.style.display = "block";

                
            } 
        }

        //3. Create and show navigation buttons on screen dynamically with javascript
        function createButtons(result) {

            array.forEach(result.features, function (feature) {
                var container = dom.byId("container");
                var navButton = new Button({
                    label: feature.attributes["STOPNAME"],
                    class: "navigationButtons"
                });

                navButton.startup();
                navButton.placeAt(container);


                //4b. Event listener to listen to pushed button
                navButton.on("click", function () {
                    var roomNumber = feature.attributes["LONGNAME"];
                    hideButtons(navButton);
                    //Query the room center that matches the longname to get the destination point
                    var stopQuery, stopQueryTask, stopFeatureLayerUrl;
                    stopFeatureLayerUrl = "https://maps.byui.edu/arcgis/rest/services/Interactive/InteractiveRoomFloor/MapServer/14";
                    //define query expression
                    stopQueryTask = new QueryTask(stopFeatureLayerUrl);
                    stopQuery = new Query();
                    stopQuery.outFields = ["LONGNAME", "FLOOR"];
                    stopQuery.returnGeometry = true;
                    //5. where clause to determine stops on push
                    stopQuery.where = "LONGNAME = '" + roomNumber + "'";
                    //execute the query task
                    stopQueryTask.execute(stopQuery, handleStopQueryResult);
                    showNavButtons();
                    mapExtentChanged();
                    clearRoute();
                    
                });
            });


        }
        
        
        /******************* Route Task     ****************************************/

        //6. 
        //Handle the query result. 

        function handleStopQueryResult(featureSet) {

            stopGraphic = featureSet.features[0];
            stopGraphic.setSymbol(stopmkr);
            map.graphics.add(stopGraphic);
            var floorNumberToChangeTo = featureSet.features[0].attributes["FLOOR"];

            //6b. Solve the route from the url with route parameters
            var routeParams = new RouteParameters();
            //Use the graphic from the query result and the graphic stored in the global variable to pass to the route task as stops.
            routeParams.stops = new FeatureSet();
            routeParams.stops.features.push(startGraphic);
            routeParams.stops.features.push(stopGraphic);
            routeParams.returnStops = true;
            routeParams.returnRoutes = true;
            routeParams.travelMode = travelModeDropDown.value;
            //routeParams.returnDirections = false;
            //routeParams.directionsLengthUnits = Units.MILES;
            routeParams.outSpatialReference = new SpatialReference({ "wkid": 102100 });


            //show the route when route task is completed
            routeTask.on("solve-complete", showRoute);
            //handle route task error
            routeTask.on("error", errorHandler);
            //Execute the route task and display the graphic line showing the route.
            routeTask.solve(routeParams);
            //Select the floor number to dispaly
            setVisibleFloor(floorNumberToChangeTo);


        }

        var routeResult;
        function showRoute(evt) {

            //line symbol to show route
            var routeLineSymbol = new SimpleLineSymbol().setColor(new Color([0, 112, 255, 0.80])).setWidth(5).setStyle(SimpleLineSymbol.STYLE_SOLID);

            routeResult = evt.result.routeResults[0].route;
            routeResult.setSymbol(routeLineSymbol);
            map.graphics.add(routeResult);
            //callback to zoom to extent
            var routeResultExtent = routeResult._extent;
            zoomToPaddedExtent(routeResultExtent, 30);

            //callback to reload page after inactivity
             resetTimeout();


        }

        function errorHandler(evt) {
            alert(evt.message);
        }



        /**
        * zoomToPaddedExtent
        *
        * Sets map extent to query extent plus a predefined padding value.
        * 
        * @param {any} routeResultExtent - The extent to zoom to
        * @param {any} paddingValue - Value to determine extent padding around queried polygon
        */
        function zoomToPaddedExtent(routeResultExtent, paddingValue) {


            if (routeResultExtent) {
                zoomExtent = new Extent(routeResultExtent.xmin - paddingValue, routeResultExtent.ymin - paddingValue, routeResultExtent.xmax + paddingValue, routeResultExtent.ymax + paddingValue, routeResultExtent.spatialReference);
                map.setExtent(zoomExtent);
            }
        }


        /**
         * mapExtentChanged
         *
         * Based on cetain global conditions, perform cetatin tasks to the
         * extent of the map.
         */




        function mapExtentChanged() {
            //Hide Buttons
            dom.byId("0floor").style.display = "none";
            dom.byId("1floor").style.display = "none";
            dom.byId("2floor").style.display = "none";
            dom.byId("3floor").style.display = "none";
            dom.byId("4floor").style.display = "none";
            dom.byId("5floor").style.display = "none";

            currentMapScale = map.getScale();

            if (currentMapScale <= interiorReferenceRoomLayerMinScale) {
                //if map is zoomed in, show floor selection for current extent
                selectFloors(map.extent);


            }




        }



        /**
       * selectFloors
       *
       * Based on what the query returns perform certain functionality calls.
       *
       * @param {Object} geometryInput - The extent of the map
       */
        function selectFloors(geometryInput) {
            var floorQueryTask = new QueryTask("https://maps.byui.edu/arcgis/rest/services/Interactive/InteractiveRoomFloor/MapServer/13");
            var floorQuery = new Query();
            floorQuery.geometry = geometryInput;
            floorQuery.returnGeometry = false;
            floorQuery.outFields = ["FLOOR"];
            floorQueryTask.execute(floorQuery, populateFloorButtons, handleError);
        }

        /**
        * populateFloorButtons
        *
        * Populate buttons that when onClicked they display the map associated with each floor layer
        * 
        * @param {Object} results - The results of the query to grab every available floor. 
        */
        function populateFloorButtons(results) {
            var resultCount = results.features.length;
            for (var i = 0; i < resultCount; i++) {
                var featureAttributes = results.features[i].attributes;
                for (var attr in featureAttributes) {
                    switch (featureAttributes[attr]) {
                        case "B":
                            dom.byId("0floor").style.display = "block";
                            break;
                        case "1":
                            dom.byId("1floor").style.display = "block";
                            break;
                        case "2":
                            dom.byId("2floor").style.display = "block";
                            break;
                        case "3":
                            dom.byId("3floor").style.display = "block";
                            break;
                        case "4":
                            dom.byId("4floor").style.display = "block";
                            break;
                        case "5":
                            dom.byId("5floor").style.display = "block";
                            break;
                    }
                }
            }
        }

        /**
         * handleError
         *
         * Display error with query to browser console and console alert box
         *
         * @param {any} results - Error results that indicates what is wrong with query.
         */
        function handleError(results) {
            console.log("Error: ", results);
            alert("Error! " + results);
        }


        /**
         * setVisibleFloor
         * @param {any} floorNumber
         */
        //Handle floor layer visibility
        function setVisibleFloor(floorNumber) {
            var targetLayer = map.getLayer("interiorReferenceLayer");
            var filteredArr;

            // interactiveFeatureLayerFloorChange(floorNumber);

            switch (floorNumber) {
                case "0":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "Basement";
                    }));
                    break;
                case "1":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "1st Floor";
                    }));
                    break;
                case "2":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "2nd Floor";
                    }));
                    break;
                case "3":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "3rd Floor";
                    }));
                    break;
                case "4":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "4th Floor";
                    }));
                    break;
                case "5":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "5th Floor";
                    }));
                    break;
                case "6":
                    filteredArr = new LayerInfo(array.filter(targetLayer.layerInfos, function (item) {
                        return item.name === "6th Floor";
                    }));
                    break;
                default:
            }


            visible = [];
            visible.push(filteredArr[0].id); //Set floor layer visibility
            targetLayer.setVisibleLayers(visible);

            //Reset the buttons
            dom.byId("0floor").className = "floorButton";
            dom.byId("1floor").className = "floorButton";
            dom.byId("2floor").className = "floorButton";
            dom.byId("3floor").className = "floorButton";
            dom.byId("4floor").className = "floorButton";
            dom.byId("5floor").className = "floorButton";

            dom.byId(floorNumber + 'floor').className = "selectedFloorButton";
        }

        //Handle floor layer visibility
        on(dom.byId("0floor"), "click", updateFloorLayerVisibility);
        on(dom.byId("1floor"), "click", updateFloorLayerVisibility);
        on(dom.byId("2floor"), "click", updateFloorLayerVisibility);
        on(dom.byId("3floor"), "click", updateFloorLayerVisibility);
        on(dom.byId("4floor"), "click", updateFloorLayerVisibility);
        on(dom.byId("5floor"), "click", updateFloorLayerVisibility);

        function updateFloorLayerVisibility() {
            setVisibleFloor(this.value);
        }


        /******************************************************Decicion Point*************************************************************** */
        //7a. Clear routes to begin a new one upon click event (clear route)
        function clearRoute() {

            map.graphics.remove(routeResult);
            map.graphics.remove(stopGraphic);

        }


        
        /*Create a reset button*/
        var resetRouteBtn = new Button({
            label: "Menu"
            
        });
        
        /*****Add reset button to border container*********/

        
        
        /********************Create functions to hide and show menu buttons***********************/
       /**show the reset (menu) button */
        function showNavButtons() {
            resetRouteBtn.placeAt(dom.byId("reset"));
            dom.byId("reset").style.visibility = 'visible';
            
        }

        /**hide the reset (menu) button **/
        function hideNavButtons() {
            dom.byId("reset").style.visibility = 'hidden';
        }
        //hideNavButtons();

        /*****Listen to click event and execute the function clear route */
        /*clear current route
         * call show button function
         * set the floor visibility
         * set the zoom extent
         * center the map
         */
        resetRouteBtn.on("click", function () {
            clearRoute();
            showButtons();
            setVisibleFloor("1");
            map.setZoom(initialZoomLevel);
            map.centerAt(startGraphic.geometry);
            hideNavButtons();
            clearTimeout(timeout);
        }); 

      
        //7b.Refresh page after 60 seconds of inactivity, after drawing the route result
        var timeout;
        function resetTimeout() {
            clearTimeout(timeout);
            //7c. Clears route graphics and reloads the document to home screen.
            timeout = setTimeout("location.reload(true);", 60000);
            //showNavButtons();
        }






    });








