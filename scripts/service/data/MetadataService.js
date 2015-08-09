/**
 * This class fetches EPG and VOD metadata from a specified Metadata Server. It uses $N.services.sdp.RequestWorker to send
 * asynchronous requests to the server and returns the fetched data to the callback function. Applications can either use the
 * generic `getData` method or the more specific `getVODData` and `getEPGData` methods for VOD and EPG data respectively.
 *
 * @class $N.services.sdp.MetadataService
 * @singleton
 * @requires $N.apps.core.Log
 * @requires $N.apps.core.XssRequest
 * @requires $N.apps.util.JSON
 */

/* global define */
define('jsfw/services/sdp/MetadataService',
	[
		'jsfw/apps/core/Log',
		'jsfw/apps/core/XssRequest',
		'jsfw/apps/util/JSON',
		'jsfw/services/sdp/stubs/allServicesPatch'
	],
	function (Log, XssRequest, JSON, allServicesPatch) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.MetadataService = (function () {
			var securityRequired = false,
				isInitialised = false,
				apiMethod = '',
				securityPort = null,
				TIMEOUT_DURATION_MS = 30000, // Check for time-outs every 30 seconds
				epgFieldList = [],
				epgSortOrder = [],
				vodFieldList = [],
				vodSortOrder = [['title', 1]],
				params = {
					'skip': 0,
					'hints': true,
					'hintLevel': 20,
					'pretty': false,
					'reversed': false
				},
				log = new $N.apps.core.Log("sdp", "MetadataService"),
				json,
				domain = '',
				SEARCH_RESULTS_FORMAT = 'json',
				SERVER_ADDRESS = '',
				SERVER_URI = '/metadata/delivery',
				SEARCH_SERVER_URI = '/metadata/solr',
				EPG_CHANNELS_URI = 'btv/services',
				EPG_EDITORIALS_URI = 'btv/editorials',
				EPG_EVENTS_URI = 'btv/programmes',
				VOD_NODES_URI = 'vod/nodes',
				VOD_EDITORIALS_URI = 'vod/editorials',
				VOD_PRODUCTS_URI = 'vod/products',
				VOD_SERIES_URI = 'vod/series',
				OFFERS_PROMOTIONS_URI = 'offers/promotions',
				SEARCH_SERVICE_URI = '/search',
				SUGGEST_SERVICE_URI = '/suggest',
				SERVICE_PROVIDER_ID = null,
				LOCALE = 'en_GB', // will be overridden on initialise if locale is provided
				REGION = '',
				DEVICE_TYPE = '',
				DEFAULT_FILTER = {},
				publishFlagStatus,
				PUBLISH_FLAG_STATUS = {
					SHOW_PUBLISHED : 1,
					HIDE_PUBLISHED : 2,
					DISABLED : 3
				},
				MAX_RESULTS = 9999;

			/**
			 * Updates the 'domain' filter query using the specified values of region and device type
			 * @method updateDomain
			 * @private
			 */
			function updateDomain() {
				domain = DEVICE_TYPE || '';
				if (REGION) {
					if (domain.indexOf('|') === -1) {
						domain += '|';
					}
					domain += REGION;
				}
			}

			function getServerAddress() {
				var protocol = securityRequired ? "https://" : "http://",
					addressEnd = SERVER_ADDRESS.indexOf("/"),
					newAddress;
				if (addressEnd) {
					newAddress = [SERVER_ADDRESS.slice(0, addressEnd), (securityPort ? (':' + securityPort) : ''), SERVER_ADDRESS.slice(addressEnd)].join('');
				} else {
					newAddress = SERVER_ADDRESS + (securityPort ? (':' + securityPort) : '');
				}
				return protocol + newAddress;
			};

			function performXssRequest(url, successCallback, failureCallback) {
				// TODO: Change this to POST when METADATASRV-490 is fixed
				var xssRequest = new XssRequest("GET", url, successCallback, function(e) {
					failureCallback(e.responseText);
				});
				xssRequest.setTimeout(TIMEOUT_DURATION_MS);
				xssRequest.send();
			}

			return {

				/**
				 * Must be called prior to any service called and must pass the serverAddress that
				 * corresponds to the MdS address, e.g. dev13
				 * @method init
				 * @param {String} serverAddress Base URL of the MdS
				 * @param {Number} [port=null] optional parameter to set the HTTP port
				 * @param {String} [baseURI="/metadata/delivery"] URI prefix for MdS requests
				 * @param {String} serviceProviderId id of the service provider
				 * @param {Number} [timeoutCheckMS=30000] parameter to override default time the outstanding requests are checked
				 * @param {String} [locale='en_GB'] the user's locale
				 * @param {String} [region=""] service provider region. If not specified, returns data from all regions.
				 * @param {String} [deviceType=""] search results are returned matching compatibility with this device.
				 * @param {String} [searchURI="/metadata/solr"] URI prefix for MdS search queries
				 * @param {Boolean} [useHttps=false] whether https should be used instead of http
				 * @param {Number} [publishFlagDefaultStatus=3] sets the status for the publishToEndUserDevices flag. This flag is disabled by default.
				 * Must be one of the exposed PUBLISH_TO_USER_DEVICES_STATUS enums
				 */
				init: function (serverAddress, port, baseURI, serviceProviderId, timeoutCheckMS, locale, region, deviceType, searchURI, useHttps, publishFlagDefaultStatus) {
					log('init', 'Enter');
					if (!isInitialised) {
						json = window.JSON || $N.apps.util.JSON;
						SERVER_ADDRESS = serverAddress;
						securityPort = port || null;
						SERVER_URI = baseURI || SERVER_URI;
						SEARCH_SERVER_URI = searchURI || SEARCH_SERVER_URI;
						SERVICE_PROVIDER_ID = serviceProviderId;
						TIMEOUT_DURATION_MS = timeoutCheckMS || TIMEOUT_DURATION_MS;
						LOCALE = locale || LOCALE;
						REGION = region || '';
						DEVICE_TYPE = deviceType || '';
						updateDomain();
						isInitialised = true;
						securityRequired = useHttps || false;
						publishFlagStatus = publishFlagDefaultStatus || PUBLISH_FLAG_STATUS.DISABLED;
						log('init', 'Class initialised');
					}
					log('init', 'Exit');
				},

				/**
				 * Must be called prior to any service called and must pass the serverAddress that
				 * corresponds to the MdS address, e.g. dev13
				 * @method initialise
				 * @deprecated use init()
				 * @param {String} serverAddress Base URL of the MdS
				 * @param {Number} [port=null] optional parameter to set the HTTP port
				 * @param {String} [baseURI="/metadata/delivery"] URI prefix for MdS requests
				 * @param {String} serviceProviderId id of the service provider
				 * @param {Number} [timeoutCheckMS=30000] parameter to override default time the outstanding requests are checked
				 * @param {String} [locale='en_GB'] the user's locale
				 * @param {String} [region=""] service provider region. If not specified, returns data from all regions.
				 * @param {String} [deviceType=""] search results are returned matching compatibility with this device.
				 * @param {String} [searchURI="/metadata/solr"] URI prefix for MdS search queries
				 * @param {Boolean} [useHttps=false] whether https should be used instead of http
				 * @param {Number} [publishFlagDefaultStatus=3] sets the status for the publishToEndUserDevices flag. This flag is disabled by default.
				 * Must be one of the exposed PUBLISH_TO_USER_DEVICES_STATUS enums
				 */
				initialise: function (serverAddress, port, baseURI, serviceProviderId, timeoutCheckMS, locale, region, deviceType, searchURI, useHttps, publishFlagDefaultStatus) {
					this.init(serverAddress, port, baseURI, serviceProviderId, timeoutCheckMS, locale, region, deviceType, searchURI, useHttps, publishFlagDefaultStatus);
				},

				/**
				 * Sets the order in which the VOD data is to be sorted
				 * @method setVODSortOrder
				 * @chainable
				 * @param {Array} sortOrder a list of arrays. Each array consists of a field name and a number which
				 * should be 1 (for ascending order) or -1 (for descending order).
				 */
				setVODSortOrder: function (sortOrder) {
					vodSortOrder = sortOrder;
					return this;
				},

				/**
				 * Sets the field list to be included in the returned VOD data
				 * @method setVODFieldList
				 * @chainable
				 * @param {Array} fieldList list of fields
				 */
				setVODFieldList: function (fieldList) {
					vodFieldList = fieldList;
					return this;
				},

				/**
				 * Sets the order in which the EPG data is to be sorted
				 * @method setEPGSortOrder
				 * @chainable
				 * @param {Array} sortOrder a list of arrays. Each array consists of a field name and a number which
				 * should be 1 (for ascending order) or -1 (for descending order).
				 */
				setEPGSortOrder: function (sortOrder) {
					epgSortOrder = sortOrder;
					return this;
				},

				/**
				 * Sets the service provider id for MDS calls
				 * @method setServiceProviderId
				 * @chainable
				 * @param {String} id the service provider id
				 */
				setServiceProviderId: function (id) {
					SERVICE_PROVIDER_ID = id;
					return this;
				},

				/**
				 * Sets the field list to be included in the returned EPG data
				 * @method setEPGFieldList
				 * @chainable
				 * @param {Array} fieldList list of fields
				 */
				setEPGFieldList: function (fieldList) {
					epgFieldList = fieldList;
					return this;
				},

				/**
				 * Sets the locale to be included in the filter criteria
				 * @method setLocale
				 * @chainable
				 * @param {String} locale the new locale string
				 */
				setLocale: function (locale) {
					if (locale && locale !== LOCALE) {
						LOCALE = locale;
					}
					return this;
				},

				/**
				 * Sets the region to be used for retrieving data
				 * @method setRegion
				 * @chainable
				 * @param {String} locale the new region
				 */
				setRegion: function (region) {
					if (region && region !== REGION) {
						REGION = region;
						updateDomain();
					}
					return this;
				},

				/**
				 * Set the device type to be used for search results
				 * @method setDeviceType
				 * @chainable
				 * @param {String} device the device type to be used. E.g., 'iPad'
				 */
				setDeviceType: function (device) {
					if (device && device !== DEVICE_TYPE) {
						DEVICE_TYPE = device;
						updateDomain();
					}
					return this;
				},

				/**
				 * Sets the status for the publishToEndUserDevices flag
				 * @method setPublishToUserDevicesStatus
				 * @param {Number} status One of the PUBLISH_TO_USER_DEVICES_STATUS enums
				 */
				setPublishToUserDevicesStatus: function (status) {
					publishFlagStatus = status;
				},

				/**
				 * Fetches data from the MDS. This method can be used for any MDS operation
				 * @method getData
				 * @async
				 * @param {Object} caller the object that will be used as the context for the callback functions
				 * @param {Function} successCallback function to be called when data has been retrieved.
				 * @param {Object} successCallback.response the data that is returned
				 * @param {Function} failureCallback function to be called when data has been retrieved.
				 * @param {Object} failureCallback.error the data that is returned
				 * @param {String} methodName the API that you want to call. E.g., btv/channels, vod/editorials
				 * @param {Object} filter the criteria that will be used to return data
				 * @param {Array} sortOrder list of arrays. Each array consists of a field name and a number which
				 * should be 1 (for ascending order) or -1 (for descending order). E.g., [['title', 1], ['event.start', -1]]
				 * @param {Array} fieldList list of fields to be included in the returned data. E.g., ['Title', 'Name']
				 * @param {Number} [count=0] returns only the specified number of records. Defaults to 'everything'
				 * @param {Number} [offset=0] specifies, when used with `count`, what the start offset for the result set should be
				 */
				getData: function (caller, successCallback, failureCallback, methodName, filter, sortOrder, fieldList, count, offset) {
					var url;
					apiMethod = methodName;
					url = getServerAddress() + SERVER_URI + '/' + SERVICE_PROVIDER_ID.toUpperCase() + "/" + apiMethod;

					params.filter = filter || DEFAULT_FILTER;
					if (!filter || !filter.locale) {
						params.filter.locale = LOCALE;
					}
					if (publishFlagStatus && publishFlagStatus !== PUBLISH_FLAG_STATUS.DISABLED) {
						params.filter.publishToEndUserDevices = publishFlagStatus === PUBLISH_FLAG_STATUS.SHOW_PUBLISHED ? true : false;
					}
					params.limit = (count !== null && count !== undefined) ? count : MAX_RESULTS;
					params.skip = (offset !== undefined && offset !== null) ? offset : 0;

					if (methodName.indexOf(OFFERS_PROMOTIONS_URI) < 0) {
					switch (methodName) {
					case EPG_CHANNELS_URI:
					case EPG_EVENTS_URI:
						params.fieldList = fieldList && fieldList.length ? fieldList : epgFieldList;
						params.sortOrder = sortOrder && sortOrder.length ? sortOrder : epgSortOrder;
						break;
					case VOD_NODES_URI:
					case VOD_EDITORIALS_URI:
					case VOD_PRODUCTS_URI:
					case VOD_SERIES_URI:
						params.fieldList = fieldList && fieldList.length ? fieldList : vodFieldList;
						params.sortOrder = sortOrder && sortOrder.length ? sortOrder : vodSortOrder;
						break;
					}
					url += '?filter=' + json.stringify(params.filter);
					if (params.limit !== null) {
						url += '&limit=' + params.limit;
					}
					if (params.skip) {
						url += '&offset=' + params.skip;
					}
					url += '&fields=' + json.stringify(params.fieldList);
					url += '&sort=' + json.stringify(params.sortOrder);
					}

					log('getData', 'URL to query: ' + url);
					performXssRequest(url, successCallback, failureCallback);
				},

				/**
				 * Fetches EPG data from the MdS. Either channel or programme / event information can be requested
				 * @method getEPGData
				 * @async
				 * @param {Object} caller the object that will be used as the context for the callback functions
				 * @param {Function} successCallback function to be called when data has been retrieved.
				 * @param {Object} successCallback.response the data that is returned
				 * @param {Function} failureCallback function to be called when data has been retrieved.
				 * @param {Object} failureCallback.error information about the error
				 * @param {Object} epgRequestType specifies whether Channel or Programme information is required. One of
				 * `RequestType.Channels` or `RequestType.Events`
				 * @param {Object} [filter={}] the criteria that will be used to return data
				 * @param {Array} [sortOrder=[]] list of arrays. Each array consists of a field name and a number which
				 * should be 1 (for ascending order) or -1 (for descending order). E.g., [['title', 1], ['event.start', -1]]
				 * @param {Array} [fieldList=[]] list of fields to be included in the returned data. E.g., ['Title', 'Name']
				 * @param {Number} [count=0] returns only the specified number of records. Defaults to 'everything'
				 * @param {Number} [offset=0] specifies, when used with `count`, what the start offset for the result set should be
				 */
				getEPGData: function (caller, successCallback, failureCallback, epgRequestType, filter, sortOrder, fieldList, count, offset) {
					this.getData(caller, successCallback, failureCallback, epgRequestType, filter, sortOrder, fieldList, count, offset);
				},

				/**
				 * Fetches VOD data from the MdS. Catalogue, Asset or Product information can be requested
				 * @method getVODData
				 * @async
				 * @param {Object} caller the object that will be used as the context for the callback functions
				 * @param {Function} successCallback function to be called when data has been retrieved.
				 * @param {Object} successCallback.response the data that is returned
				 * @param {Function} failureCallback function to be called when data has been retrieved.
				 * @param {Object} failureCallback.error information about the error
				 * @param {Object} vodRequestType specifies whether Catalogue, Asset or Product information is required. One of
				 * `RequestType.Catalogues` or `RequestType.Assets` or `RequestType.Products`
				 * @param {Object} [filter={}] the criteria that will be used to return data
				 * @param {Array} [sortOrder=[]] list of arrays. Each array consists of a field name and a number which
				 * should be 1 (for ascending order) or -1 (for descending order). E.g., [['title', 1], ['event.start', -1]]
				 * @param {Array} [fieldList=[]] list of fields to be included in the returned data. E.g., ['Title', 'Name']
				 * @param {Number} [count=0] returns only the specified number of records. Defaults to 'everything'
				 * @param {Number} [offset=0] specifies, when used with `count`, what the start offset for the result set should be
				 */
				getVODData: function (caller, successCallback, failureCallback, vodRequestType, filter, sortOrder, fieldList, count, offset) {
					this.getData(caller, successCallback, failureCallback, vodRequestType, filter, sortOrder, fieldList, count, offset);
				},

				/**
				 * Fetches Offer (Promotions) data from MDS.
				 * @method getOfferData
				 * @async
				 * @param {Object} caller the object that will be used as the context for the callback functions
				 * @param {Function} successCallback function to be called when data has been retrieved.
				 * @param {Object} successCallback.response the data that is returned
				 * @param {Function} failureCallback function to be called when data has been retrieved.
				 * @param {Object} failureCallback.error information about the error
				 * @param {Object} offerRequestType
				 * @param {Object} [filter={}] the criteria that will be used to return data
				 * @param {Array} [sortOrder=[]] list of arrays. Each array consists of a field name and a number which
				 * should be 1 (for ascending order) or -1 (for descending order).
				 * @param {Array} [fieldList=[]] list of fields to be included in the returned data.
				 * @param {Number} [count=0] returns only the specified number of records. Defaults to 'everything'
				 * @param {Number} [offset=0] specifies, when used with `count`, what the start offset for the result set should be
				 */
				getOfferData: function (caller, successCallback, failureCallback, offerRequestType, filter, sortOrder, fieldList, count, offset) {
					this.getData(caller, successCallback, failureCallback, offerRequestType, filter, sortOrder, fieldList, count, offset);
				},

				/**
				 * Performs a search for the search term specified. Additional search parameters like filters and sort order
				 * can also be specified. To specify that BTV metadata is to be queried, use ['scope:btv'] as a `filterQuery`;
				 * for VOD, use ['scope:vod'].
				 * @method doSearch
				 * @async
				 * @param {Object} caller the object that will be used as the context for the callback functions
				 * @param {String} searchTerm the term(s) to search for. These can be as simple as words ('the thing'), or
				 * a bit more involved, like 'description:"cowboy" title:"toy"'. Search terms are space-delimited.
				 * @param {Function} successCallback function to call when search results are returned.
				 * @param {Array} successCallback.response object containing numberFound, start and docs properties
				 * @param {Object} successCallback.responseHeader contains metadata about the search
				 * @param {Function} failureCallback function to call when the search fails. Any errors will be returned
				 * as parameters to this function.
				 * @param {Array} [filterQuery=[]] a list of filter queries which are used to filter the search results.
				 * E.g., [category:"comedy"].
				 * @param {String} [fieldList="*"] a comma- or space-delimited list of field names. Only these fields will be returned
				 * in the search results. By default, all fields are returned.
				 * @param {String} [sortOrder="score desc"] the order in which results are to be returned. Specified as "<field> <asc/desc>".
				 * By default, results are sorted in decreasing order of relevance with the best matches at the top.
				 * @param {String} [format="json"] output format for the search results. Possible values are "xml", "json", "csv", "python", "ruby"
				 * and "php"
				 * @param {Number} [limit] the number of results to return. See also the next parameter, `startFrom`. By default,
				 * all results are returned
				 * @param {Number} [startFrom=0] Used for pagination along with `limit`. The specified number of records are skipped
				 * in the result set.
				 * @param {String} [queryFields] Used to restrict the data that is being searched.
				 */
				doSearch: function (caller, successCallback, failureCallback, searchTerm, filterQuery, fieldList, sortOrder, format, limit, startFrom, queryFields) {
					var url = getServerAddress() + SEARCH_SERVER_URI + '/' + SERVICE_PROVIDER_ID.toUpperCase() + SEARCH_SERVICE_URI + '?q=',
						i,
						searchResult = {};
					if (searchTerm) {
						url += encodeURIComponent(searchTerm);
					}
					if (queryFields) {
						url += '&qf=' + encodeURIComponent(queryFields);
					}
					url += '&fq=' + encodeURIComponent('locale:' + LOCALE);
					url += domain ? (encodeURIComponent('+AND+domain:' + domain)) : '';
					if (filterQuery && filterQuery.length) {
						for (i = 0; i < filterQuery.length; i++) {
							url += '+AND+' + encodeURIComponent(filterQuery[i]);
						}
					}
					if (fieldList) {
						url += '&fl=' + encodeURIComponent(fieldList);
					}
					if (sortOrder) {
						url += '&sort=' + encodeURIComponent(sortOrder);
					}
					url += '&wt=' + (format || SEARCH_RESULTS_FORMAT);
					if (limit) {
						url += '&rows=' + limit;
					}
					if (startFrom) {
						url += '&start=' + startFrom;
					}
					log('doSearch', 'URL to hit: ' + url);
					performXssRequest(url, function(result) {
						searchResult.numberFound = result && result.response && result.response.numFound ? result.response.numFound : 0;
						searchResult.start = result && result.response && result.response.start ? result.response.start : 0;
						searchResult.docs = result && result.response && result.response.docs ? result.response.docs : [];
						successCallback(searchResult, result && result.responseHeader ? result.responseHeader : {});
					}, failureCallback);
				},

				/**
				 * Performs a suggest request for the search term specified. To specify that BTV metadata is to be queried,
				 * use ['scope:btv'] as a `filterQuery`;
				 * for VOD, use 'scope:vod'.
				 * @method fetchSuggestions
				 * @async
				 * @param {Object} caller the object that will be used as the context for the callback functions
				 * @param {Function} successCallback function to call when search results are returned.
				 * @param {Array} successCallback.response object containing numberFound, start and docs properties
				 * @param {Object} successCallback.responseHeader contains metadata about the search
				 * @param {Function} failureCallback function to call when the search fails. Any errors will be returned
				 * as parameters to this function.
				 * @param {String} searchTerm the term(s) to search for. These can be as simple as words ('the thing'), or
				 * a bit more involved, like 'description:"cowboy" title:"toy"'. Search terms are space-delimited.
				 * @param {Array} [filterQuery=[]] a list of filter queries which are used to filter the search results.
				 * E.g., ["scope:btv"].
				 */
				fetchSuggestions: function (caller, successCallback, failureCallback, searchTerm, filterQuery) {
					var url = getServerAddress() + SEARCH_SERVER_URI + '/' + SERVICE_PROVIDER_ID.toUpperCase() + SUGGEST_SERVICE_URI + '?q=',
						i,
						searchResult = {};
					if (searchTerm) {
						url += encodeURIComponent(searchTerm);
					}
					if (filterQuery && filterQuery.length) {
						url += '&fq=' + encodeURIComponent(filterQuery[0]);
						for (i = 1; i < filterQuery.length; i++) {
							url += '+AND+' + encodeURIComponent(filterQuery[i]);
						}
					}
					log('fetchSuggestions', 'URL to hit: ' + url);
					performXssRequest(url, successCallback, failureCallback);
				},

				/**
				 * Enumerates the various request types that can be used for calling the API methods. One of `Channels`, `Events`,
				 * `Programmes`, `Catalogues`, `Assets` and `Products`
				 * @type {Object}
				 */
				RequestType: {
					Channels: EPG_CHANNELS_URI,
					Programmes: EPG_EDITORIALS_URI,
					Events: EPG_EVENTS_URI,
					Catalogues: VOD_NODES_URI,
					Assets: VOD_EDITORIALS_URI,
					Products: VOD_PRODUCTS_URI,
					Series: VOD_SERIES_URI,
					Promotions: OFFERS_PROMOTIONS_URI,
					Search: SEARCH_SERVICE_URI
				},

				/**
				 * Enumerates the various publishToEndUserDevices MDS flag statuses. One of SHOW_PUBLISHED, HIDE_PUBLISHED and DISABLED.
				 * @type {Object}
				 */
				PUBLISH_TO_USER_DEVICES_STATUS: PUBLISH_FLAG_STATUS
			};

		}());
		return $N.services.sdp.MetadataService;
	}
);
