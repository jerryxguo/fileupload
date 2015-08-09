/**
 * EPGEventFactory creates an EPG event object or an array of EPG Event objects
 * passed in from an external application. This factory creates its output from
 * EPG events passed in from Metadata Server.
 * @class $N.services.sdp.EPGEventFactory
 * @singleton
 * @requires $N.data.EPGEvent
 * @requires $N.services.sdp.EPGEventFactory
 * @author Mark Brown
 */
/* global define */
define('jsfw/services/sdp/EPGEventFactory',
	[
		'jsfw/data/EPGEvent'
	],
	function (EPGEvent) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};


		$N.services.sdp.EPGEventFactory = (function () {

			var defineGetter;

		    if (Object.defineProperty) {
		        defineGetter = function (obj, name, func) {
		            Object.defineProperty(obj, name, {
		                get: func,
		                enumerable: true
		            });
		        };
		    } else {
			    defineGetter = function (obj, name, func) {
			        obj.__defineGetter__(name, func);
			    };
			}

		    function getMappedObject(obj, serviceLookup) {
				//TODO: add the other properties as defined in EPGEvent
				var mapped = {
			        _data: obj
			    };

		        defineGetter(mapped, "eventId", function () {
					return mapped._data.id.toString();
		        });
		        defineGetter(mapped, "serviceId", function () {
					return mapped._data.serviceRef.toString();
		        });
		        defineGetter(mapped, "startTime", function () {
					return mapped._data.period.start * 1000;
		        });
		        defineGetter(mapped, "endTime", function () {
					return mapped._data.period.end * 1000;
		        });
		        defineGetter(mapped, "title", function () {
					return mapped._data.Title;
		        });
		        defineGetter(mapped, "shortDesc", function () {
					return mapped._data.Description;
		        });
		        defineGetter(mapped, "longDesc", function () {
					return mapped._data.Synopsis;
		        });
		        defineGetter(mapped, "parentalRating", function () {
					return mapped._data.Rating.precedence;
		        });
		        defineGetter(mapped, "promoImage", function () {
					return mapped._data.PromoImages && mapped._data.PromoImages.length ? mapped._data.PromoImages[0] : "";
		        });
		        defineGetter(mapped, "definition", function () {
					return mapped._data.Definition;
		        });
		        defineGetter(mapped, "year", function () {
					return mapped._data.Year;
		        });
		        defineGetter(mapped, "source", function () {
					return $N.data.EPGEvent.SOURCE.MDS;
		        });
		        defineGetter(mapped, "isCatchUp", function () {
					return mapped._data.isCatchUp;
		        });
		        defineGetter(mapped, "isStartOver", function () {
					return mapped._data.isStartOver;
		        });
		        defineGetter(mapped, "dvbEventId", function () {
					return mapped._data.eventId;
		        });
		        defineGetter(mapped, "isSeries", function () {
					return mapped._data.seriesRef ? true : false;
		        });
		        defineGetter(mapped, "uri", function () {
		        	var now,
		        		service,
		        		channelUri,
		        		liveString,
		        		channelName,
		        		videoPath;
		        	if (mapped.isCatchUp || mapped.isStartOver) {
		        		now = new Date().getTime();
		        		service = serviceLookup[mapped.serviceId];
		        		channelUri = service.uri;
		        		liveString = "Live/Channel("
		        		videoPath = channelUri.substring(0, channelUri.indexOf(liveString));
						channelName = channelUri.substring(channelUri.indexOf(liveString) + liveString.length);
						channelName = channelName.substring(0, channelName.indexOf(")/"));
						if (mapped.isStartOver && mapped.endTime > now && mapped.startTime < now) {
							return videoPath + "Startover/Channel(name=" + channelName + ",startTime=" + mapped.startTime + "0000)/index.m3u8";
						} else if (mapped.isCatchUp && mapped.endTime < now) {
							return videoPath + "Catchup/Channel(name=" + channelName + ",startTime=" + mapped.startTime + "0000,endTime=" + mapped.endTime + "0000)/index.m3u8";
						}
		        	}
		        	return null;
		        });
		        defineGetter(mapped, "casId", function () {
		        	var now,
		        		service;
		        	if (mapped.isCatchUp || mapped.isStartOver) {
		        		service = serviceLookup[mapped.serviceId];
						return service.casId;
		        	}
		        	return null;
		        });
				defineGetter(mapped, "isnPvr", function () {
					return (mapped._data.isnPvr === "true" || mapped._data.isnPvr === true) ? true : false;
				});
				return mapped;
		    }

		    function getMappedArray(array, serviceLookup) {
		        var i,
					mapped,
					mappedArray	= [];

				if (array.length > 0) {
			        for (i = 0; i < array.length; i++) {
						mapped = getMappedObject(array[i], serviceLookup);
						mappedArray.push(mapped);
					}
				}
				return mappedArray;
			}

		    return {

				/**
				 * Takes an event object as returned from the platform and returns an
				 * event object mapped to the framework standard as defined
				 * in $N.data.EPGEvent
				 * @method mapObject
				 * @param {Object} obj Object to map
				 * @return {Object}
				 */
				mapObject: function (obj, serviceLookup) {
					if (obj) {
						return getMappedObject(obj, serviceLookup);
					} else {
						return null;
					}
				},

				/**
				 * Takes an array of event objects from the platform and returns an
				 * array of event objects mapped to the framework standard as defined
				 * in $N.data.EPGEvent
				 * @method mapArray
				 * @param {Array} array Array of objects to map
				 * @return {Array}
				 */
				mapArray: function (array, serviceLookup) {
					if (array) {
			            return getMappedArray(array, serviceLookup);
					} else {
						return [];
					}
		        }
			};
		}());
		return $N.services.sdp.EPGEventFactory;
	}
);
