# BaiduMapChart调用说明：

[![baidumapchart](.\images\baidumapchart.png)](./src/index.html)

### 1. BaiduMapChart依赖库：

依赖库：

[jquery.min.js](/static/lib/js/jquery.min.js), [bootstrap.min.js](/static/lib/js/bootstrap.min.js), [underscore-min.js](/static/lib/js/underscore-min.js), [crossfilter.js](/static/lib/js/crossfilter.js), [d3.min.js](/static/lib/js/d3.min.js), [dc.js](/static/lib/js/dc.js), [queue.js](/static/lib/js/queue.js), [leaflet.js](/static/lib/js/leaflet.js),

[leaflet-heat.js](/static/lib/js/leaflet-heat.js), [leaflet-baidu.js](/static/lib/js/leaflet-baidu.js), [baiduMapAPI-2.0-min.js](/static/lib/js/baiduMapAPI-2.0-min.js)

百度地图chart下载：[BaiduMapChart](/static/upcjs/BaiduMapChart.js)

### 2. 创建：

代码示例：

```
var mapChart = dc.BaiduMapChart("#map");
```

### 3. 调用：

代码示例：

```
mapChart
	.width(900)
	.height(600)
	.dimension(allDim)
	.center([31.207391, 121.608203])
	.maptyppe('bluish')
	.zoom(11);
```

##4. api说明：

**函数dimension（）**

参数为crossfilter中的dimension变量。

**函数center（）**

传入数据格式为[纬度，经度]，定义地图中心点的坐标。

**函数zoom（）**

传入一个数字，作用是调整地图缩放比例。（在leaflet-baidu.js中规定范围为[3,19]）

**函数maptype（）**

传入数据应该为字符串，规定默认加载地图格式，目前包括：normal，satellite，road，cnormal，light，dark，redalert，googlelite，grassgreen，midnight，pink，darkgreen，bluish，grayscale，hardedge共15种。

不同模式地图展示示例如下：

| ![normal模式示例图](images\normal模式示例图.jpg) | ![satellite模式示例图](images\satellite模式示例图.jpg) | ![satellite模式示例图](images\bluish模式示例图.jpg) |
| :------------------------------------: | :--------------------------------------: | :--------------------------------------: |
|                normal模式                |               satellite模式                |                 bluish模式                 |

完整代码：

```javascript
<!DOCTYPE html>
<html>
<head>
  <title>BaiduMapChart example</title>
  <link rel="stylesheet" href="/static/lib/css//bootstrap.min.css">
  <link rel="stylesheet" href="/static/lib/css/keen-dashboards.css">
  <link rel="stylesheet" href="/static/lib/css/dc.min.css">
  <link rel="stylesheet" href="/static/lib/css/leaflet.css">
  <link rel="stylesheet" href="/static/css/custom.css">
</head>
<body class="application">

  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="./">BaiduMapChart example</a>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        <div class="row">
          <!-- Time Chart -->
          <div class="col-sm-12">
            <div class="chart-wrapper">
              <div class="chart-title">
                Number of Events
              </div>
              <div class="chart-stage">
                <div id="time-chart"></div>
              </div>
            </div>
          </div>
        </div>
      <!--</div>-->
      <!--<div class="col-sm-4">-->
        <div class="row">
          <!-- Map -->
          <div class="col-sm-32">
            <div class="chart-wrapper">
              <div class="chart-title">
                Map
              </div>
              <div class="chart-stage">
                <div id="map" ></div>
              </div>
            </div>
          </div>
          <!-- Map -->
        </div>
      </div>
    </div>

  </div>

  <hr>
  <p class="small text-muted">Built with &#9829; by <a href="https://upcjs.github.io">upcjs.github.io</a></p>

  <script src="/static/lib/js/jquery.min.js"></script>
  <script src="/static/lib/js/bootstrap.min.js"></script>
  <script src="/static/lib/js/underscore-min.js"></script>
  <script src="/static/lib/js/crossfilter.js"></script>
  <script src="/static/lib/js/d3.min.js"></script>
  <script src="/static/lib/js/dc.js"></script>
  <script src="/static/lib/js/queue.js"></script>
  <script src="/static/lib/js/leaflet.js"></script>
  <script src="/static/lib/js/leaflet-heat.js"></script>
  <script src="/static/lib/js/leaflet-baidu.js"></script>
  <script src="/static/lib/js/baiduMapAPI-2.0-min.js"></script>
  <script src="/static/upcjs/BaiduMapChart.js" type='text/javascript'></script>
<script>
 queue()
    .defer(d3.json, "./data.json")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
	var records = recordsJson;
	var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");

	records.forEach(function(d) {
		d["timestamp"] = dateFormat.parse(d["timestamp"]);
		d["timestamp"].setMinutes(0);
		d["timestamp"].setSeconds(0);
		d["longitude"] = +d["longitude"];
		d["latitude"] = +d["latitude"];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
	var locationdDim = ndx.dimension(function(d) { return d["location"]; });
	var allDim = ndx.dimension(function(d) {return d;});

	//Group Data
	var numRecordsByDate = dateDim.group();

	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["timestamp"];
	var maxDate = dateDim.top(1)[0]["timestamp"];
    //Charts
	var timeChart = dc.barChart("#time-chart");
	var mapChart = dc.BaiduMapChart("#map");

    mapChart
        .width(900)
        .height(600)
        .dimension(allDim)
		.center([31.207391, 121.608203])
		.maptyppe('bluish')
		.zoom(11);

	timeChart
		.width(900)
		.height(80)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	dc.renderAll();
};
</script>
</body>
</html>
```

[完整代码示例](src/index.html)

致谢：

在地图调用过程中使用到了[leaflet插件](http://www.liedman.net/Proj4Leaflet/)

调用百度地图还需要[百度地图的api](http://lbsyun.baidu.com/index.php?title=jspopular)

感谢Tiven制作的[leaflet百度地图](http://labs.tiven.wang/map/)



版权：
中国石油大学华东可视分析小组

联系人：李昕         邮箱：lix@upc.edu.cn

