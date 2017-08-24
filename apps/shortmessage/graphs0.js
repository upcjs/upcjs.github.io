queue()
    .defer(d3.csv, "./test.csv")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
	
	//Clean data
	var records = recordsJson;
    // var dateFormat = d3.time.format("%H:%M:%S");
	//
	// records.forEach(function(d) {
     //    d["conntime"] = dateFormat.parse(d["conntime"]);
     //    d["conntime"].setMinutes(0);
     //    d["conntime"].setSeconds(0);
	// 	d["lng"] = +d["lng"];
	// 	d["lat"] = +d["lat"];
	// });

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

    var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;
    records.forEach(function(d) {
        d["conntime"] = parseDate(d["conntime"]);
    });
	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["conntime"]; });
    var topicDim = ndx.dimension(function(d) { return d["topic"]; });
    var phoneBrandDim = ndx.dimension(function(d) { return d["phonenumber"]; });
	var locationdDim = ndx.dimension(function(d) { return d["location"]; });
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
    var numRecordsByDate = dateDim.group();
	var dateGroup=dateDim.group();
    var phoneBrandGroup = phoneBrandDim.group();
    var topicGroup = topicDim.group();
	var locationGroup = locationdDim.group();
	var all = ndx.groupAll();


	//Define values (to be used in charts)
    // var minDate = dateDim.bottom(1)[0]["conntime"];
    // var maxDate = dateDim.top(1)[0]["conntime"];
	var datetime=[{date:'2017/02/23 00:00'},{date:'2017/02/23 24:00'}];
    var parseDate1 = d3.time.format("%Y/%m/%d %H:%M").parse;
    datetime.forEach(function(d) {
        d.date= parseDate1(d.date);
    });
    var ndx1=crossfilter(datetime);
    var datetimeDim=ndx1.dimension(function (d) {	return d.date;});
    var minDate=datetimeDim.bottom(1)[0].date;
    var maxDate=datetimeDim.top(1)[0].date;
	
	
	
	
	

    //Charts
	var dateChart=dc.barChart("#date-chart");
    var topicChart = dc.rowChart("#topic-row-chart");
    var locationChart = dc.rowChart("#location-row-chart");
    var numberRecordsND = dc.numberDisplay("#number-records-nd");
    var phoneNumberChart = dc.rowChart("#phone-number-chart");
    // console.log('变量：',phoneBrandGroup{top:10});

    numberRecordsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(all);


    dateChart
        .width(650)
        .height(120)
        .margins({top: 10, right: 50, bottom: 20, left: 20})
        .dimension(dateDim)
        .group(dateGroup)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .yAxis().ticks(4);

    topicChart
       .width(210)
       .height(350)
       .dimension(topicDim)
       .group(topicGroup)
       .ordering(function(d) { return -d.value })
       .colors(['#6baed6'])
       .elasticX(true)
       .xAxis().ticks(4);

    phoneNumberChart
        .width(210)
        .height(480)
		.cap(15)
        .dimension(phoneBrandDim)
        .group(phoneBrandGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

    locationChart
    	.width(210)
		.height(350)
		.cap(10)
        .dimension(locationdDim)
        .group(locationGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);
    dc.renderAll();
    dc.renderAll();
    var map = L.map('map');
    map.setView([39.90, 116.41], 10);
	var drawMap = function(){


		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["lat"], d["lng"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20,
			maxZoom: 1,
		}).addTo(map);

	};

	//Draw Map
	drawMap();

	//Update the heatmap if any dc chart get filtered
	dcCharts = [dateChart,topicChart,locationChart,phoneNumberChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			});
			drawMap();
		});
	});
	dc.renderAll();

}