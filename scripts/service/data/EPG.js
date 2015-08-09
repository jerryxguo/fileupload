/**
 * This class manages EPG data retrieved directly from the Metadata Server: it doesn't cache the data.
 *
 * @class $N.services.sdp.EPG
 * @static
 * @singleton
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.EPGServiceFactory
 * @requires $N.services.sdp.EPGEventFactory
 * @author Mahesh Jagadeesan
 */
/* global define */
define('jsfw/services/sdp/EPG',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/EPGServiceFactory',
		'jsfw/services/sdp/EPGEventFactory',
		'jsfw/services/sdp/MetadataService'
	],
	function (Log, EPGServiceFactory, EPGEventFactory, MetadataService) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.EPG = (function () {
			var accountUID,
				locale,
				log = new $N.apps.core.Log("sdp", "EPG"),
				MAX_EVENT_DURATION = 3 * 3600 * 1000 * 1000,
				serviceCache = {},
				MAX_RESULTS = 9999;

			/**
			 * Creates a filter for a mds call to fetch events between start and end times
			 * @method createFilterForCurrentEvent
			 * @param {Object} mdsEvent object containing channel id and time window of the event
			 * @return {Object} programFilter filter object to be passed to mds
			 * @private
			 */
			function createFilterForCurrentEvent(mdsEvent) {
				var programFilter = {};
				programFilter.serviceRef = mdsEvent.channelId;
				if (mdsEvent.startTime) {
					programFilter["period.start"] = {"$lte": mdsEvent.startTime / 1000};
					programFilter["period.end"] = {"$gt": mdsEvent.startTime / 1000};
				}
				return programFilter;
			}

			/**
			 * Creates a filter for a mds call to fetch an event with a specified channel id and start time
			 * @method createFilterForNextEvent
			 * @param {Object} mdsEvent object containing channel id and time window of the event
			 * @return {Object} programFilter filter object to be passed to mds
			 * @private
			 */
			function createFilterForNextEvent(mdsEvent) {
				var programFilter = {};
				programFilter.serviceRef = mdsEvent.channelId;
				if (mdsEvent.startTime) {
					programFilter["period.start"] =  {"$gte": mdsEvent.startTime / 1000};
				}
				return programFilter;
			}

			/**
			 * Creates a filter for a mds call to fetch events by window
			 * @method createFilterForWindow
			 * @param {Object} timeWindow object containing an array of serviceids and a window start and end time
			 * @return {Object} programFilter filter object to be passed to mds
			 * @private
			 */
			function createFilterForWindow(timeWindow) {
				var programFilter = {};
				if (timeWindow.channelIds.length === 1) {
					programFilter.serviceRef = timeWindow.channelIds[0];
				} else {
					programFilter.serviceRef = {"$in": timeWindow.channelIds};
				}
				if (timeWindow.endTime) {
					programFilter["period.start"] = {"$lt": timeWindow.endTime / 1000};
				}
				if (timeWindow.startTime) {
					programFilter["period.end"] = {"$gt": timeWindow.startTime / 1000};
				}
				return programFilter;
			}

			function sortEventsByChannel(requestedChannels, returnedEvents) {
				var i,
					channel,
					sortedEventsLookup = {},
					sortedEventsArray = [];

				for (i = 0; i < requestedChannels.length; i++) {
					sortedEventsLookup[requestedChannels[i]] = [];
				}
				for (i = 0; i < returnedEvents.length; i++) {
					sortedEventsLookup[returnedEvents[i].serviceId].push(returnedEvents[i]);
				}
				for (channel in sortedEventsLookup) {
					if (sortedEventsLookup.hasOwnProperty(channel) && sortedEventsLookup[channel]) {
						sortedEventsArray = sortedEventsArray.concat(sortedEventsLookup[channel]);
					}
				}
				return sortedEventsArray;
			}

			function getTimeRoundedToMinute(time) {
				var tempDate = new Date(time);
				if (tempDate.getSeconds() >= 30) {
					tempDate.setMinutes(tempDate.getMinutes() + 1);
				}
				return new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), tempDate.getHours(), tempDate.getMinutes());
			}

			function retrieveEventsByWindow(serviceIds, startTime, endTime, successCallback, failureCallback, isCatchUp) {
				var	filter,
					processSuccess = function (response) {
						var events = [];
						if (response && response.programmes && response.programmes.length > 0) {
							events = $N.services.sdp.EPGEventFactory.mapArray(response.programmes, serviceCache);
							successCallback(sortEventsByChannel(serviceIds, events));
						} else {
							successCallback([]);
						}
					},
					processFailure = function (response) {
						log("retrieveEventsByWindow failure", "processFailure response = " + String(response));
						if (failureCallback) {
							failureCallback(response);
						}
					};
				startTime = getTimeRoundedToMinute(startTime);
				endTime = getTimeRoundedToMinute(endTime);

				if (serviceIds.length > 0) {
					filter = createFilterForWindow({'channelIds': serviceIds, 'startTime': startTime, 'endTime': endTime});
					if (isCatchUp) {
						filter.isCatchUp = true;
					}
					$N.services.sdp.MetadataService.getEPGData(this, processSuccess, processFailure, $N.services.sdp.MetadataService.RequestType.Events, filter, [["period.start", 1]], null, MAX_RESULTS);
				}
			}

			function cacheServices(serviceArray) {
				var i = 0;
				for (i = 0; i < serviceArray.length; i++) {
					serviceCache[serviceArray[i].serviceId] = serviceArray[i];
				}
			}

			return {
				/**
				 * Initialises the class
				 * @method init
				 * @param {Number} account account id
				 * @param {String} currentLocale the user's current locale (en_gb, es_es, etc.)
				 */
				init: function (account, currentLocale) {
					accountUID = account || null;
					locale = currentLocale || 'en_GB';
				},

				/**
				 * Initialises the class
				 * @method initialise
				 * @deprecated use init()
				 * @param {Number} account account id
				 * @param {String} currentLocale the user's current locale (en_gb, es_es, etc.)
				 */
				initialise: function (account, currentLocale) {
					this.init(account, currentLocale);
				},

				/**
				 * Fetched all the channels available regardless of subscription from the SDP
				 * @method fetchAllChannels
				 * @param {Function} successCallback function that will be executed
				 * @param {Function} [failureCallback] function that will be executed if the SDP call fails
				 * @async
				 */
				fetchAllChannels: function (successCallback, failureCallback) {
					log('fetchAllChannels', 'Enter');
					var filter = {},
						processSuccess = function (response) {
							var channels = [];
							if (response && response.services && response.services.length > 0) {
								channels = $N.services.sdp.EPGServiceFactory.mapArray(response.services);
								cacheServices(channels);
								successCallback(channels);
							} else {
								successCallback(channels);
							}
						},
						processFailure = function (response) {
							failureCallback(response);
						};
					$N.services.sdp.MetadataService.getEPGData(this, processSuccess, processFailure, $N.services.sdp.MetadataService.RequestType.Channels, filter, [["Title", 1]], null);
					log('fetchAllChannels', 'Exit');
				},

				/**
				 * Retrieves information about the currently showing event for the specified channel. Since this
				 * call is asynchronous, the caller accesses the retrieved information by passing  in a callback
				 * function.
				 * @method fetchCurrentEventForService
				 * @async
				 * @param {String} serviceId service id of the requested channel
				 * @param {Function} successCallback function that will be executed after the event information becomes
				 * fetched
				 * @param {Function} [failureCallback] function that will be executed if the SDP call fails
				 */
				fetchCurrentEventForService: function (serviceId, successCallback, failureCallback) {
					log('fetchCurrentEventForService', 'Enter');
					var mdsEvent = {},
						currentEvent,
						filter,
						startDate = new Date(),
						processSuccess = function (response) {
							if (response && response.programmes && response.programmes.length > 0) {
								currentEvent = $N.services.sdp.EPGEventFactory.mapObject(response.programmes[0], serviceCache);
								successCallback(currentEvent);
							} else {
								successCallback(null);
							}
						},
						processFailure = function (response) {
							log("fetchCurrentEventForService failure", "processFailure response = " + String(response));
						};
					if (serviceId) {
						mdsEvent.channelId = serviceId;
						mdsEvent.startTime = getTimeRoundedToMinute(startDate.getTime());
						mdsEvent.endTime = getTimeRoundedToMinute(startDate.getTime() + MAX_EVENT_DURATION);
						filter = createFilterForCurrentEvent(mdsEvent);
						$N.services.sdp.MetadataService.getEPGData(this, processSuccess, processFailure, $N.services.sdp.MetadataService.RequestType.Events, filter, [["period.start", 1]], null, 1, null);
					}
					log('fetchCurrentEventForService', 'Exit');
				},

				/**
				 * Retrieves information about the next event for the specified channel. Since this call is asynchronous,
				 * the caller accesses the retrieved information by passing in a callback function.
				 * @method fetchNextEventForService
				 * @async
				 * @param {String} serviceId service id of the requested channel
				 * @param {Function} successCallback function that will be executed after the event information becomes
				 * available
				 * @param {Function} [failureCallback] function that will be executed if the SDP call fails
				 */
				fetchNextEventForService: function (serviceId, successCallback, failureCallback) {
					log('fetchNextEventForService', 'Enter');
					var me = this,
						filter,
						nextEvent,
						mdsEvent = {},
						processCurrentSuccess = function (currentResponse) {
							var startTime,
								endTime,
								processNextSuccess = function (nextResponse) {
									if (nextResponse && nextResponse.programmes.length > 0) {
										nextEvent = $N.services.sdp.EPGEventFactory.mapObject(nextResponse.programmes[0], serviceCache);
										successCallback(nextEvent);
									} else {
										successCallback(null);
									}
								},
								processNextFailure = function (nextResponse) {
									log("fetchNextEventForService Next failure", "for service " + serviceId, Log.LOG_DEBUG);
								};
							if (currentResponse) {
								startTime = currentResponse.endTime;
								endTime = currentResponse.endTime + (60 * 1000);
								mdsEvent.channelId = serviceId;
								mdsEvent.startTime = startTime;
								filter = createFilterForNextEvent(mdsEvent);
								$N.services.sdp.MetadataService.getEPGData(this, processNextSuccess, processNextFailure, $N.services.sdp.MetadataService.RequestType.Events, filter, [["period.start", 1]], null, 1);
							} else {
								successCallback(null);
							}
						},
						processCurrentFailure = function (currentResponse) {
							log("fetchNextEventForService Current failure", "for service " + serviceId, Log.LOG_DEBUG);
						};
					if (serviceId) {
						me.fetchCurrentEventForService(serviceId, processCurrentSuccess, processCurrentFailure);
					}
					log('fetchNextEventForService', 'Exit');
				},

				/**
				 * Retrieves information about events falling within a specified time window. Since this call is asynchronous,
				 * the caller accesses the retrieved information by passing in a callback function.
				 * @method fetchEventsByWindow
				 * @async
				 * @param {Array} serviceIds Array of serviceids)
				 * @param {Number} startTime start time (in ms)
				 * @param {Number} endTime end time (in ms)
				 * @param {Function} successCallback function that will be invoked after the event information becomes
				 * available
				 * @param {Function} [failureCallback] function that will be executed if the SDP call fails
				 */
				fetchEventsByWindow: function (serviceIds, startTime, endTime, successCallback, failureCallback) {
					log('fetchEventsByWindow', 'Enter');
					retrieveEventsByWindow(serviceIds, startTime, endTime, successCallback, failureCallback);
					log('fetchEventsByWindow', 'Exit');
				},

				/**
				 * Retrieves catch-up events falling within a specified time window for the given list of services.
				 * @method fetchCatchUpEventsByWindow
				 * @async
				 * @param {Array} serviceIds list of service ids
				 * @param {Number} startTime start time in ms
				 * @param {Number} endTime end time in ms
				 * @param {Function} successCallback function that will be called when the request is successful
				 * @param {Array} successCallback.events list of events arranged in order of their start times
				 * @param {Function} failureCallback that that will be called when the request has failed
				 */
				fetchCatchUpEventsByWindow: function (serviceIds, startTime, endTime, successCallback, failureCallback) {
					log('fetchCatchUpEventsByWindow', 'Enter');
					retrieveEventsByWindow(serviceIds, startTime, endTime, successCallback, failureCallback, true);
					log('fetchCatchUpEventsByWindow', 'Exit');
				},

				/**
				 * Retrieves events that are deemed watchable within the given time window. For a window that's entirely in the past,
				 * this means only catch-up events; for a window that starts in the past and extends into the future, this means catch-up
				 * events for the past time window and all events in the future window; for a window that's entirely in the future,
				 * this means all events.
				 * @method fetchWatchableEventsByWindow
				 * @async
				 * @param {Array} serviceIds list of service ids
				 * @param {Number} startTime start time in ms
				 * @param {Number} endTime end time in ms
				 * @param {Function} successCallback function that will be called if the request is successful
				 * @param {Array} successCallback.events list of events arranged in order of their start times
				 * @param {Function} failureCallback function that will be called if the request fails
				 */
				fetchWatchableEventsByWindow: function (serviceIds, startTime, endTime, successCallback, failureCallback) {
					retrieveEventsByWindow(serviceIds, startTime, endTime, function (eventList) {
						var now = new Date().getTime();
						eventList = eventList.filter(function (currentEvent) {
							return (currentEvent.startTime < now && currentEvent.endTime <= now) ? currentEvent.isCatchUp : true;
						});
						successCallback(eventList);
					}, failureCallback);
				},

				fetchEventsForChannelWithDummyEvents: function (serviceId, startTime, endTime, successCallback, failureCallback) {
					//TODO: for implementation later, when we can consider IPDataLoader.js SDP abstraction/separation
				},

				/**
				* Retrieves channels for the given package ids
				* @method fetchChannelsForPackages
				* @param {Array} packageIds
				* @param {Function} callback
				*/
				fetchChannelsForPackages: function (packageIds, callback) {
					var filter = {
							"technical.productRefs": {"$in": packageIds}
						},
						processSuccess = function (response) {
							var channels = [];
							if (response && response.services && response.services.length > 0) {
								channels = $N.services.sdp.EPGServiceFactory.mapArray(response.services);
								callback(channels);
							} else {
								callback(channels);
							}
						},
						processFailure = function (response) {
							callback([]);
						};
					$N.services.sdp.MetadataService.getEPGData(this, processSuccess, processFailure, $N.services.sdp.MetadataService.RequestType.Channels, filter, [["Title", 1]], null);
				}
			};
		}());
		return $N.services.sdp.EPG;
	}
);