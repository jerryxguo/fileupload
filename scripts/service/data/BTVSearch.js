/**
 * BTVSearch class is used to offer an API to return search
 * results from MDS.
 * @class $N.services.sdp.BTVSearch
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.MetadataService
 * @requires $N.services.sdp.EPGEventFactory
 * @author gstacey
 * @singleton
 */
/* global define */
define('jsfw/services/sdp/BTVSearch',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/MetadataService',
		'jsfw/services/sdp/EPGEventFactory'
	],
	function (Log, MetadataService, EPGEventFactory) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.BTVSearch = (function () {

			var log = new $N.apps.core.Log("sdp", "BTVSearch"),
				failureCallback = null,
				dataReceivedCallback = null,
				MAX_RESULTS = 9999,
				MAX_NON_PAGING_RESULTS = 100;

			function getEpgData(result, filter, isPagingRequest, ids) {
				var searchResult = {
						start : result.start,
						numberFound : result.numberFound
					},
					successCallback = function (response) {
						var mongoLookup = {},
							sortedResponseArray = [],
							responseObject = {},
							length,
							currentResult,
							i;

						if (response && response.programmes) {
							for (i = 0, length = response.programmes.length; i < length; i++) {
								mongoLookup[response.programmes[i].id] = response.programmes[i];
							}
						}

						for (i = 0, length = ids.length; i < length; i++) {
							currentResult = mongoLookup[ids[i]];
							if (currentResult) {
								sortedResponseArray.push(currentResult);
							}
						}

						if (sortedResponseArray.length > 0) {
							searchResult.events = $N.services.sdp.EPGEventFactory.mapArray(sortedResponseArray);
						} else {
							searchResult.events = [];
						}
						dataReceivedCallback(searchResult);
					};

				if (!filter) {
					filter = {};
				}
				filter.id = {"$in": ids};
				if (isPagingRequest) {
					searchResult.numberFound = result.numberFound;
				} else if (result.numberFound > MAX_NON_PAGING_RESULTS) {
					searchResult.numberFound = MAX_NON_PAGING_RESULTS;
				}
				$N.services.sdp.MetadataService.getEPGData(this, successCallback, function () {
					dataReceivedCallback(null);
				}, $N.services.sdp.MetadataService.RequestType.Events, filter, null, null, ids.length, null);
			}

			function nonExpiredEventsCallback(result, isPagingRequest) {
				var filter = {},
					i = 0,
					len = 0,
					ids = [];

				for (i = 0, len = result.docs.length; i < len; i++) {
					ids.push(result.docs[i].id);
				}
				filter["period.end"] = {"$gte": new Date().getTime() / 1000};
				getEpgData(result, filter, isPagingRequest, ids);
			}

			function eventsCallback(result, isPagingRequest) {
				var filter = {},
					i = 0,
					len = 0,
					ids = [];

				for (i = 0, len = result.docs.length; i < len; i++) {
					ids.push(result.docs[i].id);
				}
				getEpgData(result, filter, isPagingRequest, ids);
			}

			function createConfig(limit, startFrom, title, dataCallback, exactMatch) {
				var isPaging = false;
				dataReceivedCallback = dataCallback || function () {};

				if (limit && (startFrom || startFrom === 0)) {
					isPaging = true;
				}
				return {
					isPaging: isPaging,
					title : exactMatch ? '"' + title + '"' : '*' + title + '*',
					limit : limit || MAX_NON_PAGING_RESULTS,
					startFrom : startFrom || 0
				};
			}

			function doSearch(searchTerm, queryFields, startRow, endRow, filter) {
				var filterQuery = [],
					limit,
					isPagingRequest = false,
					me = this,
					callback = function (result) {
						eventsCallback(result, isPagingRequest);
					};

				if (endRow && (startRow || startRow === 0)) {
					isPagingRequest = true;
				}
				limit = (endRow || MAX_NON_PAGING_RESULTS) - (startRow || 0);
				limit = limit > MAX_NON_PAGING_RESULTS ? MAX_NON_PAGING_RESULTS : limit;
				if (filter && filter.length) {
					filterQuery = filter.slice(0);
				}
				filterQuery.push("scope:btv");
				filterQuery.push("entity:programme");
				$N.services.sdp.MetadataService.doSearch(this, callback, failureCallback, searchTerm, filterQuery, ['id'], null, null, limit, startRow, queryFields);
			}

			/* Public API */
			return {

				/**
				 * Retrieves an array of events matching the given title.
				 * The title parameter should be at least 3 characters long.
				 * The search is limited to 100 results per query when not paging
				 * @method getNonExpiredEventsByTitle
				 * @async
				 * @param {String} title title of the event that we're interested in. At least 3 characters long
				 * @param {Function} dataCallback function that will be invoked when the data has been fetched. This
				 * function should expect an object consisting of start, numberFound and events properties.
				 * @param {Boolean} [exactMatch=false] indicates whether an exact match is required. If exactMatch is true, the wild card
				 * character (*) will not prepend and append the string so only events with a title that contains a word that starts with the
				 * supplied string will be retrieved. If exactMatch is false, events with a title that contain a word that simply contains the
				 * supplied string will be retrieved.
				 * @param {Number} limit amount of events to return - must not exceed 100
				 * @param {Number} startFrom row to start from - allows for paging
				 */
				getNonExpiredEventsByTitle : function (title, dataCallback, exactMatch, limit, startFrom) {
					log("getNonExpiredEventsByTitle", "Starting search for " + title, Log.LOG_INFO);
					var config = createConfig(limit, startFrom, title, dataCallback, exactMatch);
					$N.services.sdp.MetadataService.doSearch(this, function (events) {
						nonExpiredEventsCallback(events, config.isPaging);
					}, function () {
						dataCallback(null);
					}, config.title, ['scope:btv', 'entity:programme'], ['id'], null, null, config.limit, config.startFrom, 'title');
				},

				/**
				 * Retrieves an array of valid catch up events matching the given title.
				 * The title parameter should be at least 3 characters long.
				 * The search is limited to 100 results per query when not paging
				 * @method getCatchupEventsByTitle
				 * @async
				 * @param {String} title title of the event that we're interested in. At least 3 characters long
				 * @param {Function} dataCallback function that will be invoked when the data has been fetched. This
				 * function should expect an object consisting of start, numberFound and events properties.
				 * @param {Boolean} [exactMatch=false] indicates whether an exact match is required. If exactMatch is true, the wild card
				 * character (*) will not prepend and append the string so only events with a title that contains a word that starts with the
				 * supplied string will be retrieved. If exactMatch is false, events with a title that contain a word that simply contains the
				 * supplied string will be retrieved.
				 * @param {Number} limit amount of events to return - must not exceed 100
				 * @param {Number} startFrom row to start from - allows for paging
				 */
				getCatchupEventsByTitle : function (title, dataCallback, exactMatch, limit, startFrom) {
					log("getCatchupEventsByTitle", "Starting search for " + title, Log.LOG_INFO);
					var config = createConfig(limit, startFrom, title, dataCallback, exactMatch),
						now = Math.round(new Date().getTime() / 1000);
					$N.services.sdp.MetadataService.doSearch(this, function (events) {
						eventsCallback(events, config.isPaging);
					}, function () {
						dataCallback(null);
					}, config.title, ['scope:btv', 'catchupStart:[0 TO ' + now + ']', 'catchupEnd:[' + now + ' TO *]'], ['id'], null, null, config.limit, config.startFrom, 'title');
				},

				/**
				* Performs a full text search against title, description, synopsis and actor
				* @method search
				* @param {String} keyword - keyword to search on. The keyword can be prepended or prepended and appended with
				* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
				* @param {Number} startRow - start number for rows being retrieved (used for pagination)
				* @param {Number} endRow - end number for rows being retrieved (used for pagination)
				* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
				*/
				search : function (keyword, startRow, endRow, filter) {
					doSearch(keyword, null, startRow, endRow, filter);
				},

				/**
				* Performs a full text search against title
				* @method searchByTitle
				* @param {String} title - title to search on. The title can be prepended or prepended and appended with
				* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
				* @param {Number} startRow - start number for rows being retrieved (used for pagination)
				* @param {Number} endRow - end number for rows being retrieved (used for pagination)
				* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
				*/
				searchByTitle: function (title, startRow, endRow, filter) {
					var queryFields = "title";
					doSearch(title, queryFields, startRow, endRow, filter);
				},

				/**
				* Performs a full text search against actor
				* @method searchByActor
				* @param {String} actor - actor to search on. The actor can be prepended or prepended and appended with
				* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
				* @param {Number} startRow - start number for rows being retrieved (used for pagination)
				* @param {Number} endRow - end number for rows being retrieved (used for pagination)
				* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
				*/
				searchByActor: function (actor, startRow, endRow, filter) {
					var queryFields = "actors";
					doSearch(actor, queryFields, startRow, endRow, filter);
				},

				/**
				* Performs a full text search against director
				* @method searchByDirector
				* @param {String} actor - actor to search on. The actor can be prepended or prepended and appended with
				* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
				* @param {Number} startRow - start number for rows being retrieved (used for pagination)
				* @param {Number} endRow - end number for rows being retrieved (used for pagination)
				* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
				*/
				searchByDirector: function (director, startRow, endRow, filter) {
					var queryFields = "directors";
					doSearch(director, queryFields, startRow, endRow, filter);
				},

				/**
				* Sets the success callback to the given callback function.
				* Callback will be passed an object consisting of start, numberFound and editorials properties
				* where start is the start row index, numberFound is the total number of results found and editorials
				* is an array of found assets
				* @method setSuccessCallback
				* @chainable
				* @param {Function} callback
				*/
				setSuccessCallback: function (callback) {
					dataReceivedCallback = callback;
					return this;
				},

				/**
				* Sets the failure callback to the given callback function
				* @method setFailureCallback
				* @chainable
				* @param {Function} callback
				*/
				setFailureCallback: function (callback) {
					failureCallback = callback;
					return this;
				}
			};
		}());
		return $N.services.sdp.BTVSearch;
	});
