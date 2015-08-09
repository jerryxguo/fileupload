/**
 * This class is used to offer an API to perform a search for VOD assets.
 * Results are limited to 100 results per query
 *
 * @class $N.services.sdp.VODSearch
 * @author nthorne
 * @requires $N.services.sdp.MetadataService
 * @requires $N.apps.util.JSON
 * @constructor
 */
/* global define */
define('jsfw/services/sdp/VODSearch',
	[
		'jsfw/services/sdp/VOD',
		'jsfw/services/sdp/MetadataService',
		'jsfw/apps/util/JSON'
	],
	function (VOD, MetadataService, JSON) {
		var JON;
		function VODSearch() {
			this._maxPagedResults = 50;
			this._successCallback = function () {};
			this._failureCallback = function () {};
			this._metaDataService = $N.services.sdp.MetadataService;
			JON = window.JSON || $N.apps.util.JSON;
			this._MAX_NON_PAGING_RESULTS = 100;
		}

		/*
		 * PRIVATE HELPER METHODS
		 */
		VODSearch.prototype._searchCallback = function (result, isPagingRequest, start) {
			var filter = {},
				me = this,
				i = 0,
				ids = [],
				searchResult = {
					start: start || 0,
					numberFound: result.numberFound
				},
				assetSuccessCallback = function (response) {
					if (response && response.editorials && response.editorials.length > 0) {
						searchResult.editorials = response.editorials;
					} else {
						searchResult.editorials = [];
					}
					me._successCallback(searchResult);
				};

			if (isPagingRequest) {
				searchResult.numberFound = result.numberFound;
			} else if (result.numberFound > this._MAX_NON_PAGING_RESULTS) {
				searchResult.numberFound = this._MAX_NON_PAGING_RESULTS;
			}
			for (i = 0; i < result.docs.length; i++) {
				ids.push(result.docs[i].id);
			}
			$N.services.sdp.VOD.getAssetsByIds(ids, assetSuccessCallback, this._failureCallback);
		};

		VODSearch.prototype._doSearch = function (searchTerm, queryFields, startRow, endRow, filter) {
			var filterQuery = [],
				limit,
				isPagingRequest = false,
				me = this;
			if (endRow && (startRow || startRow === 0)) {
				isPagingRequest = true;
			}
			limit = (endRow || this._MAX_NON_PAGING_RESULTS) - (startRow || 0);
			limit = limit > this._maxPagedResults ? this._maxPagedResults : limit;
			if (filter && filter.length) {
				filterQuery = filter.slice(0);
			}
			filterQuery.push("scope:vod");
			this._metaDataService.doSearch(this, function (result) {
				me._searchCallback(result, isPagingRequest, startRow);
			}, this._failureCallback, searchTerm, filterQuery, ['id'], null, null, limit, startRow, queryFields);

		};

		/*
		 * PUBLIC API
		 */
		/**
		* Performs a full text search against title, description, synopsis and actor
		* @method search
		* @param {String} keyword - keyword to search on. The keyword can be prepended or prepended and appended with
		* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
		* @param {Number} startRow - start number for rows being retrieved (used for pagination)
		* @param {Number} endRow - end number for rows being retrieved (used for pagination)
		* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
		*/
		VODSearch.prototype.search = function (keyword, startRow, endRow, filter) {
			this._doSearch(keyword, null, startRow, endRow, filter);
		};

		/**
		* Performs a full text search against title, description, synopsis and actor
		* @method pagedSearch
		* @param {String} keyword - keyword to search on. The keyword can be prepended or prepended and appended with
		* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
		* @param {Number} startRow - start number for rows being retrieved (used for pagination)
		* @param {Number} endRow - end number for rows being retrieved (used for pagination)
		* @deprecated - use search
		*/
		VODSearch.prototype.pagedSearch = function (keyword, startRow, endRow) {
			this._doSearch(keyword, null, startRow, endRow);
		};

		/**
		* Performs a search by keyword using the given search term
		* @method searchByKeyword
		* @param {String} keyword
		* @deprecated - use search
		*/
		VODSearch.prototype.searchByKeyword = function (keyword) {
			this._doSearch(keyword);
		};

		/**
		* Performs a full text search against title
		* @method searchByTitle
		* @param {String} title - title to search on. The title can be prepended or prepended and appended with
		* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
		* @param {Number} startRow - start number for rows being retrieved (used for pagination)
		* @param {Number} endRow - end number for rows being retrieved (used for pagination)
		* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
		*/
		VODSearch.prototype.searchByTitle = function (title, startRow, endRow, filter) {
			var queryFields = "title";
			this._doSearch(title, queryFields, startRow, endRow, filter);
		};

		/**
		* Performs a full text search against actor
		* @method searchByActor
		* @param {String} actor - actor to search on. The actor can be prepended or prepended and appended with
		* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
		* @param {Number} startRow - start number for rows being retrieved (used for pagination)
		* @param {Number} endRow - end number for rows being retrieved (used for pagination)
		* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
		*/
		VODSearch.prototype.searchByActor = function (actor, startRow, endRow, filter) {
			var queryFields = "actors";
			this._doSearch(actor, queryFields, startRow, endRow, filter);
		};

		/**
		* Performs a full text search against director
		* @method searchByDirector
		* @param {String} actor - actor to search on. The actor can be prepended or prepended and appended with
		* a wild card '*' if rows ending with or containing the supplied string are required to be retrieved.
		* @param {Number} startRow - start number for rows being retrieved (used for pagination)
		* @param {Number} endRow - end number for rows being retrieved (used for pagination)
		* @param {Array} filter - string array of name-value pairs in ["key1: value1", "key2: value2"] format
		*/
		VODSearch.prototype.searchByDirector = function (director, startRow, endRow, filter) {
			var queryFields = "directors";
			this._doSearch(director, queryFields, startRow, endRow, filter);
		};

		/**
		* Sets the success callback to the given callback function.
		* Callback will be passed an object consisting of start, numberFound and editorials properties
		* where start is the start row index, numberFound is the total number of results found and editorials
		* is an array of found assets
		* @method setSuccessCallback
		* @chainable
		* @param {Function} callback
		*/
		VODSearch.prototype.setSuccessCallback = function (callback) {
			this._successCallback = callback;
			return this;
		};

		/**
		* Sets the failure callback to the given callback function
		* @method setFailureCallback
		* @chainable
		* @param {Function} callback
		*/
		VODSearch.prototype.setFailureCallback = function (callback) {
			this._failureCallback = callback;
			return this;
		};

		/**
		* Sets the max amount of results to be returned for each search query
		* This can not be greater than 100
		* @method setMaxPagedResults
		* @chainable
		* @param {Number} amount
		*/
		VODSearch.prototype.setMaxPagedResults = function (amount) {
			this._maxPagedResults = amount;
			return this;
		};

		/**
		* Gets the max amount of results to be returned for each search query
		* @method getMaxPagedResults
		* @return {Number} amount
		*/
		VODSearch.prototype.getMaxPagedResults = function () {
			return this._maxPagedResults;
		};

		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};
		$N.services.sdp.VODSearch = VODSearch;
		return VODSearch;
	}
);
