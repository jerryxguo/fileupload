/**
 * This class manages a user's Acquired Content List (ACL) which is the term that stands for all the
 * OnDemand content that the user has purchased. It retrieves data from the SDP using the
 * AssetService, and refreshes its data periodically (currently set to two minutes).
 *
 * @class $N.services.sdp.AcquiredContent
 * @static
 * @singleton
 * @requires $N.services.sdp.ServiceFactory
 * @requires $N.services.sdp.VOD
 * @requires $N.apps.core.Log
 *
 */
/* global define */
define('jsfw/services/sdp/AcquiredContent',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/ServiceFactory',
		'jsfw/services/sdp/VOD',
		'jsfw/services/sdp/MetadataService'
	],
	function (Log, ServiceFactory, VOD, MetadataService) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.AcquiredContent = (function () {
			var log = new $N.apps.core.Log("sdp", "AcquiredContent");

			/* Private behaviour constants */
			var ACL_CHANGE_LISTENER_TIMEOUT_LENGTH = 100,
				MAX_ASSETS_IN_SUBSCRIPTION = 2000;

			/* Private preferences references */
			var USER_ACCOUNT_UID = null,
				LOCALE = "en_gb";

			/* SDP Services */
			var AclService,
				MetadataService;

			/* Private ACL cache */
			var purchasedItems = [],
				purchasedAssets = {},
				purchasedProducts = {};

			/* associative arrays to increase performance of isPurchased methods */
			var productFrequencyType = {},
				purchasedAssetsByEditorialId = {},
				subscribedAssetsByTechnicalId = {},
				subscribedAssetsByEditorialId = {};

			/* tally for retrieved items and subscriptions watching */
			var numberOfItemsRetrieved = 0,
				numberOfItemsToRetrieve = 0,
				numberOfSubscriptionsRetrieved = 0,
				numberOfSubscriptionsToRetrieve = 0;

			/* timeout to refresh the ACL on earliest asset expiry */
			var rentalCountTO = null;

			/* change listener */
			var aclChangeListener = null;


			/**
			 * Waits for ACL data retrieval to complete before calling registered change listener
			 * @method invokeChangeListener
			 * @private
			 */
			function invokeChangeListener() {
				if (aclChangeListener) {
					if (numberOfItemsRetrieved < numberOfItemsToRetrieve ||
							numberOfSubscriptionsRetrieved < numberOfSubscriptionsToRetrieve) {
						// if we're still waiting for retrieved items and subscribed assets, then set timeout
						setTimeout(function () {
							invokeChangeListener();
						}, ACL_CHANGE_LISTENER_TIMEOUT_LENGTH);
					} else {
						aclChangeListener();
					}
				}
			}

			/**
			 * Add the asset retrieved for the ACL into our ACL array.
			 * @method getAssetSuccess
			 * @param {Object} result ACL item
			 * @private
			 */
			function getAssetSuccess(result) {
				log("getAssetSuccess", "Asset Retrieved");
				var fullAssetInfo,
					technicalAsset,
					technicalAssetId,
					expiryDate,
					i;

				numberOfItemsRetrieved++;
				if (result) {
					fullAssetInfo = result;
					technicalAsset = fullAssetInfo.technicals[0];
					if (technicalAsset) {
						technicalAssetId = technicalAsset.id;
						if (!purchasedAssets[technicalAssetId]) {
							// we're only interested in unique assets, so only process if not already in asset array
							for (i = purchasedItems.length - 1; i >= 0; i--) {
								if (purchasedItems[i] && purchasedItems[i].purchasedItemOriginKey === technicalAssetId) {
									expiryDate = purchasedItems[i].expiryDate;
									if (!technicalAsset.expiryDate || technicalAsset.expiryDate < expiryDate) {
										technicalAsset.expiryDate = expiryDate;
										fullAssetInfo.expiryDate = expiryDate;
										purchasedAssetsByEditorialId[fullAssetInfo.id] = true;
									}
									break;
								}
							}
							purchasedAssets[technicalAssetId] = fullAssetInfo;
						}
					} else {
						log("getAssetSuccess", "Asset with technical id not found", "error");
					}
				} else {
					log("getAssetSuccess", "result arg on callback is null or empty");
				}
			}

			/**
			 * Add the policy group retrieved for the ACL into our ACL array. Also record assets that are part of a subscription.
			 * @method getPolicyGroupSuccess
			 * @param {Array} result list of assets that are contained in the product / policy group
			 * @param {String} productId policy group id
			 * @param {Date} expiryDate expiry date of the policy group
			 * @param {Boolean} isSubscription flags the policy group as a subscription
			 * @private
			 */
			function getPolicyGroupSuccess(result, productId, expiryDate, isSubscription) {
				log("getPolicyGroupSuccess", "Policy Group Retrieved for: " + productId);
				var product,
					j;
				if (result) {
					numberOfItemsRetrieved++;
					if (isSubscription) {
						numberOfSubscriptionsRetrieved++;
					}
					if (result.length) {
						result.forEach(function (fullAssetInfo) {
							var technicalAsset;
							if (isSubscription) {
								subscribedAssetsByEditorialId[fullAssetInfo.id] = true;
							} else {
								purchasedAssetsByEditorialId[fullAssetInfo.id] = true;
							}
							for (j = fullAssetInfo.technicals.length - 1; j >= 0; j--) {
								technicalAsset = fullAssetInfo.technicals[j];
								if (isSubscription) {
									subscribedAssetsByTechnicalId[technicalAsset.id] = true;
								} else {
									if (!purchasedAssets[technicalAsset.id]) {
										if (!technicalAsset.expiryDate || technicalAsset.expiryDate < expiryDate) {
											technicalAsset.expiryDate = expiryDate;
											fullAssetInfo.expiryDate = expiryDate;
											purchasedAssetsByEditorialId[fullAssetInfo.id] = true;
										}
										purchasedAssets[technicalAsset.id] = fullAssetInfo;
									}
								}
								product = technicalAsset.products[0];
								// add the policy group / product to the list only if it has not already been added
								if (!purchasedProducts[productId] && product.id === productId) {
									product.expiryDate = expiryDate;
									purchasedProducts[productId] = product;
									purchasedProducts[productId].frequencyType = productFrequencyType[productId];
								}
							}
						});
					} else {
						log('getPolicyGroupSuccess', 'Policy Group not found');
					}
				} else {
					log("getPolicyGroupSuccess", "result arg on callback is null or empty");
				}
			}

			/**
			 * Successfully retrieved acquired content list so update Currently Rented menu.
			 * @method getACLSuccess
			 * @param {Array} result An array of ACL items
			 * @private
			 */
			function getACLSuccess(result) {
				// store ACL items
				purchasedItems = result;
				// clear associative arrays
				purchasedAssets = {};
				purchasedAssetsByEditorialId = {};
				purchasedProducts = {};
				productFrequencyType = {};
				subscribedAssetsByTechnicalId = {};
				subscribedAssetsByEditorialId = {};

				// reset item and subscription retrieval tally
				numberOfItemsRetrieved = 0;
				numberOfItemsToRetrieve = 0;
				numberOfSubscriptionsRetrieved = 0;
				numberOfSubscriptionsToRetrieve = 0;
				var firstExpire = null,
					assetFailure = function (result) {
						log("getACLSuccess", "Failed to get ACL asset " + result.uid, "error");
					},
					policyGroupFailure = function (result) {
						log("getACLSuccess", "Failed to get ACL policy group " + result.uid, "error");
					};
				if (purchasedItems && purchasedItems.length) {
					purchasedItems.forEach(function (aclItem) {
						var isSubscription = false;
						if (aclItem.purchasedItemType === 'AST') {
							numberOfItemsToRetrieve++;
							// fetch the asset
							$N.services.sdp.VOD.getDetailedAssetByTechnicalId(aclItem.purchasedItemOriginKey, getAssetSuccess, assetFailure, false);
						} else if (aclItem.purchasedItemType === 'PLG') {
							// store the frequency type in the uid to distinguish between REC and MUL
							productFrequencyType[aclItem.purchasedItemOriginKey] = aclItem.frequencyType;
							numberOfItemsToRetrieve++;
							if (aclItem.frequencyType === $N.services.sdp.AcquiredContent.POLICY_GROUP_SUBSCRIPTION) {
								log('getACLSuccess', 'item is a subscription, id: ' + aclItem.purchasedItemOriginKey);
								numberOfSubscriptionsToRetrieve++;
								isSubscription = true;
							}
							// fetch the policy group
							$N.services.sdp.VOD.getPagedDetailedAssetsByProduct(function (result) {
								getPolicyGroupSuccess(result, aclItem.purchasedItemOriginKey, aclItem.expiryDate, isSubscription);
							}, null, policyGroupFailure, aclItem.purchasedItemOriginKey, '', 0, MAX_ASSETS_IN_SUBSCRIPTION);
						}
						// record earliest expiry date of all items
						if (firstExpire === null || aclItem.expiryDate < firstExpire) {
							firstExpire = aclItem.expiryDate;
						}
					});
				}

				// set expiry timeout to refresh the ACL at earliest expiry date
				if (firstExpire) {
					var now = new Date().getTime();
					var toDelay = firstExpire - now;

					if (toDelay < 0) {
						toDelay = 120000; // 2 minutes server time may be out
					}

					if (rentalCountTO) {
						clearTimeout(rentalCountTO);
					}

					if (toDelay < 43200000) { // don't bother if over 12 hrs
						rentalCountTO = setTimeout(function () {
							refresh();
						}, toDelay);
					}
				}
				// inform registered ACL change listener
				invokeChangeListener();
			}

			/**
			 * Unsuccessfully retrieved acquired content list so update Currently Rented menu.
			 * @method getACLFail
			 * @param {Object} result Contains details of the failure
			 * @private
			 */
			function getACLFail(result) {
				log("getACLFail", "Unable to retrieve ACL: " + result);
			}

			/**
			 * Determines if a given asset was purchased
			 * @method isAssetPurchased
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Boolean} true if the asset was purchased; false otherwise
			 */
			function isAssetPurchased(technicalAssetId) {
				return purchasedAssets[technicalAssetId] ? true : false;
			}

			/**
			 * Determines if an asset identified by its editorial asset id was purchased
			 * @method doesContainPurchasedAsset
			 * @param {String} editorialAssetId editorial asset id of the asset in question
			 * @return {Boolean} true if the asset was purchased; false otherwise
			 */
			function doesContainPurchasedAsset(editorialAssetId) {
				return purchasedAssetsByEditorialId[editorialAssetId] ? true : false;
			}

			/**
			 * Determines if an asset with the given technical asset id has been subscribed to
			 * @method isAssetSubscribed
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Boolean} true if the asset was subscribed to; false otherwise
			 */
			function isAssetSubscribed(technicalAssetId) {
				return subscribedAssetsByTechnicalId[technicalAssetId] ? true : false;
			}

			/**
			 * Determines if an asset with the given editorial asset id has been subscribed to
			 * @method doesContainSubscribedAsset
			 * @param {String} editorialAssetId editorial asset id of the asset in question
			 * @return {Boolean} true if the asset was subscribed to; false otherwise
			 */
			function doesContainSubscribedAsset(editorialAssetId) {
				return subscribedAssetsByEditorialId[editorialAssetId] ? true : false;
			}

			/**
			 * Determines if an asset is either purchased or subscribed
			 * @method isAssetPurchasedOrSubscribed
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Boolean} true if the asset was purchased or subscribed; false otherwise
			 */
			function isAssetPurchasedOrSubscribed(technicalAssetId) {
				if (purchasedAssets[technicalAssetId] || subscribedAssetsByTechnicalId[technicalAssetId]) {
					return true;
				}
				return false;
			}

			/**
			 * Determines if a bundle (identified by a policy group) was purchased
			 * @method isPolicyGroupPurchased
			 * @param {String} policyGroupId Id of the policy group a.k.a. product id
			 * @return {Boolean} true if the policy group was purchased; false otherwise
			 */
			function isPolicyGroupPurchased(policyGroupId) {
				return productFrequencyType[policyGroupId] ? true : false;
			}

			/**
			 * Gets a list of all acquired technical assets
			 * @method getAssets
			 * @return {Array} a list of subscribed assets
			 */
			function getAssets() {
				var arrayOfAssets = [],
					id,
					asset;
				for (id in purchasedAssets) {
					if (purchasedAssets.hasOwnProperty(id)) {
						asset = purchasedAssets[id].technicals[0];
						arrayOfAssets.push(asset);
					}
				}
				return arrayOfAssets;
			}

			/**
			 * Gets a list of all acquired assets with editorial data
			 * @method getAssetsWithEditorialData
			 * @return {Array} a list of purchased assets
			 */
			function getAssetsWithEditorialData() {
				var arrayOfAssets = [],
					id;
				for (id in purchasedAssets) {
					if (purchasedAssets.hasOwnProperty(id)) {
						arrayOfAssets.push(purchasedAssets[id]);
					}
				}
				return arrayOfAssets;
			}

			/**
			 * Gets the acquired policy groups of a particular frequency type or all if unspecified
			 * @method getPolicyGroups
			 * @param {String} [frequency] the frequency of the policy group. One of `POLICY_GROUP_IMPULSE`,
			 * `POLICY_GROUP_SUBSCRIPTION` or `POLICY_GROUP_BUNDLE`
			 * @return {Array} list of policy groups
			 */
			function getPolicyGroups(frequency) {
				var retrievedProducts = [],
					id;
				if (frequency) {
					for (id in purchasedProducts) {
						if (purchasedProducts.hasOwnProperty(id) && purchasedProducts[id].frequencyType === frequency) {
							retrievedProducts.push(purchasedProducts[id]);
						}
					}
				} else {
					for (id in purchasedProducts) {
						if (purchasedProducts.hasOwnProperty(id)) {
							retrievedProducts.push(purchasedProducts[id]);
						}
					}
				}
				return retrievedProducts;
			}

			/**
			 * Gets the expiry date of the asset identified by its technical asset id
			 * @method getAssetExpiryDate
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Date | null} the expiry date of the asset, or null if technicalAssetId was invalid
			 */
			function getAssetExpiryDate(technicalAssetId) {
				return purchasedAssets[technicalAssetId] ? purchasedAssets[technicalAssetId].technicals[0].expiryDate : null;
			}

			/**
			 * Returns the expiry date of the given policy group
			 * @method getPolicyGroupExpiryDate
			 * @param {String} policyGroupUID UID of the policy group
			 * @return {Date | null} the expiry date of the policy group, or null if the UID is invalid
			 */
			function getPolicyGroupExpiryDate(policyGroupUID) {
				return purchasedProducts[policyGroupUID] ? (purchasedProducts[policyGroupUID].endValidity * 1000) : null;
			}

			/**
			 * Retrieve ACL items of a particular product type
			 * @method getAclItemsByProductType
			 * @param {String} productType Type of product
			 * @return {Array} An array of ACL items
			 */
			function getAclItemsByProductType(productType) {
				var retrievedpurchasedItems = purchasedItems.filter(function (item) {
					return (!productType || item.productType === productType);
				});
				return retrievedpurchasedItems;
			}

			/**
			 * Set the call back method to be called when the ACL changes
			 * @method registerAclChangeCallBack
			 * @param {Function} callback The call back function
			 */
			function registerAclChangeCallBack(callback) {
				aclChangeListener = callback;
			}

			/**
			 * Removes the current ACL change call back function.
			 * @method removeAclChangeCallback
			 */
			function removeAclChangeCallback() {
				aclChangeListener = null;
			}

			/**
			 * Forces a refresh of the cached ACL with content retrieved from SDP.
			 * @method refresh
			 */
			function refresh() {
				log("refresh", "Refreshing ACL");
				AclService.getByAccountUID(this, getACLSuccess, getACLFail, USER_ACCOUNT_UID, "CURRENT", LOCALE);
			}

			/**
			 * Sets the locale to be used when fetching data from the server.
			 * @method setLocale
			 * @param {String} locale e.g. `en_gb`
			 */
			function setLocale(locale) {
				LOCALE = locale;
			}

			/**
			 * Initialise class
			 * @method init
			 * @param {String} userAccountUID Users account UID
			 * @param {String} [locale='en_gb'] user's locale
			 */
			function init(userAccountUID, locale) {
				log("init", "user account " + userAccountUID);
				AclService = $N.services.sdp.ServiceFactory.get('AcquiredContentListService');
				USER_ACCOUNT_UID = userAccountUID;
				setLocale(locale || LOCALE);
				refresh();
				MetadataService = $N.services.sdp.MetadataService;
			}

			/**
			 * Initialise class
			 * @method initialise
			 * @deprecated use init()
			 * @param {String} userAccountUID Users account UID
			 * @param {String} [locale='en_gb'] user's locale
			 */
			function initialise(userAccountUID, locale) {
				init(userAccountUID, locale);
			}

			/*
			 * Public API
			 */
			return {
				init: init,
				initialise: initialise,
				refresh: refresh,
				isAssetPurchased: isAssetPurchased,
				doesContainPurchasedAsset: doesContainPurchasedAsset,
				isAssetSubscribed: isAssetSubscribed,
				doesContainSubscribedAsset: doesContainSubscribedAsset,
				isAssetPurchasedOrSubscribed: isAssetPurchasedOrSubscribed,
				isPolicyGroupPurchased: isPolicyGroupPurchased,
				getAssets: getAssets,
				getAssetsWithEditorialData: getAssetsWithEditorialData,
				getPolicyGroups: getPolicyGroups,
				getAssetExpiryDate: getAssetExpiryDate,
				getPolicyGroupExpiryDate: getPolicyGroupExpiryDate,
				getAclItemsByProductType: getAclItemsByProductType,
				registerAclChangeCallBack: registerAclChangeCallBack,
				removeAclChangeCallback: removeAclChangeCallback,
				setLocale: setLocale,
				/**
				 * Policy group of type recurring subscription.
				 * @property {String} POLICY_GROUP_IMPULSE
				 * @readonly
				 */
				POLICY_GROUP_IMPULSE: 'IMP',

				/**
				 * Policy group of type recurring subscription.
				 * @property {String} POLICY_GROUP_SUBSCRIPTION
				 * @readonly
				 */
				POLICY_GROUP_SUBSCRIPTION: 'REC',

				/**
				 * Policy group of type multiple bundle.
				 * @property {String} POLICY_GROUP_BUNDLE
				 * @readonly
				 */
				POLICY_GROUP_BUNDLE: 'MUL',

				/**
				 * Product of type NPVR.
				 * @property {String} PRODUCT_NPVR
				 * @readonly
				 */
				PRODUCT_NPVR: 'NPVR'
			};
		}());
		return $N.services.sdp.AcquiredContent;
	}
);