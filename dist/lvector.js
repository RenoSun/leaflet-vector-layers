/*
 Copyright (c) 2011, Jason Sanford
 Leaflet Vector Layers is a library for showing geometry objects
 from multiple geoweb services in a Leaflet map
*/
(function(a){a.lvector={VERSION:"1.0.0",ROOT_URL:function(){var a=document.getElementsByTagName("script"),e=/^(.*\/)lvector\-?([\w\-]*)\.js.*$/,c,d,f;c=0;for(d=a.length;c<d;c++)if(f=a[c].src,f=f.match(e)){if(f[2]==="include")break;return f[1]}return"../../dist/"}(),noConflict:function(){a.lvector=this._originallvector;return this},_originallvector:a.lvector};if(!L.LatLngBounds.equals)L.LatLngBounds=L.LatLngBounds.extend({equals:function(a){var e=!1;a!==null&&(e=this._southWest.lat==a.getSouthWest().lat&&
this._southWest.lng==a.getSouthWest().lng&&this._northEast.lat==a.getNorthEast().lat&&this._northEast.lng==a.getNorthEast().lng);return e}});L.Popup=L.Popup.extend({_close:function(){this._opened&&(this._map.closePopup(),this._map.removeLayer(this))}})})(this);/*
 Using portions of Leaflet code (https://github.com/CloudMade/Leaflet)
*/
lvector.Util={extend:function(a){for(var b=Array.prototype.slice.call(arguments,1),e=0,c=b.length,d;e<c;e++){d=b[e]||{};for(var f in d)d.hasOwnProperty(f)&&(a[f]=d[f])}return a},setOptions:function(a,b){a.options=lvector.Util.extend({},a.options,b)}};/*
 Using portions of Leaflet code (https://github.com/CloudMade/Leaflet)
*/
lvector.Class=function(){};
lvector.Class.extend=function(a){var b=function(){this.initialize&&this.initialize.apply(this,arguments)},e=function(){};e.prototype=this.prototype;e=new e;e.constructor=b;b.prototype=e;b.superclass=this.prototype;for(var c in this)this.hasOwnProperty(c)&&c!="prototype"&&c!="superclass"&&(b[c]=this[c]);a.statics&&(lvector.Util.extend(b,a.statics),delete a.statics);a.includes&&(lvector.Util.extend.apply(null,[e].concat(a.includes)),delete a.includes);if(a.options&&e.options)a.options=lvector.Util.extend({},
e.options,a.options);lvector.Util.extend(e,a);b.extend=arguments.callee;b.include=function(a){lvector.Util.extend(this.prototype,a)};return b};lvector.Layer=lvector.Class.extend({options:{fields:"",scaleRange:null,map:null,uniqueField:null,visibleAtScale:!0,dynamic:!1,autoUpdate:!1,autoUpdateInterval:null,popupTemplate:null,popupOptions:{},singlePopup:!1,symbology:null,showAll:!1},initialize:function(a){lvector.Util.setOptions(this,a)},setMap:function(a){if(!a||!this.options.map)if(a){this.options.map=a;if(this.options.scaleRange&&this.options.scaleRange instanceof Array&&this.options.scaleRange.length===2){var a=this.options.map.getZoom(),
b=this.options.scaleRange;this.options.visibleAtScale=a>=b[0]&&a<=b[1]}this._show()}else this._hide(),this.options.map=a},getMap:function(){return this.options.map},setOptions:function(){},_show:function(){this._addIdleListener();this.options.scaleRange&&this.options.scaleRange instanceof Array&&this.options.scaleRange.length===2&&this._addZoomChangeListener();if(this.options.visibleAtScale){if(this.options.autoUpdate&&this.options.autoUpdateInterval){var a=this;this._autoUpdateInterval=setInterval(function(){a._getFeatures()},
this.options.autoUpdateInterval)}this.options.map.fire("moveend").fire("zoomend")}},_hide:function(){this._idleListener&&this.options.map.off("moveend",this._idleListener);this._zoomChangeListener&&this.options.map.off("zoomend",this._zoomChangeListener);this._autoUpdateInterval&&clearInterval(this._autoUpdateInterval);this._clearFeatures();this._lastQueriedBounds=null;if(this._gotAll)this._gotAll=!1},_hideVectors:function(){for(var a=0;a<this._vectors.length;a++){if(this._vectors[a].vector)if(this.options.map.removeLayer(this._vectors[a].vector),
this._vectors[a].popup)this.options.map.removeLayer(this._vectors[a].popup);else if(this.popup&&this.popup.associatedFeature&&this.popup.associatedFeature==this._vectors[a])this.options.map.removeLayer(this.popup),this.popup=null;if(this._vectors[a].vectors&&this._vectors[a].vectors.length)for(var b=0;b<this._vectors[a].vectors.length;b++)if(this.options.map.removeLayer(this._vectors[a].vectors[b]),this._vectors[a].vectors[b].popup)this.options.map.removeLayer(this._vectors[a].vectors[b].popup);else if(this.popup&&
this.popup.associatedFeature&&this.popup.associatedFeature==this._vectors[a])this.options.map.removeLayer(this.popup),this.popup=null}},_showVectors:function(){for(var a=0;a<this._vectors.length;a++)if(this._vectors[a].vector&&this.options.map.addLayer(this._vectors[a].vector),this._vectors[a].vectors&&this._vectors[a].vectors.length)for(var b=0;b<this._vectors[a].vectors.length;b++)this.options.map.addLayer(this._vectors[a].vectors[b])},_clearFeatures:function(){this._hideVectors();this._vectors=
[]},_addZoomChangeListener:function(){this.options.map.on("zoomend",this._zoomChangeListener,this)},_zoomChangeListener:function(){this._checkLayerVisibility()},_idleListener:function(){if(this.options.visibleAtScale)if(this.options.showAll){if(!this._gotAll)this._getFeatures(),this._gotAll=!0}else this._getFeatures()},_addIdleListener:function(){this.options.map.on("moveend",this._idleListener,this)},_checkLayerVisibility:function(){var a=this.options.visibleAtScale,b=this.options.map.getZoom(),
e=this.options.scaleRange;this.options.visibleAtScale=b>=e[0]&&b<=e[1];if(a!==this.options.visibleAtScale)this[this.options.visibleAtScale?"_showVectors":"_hideVectors"]();if(a&&!this.options.visibleAtScale&&this._autoUpdateInterval)clearInterval(this._autoUpdateInterval);else if(!a&&this.options.autoUpdate&&this.options.autoUpdateInterval){var c=this;this._autoUpdateInterval=setInterval(function(){c._getFeatures()},this.options.autoUpdateInterval)}},_setPopupContent:function(a){var b=a.popupContent,
e=a.attributes||a.properties,c;if(typeof this.options.popupTemplate=="string"){c=this.options.popupTemplate;for(var d in e)c=c.replace(RegExp("{"+d+"}","g"),e[d])}else if(typeof this.options.popupTemplate=="function")c=this.options.popupTemplate(e);else return;a.popupContent=c;a.popup?a.popupContent!==b&&a.popup.setContent(a.popupContent):this.popup&&this.popup.associatedFeature==a&&a.popupContent!==b&&this.popup.setContent(a.popupContent)},_showPopup:function(a,b){var e=b.latlng;e||L.Util.extend(this.options.popupOptions,
{offset:b.target.options.icon.popupAnchor});var c;if(this.options.singlePopup){if(this.popup)this.options.map.removeLayer(this.popup),this.popup=null;this.popup=new L.Popup(this.options.popupOptions,a.vector);this.popup.associatedFeature=a;c=this}else a.popup=new L.Popup(this.options.popupOptions,a.vector),c=a;c.popup.setLatLng(e?b.latlng:b.target.getLatLng());c.popup.setContent(a.popupContent);this.options.map.addLayer(c.popup)},_getFeatureVectorOptions:function(a){var b={},a=a.attributes||a.properties;
if(this.options.symbology)switch(this.options.symbology.type){case "single":for(var e in this.options.symbology.vectorOptions)b[e]=this.options.symbology.vectorOptions[e];break;case "unique":for(var c=this.options.symbology.property,d=0,f=this.options.symbology.values.length;d<f;d++)if(a[c]==this.options.symbology.values[d].value)for(e in this.options.symbology.values[d].vectorOptions)b[e]=this.options.symbology.values[d].vectorOptions[e];break;case "range":c=this.options.symbology.property;d=0;for(f=
this.options.symbology.ranges.length;d<f;d++)if(a[c]>=this.options.symbology.ranges[d].range[0]&&a[c]<=this.options.symbology.ranges[d].range[1])for(e in this.options.symbology.ranges[d].vectorOptions)b[e]=this.options.symbology.ranges[d].vectorOptions[e]}return b},_getPropertiesChanged:function(a,b){var e=!1,c;for(c in a)a[c]!=b[c]&&(e=!0);return e},_getGeometryChanged:function(a,b){var e=!1;a.coordinates&&a.coordinates instanceof Array?a.coordinates[0]==b.coordinates[0]&&a.coordinates[1]==b.coordinates[1]||
(e=!0):a.x==b.x&&a.y==b.y||(e=!0);return e},_esriJsonGeometryToLeaflet:function(a,b){var e,c;if(a.x&&a.y)e=new L.Marker(new L.LatLng(a.y,a.x),b);else if(a.points){c=[];for(var d=0,f=a.points.length;d<f;d++)c.push(new L.Marker(new L.LatLng(a.points[d].y,a.points[d].x),b))}else if(a.paths)if(a.paths.length>1){c=[];d=0;for(f=a.paths.length;d<f;d++){for(var g=[],h=0,j=a.paths[d].length;h<j;h++)g.push(new L.LatLng(a.paths[d][h][1],a.paths[d][h][0]));c.push(new L.Polyline(g,b))}}else{g=[];d=0;for(f=a.paths[0].length;d<
f;d++)g.push(new L.LatLng(a.paths[0][d][1],a.paths[0][d][0]));e=new L.Polyline(g,b)}else if(a.rings)if(a.rings.length>1){c=[];d=0;for(f=a.rings.length;d<f;d++){for(var i=[],g=[],h=0,j=a.rings[d].length;h<j;h++)g.push(new L.LatLng(a.rings[d][h][1],a.rings[d][h][0]));i.push(g);c.push(new L.Polygon(i,b))}}else{i=[];g=[];d=0;for(f=a.rings[0].length;d<f;d++)g.push(new L.LatLng(a.rings[0][d][1],a.rings[0][d][0]));i.push(g);e=new L.Polygon(i,b)}return e||c},_geoJsonGeometryToLeaflet:function(a,b){var e,
c;switch(a.type){case "Point":e=new L.Marker(new L.LatLng(a.coordinates[1],a.coordinates[0]),b);break;case "MultiPoint":c=[];for(var d=0,f=a.coordinates.length;d<f;d++)c.push(new L.Marker(new L.LatLng(a.coordinates[d][1],a.coordinates[d][0]),b));break;case "LineString":for(var g=[],d=0,f=a.coordinates.length;d<f;d++)g.push(new L.LatLng(a.coordinates[d][1],a.coordinates[d][0]));e=new L.Polyline(g,b);break;case "MultiLineString":c=[];d=0;for(f=a.coordinates.length;d<f;d++){for(var g=[],h=0,j=a.coordinates[d].length;h<
j;h++)g.push(new L.LatLng(a.coordinates[d][h][1],a.coordinates[d][h][0]));c.push(new L.Polyline(g,b))}break;case "Polygon":for(var i=[],d=0,f=a.coordinates.length;d<f;d++){g=[];h=0;for(j=a.coordinates[d].length;h<j;h++)g.push(new L.LatLng(a.coordinates[d][h][1],a.coordinates[d][h][0]));i.push(g)}e=new L.Polygon(i,b);break;case "MultiPolygon":c=[];d=0;for(f=a.coordinates.length;d<f;d++){i=[];h=0;for(j=a.coordinates[d].length;h<j;h++){for(var g=[],k=0,l=a.coordinates[d][h].length;k<l;k++)g.push(new L.LatLng(a.coordinates[d][h][k][1],
a.coordinates[d][h][k][0]));i.push(g)}c.push(new L.Polygon(i,b))}break;case "GeometryCollection":c=[];d=0;for(f=a.geometries.length;d<f;d++)c.push(this._geoJsonGeometryToLeaflet(a.geometries[d],b))}return e||c},_makeJsonpRequest:function(a){var b=document.getElementsByTagName("head")[0],e=document.createElement("script");e.type="text/javascript";e.src=a;b.appendChild(e)}});lvector.AGS=lvector.Layer.extend({initialize:function(a){for(var b=0,e=this._requiredParams.length;b<e;b++)if(!a[this._requiredParams[b]])throw Error('No "'+this._requiredParams[b]+'" parameter found.');this._globalPointer="AGS_"+Math.floor(Math.random()*1E5);window[this._globalPointer]=this;a.url.substr(a.url.length-1,1)!=="/"&&(a.url+="/");this._originalOptions=lvector.Util.extend({},a);if(a.esriOptions)if(typeof a.esriOptions=="object")lvector.Util.extend(a,this._convertEsriOptions(a.esriOptions));
else{this._getEsriOptions();return}lvector.Layer.prototype.initialize.call(this,a);if(this.options.where)this.options.where=encodeURIComponent(this.options.where);this._vectors=[];if(this.options.map){if(this.options.scaleRange&&this.options.scaleRange instanceof Array&&this.options.scaleRange.length===2)a=this.options.map.getZoom(),b=this.options.scaleRange,this.options.visibleAtScale=a>=b[0]&&a<=b[1];this._show()}},options:{where:"1=1",url:null,useEsriOptions:!1},_requiredParams:["url"],_convertEsriOptions:function(a){var b=
{};if(!(a.minScale==void 0||a.maxScale==void 0)){var e=this._scaleToLevel(a.minScale),c=this._scaleToLevel(a.maxScale);c==0&&(c=20);b.scaleRange=[e,c]}if(a.drawingInfo&&a.drawingInfo.renderer)b.symbology=this._renderOptionsToSymbology(a.drawingInfo.renderer);return b},_getEsriOptions:function(){this._makeJsonpRequest(this._originalOptions.url+"?f=json&callback="+this._globalPointer+"._processEsriOptions")},_processEsriOptions:function(a){var b=this._originalOptions;b.esriOptions=a;this.initialize(b)},
_scaleToLevel:function(a){var b=[5.91657527591555E8,2.95828763795777E8,1.47914381897889E8,7.3957190948944E7,3.6978595474472E7,1.8489297737236E7,9244648.868618,4622324.434309,2311162.217155,1155581.108577,577790.554289,288895.277144,144447.638572,72223.819286,36111.909643,18055.954822,9027.977411,4513.988705,2256.994353,1128.497176,564.248588,282.124294];if(a==0)return 0;for(var e=0,c=0;c<b.length-1;c++){var d=b[c+1];if(a<=b[c]&&a>d){e=c;break}}return e},_renderOptionsToSymbology:function(a){symbology=
{};switch(a.type){case "simple":symbology.type="single";symbology.vectorOptions=this._parseSymbology(a.symbol);break;case "uniqueValue":symbology.type="unique";symbology.property=a.field1;for(var b=[],e=0;e<a.uniqueValueInfos.length;e++){var c=a.uniqueValueInfos[e],d={};d.value=c.value;d.vectorOptions=this._parseSymbology(c.symbol);d.label=c.label;b.push(d)}symbology.values=b;break;case "classBreaks":symbology.type="range";symbology.property=rend.field;b=[];c=a.minValue;for(e=0;e<a.classBreakInfos.length;e++){var d=
a.classBreakInfos[e],f={};f.range=[c,d.classMaxValue];c=d.classMaxValue;f.vectorOptions=this._parseSymbology(d.symbol);f.label=d.label;b.push(f)}symbology.ranges=b}return symbology},_parseSymbology:function(a){var b={};switch(a.type){case "esriSMS":case "esriPMS":a=L.Icon.extend({iconUrl:"data:"+a.contentType+";base64,"+a.imageData,shadowUrl:null,iconSize:new L.Point(a.width,a.height),iconAnchor:new L.Point(a.width/2+a.xoffset,a.height/2+a.yoffset),popupAnchor:new L.Point(0,-(a.height/2))});b.icon=
new a;break;case "esriSLS":b.weight=a.width;b.color=this._parseColor(a.color);b.opacity=this._parseAlpha(a.color[3]);break;case "esriSFS":a.outline?(b.weight=a.outline.width,b.color=this._parseColor(a.outline.color),b.opacity=this._parseAlpha(a.outline.color[3])):(b.weight=0,b.color="#000000",b.opacity=0),a.style!="esriSFSNull"?(b.fillColor=this._parseColor(a.color),b.fillOpacity=this._parseAlpha(a.color[3])):(b.fillColor="#000000",b.fillOpacity=0)}return b},_parseColor:function(a){red=this._normalize(a[0]);
green=this._normalize(a[1]);blue=this._normalize(a[2]);return"#"+this._pad(red.toString(16))+this._pad(green.toString(16))+this._pad(blue.toString(16))},_normalize:function(a){return a<1&&a>0?Math.floor(a*255):a},_pad:function(a){return a.length>1?a.toUpperCase():"0"+a.toUpperCase()},_parseAlpha:function(a){return a/255},_getFeatures:function(){this.options.uniqueField||this._clearFeatures();var a=this.options.url+"query?returnGeometry=true&outSR=4326&f=json&outFields="+this.options.fields+"&where="+
this.options.where+"&callback="+this._globalPointer+"._processFeatures";this.options.showAll||(a+="&inSR=4326&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&geometry="+this.options.map.getBounds().toBBoxString());this._makeJsonpRequest(a)},_processFeatures:function(a){if(this.options.map){var b=this.options.map.getBounds();if(!this._lastQueriedBounds||!this._lastQueriedBounds.equals(b)||this.options.autoUpdate)if(this._lastQueriedBounds=b,a&&a.features&&a.features.length)for(b=
0;b<a.features.length;b++){var e=!1;if(this.options.uniqueField)for(var c=0;c<this._vectors.length;c++)if(a.features[b].attributes[this.options.uniqueField]==this._vectors[c].attributes[this.options.uniqueField]&&(e=!0,this.options.dynamic)){if(this._getGeometryChanged(this._vectors[c].geometry,a.features[b].geometry)&&!isNaN(a.features[b].geometry.x)&&!isNaN(a.features[b].geometry.y))this._vectors[c].geometry=a.features[b].geometry,this._vectors[c].vector.setLatLng(new L.LatLng(this._vectors[c].geometry.y,
this._vectors[c].geometry.x)),this._vectors[c].popup?this._vectors[c].popup.setLatLng(new L.LatLng(this._vectors[c].geometry.y,this._vectors[c].geometry.x)):this.popup&&this.popup.associatedFeature==this._vectors[c]&&this.popup.setLatLng(new L.LatLng(this._vectors[c].geometry.y,this._vectors[c].geometry.x));if(this._getPropertiesChanged(this._vectors[c].attributes,a.features[b].attributes))this._vectors[c].attributes=a.features[b].attributes,this.options.popupTemplate&&this._setPopupContent(this._vectors[c]),
this.options.symbology&&this.options.symbology.type!="single"&&(this._vectors[c].vector.setStyle?this._vectors[c].vector.setStyle(this._getFeatureVectorOptions(this._vectors[c])):this._vectors[c].vector.setIcon&&this._vectors[c].vector.setIcon(this._getFeatureVectorOptions(this._vectors[c]).icon))}if(!e||!this.options.uniqueField){e=this._esriJsonGeometryToLeaflet(a.features[b].geometry,this._getFeatureVectorOptions(a.features[b]));a.features[b][e instanceof Array?"vectors":"vector"]=e;if(a.features[b].vector)this.options.map.addLayer(a.features[b].vector);
else if(a.features[b].vectors&&a.features[b].vectors.length)for(e=0;e<a.features[b].vectors.length;e++)this.options.map.addLayer(a.features[b].vectors[e]);this._vectors.push(a.features[b]);if(this.options.popupTemplate){var d=this,e=a.features[b];this._setPopupContent(e);(function(a){if(a.vector)a.vector.on("click",function(b){d._showPopup(a,b)});else if(a.vectors)for(var b=0,c=a.vectors.length;b<c;b++)a.vectors[b].on("click",function(b){d._showPopup(a,b)})})(e)}}}}}});lvector.A2E=lvector.AGS.extend({initialize:function(a){for(var b=0,e=this._requiredParams.length;b<e;b++)if(!a[this._requiredParams[b]])throw Error('No "'+this._requiredParams[b]+'" parameter found.');this._globalPointer="A2E_"+Math.floor(Math.random()*1E5);window[this._globalPointer]=this;a.url.substr(a.url.length-1,1)!=="/"&&(a.url+="/");this._originalOptions=lvector.Util.extend({},a);if(a.esriOptions)if(typeof a.esriOptions=="object")lvector.Util.extend(a,this._convertEsriOptions(a.esriOptions));
else{this._getEsriOptions();return}lvector.Layer.prototype.initialize.call(this,a);if(this.options.where)this.options.where=encodeURIComponent(this.options.where);this._vectors=[];if(this.options.map){if(this.options.scaleRange&&this.options.scaleRange instanceof Array&&this.options.scaleRange.length===2)a=this.options.map.getZoom(),b=this.options.scaleRange,this.options.visibleAtScale=a>=b[0]&&a<=b[1];this._show()}if(this.options.autoUpdate&&this.options.esriOptions.editFeedInfo){this._makeJsonpRequest("http://cdn.pubnub.com/pubnub-3.1.min.js");
var c=this;this._pubNubScriptLoaderInterval=setInterval(function(){window.PUBNUB&&c._pubNubScriptLoaded()},200)}},_pubNubScriptLoaded:function(){clearInterval(this._pubNubScriptLoaderInterval);this.pubNub=PUBNUB.init({subscribe_key:this.options.esriOptions.editFeedInfo.pubnubSubscribeKey,ssl:!1,origin:"pubsub.pubnub.com"});var a=this;this.pubNub.subscribe({channel:this.options.esriOptions.editFeedInfo.pubnubChannel,callback:function(){a._getFeatures()},error:function(){}})}});lvector.GeoIQ=lvector.Layer.extend({initialize:function(a){for(var b=0,e=this._requiredParams.length;b<e;b++)if(!a[this._requiredParams[b]])throw Error('No "'+this._requiredParams[b]+'" parameter found.');lvector.Layer.prototype.initialize.call(this,a);this._globalPointer="GeoIQ_"+Math.floor(Math.random()*1E5);window[this._globalPointer]=this;this._vectors=[];if(this.options.map){if(this.options.scaleRange&&this.options.scaleRange instanceof Array&&this.options.scaleRange.length===2)a=this.options.map.getZoom(),
b=this.options.scaleRange,this.options.visibleAtScale=a>=b[0]&&a<=b[1];this._show()}},options:{dataset:null},_requiredParams:["dataset"],_getFeatures:function(){this.options.uniqueField||this._clearFeatures();var a="http://geocommons.com/datasets/"+this.options.dataset+"/features.json?geojson=1&callback="+this._globalPointer+"._processFeatures&limit=999";this.options.showAll||(a+="&bbox="+this.options.map.getBounds().toBBoxString()+"&intersect=full");this._makeJsonpRequest(a)},_processFeatures:function(a){if(this.options.map){var a=
JSON.parse(a),b=this.options.map.getBounds();if(!this._lastQueriedBounds||!this._lastQueriedBounds.equals(b)||this._autoUpdateInterval)if(this._lastQueriedBounds=b,a&&a.features&&a.features.length)for(b=0;b<a.features.length;b++){var e=!1;if(this.options.uniqueField)for(var c=0;c<this._vectors.length;c++)if(a.features[b].properties[this.options.uniqueField]==this._vectors[c].properties[this.options.uniqueField]&&(e=!0,this.options.dynamic)){if(this._getGeometryChanged(this._vectors[c].geometry,a.features[b].geometry)&&
!isNaN(a.features[b].geometry.coordinates[0])&&!isNaN(a.features[b].geometry.coordinates[1]))this._vectors[c].geometry=a.features[b].geometry,this._vectors[c].vector.setLatLng(new L.LatLng(this._vectors[c].geometry.coordinates[1],this._vectors[c].geometry.coordinates[0]));if(this._getPropertiesChanged(this._vectors[c].properties,a.features[b].properties)&&(this._vectors[c].properties=a.features[b].properties,this.options.popupTemplate&&this._setPopupContent(this._vectors[c]),this.options.symbology&&
this.options.symbology.type!="single"))if(this._vectors[c].vector)this._vectors[c].vector.setOptions(this._getFeatureVectorOptions(this._vectors[c]));else if(this._vectors[c].vectors)for(var d=0,f=this._vectors[c].vectors.length;d<f;d++)this._vectors[c].vectors[d].setOptions(this._getFeatureVectorOptions(this._vectors[c]))}if(!e||!this.options.uniqueField){e=this._geoJsonGeometryToLeaflet(a.features[b].geometry,this._getFeatureVectorOptions(a.features[b]));a.features[b][e instanceof Array?"vectors":
"vector"]=e;if(a.features[b].vector)this.options.map.addLayer(a.features[b].vector);else if(a.features[b].vectors&&a.features[b].vectors.length)for(d=0;d<a.features[b].vectors.length;d++)this.options.map.addLayer(a.features[b].vectors[d]);this._vectors.push(a.features[b]);if(this.options.popupTemplate){var g=this,e=a.features[b];this._setPopupContent(e);(function(a){if(a.vector)a.vector.on("click",function(b){g._showPopup(a,b)});else if(a.vectors)for(var b=0,c=a.vectors.length;b<c;b++)a.vectors[b].on("click",
function(b){g._showPopup(a,b)})})(e)}}}}}});lvector.CartoDB=lvector.Layer.extend({initialize:function(a){for(var b=0,e=this._requiredParams.length;b<e;b++)if(!a[this._requiredParams[b]])throw Error('No "'+this._requiredParams[b]+'" parameter found.');lvector.Layer.prototype.initialize.call(this,a);this._globalPointer="CartoDB_"+Math.floor(Math.random()*1E5);window[this._globalPointer]=this;this._vectors=[];if(this.options.map){if(this.options.scaleRange&&this.options.scaleRange instanceof Array&&this.options.scaleRange.length===2)a=this.options.map.getZoom(),
b=this.options.scaleRange,this.options.visibleAtScale=a>=b[0]&&a<=b[1];this._show()}},options:{version:1,user:null,table:null,fields:"*",where:null,limit:null,uniqueField:"cartodb_id"},_requiredParams:["user","table"],_getFeatures:function(){var a=this.options.where||"";if(!this.options.showAll)for(var b=this.options.map.getBounds(),e=b.getSouthWest(),b=b.getNorthEast(),c=this.options.table.split(",").length,d=0;d<c;d++)a+=(a.length?" AND ":"")+(c>1?this.options.table.split(",")[d].split(".")[0]+
".the_geom":"the_geom")+" && st_setsrid(st_makebox2d(st_point("+e.lng+","+e.lat+"),st_point("+b.lng+","+b.lat+")),4326)";this.options.limit&&(a+=(a.length?" ":"")+"limit "+this.options.limit);a=a.length?" "+a:"";this._makeJsonpRequest("http://"+this.options.user+".cartodb.com/api/v"+this.options.version+"/sql?q="+encodeURIComponent("SELECT "+this.options.fields+" FROM "+this.options.table+(a.length?" WHERE "+a:""))+"&format=geojson&callback="+this._globalPointer+"._processFeatures")},_processFeatures:function(a){if(this.options.map){var b=
this.options.map.getBounds();if(!this._lastQueriedBounds||!this._lastQueriedBounds.equals(b)||this._autoUpdateInterval)if(this._lastQueriedBounds=b,a&&a.features&&a.features.length)for(b=0;b<a.features.length;b++){var e=!1;if(this.options.uniqueField)for(var c=0;c<this._vectors.length;c++)if(a.features[b].properties[this.options.uniqueField]==this._vectors[c].properties[this.options.uniqueField]&&(e=!0,this.options.dynamic)){if(this._getGeometryChanged(this._vectors[c].geometry,a.features[b].geometry)&&
!isNaN(a.features[b].geometry.coordinates[0])&&!isNaN(a.features[b].geometry.coordinates[1]))this._vectors[c].geometry=a.features[b].geometry,this._vectors[c].vector.setLatLng(new L.LatLng(this._vectors[c].geometry.coordinates[1],this._vectors[c].geometry.coordinates[0]));if(this._getPropertiesChanged(this._vectors[c].properties,a.features[b].properties)&&(this._vectors[c].properties=a.features[b].properties,this.options.popupTemplate&&this._setPopupContent(this._vectors[c]),this.options.symbology&&
this.options.symbology.type!="single"))if(this._vectors[c].vector)this._vectors[c].vector.setOptions(this._getFeatureVectorOptions(this._vectors[c]));else if(this._vectors[c].vectors)for(var d=0,f=this._vectors[c].vectors.length;d<f;d++)this._vectors[c].vectors[d].setOptions(this._getFeatureVectorOptions(this._vectors[c]))}if(!e||!this.options.uniqueField){e=this._geoJsonGeometryToLeaflet(a.features[b].geometry,this._getFeatureVectorOptions(a.features[b]));a.features[b][e instanceof Array?"vectors":
"vector"]=e;if(a.features[b].vector)this.options.map.addLayer(a.features[b].vector);else if(a.features[b].vectors&&a.features[b].vectors.length)for(d=0;d<a.features[b].vectors.length;d++)this.options.map.addLayer(a.features[b].vectors[d]);this._vectors.push(a.features[b]);if(this.options.popupTemplate){var g=this,e=a.features[b];this._setPopupContent(e);(function(a){if(a.vector)a.vector.on("click",function(b){g._showPopup(a,b)});else if(a.vectors)for(var b=0,c=a.vectors.length;b<c;b++)a.vectors[b].on("click",
function(b){g._showPopup(a,b)})})(e)}}}}}});
