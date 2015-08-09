/**
 * This class creates a single code base that will interact with SDP
 * to allow the retrieval and subscription of on demand assets and catalogues
 * (which can be filtered using the catalogue filtering functionality).
 *
 * @class $N.services.sdp.VOD
 * @static
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.Ratings
 * @requires $N.services.sdp.ServiceFactory
 * @requires $N.services.sdp.MetadataService
 * @requires $N.apps.util.JSON
 */

/* global define */
define('jsfw/services/sdp/VOD',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/Ratings',
		'jsfw/services/sdp/ServiceFactory',
		'jsfw/services/sdp/MetadataService',
		'jsfw/services/sdp/Promotions',
		'jsfw/apps/util/JSON'
	],
	function (Log, Ratings, ServiceFactory, MetadataService, Promotions, JSON) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.VOD = (function () {

			var log = new $N.apps.core.Log("sdp", "VOD"),
				ContextService,
				BocPurchaseService,
				USER_ID,
				ACCOUNT_ID,
				VOD_ROOT_BY_ACCP = null,
				ORIGIN_CMS = 1,
				LOCALE,
				SMART_CARD_ID,
				context = null,
				filteredCatalogues = [], // catalogues to be filtered
				featureNameList = [],
				ratingLookup = {},
				MAX_RESULTS = 9999;

			/**
			 * Set the account ID for VOD purchases.
			 * @method setAccountId
			 * @chainable
			 * @param {Number} accountId Unique identifier for account.
			 */
			function setAccountId(accountId) {
				ACCOUNT_ID = accountId;
				return this;
			}

			/**
			 * Set the user ID for VOD purchases.
			 * @method setUserId
			 * @chainable
			 * @param {Number} userId Unique identifier for user.
			 */
			function setUserId(userId) {
				USER_ID = userId;
				return this;
			}

			/**
			 * Set the smart card ID for VOD purchases.
			 * @method setSmartCardId
			 * @chainable
			 * @param {Number} smartCardId Unique identifier for smart card.
			 */
			function setSmartCardId(smartCardId) {
				SMART_CARD_ID = smartCardId;
				return this;
			}

			/**
			 * Success callback for the ratingService.getList, turns the
			 * result in to a look up table instead of an array.
			 * @method buildratingLookup
			 * @private
			 * @param {Array} result
			 */
			function buildratingLookup(result) {
				var i;
				ratingLookup = {};
				for (i = 0; i < result.length; i++) {
					ratingLookup[result[i].ratingCode] = result[i];
				}
			}

			/**
			 * Calls the RatingService's `getList` method to get the parental ratings from SDP
			 * @method loadRatingTable
			 * @private
			 * @param {String} locale the locale string
			 */
			//TODO: Client+guide+to+using+the+MDS+with+the+SDP states:
			//      The client application should retrieve this rating list once on initialisation and periodically check for updates.
			//      No periodic check yet added.
			function loadRatingTable(locale) {
				if ($N.services.sdp.Ratings && $N.services.sdp.Ratings.getRatingLookupByCode()) {
					ratingLookup = $N.services.sdp.Ratings.getRatingLookupByCode();
				} else {
					$N.services.sdp.ServiceFactory.get("RatingService").getList(this, buildratingLookup, function () {
						log("loadRatingTable", "Failed to get rating table for VOD", "warn");
					}, locale);
				}
			}

			function getMDSLocale(locale) {
				var underScorePosition,
					convertedLocale = '';
				if (locale) {
					underScorePosition = locale.indexOf('_');
					convertedLocale = locale.substr(0, underScorePosition + 1) + locale.substr(underScorePosition + 1).toUpperCase();
				}
				return convertedLocale;
			}

			/**
			 * Sets the locale for VOD purchases.
			 * @method setLocale
			 * @chainable
			 * @param {String} locale The new locale.
			 */
			function setLocale(locale) {
				LOCALE = locale;
				loadRatingTable(LOCALE.toLowerCase());
				MetadataService.setLocale(getMDSLocale(LOCALE));
				return this;
			}

			/**
			 * Get the account ID for VOD purchases.
			 * @method getAccountId
			 * @return {Number} Unique identifier for account.
			 */
			function getAccountId() {
				return ACCOUNT_ID;
			}

			/**
			 * Get the user ID for VOD purchases.
			 * @method getUserId
			 * @return {Number} Unique identifier for user.
			 */
			function getUserId() {
				return USER_ID;
			}

			/**
			 * Get the smart card ID for VOD purchases.
			 * @method getSmartCardId
			 * @return {Number} smart card ID.
			 */
			function getSmartCardId() {
				return SMART_CARD_ID;
			}

			/**
			 * Get the locale for VOD purchases.
			 * @method getLocale
			 * @return {String} locale.
			 */
			function getLocale() {
				return LOCALE;
			}

			/**
			 * Get the context for VOD SDP calls
			 * @method getContext
			 * @return {Object} context.
			 */
			function getContext() {
				return context;
			}

			/**
			 * Refreshes the current context. It is recommended that a call to `setFeatureNameList` be
			 * made before calling this method in order to ensure that the correct features are set
			 * in the refreshed context.
			 * @deprecated - not required for MDS
			 * @method refreshContext
			 */
			function refreshContext() {
				ContextService.getCurrentContext(this, function (result) {
					context = result;
					context.featureNameList = featureNameList || null;
				}, function () {});
			}

			/**
			 * Sets the feature list that is to be used in the callback of `getCurrentContext`
			 * @method setFeatureNameList
			 * @chainable
			 * @param {Array} list list of features
			 */
			function setFeatureNameList(list) {
				featureNameList = list;
				return this;
			}

			/**
			 * Gets the feature name list
			 * @method fetFeatureNameList
			 * @return {Array} list list of features
			 */
			function getFeatureNameList() {
				return featureNameList;
			}

			/**
			 * Adds a catalogue to the list of catalogues to be filtered from the root catalogues.
			 * @method addFilteredCatalogue
			 * @chainable
			 * @param {String} catalogue The name of the catalogue to add to the filtered list
			 */
			function addFilteredCatalogue(catalogue) {
				log("addFilteredCatalogue", "adding " + catalogue);
				if (filteredCatalogues.indexOf(catalogue) === -1) {
					filteredCatalogues.push(catalogue);
				}
				return this;
			}

			/**
			 * Removes a catalogue from the list of catalogues to be filtered from the root catalogues.
			 * @method removeFilteredCatalogue
			 * @chainable
			 * @param {String} catalogue The name of the catalogue to remove from the filtered list
			 */
			function removeFilteredCatalogue(catalogue) {
				log("removeFilteredCatalogue", "removing " + catalogue);
				var index = filteredCatalogues.indexOf(catalogue);
				if (index !== -1) {
					filteredCatalogues.splice(index, 1);
				}
				return this;
			}

			/**
			 * Clears catalogues to be filtered from the root catalogues.
			 * @method clearFilteredCatalogues
			 * @chainable
			 */
			function clearFilteredCatalogues() {
				filteredCatalogues = [];
				return this;
			}

			/**
			 * Returns the list of catalogues to be filtered from the root catalogues.
			 * @method getFilteredCatalogues
			 * @return {Array} List of catalogues
			 */
			function getFilteredCatalogues() {
				return filteredCatalogues;
			}

			/**
			 * Initialises the VOD class by establishing connections to the SDP using
			 * the provided account, connection and locale properties. Note that an account
			 * or a smart card reference is required, but not necessarily both. This method is
			 * expected to be called after the signon / bootstap code after the initialisation
			 * of `$N.services.sdp.MetadataService`.
			 * @method init
			 * @param {Number} accountId Unique identifier for user's account.
			 * @param {Number} userId Unique identifier for user.
			 * @param {Number} smartCardId Unique identifier for smart card.
			 * @param {Boolean} rootByAccessPoint Specifies if root should be obtained by access point
			 * @param {String} locale The locale.
			 * @param {Array} [featureNameList] list of feature names
			 */
			function init(accountID, userID, smartCardId, rootByAccessPoint, locale, featureNameList) {
				var mdsLocale;

				log("init", "initialising VOD");
				MetadataService = $N.services.sdp.MetadataService;
				ACCOUNT_ID = accountID || null;
				USER_ID = userID || null;
				SMART_CARD_ID = smartCardId || null;
				LOCALE = locale || null;

				mdsLocale = getMDSLocale(locale);
				if (rootByAccessPoint !== undefined && rootByAccessPoint !== null) {
					VOD_ROOT_BY_ACCP = rootByAccessPoint;
				}
				if (locale) {
					loadRatingTable(locale.toLowerCase());
					MetadataService.setLocale(mdsLocale);
				}
				ContextService = $N.services.sdp.ServiceFactory.get("ContextService");
				BocPurchaseService = $N.services.sdp.ServiceFactory.get("BocPurchaseService");
				if (featureNameList && featureNameList.length > 0) {
					setFeatureNameList(featureNameList);
				}
			}

			/**
			 * Initialises the VOD class by establishing connections to the SDP using
			 * the provided account, connection and locale properties. Note that an account
			 * or a smart card reference is required, but not necessarily both. This method is
			 * expected to be called after the signon / bootstap code after the initialisation
			 * of `$N.services.sdp.MetadataService`.
			 * @method initialise
			 * @deprecated use init()
			 * @param {Number} accountId Unique identifier for user's account.
			 * @param {Number} userId Unique identifier for user.
			 * @param {Number} smartCardId Unique identifier for smart card.
			 * @param {Boolean} rootByAccessPoint Specifies if root should be obtained by access point
			 * @param {String} locale The locale.
			 * @param {Array} [featureNameList] list of feature names
			 */
			function initialise(accountID, userID, smartCardId, rootByAccessPoint, locale, featureNameList) {
				init(accountID, userID, smartCardId, rootByAccessPoint, locale, featureNameList);
			}

			/**
			 * Creates a filter or updates an existing filter with the specified criterion
			 * @method addToFilter
			 * @private
			 * @return {String} field the field on which the filter criterion is to be applied.
			 * @return {Mixed} item the filter criterion to be added.
			 * @return {Object} [filter] an existing filter. If this parameter is not passed in, a new filter object is created.
			 * @return {Object} filter Filter containing catalogue uid.
			 */
			function addToFilter(field, item, filter) {
				if (!filter) {
					filter = {};
				}
				if (item) {
					filter[field] = item;
				}
				return filter;
			}

			/**
			 * Convenience method to add commonly used criteria to a filter
			 * @method addCommonFilters
			 * @private
			 * @param {Array} deviceTypes a list of device types to filter
			 * @param {String} catalogueUid uid of the catalogue to filter
			 * @param {String} titleSubstring part of an asset's title to look for
			 * @param {Object} [filter={}] the final filter object. If supplied, filter criteria
			 * are appended to it; otherwise, a new filter is created with the criteria and returned
			 */
			function addCommonFilters(deviceTypes, catalogueUid, titleSubstring, filter) {
				if (!filter) {
					filter = {};
				}
				if (deviceTypes && deviceTypes.length) {
					filter = addToFilter('technical.deviceType', {'$in': deviceTypes}, filter);
				}
				if (catalogueUid) {
					filter = addToFilter('voditem.node', catalogueUid, filter);
				}
				if (titleSubstring) {
					filter = addToFilter('editorial.Title', {'$regex': titleSubstring}, filter);
				}
				filter = addToFilter('isVisible', true, filter);
				return filter;
			}

			/**
			 * Augments the MDS asset objects with ratings
			 * @method augmentAssetsWithPricing
			 * @private
			 * @param {Array} assets Array of assets to which the additional pricing information is to be added.
			 * @return {Array} augmentedAssets Array of augmented assets.
			 */
			function augmentAssetsWithPricing(assets) {
				var i,
					j,
					asset,
					productList,
					currentLowestPrice,
					lowestPrice,
					sortFunction = function (a, b) {
						return a.price.value - b.price.value;
					};

				for (i = 0; i < assets.length; i++) {
					asset = assets[i];
					if ($N.Config.PROMOTIONS && $N.services.sdp.Promotions.isPromotionAvailableForAsset(asset)) {
						asset.isPromotionAvailable = true;
					} else {
						asset.isPromotionAvailable = false;
					}
					for (j = 0; j < asset.technicals.length; j++) {
						productList = asset.technicals[j].products;
						productList.sort(sortFunction);
						currentLowestPrice = productList[0].price;
						if (!lowestPrice || currentLowestPrice.value < lowestPrice.value) {
							lowestPrice = currentLowestPrice;
						}
					}
					asset.lowestPrice = lowestPrice;
				}
				return assets;
			}

			/**
			 * Augments the MDS asset objects with ratings
			 * @method augmentAssetsWithRatings
			 * @private
			 * @param {Array} assets Array of assets to which the additional rating information is to be added.
			 * @return {Array} augmentedAssets Array of augmented assets.
			 */
			function augmentAssetsWithRatings(assets) {
				var augmentedAssets = [],
					i = 0,
					asset;
				for (i = 0; i < assets.length; i++) {
					asset = assets[i];

					//TODO: Check if necessary!! - use MDS equivalent for editorialAsset.status when available
					//if (asset.editorialAsset.status === 'A') {
					asset.parentalRatingValue = ratingLookup[asset.Rating] ? ratingLookup[asset.Rating].precedenceValue : null;
					augmentedAssets.push(asset);
					//}
				}
				return augmentedAssets;
			}

			/**
			 * Gets all root catalogues that are subscribed, and removes catalogues added to
			 * the filtered catalogues list.
			 * @method getRootCatalogues
			 * @async
			 * @param {Function} catalogueSuccessCallback The function to be executed if the call to SDP succeeds. It should expect the parameters
			 * specified below.
			 * @param {Array} catalogueSuccessCallback.catalogues The list of catalogues
			 * @param {Object} catalogueSuccessCallback.meta Additional information about the server response, like time taken, number of results
			 * returned, and so on.
			 * @param {Function} detailSuccessCallback The function to be executed once additional catalogue information has been retrieved.
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 */
			function getRootCatalogues(catalogueSuccessCallback, detailSuccessCallback, failureCallback) {
				log("getRootCatalogues", "Enter");
				var successCallback = function (result) {
						if (catalogueSuccessCallback) {
							catalogueSuccessCallback(result.nodes, result.z);
						}
						if (detailSuccessCallback) {
							detailSuccessCallback(result.nodes, result.z);
						}
					},
					filter = {
						isRoot: true
					};
				if (filteredCatalogues && filteredCatalogues.length > 0) {
					filter.title = {'$nin': filteredCatalogues};
				}
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Catalogues, filter);
				log("getRootCatalogues", "Exit");
			}

			/**
			 * Retrieves the number of current, valid schedules in the specified catalogue,
			 * specific to the title filter string and current locale.
			 * @method getCatalogueScheduleCount
			 * @param {Function} successCallback The function to be executed if the call to SDP succeeds.
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 * @param {Number} catalogueUID The ID of the catalogue from which the number of catalogue schedules should be counted.
			 * @param {String} assetTitleFilterString The asset title filter string.
			 */
			function getCatalogueScheduleCount(catalogueSuccessCallback, catalogueFailureCallback, catalogueUID, assetTitleFilterString) {
				log("getCatalogueScheduleCount", "Enter");
				var filter = {},
					successCallback = function (result) {
						if (catalogueSuccessCallback) {
							catalogueSuccessCallback(result.total_records);
						}
					},
					failureCallback = function (result) {
						if (catalogueFailureCallback) {
							catalogueFailureCallback(result);
						}
					};
				filter = addCommonFilters(featureNameList, catalogueUID, assetTitleFilterString, filter);
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Assets, filter, null, ["id"], MAX_RESULTS, 0);
				log("getCatalogueScheduleCount", "Exit");
			}

			/**
			 * Retrieves the number of assets in all catalogues that contain the specified product and current locale,
			 * filtered by an optional title string.
			 * @method getCatalogueScheduleCountByProduct
			 * @param {Function} successCallback The function to be executed if the call to SDP succeeds.
			 * @param {Number} successCallback.result The number of assets that have this product
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 * @param {String} productID The ID of the product in question.
			 * @param {String} [assetTitleFilterString=''] The asset title filter string.
			 */
			function getCatalogueScheduleCountByProduct(catalogueSuccessCallback, catalogueFailureCallback, productID, assetTitleFilterString) {
				log("getCatalogueScheduleCountByProduct", "Enter");
				var filter = {},
					successCallback = function (result) {
						if (catalogueSuccessCallback) {
							catalogueSuccessCallback(result.total_records);
						}
					},
					failureCallback = function (result) {
						if (catalogueFailureCallback) {
							catalogueFailureCallback(result);
						}
					};
				if (featureNameList && featureNameList.length) {
					filter['technical.deviceType'] = {'$in': featureNameList};
				}
				if (assetTitleFilterString) {
					filter['editorial.Title'] = {'$regex': assetTitleFilterString};
				}
				filter['product.id'] = productID;
				//TODO: These are used in the SDP request. The mappings for MDS are unknown
				/*
						scheduleIsCurrent: true,
						scheduleStatus: 'P',
						assetPlayType: 'E',
						offerFrequencyType: ['IMP', 'MUL', 'REC'],
						assetTitleSubstringList: [assetTitleFilterString],
				*/
				//filter['product.startPurchase'] {"$lt": Date.1583562897}

				//amFilter["period.start"] = {"$gte": mdsEvent.startTime / 1000};

				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Assets, filter, null, ["id"], MAX_RESULTS, 0);
				log("getCatalogueScheduleCountByProduct", "Exit");
			}

			/**
			 * Retrieves a detailed list of catalogues associated with the specified parent catalogue UID for the current locale.
			 * @method getDetailedCatalogues
			 * @async
			 * @param {Function} catalogueSuccessCallback The function to be executed if the call to SDP succeeds. This function will receive
			 * the following parameters
			 * @param {Array} catalogueSuccessCallback.catalogues list of catalogues
			 * @param {Object} catalogueSuccessCallback.meta an object containing information about the query
			 * @param {Function} detailSuccessCallback The function to be executed once additional catalogue information has been retrieved.
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 * @param {Number} catalogueUID The UID of the parent catalogue.
			 */
			function getDetailedCatalogues(catalogueSuccessCallback, detailSuccessCallback, failureCallback, catalogueUID) {
				log("getDetailedCatalogues", "Enter");

				var filter = {},
					successCallback = function (result) {
						if (catalogueSuccessCallback) {
							catalogueSuccessCallback(result.nodes, result.z);
						}
						if (detailSuccessCallback) {
							detailSuccessCallback(result.nodes, result.z);
						}
					};
				filter = addToFilter("parent", catalogueUID, filter);
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Catalogues, filter);
				log("getDetailedCatalogues", "Exit");
			}

			/**
			 * Retrieves a detailed list of assets associated with the specified parent catalogue UID for the current locale.
			 * @method getPagedDetailedAssets
			 * @async
			 * @param {Function} assetSuccessCallback The function to be executed if the call to SDP succeeds.
			 * @param {Array} assetSuccessCallback.assets list of assets
			 * @param {Function} detailSuccessCallback The function to be executed once additional asset information has been retrieved.
			 * @param {Array} detailSuccessCallback.assets list of assets augmented with an additional attribute, 'lowestPrice', that has
			 * details about the lowest priced item
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 * @param {Number} catalogueUID The UID of the catalogue from which the schedules should be retrieved.
			 * @param {String} assetTitleFilterString The asset title filter string.
			 * @param {Number} startIndex The start index of the paged results. The first item is at index 0.
			 * @param {Number} endIndex The end index of the paged results.
			 * @param {Array} [sortArray=[]] list of columns on which returned data is to be sorted.
			 */
			function getPagedDetailedAssets(assetSuccessCallback, detailSuccessCallback, failureCallback, catalogueUID, assetTitleFilterString, startIndex, endIndex, sortArray) {
				log("getPagedDetailedAssets", "Enter");
				var filter,
					limit,
					skip,
					successCallback = function (result) {
						var assets = augmentAssetsWithRatings(result.editorials);
						if (assetSuccessCallback) {
							assetSuccessCallback(assets);
						}
						if (detailSuccessCallback) {
							detailSuccessCallback(augmentAssetsWithPricing(assets));
						}
						log("getPagedDetailedAssets", "Exit");
					};
				skip = startIndex || 0;
				limit = (endIndex - startIndex) || null;
				filter = addCommonFilters(featureNameList, catalogueUID, null, filter);
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Assets, filter, sortArray, null, limit, skip);
				log("getPagedDetailedAssets", "Exit");
			}

			/**
			 * Retrieves a detailed list of assets associated with the specified product id for the current locale.
			 * @method getPagedDetailedAssetsByProduct
			 * @async
			 * @param {Function} assetSuccessCallback The function to be executed if the call to SDP succeeds.
			 * @param {Array} assetSuccessCallback.assets list of assets
			 * @param {Function} detailSuccessCallback The function to be executed once additional asset information has been retrieved.
			 * @param {Array} detailSuccessCallback.assets list of assets augmented with an additional attribute, 'lowestPrice', that has
			 * details about the lowest priced item
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 * @param {String} productID The product ID to look for.
			 * @param {String} assetTitleFilterString The asset title filter string.
			 * @param {Number} startIndex The start index of the paged results. The first item is at index 0.
			 * @param {Number} endIndex The end index of the paged results.
			 * @param {Array} [sortArray=[]] list of columns on which returned data is to be sorted.
			 */
			function getPagedDetailedAssetsByProduct(assetSuccessCallback, detailSuccessCallback, failureCallback, productID, assetTitleFilterString, startIndex, endIndex, sortArray) {
				log("getPagedDetailedAssetsByProduct", "Enter: " + productID);
				var filter = {},
					limit,
					skip,
					successCallback = function (result) {
						var assets = augmentAssetsWithRatings(result.editorials);
						if (assetSuccessCallback) {
							assetSuccessCallback(assets);
						}
						if (detailSuccessCallback) {
							detailSuccessCallback(augmentAssetsWithPricing(assets));
						}
						log("getPagedDetailedAssetsByProduct", "Exit");
					};
				skip = startIndex || 0;
				limit = (endIndex - startIndex) || null;
				filter['product.id'] = productID;
				filter = addCommonFilters(featureNameList, null, assetTitleFilterString, filter);
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Assets, filter, sortArray, null, limit, skip);
				log("getPagedDetailedAssetsByProduct", "Exit");
			}

			/**
			 * Retrieves the list of assets from a given catalogue
			 * @method getAssets
			 * @async
			 * @param {Number} catalogueUID UI of the catalogue we wish to retrieve assets for
			 * @param {Function} returnCallback Function to run once assets have been retrieved. This function should
			 * expect an array of assets indexed by their uid to be its input parameter
			 * @param {Array} sortArray list of columns on which returned data is to be sorted.
			 */
			function getAssets(catalogueUID, returnCallback, sortArray) {
				log("getAssets", "Enter");
				var filter,
					successCallback = function (result) {
						if (returnCallback) {
							returnCallback(result.editorials);
						}
					},
					failureCallback = function (result) {
						log("getAssets", "failure callback " + $N.apps.util.JSON.stringify(result));
					};
				filter = addCommonFilters(featureNameList, catalogueUID, null, filter);
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Assets, filter, sortArray);
				log("getAssets", "Exit");
			}

			/**
			 * Retrieves a filtered list of assets associated with the specified parent
			 * catalogue UID for the current locale. Optionally, assets are also filtered
			 * on the title string supplied.
			 * @method getDetailedAssets
			 * @async
			 * @param {Function} assetSuccessCallback The function to be executed if the call to SDP succeeds. It should expect the
			 * following parameters.
			 * @param {Array} assetSuccessCallback.assets an array of matching items
			 * @param {Function} detailSuccessCallback The function to be executed once additional asset information has been retrieved.
			 * @param {Array} detailSuccessCallback.assets an array of matching items with an additional attribute, 'lowestPrice'
			 * @param {Function} failureCallback The function to be executed if the call to SDP fails.
			 * @param {Number} catalogueUID The UID of the catalogue from which the schedules should be retrieved.
			 * @param {String} [assetTitleFilterString=''] The asset title filter string.
			 * @param {Array} sortArray list of columns on which returned data is to be sorted.
			 */
			function getDetailedAssets(assetSuccessCallback, detailSuccessCallback, failureCallback, catalogueUID, assetTitleFilterString, sortArray) {
				log("getDetailedAssets", "Enter - catalogueUID: " + catalogueUID);
				var successCallback = function (result) {
						var assets = result.editorials;
						if (assetSuccessCallback) {
							assetSuccessCallback(assets, result.z);
						}
						// TODO: augment assets with ratings
						if (detailSuccessCallback) {
							detailSuccessCallback(augmentAssetsWithPricing(assets));
						}
					},
					filter;
				// TODO: add asset 'active' filtering
				filter = addCommonFilters(featureNameList, catalogueUID, assetTitleFilterString, filter);
				MetadataService.getVODData(this, successCallback, failureCallback, MetadataService.RequestType.Assets, filter, sortArray);
				log("getDetailedAssets", "Exit");
			}

			/**
			 * Retrieves the asset object with its schedules for the given asset uid
			 * @method getAssetSchedulesByUid
			 * @async
			 * @deprecated This call is no longer supported, as product information is included in the asset. To retrieve
			 * an asset matching an id, use `getDetailedAssetByUid`
			 * @param {Number} uid the uid of the asset
			 * @param {Function} successCallback the function to run upon successfully retrieving the asset. The asset
			 * will be passed as a parameter to this function.
			 * @param {Object} successCallback.asset the asset that has been retrieved
			 * @param {Function} failureCallback the function to run upon failing to retrieve the asset
			 * @param {Array} sortArray list of columns on which returned data is to be sorted.
			 */
			function getAssetSchedulesByUid(uid, successCallback, failureCallback, sortArray) {
				log("getAssetSchedulesByUid", "Enter");
				var assetSuccess = function (assetData) {
						successCallback(assetData.editorials);
						log("getAssetSchedulesByUid", "Exit");
					},
					filter = addToFilter("editorial.id", uid, {});
				filter = addCommonFilters(featureNameList, null, null, filter);
				MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter, sortArray);
			}

			/**
			 * Retrieves the detailed asset object with its schedules for the given editorial asset id
			 * @method getDetailedAssetByUid
			 * @async
			 * @param {String} uid the unique id of the editorial asset
			 * @param {Function} successCallback The function to run upon successfully returning the asset object
			 * @param {Function} failureCalllback the function to run upon failing to retrieve the asset object
			 * @param {Boolean} [augment=true] indicates whether the returned assets should be augmented
			 */
			function getDetailedAssetByUid(uid, successCallback, failureCallback, augment) {
				log("getDetailedAssetByUid", "Enter");
				augment = (augment !== undefined && augment !== null) ? augment : true;
				var assetSuccess = function (assetData) {
						var assets = assetData.editorials;
						if (augment) {
							assets = augmentAssetsWithRatings(augmentAssetsWithPricing(assets));
						}
						if (successCallback) {
							successCallback(assets[0]);
						}
						log("getDetailedAssetByUid", "Exit");
					},
					filter = addToFilter("editorial.id", uid, {});
				filter = addCommonFilters(featureNameList, null, null, filter);
				MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter);
			}

			/**
			 * Retrieves the detailed asset object for the given technical asset uid
			 * @method getAssetsByIds
			 * @async
			 * @param {Array} id the ids of the assets
			 * @param {Function} successCallback The function to run upon successfully returning the asset object
			 * @param {Function} failureCallback the function to run upon failing to retrieve the asset object
			 * @param {Boolean} [augment=true] indicates whether the returned assets should be augmented
			 */
			function getAssetsByIds(ids, successCallback, failureCallback, augment) {
				log("getAssetsByIds", "Enter");
				augment = (augment !== undefined && augment !== null) ? augment : true;
				var assetSuccess = function (assets) {
						var mongoLookup = {},
							sortedResponseArray = [],
							responseObject = {},
							length,
							currentResult,
							i;

						if (augment) {
							assets.editorials = augmentAssetsWithRatings(augmentAssetsWithPricing(assets.editorials));
						}
						for (i = 0, length = assets.editorials.length; i < length; i++) {
							mongoLookup[assets.editorials[i].id] = assets.editorials[i];
						}
						for (i = 0, length = ids.length; i < length; i++) {
							currentResult = mongoLookup[ids[i]];
							if (currentResult) {
								sortedResponseArray.push(currentResult);
							}
						}
						responseObject.totalRecords = assets.totalRecords;
						responseObject.version = assets.version;
						responseObject.editorials = sortedResponseArray;
						if (successCallback) {
							successCallback(responseObject);
						}
						log("getAssetsByIds", "Exit");
					},
					filter = {};
				filter["editorial.id"] = {"$in": ids};
				filter = addCommonFilters(featureNameList, null, null, filter);
				MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter);
			}
			/**
			 * Retrieves the detailed asset object for the given technical asset uid
			 * @method getDetailedAssetByTechnicalId
			 * @async
			 * @param {String} id the unique id of the technical asset
			 * @param {Function} successCallback The function to run upon successfully returning the asset object
			 * @param {Function} failureCallback the function to run upon failing to retrieve the asset object
			 * @param {Boolean} [augment=true] indicates whether the returned assets should be augmented
			 */
			function getDetailedAssetByTechnicalId(id, successCallback, failureCallback, augment) {
				log("getDetailedAssetByTechnicalId", "Enter");
				augment = (augment !== undefined && augment !== null) ? augment : true;
				var assetSuccess = function (assetData) {
						var assets = assetData.editorials;
						if (augment) {
							assets = augmentAssetsWithRatings(augmentAssetsWithPricing(assets));
						}
						if (successCallback) {
							successCallback(assets[0]);
						}
						log("getDetailedAssetByTechnicalId", "Exit");
					},
					filter = addToFilter("technical.id", id, {});
				filter = addCommonFilters(featureNameList, null, null, filter);
				MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter);
			}

			/**
			 * Retrieves the asset objects that contain a specific promotion
			 * @method getAssetsByPromotionId
			 * @async
			 * @param {String} id the promotion id
			 * @param {Function} successCallback The function to run upon successfully returning the asset object
			 * @param {Function} failureCallback the function to run upon failing to retrieve the asset object
			 * @param {Boolean} [augment=true] indicates whether the returned assets should be augmented
			 * @param {Array} sortArray array of fields on which to sort the returned results
			 */
			function getAssetsByPromotionId(promotionId, successCallback, failureCallback, augment, sortArray) {
				log("getAssetsByPromotionId", "Enter");
				augment = (augment !== undefined && augment !== null) ? augment : true;
				var assetSuccess = function (assetData) {
						var assets = assetData.editorials;
						if (augment) {
							assets = augmentAssetsWithRatings(augmentAssetsWithPricing(assets));
						}
						if (successCallback) {
							successCallback(assetData);
						}
						log("getAssetsByPromotionId", "Exit");
					},
					filter = addToFilter("product.promotions", promotionId, {});
				filter = addCommonFilters(featureNameList, null, null, filter);
				MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter, sortArray);
			}

			/**
			 * Retrieves a detailed list of assets associated with the specified product id for the current locale.
			 * @method getPagedAssetsByPromotionId
			 * @async
			 * @param {String} id the promotion id
			 * @param {Function} successCallback The function to run upon successfully returning the asset object
			 * @param {Function} failureCallback the function to run upon failing to retrieve the asset object
			 * @param {Boolean} [augment=true] indicates whether the returned assets should be augmented
			 * @param {Array} sortArray array of fields on which to sort the returned results
			 * @param {Number} startIndex The start index of the paged results. The first item is at index 0.
			 * @param {Number} endIndex The end index of the paged results.
			 */
			function getPagedAssetsByPromotionId(promotionId, successCallback, failureCallback, augment, sortArray, startIndex, endIndex) {
				log("getPagedAssetsByPromotionId", "Enter: " + promotionId);
				var filter = {},
					limit,
					skip,
					assetSuccess = function (assetData) {
						var assets = assetData.editorials;
						if (augment) {
							assets = augmentAssetsWithRatings(augmentAssetsWithPricing(assets));
						}
						if (successCallback) {
							successCallback(assetData);
						}
						log("getPagedAssetsByPromotionId", "Exit");
					};
				skip = startIndex || 0;
				limit = (endIndex - startIndex) || null;
				filter = addToFilter("product.promotions", promotionId, {});
				filter = addCommonFilters(featureNameList, null, null, filter);
				MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter, sortArray, null, limit, skip);
				log("getPagedAssetsByPromotionId", "Exit");
			}

			/**
			 * Subscribes to a policy group.
			 * @method subscribeToPolicyGroup
			 * @async
			 * @param {String} productId The product id (origin key) of the policy group.
			 * @param {Function} caller Reference to the calling function.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failCallback Function to execute on failure
			 * @param {String} promotionId id of any applicable promotion to be applied
			 */
			function subscribeToPolicyGroup(productId, caller, successCallback, failCallback, promotionId) {
				log("subscribeToPolicyGroup", "product id " + productId);

				var offerSpecification = {},
					purchaseFor;

				ContextService.getCurrentContext(this, function (result) {
					context = $N.apps.util.JSON.stringify(result);
					if (promotionId) {
						offerSpecification = $N.apps.util.JSON.stringify({ "polgrpOriginKey" : productId, "polgrpOriginId" : ORIGIN_CMS, "offerId": promotionId});
					} else {
						offerSpecification = $N.apps.util.JSON.stringify({ "polgrpOriginKey" : productId, "polgrpOriginId" : ORIGIN_CMS});
					}
					purchaseFor = $N.apps.util.JSON.stringify("ACCOUNT"); // this needs a stringify, otherwise BocPurchasePolicy won't work
					BocPurchaseService.purchasePolicy(this, successCallback, failCallback, context, offerSpecification, purchaseFor);
				}, failCallback);
			}

			/**
			 * Subscribes to an asset using the offer object.
			 *
			 * @method subscribeToAssetUsingOffer
			 * @async
			 * @param {Object} asset The asset object - required for compatibility with SDP.
			 * @param {Object} offer The offer object (obtainable from the asset).
			 * @param {Function} caller Reference to the calling function.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failCallback Function to execute on failure
			 */
			function subscribeToAssetUsingOffer(asset, offer, caller, successCallback, failCallback) {
				log("subscribeToAssetUsingOffer", "Enter");
				subscribeToPolicyGroup(offer.id, this, successCallback, failCallback);
				log("subscribeToAssetUsingOffer", "Exit");
			}

			/**
			 * Subscribes to an asset using a policy if the policy is an impulse purchase.
			 * If the policy is for a subscription or a bundle,
			 * then the purchase is made via the policy group to ensure the subscription
			 * and/or bundle purchase is completed along with the asset.
			 * This method requires the asset and policy objects (rather than their
			 * identifiers) so that it can determine the subscription method to use.
			 * For direct subscription to an asset or policy group, see `subscribeToAsset` and
			 * `subscribeToPolicyGroup`.
			 * @method subscribeToAssetUsingPolicy
			 * @async
			 * @deprecated use `subscribeToPolicyGroup` instead
			 * @param {Object} asset The asset object.
			 * @param {Object} policy The policy object (obtainable from the asset).
			 * @param {Function} caller Reference to the calling function.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failCallback Function to execute on failure
			 */
			function subscribeToAssetUsingPolicy(asset, policy, caller, successCallback, failCallback) {
			}

			/**
			 * Subscribes to an individual asset using a policy group.
			 * @method subscribeToAsset
			 * @async
			 * @deprecated use `subscribeToPolicyGroup` instead
			 * @param {Number} assestId The asset identifier.
			 * @param {String} productId The product id (origin key) of the policy group.
			 * @param {Function} caller Reference to the calling function.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failCallback Function to execute on failure
			 */
			function subscribeToAsset(assetId, productId, caller, successCallback, failCallback) {
			}

			/**
			 * Unsubscribe a previously subscribed asset.
			 * @method unsubscribeAsset
			 * @async
			 * @deprecated no longer supported by SDP
			 * @param {Number} assestId The asset identifier.
			 * @param {Function} caller Reference to the calling function.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failCallback Function to execute on failure
			 */
			function unsubscribeAsset(assetId, caller, successCallback, failCallback) {
			}

			/**
			 * Searches the given array of assets for common bundle or subscription policy
			 * groups.
			 * @method getCommonPolicyGroupsForAssets
			 * @deprecated - not supported in MDS
			 * @param {Array} assets List of asset objects.
			 * @return {Object} Object containing the common bundle and / or subscription policy group in the following attributes:
			 *
			 *     bundlePolicyGroup: {Object}
			 *     subscriptionPolicyGroup: {Object}
			 */
			function getCommonPolicyGroupsForAssets(assets) {
			}

			/**
			 * Retrieves a policy of a given type from a policy group.
			 * If policy type is not defined, then the flat rate policy is returned.
			 * @method getPolicyByPolicyGroupId
			 * @async
			 * @deprecated - not supported in MDS
			 * @param {Number} policyGroupId The policy group identifier.
			 * @param {String} policyType The policy type (one of POLICY_TYPE constants)
			 * @param {Function} caller Reference to the calling function.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failCallback Function to execute on failure
			 */
			function getPolicyByPolicyGroupId(policyGroupId, policyType, caller, successCallback, failCallback) {
			}

			/**
			 * Retrieves series metadata for a provided asset (episode). Only if seriesRef exists on the VOD asset
			 * will a MDS call be made.
			 * @method getSeriesForAsset
			 * @async
			 * @param {Object} asset The asset (episode) in a series.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failureCallback Function to execute on failure
			 */
			function getSeriesForAsset(asset, successCallback, failureCallback) {
				log("getSeriesForEpisode", "Enter");
				var filter,
					seriesSuccess = function (series) {
						if (successCallback) {
							successCallback(series);
						}
						log("getSeriesForEpisode", "Exit");
					};
				filter = addToFilter("id", asset.seriesRef, {});
				if (asset.seriesRef) {
					MetadataService.getVODData(this, seriesSuccess, failureCallback, MetadataService.RequestType.Series, filter);
				} else {
					failureCallback("No series reference for asset");
				}
			}

			/**
			 * Retrieves assets (episode) in the same series as a provided asset (episode).
			 * Only if seriesRef exists on the VOD asset will a MDS call be made.
			 * @method getAssetsInSeriesForAsset
			 * @async
			 * @param {Object} asset The asset (episode) in a series.
			 * @param {Function} successCallback Function to execute on success.
			 * @param {Function} failureCallback Function to execute on failure
			 */
			function getAssetsInSeriesForAsset(asset, successCallback, failureCallback, sortArray) {
				log("getAssetsInSeriesForAsset", "Enter");
				var filter,
					assetSuccess = function (series) {
						if (successCallback) {
							successCallback(series);
						}
						log("getAssetsInSeriesForAsset", "Exit");
					};

				if (asset.seriesRef) {
					filter = addToFilter("editorial.seriesRef", asset.seriesRef, {});
					filter = addCommonFilters(featureNameList, null, null, filter);
					MetadataService.getVODData(this, assetSuccess, failureCallback, MetadataService.RequestType.Assets, filter, sortArray);
				} else {
					failureCallback("No series reference for asset");
				}
			}

			/**
			 * Fetches VOD data from MDS. Catalogue, Asset or Product information can be requested.
			 * @method getVODData
			 * @async
			 * @param {Function} successCallback Function to be called when data has been retrieved.
			 * @param {Function} failureCallback Function to be called o on failure
			 * @param {String} vodRequestType Specifies whether Catalogue, Asset or Product information is required.
			 * One of `$N.services.sdp.MetadataService.RequestType.Catalogues`, `$N.services.sdp.MetadataService.RequestType.Assets` or `$N.services.sdp.MetadataServiceRequestType.Products`
			 * @param {Object} filter This is a object containing criteria that will be used in the request. E.G. {"technical.id" : "12345"}
			 * @param {Array} [sortOrder] Array of arrays. Each array consists of a field name and a number which should be 1 (for ascending order) or -1 (for descending order).
			 * @param {Array} [fieldList] List of fields to be included in the returned data. E.g., ['Title', 'Name']
			 * @param {Number} [count] Returns only the specified number of records. Defaults to 'everything'
			 * @param {Number} [offset] Specifies, when used with `count`, what the start offset for the result set should be
			 */
			function getVODData(successCallback, failureCallback, vodRequestType, filter, sortOrder, fieldList, count, offset) {
				MetadataService.getVODData(this, successCallback, failureCallback, vodRequestType, addCommonFilters(featureNameList, null, null, filter), sortOrder, fieldList, count, offset);
			}

			/*
			 * Public API
			 */
			return {
				init: init,
				initialise: initialise,
				setAccountId: setAccountId,
				setUserId: setUserId,
				setSmartCardId: setSmartCardId,
				setLocale: setLocale,
				setFeatureNameList: setFeatureNameList,
				getFeatureNameList: getFeatureNameList,
				refreshContext: refreshContext,
				getAccountId: getAccountId,
				getUserId: getUserId,
				getSmartCardId: getSmartCardId,
				getLocale: getLocale,
				getContext: getContext,
				getAssets: getAssets,
				addFilteredCatalogue: addFilteredCatalogue,
				removeFilteredCatalogue: removeFilteredCatalogue,
				clearFilteredCatalogues: clearFilteredCatalogues,
				getAssetSchedulesByUid: getAssetSchedulesByUid,
				getDetailedAssetByUid: getDetailedAssetByUid,
				getDetailedAssetByTechnicalId: getDetailedAssetByTechnicalId,
				getAssetsByIds: getAssetsByIds,
				getAssetsByPromotionId: getAssetsByPromotionId,
				getPagedAssetsByPromotionId: getPagedAssetsByPromotionId,
				getFilteredCatalogues: getFilteredCatalogues,
				getRootCatalogues: getRootCatalogues,
				getDetailedCatalogues: getDetailedCatalogues,
				getDetailedAssets: getDetailedAssets,
				getPagedDetailedAssets: getPagedDetailedAssets,
				getPagedDetailedAssetsByProduct: getPagedDetailedAssetsByProduct,
				getCommonPolicyGroupsForAssets: getCommonPolicyGroupsForAssets,
				getPolicyByPolicyGroupId: getPolicyByPolicyGroupId,
				subscribeToAsset: subscribeToAsset,
				subscribeToPolicyGroup: subscribeToPolicyGroup,
				subscribeToAssetUsingPolicy: subscribeToAssetUsingPolicy,
				subscribeToAssetUsingOffer: subscribeToAssetUsingOffer,
				unsubscribeAsset: unsubscribeAsset,
				getCatalogueScheduleCount: getCatalogueScheduleCount,
				getCatalogueScheduleCountByProduct: getCatalogueScheduleCountByProduct,
				getSeriesForAsset: getSeriesForAsset,
				getAssetsInSeriesForAsset: getAssetsInSeriesForAsset,
				getVODData: getVODData
			};
		}());

		// Policy frequencies
		$N.services.sdp.VOD.POLICY_FREQUENCY = {};

		/**
		 * Policy group of type impulse purchase.
		 * @property {String} POLICY_FREQUENCY.IMPULSE
		 * @readonly
		 */
		$N.services.sdp.VOD.POLICY_FREQUENCY.IMPULSE = 'IMP';

		/**
		 * Policy group of type recurring subscription.
		 * @property {String} POLICY_FREQUENCY.SUBSCRIPTION
		 * @readonly
		 */
		$N.services.sdp.VOD.POLICY_FREQUENCY.SUBSCRIPTION = 'REC';

		/**
		 * Policy group of type multiple bundle.
		 * @property {String} POLICY_FREQUENCY.BUNDLE
		 * @readonly
		 */
		$N.services.sdp.VOD.POLICY_FREQUENCY.BUNDLE = 'MUL';
		return $N.services.sdp.VOD;
	}
);
