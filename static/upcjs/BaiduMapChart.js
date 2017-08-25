
dc.BaiduMapChart  = function (parent, chartGroup) {
    var _chart = dc.baseMixin({});
    var map;
    var _heatmap;
    // group not required
    _chart._mandatoryAttributes(['dimension']);
    var options = {
      crs: L.CRS.EPSGB3857,  //projection of baidu map
    };
	_chart._doRender = function(){
	    _chart.resetSvg();
        map = L.map("map", options);
        map.setView(_cen,_zoo);
        L.control.layers(baseMaps).addTo(map);
		drawMap();
		return _chart;
	};
	_chart._doRedraw = function () {
        drawMap();
        return _chart;
    };
    var baseMaps = {
      normal: new L.TileLayer.BaiduLayer("Normal.Map"),
      satellite: new L.TileLayer.BaiduLayer("Satellite.Map"),
      road: new L.TileLayer.BaiduLayer("Satellite.Road"),
      cnormal: new L.TileLayer.BaiduLayer("CustomStyle.Map.normal"),
      light: new L.TileLayer.BaiduLayer("CustomStyle.Map.light"),
      dark: new L.TileLayer.BaiduLayer("CustomStyle.Map.dark"),
      redalert: new L.TileLayer.BaiduLayer("CustomStyle.Map.redalert"),
      googlelite: new L.TileLayer.BaiduLayer("CustomStyle.Map.googlelite"),
      grassgreen: new L.TileLayer.BaiduLayer("CustomStyle.Map.grassgreen"),
      midnight: new L.TileLayer.BaiduLayer("CustomStyle.Map.midnight"),
      pink: new L.TileLayer.BaiduLayer("CustomStyle.Map.pink"),
      darkgreen: new L.TileLayer.BaiduLayer("CustomStyle.Map.darkgreen"),
      bluish: new L.TileLayer.BaiduLayer("CustomStyle.Map.bluish"),
      grayscale: new L.TileLayer.BaiduLayer("CustomStyle.Map.grayscale"),
      hardedge: new L.TileLayer.BaiduLayer("CustomStyle.Map.hardedge")
    };
	_cen = [31.207391, 121.608203]
	_zoo = 13
	_mty = "normal"
	_chart.center = function (centerin) {
        if (!arguments.length) {
            return _center;
        }
        _cen = centerin;
        return _chart;
	};
	
	_chart.zoom = function (zoomin) {
        if (!arguments.length) {
            return _zoom;
        }
        _zoo = zoomin;
        return _chart;
	};
	_chart.maptyppe = function (mtypein) {
        if (!arguments.length) {
            return _mty;
        }
        _mty = mtypein;
        return _chart;
	};

	
    var overlayMaps = {
        Office: L.marker(L.latLng(31.207391, 121.608203)).bindPopup('I\'m working Shanghai in SAP Labs!')
    };
	
	var drawMap = function(){
	    if(map == null) return;
	    if(_heatmap != null)
	        map.removeLayer(_heatmap);
		eval('baseMaps.'+_mty).addTo(map);
		var geoData = [];
		_.each(_chart.dimension().top(Infinity), function (d) {
			geoData.push([d["latitude"], d["longitude"], 1]);
	      });
		_heatmap = L.heatLayer(geoData,{
			radius: 10,
			blur: 20,
			maxZoom: 1,
			}).addTo(map);

	};
    return _chart.anchor(parent, chartGroup);
};

 
