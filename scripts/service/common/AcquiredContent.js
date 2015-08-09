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
		'jsfw/services/sdp/VOD'
	],
	function (Log, ServiceFactory, VOD) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.AcquiredContent = (function () {
			var log = new $N.apps.core.Log("sdp", "AcquiredContent");

			/* Private behaviour constants */
			var ACL_CHANGE_LISTENER_TIMEOUT_LENGTH = 100,
				MAX_ASSETS_IN_SUBSCRIPTION = 2000;

			/* Private preferences references */
			var USER_ACCOUNT_UID = null;
			var LOCALE = null;

			/* SDP Services */
			var AclService,
				PolicyGroupService;

			/* Private ACL cache */
			var aclItems = {},
				aclAssets = {},
				aclPolicyGroups = {};

			/* associative arrays to increase performance of isPurchased methods */
			var polGroupFrequencyType = {},
				subscribedAssetsByTechnical = {},
				aclAssetsByEditorialId = {},
				subscribedAssetsByEditorial = {};

			/* tally for retrieved items and subscriptions watching */
			var numberOfItemsRetrieved = 0;
			var numberOfItemsToRetrieve = 0;
			var numberOfSubscriptionsRetrieved = 0;
			var numberOfSubscriptionsToRetrieve = 0;

			/* timeout to refresh the ACL on earliest asset expiry */
			var rentalCountTO = null;

			/* change listener */
			var aclChangeListener = null;


			/**
			 * Waits for ACL data retrieval to finish before calling registered change listener
			 *
			 * @method invokeChangeListener
			 * @private
			 */
			function invokeChangeListener() {
				if (aclChangeListener) {
					if (numberOfItemsRetrieved < numberOfItemsToRetrieve ||
							numberOfSubscriptionsRetrieved < numberOfSubscriptionsToRetrieve) {
						// if we're still waiting for retrieved items or subscribed assets, then set timeout
						setTimeout(function () {
							invokeChangeListener();
						}, ACL_CHANGE_LISTENER_TIMEOUT_LENGTH);
					} else {
						aclChangeListener();
					}
				}
			}

			/**
			 * Returns an asset object with additional expiryDate property if required.
			 * Updates the aclAssetsByEditorialId lookup
			 * @method getAssetWithExpiryDate
			 * @private
			 * @param {Object} fullAssetInfo
			 * @param {Number} expiryDate
			 * @param {Number} technicalItemIndex
			 */
			function getAssetWithExpiryDate(fullAssetInfo, expiryDate, technicalItemIndex) {
				var technicalAsset = fullAssetInfo.scheduledTechnicalItems[technicalItemIndex].technicalAsset
				if (!technicalAsset.expiryDate || technicalAsset.expiryDate < expiryDate) {
					technicalAsset.expiryDate = expiryDate;
				}
				if (!fullAssetInfo.expiryDate || fullAssetInfo.expiryDate < expiryDate) {
					fullAssetInfo.expiryDate = expiryDate;
					aclAssetsByEditorialId[fullAssetInfo.editorialAsset.uid] = technicalAsset;
				}
				return fullAssetInfo;
			}

			/**
			 * Retrieves the assets belonging to a policy group
			 *
			 * @method getAssetsByPolicyGroupUid
			 * @param {String} policyGroupUid UID of the policy group in question
			 * @private
			 */
			function getAssetsByPolicyGroupUid(policyGroupUid, frequency, expiryDate) {
				$N.services.sdp.VOD.getPagedDetailedAssetsByProduct(function (result) {
					var i,
						j,
						asset;
					for (i = result.length - 1; i >= 0; i--) {
						asset = result[i];
						if (asset) {
							if (frequency === $N.services.sdp.AcquiredContent.POLICY_GROUP_SUBSCRIPTION) {
								subscribedAssetsByEditorial[asset.editorialAsset.uid] = true;
								asset.scheduledTechnicalItems.forEach(function (scheduledItem) {
									subscribedAssetsByTechnical[scheduledItem.technicalAsset.uid] = true;
								});
							} else if (frequency === $N.services.sdp.AcquiredContent.POLICY_GROUP_IMPULSE) {
								for (j = 0; J < asset.scheduledTechnicalItems.length; j++) {
									asset = getAssetWithExpiryDate(asset, expiryDate, j);
								}
								for (j = 0; J < asset.scheduledTechnicalItems.length; j++) {
									aclAssets[asset.scheduledTechnicalItems[j].technicalAsset.uid] = asset;
								}

							}
						}
					}
					// update the number of retrieved subscriptions
					numberOfSubscriptionsRetrieved++;
				},
				null,
				function (result) {
					log("getAssetsByPolicyGroupUid", 'Error: ' + result);
				},
				policyGroupUid,
				'',
				0, MAX_ASSETS_IN_SUBSCRIPTION);
			}

			/**
			 * Add the asset retrieved for the ACL into our ACL array.
			 *
			 * @method getAssetSuccess
			 * @param {Object} result ACL item
			 * @private
			 */
			function getAssetSuccess(result) {
				log("getAssetSuccess", "Asset Retrieved");

				numberOfItemsRetrieved++;
				if (result) {
					var fullAssetInfo = result,
						technicalAsset = fullAssetInfo.scheduledTechnicalItems[0].technicalAsset,
						technicalAssetId = technicalAsset.uid;
					// we're only interested in unique assets, so only process if not already in asset array
					if (!aclAssets[technicalAssetId]) {
						// add largest expiry date to asset object (both editorial and technical)
						var i = null;
						for (i in aclItems) {
							if (aclItems.hasOwnProperty(i) && aclItems[i].purchasedItemUID === technicalAssetId && aclItems[i].purchasedItemType === 'AST') {
								fullAssetInfo = getAssetWithExpiryDate(fullAssetInfo, aclItems[i].expiryDate, 0);
								break;
							}
						}
						// add the asset to the asset associative array
						aclAssets[technicalAssetId] = fullAssetInfo;
					}
				} else {
					log("getAssetSuccess", "result arg on callback is null or empty");
				}
			}

			/**
			 * Add the policy group retrieved for the ACL into our ACL array.
			 *
			 * @method getPolicyGroupSuccess
			 * @param {Object} result policy group that was requested
			 * @private
			 */
			function getPolicyGroupSuccess(result) {
				log("getPolicyGroupSuccess", "Policy Group Retrieved");

				numberOfItemsRetrieved++;
				if (result) {
					var policyGroup = result;

					// add expiry date to policy group object
					var i = null;
					for (i in aclItems) {
						if (aclItems.hasOwnProperty(i) && aclItems[i].purchasedItemType === 'PLG' && aclItems[i].purchasedItemUID === policyGroup.uid) {
							policyGroup.expiryDate = aclItems[i].expiryDate;
						}
					}
					// do not add the policy group to the list if it has already been added
					if (!aclPolicyGroups[policyGroup.uid]) {
						aclPolicyGroups[policyGroup.uid] = policyGroup;
						aclPolicyGroups[policyGroup.uid].frequencyType = polGroupFrequencyType[policyGroup.uid];
					}
				} else {
					log("getPolicyGroupSuccess", "result arg on callback is null or empty");
				}
			}

			/**
			 * Successfully retrieved acquired content list so update Currently Rented menu.
			 *
			 * @method getACLSuccess
			 * @param {Array} result An array of ACL items
			 * @private
			 */
			function getACLSuccess(result) {
				// store ACL items
				aclItems = result;
				// clear associative arrays
				aclAssets = {};
				aclPolicyGroups = {};
				polGroupFrequencyType = {};
				subscribedAssetsByTechnical = {};
				// reset item and subscription retrieval tally
				numberOfItemsRetrieved = 0;
				numberOfItemsToRetrieve = 0;
				numberOfSubscriptionsRetrieved = 0;
				numberOfSubscriptionsToRetrieve = 0;
				var item,
					firstExpire = null,
					aclIdx = null,
					assetFailure = function (result) {
						log("getACLSuccess", "Failed to get ACL asset " + result.uid, "error");
					},
					policyGroupFailure = function (result) {
						log("getACLSuccess", "Failed to get ACL policy group " + result.uid, "error");
					};
				for (aclIdx = 0; aclIdx < result.length; aclIdx++) {
					item = result[aclIdx];

					if (item.purchasedItemType === 'AST') {
						// fetch the asset
						numberOfItemsToRetrieve++;
						log('getACLSuccess', 'sending request for asset id: ' + item.purchasedItemUID);
						$N.services.sdp.VOD.getDetailedAssetByTechnicalId(item.purchasedItemUID, getAssetSuccess, assetFailure, false);
					} else if (item.purchasedItemType === 'PLG') {
						// get the policy group (store the frequency type to distinguish between REC and MUL)
						polGroupFrequencyType[item.purchasedItemUID] = item.frequencyType;
						// fetch the policy group
						numberOfItemsToRetrieve++;
						PolicyGroupService.getByUID(this, getPolicyGroupSuccess, policyGroupFailure, item.purchasedItemUID, LOCALE);
						// if policy group is for a subscription, then retrieve the assets and add them to the subscribedAssets list
						if (item.frequencyType === $N.services.sdp.AcquiredContent.POLICY_GROUP_SUBSCRIPTION) {
							getAssetsByPolicyGroupUid(item.purchasedItemUID, item.frequencyType, item.expiryDate);
							numberOfSubscriptionsToRetrieve++;
						}
					}
					// record earliest expiry date
					if (firstExpire === null || item.expiryDate < firstExpire) {
						firstExpire = item.expiryDate;
					}
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
			 *
			 * @method getACLFail
			 * @param {Object} result Contains details of the failure
			 * @private
			 */
			function getACLFail(result) {
				log("getACLFail", "Unable to retrieve ACL: " + result);
			}

			/**
			 * Returns the purchased scheduled technical items in an array or empty array if none are purchased
			 *
			 * @method getPurchasedScheduledAssets
			 * @param {Object} asset
			 * @return
			 */
			function getPurchasedScheduledAssets(asset) {
				var i,
					purchasedItems = [];
				for (i = 0; i < asset.scheduledTechnicalItems.length; i++) {
					if (isAssetPurchased(asset.scheduledTechnicalItems[i].technicalAsset.uid)) {
						purchasedItems.push(asset.scheduledTechnicalItems[i]);
					}
				}
				return purchasedItems;

			}

			/**
			 * Determines if an asset identified by its technical asset id was purchased
			 * @method isAssetPurchased
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Boolean} true if the asset was purchased; false otherwise
			 */
			function isAssetPurchased(technicalAssetId) {
				return aclAssets[technicalAssetId] ? true : false;
			}

			/**
			 * Determines if any of the scheduled technical items are purchased for the given asset
			 *
			 * @method isAnyScheduledAssetsPurchased
			 * @deprecated Please use `doesContainPurchasedAsset` instead
			 * @param {Object} asset
			 * @return {Boolean} true if is purchased, false if not
			 */
			function isAnyScheduledAssetsPurchased(asset) {
				var i;
				for (i = 0; i < asset.scheduledTechnicalItems.length; i++) {
					if (isAssetPurchased(asset.scheduledTechnicalItems[i].technicalAsset.uid)) {
						return true;
					}
				}
				return false;
			}

			/**
			 * Determines if an asset identified by its editorial asset id was purchased
			 * @method doesContainPurchasedAsset
			 * @param {String} editorialAssetId editorial asset id of the asset in question
			 * @return {Boolean} true if the asset was purchased; false otherwise
			 */
			function doesContainPurchasedAsset(editorialAssetId) {
				return aclAssetsByEditorialId[editorialAssetId] ? true : false;
			}

			/**
			 * Determines if a given asset has been subscribed to
			 *
			 * @method isAssetSubscribed
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Boolean} true if the asset was subscribed to; false otherwise
			 */
			function isAssetSubscribed(technicalAssetId) {
				return subscribedAssetsByTechnical[technicalAssetId] ? true : false;
			}

			/**
			 * Determines if an asset with the given editorial asset id has been subscribed to
			 * @method doesContainSubscribedAsset
			 * @param {String} editorialAssetId editorial asset id of the asset in question
			 * @return {Boolean} true if the asset was subscribed to; false otherwise
			 */
			function doesContainSubscribedAsset(editorialAssetId) {
				return subscribedAssetsByEditorial[editorialAssetId] ? true : false;
			}

			/**
			 * Determines if an asset is either purchased or subscribed
			 * @method isAssetPurchasedOrSubscribed
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Boolean} true if the asset was purchased or subscribed; false otherwise
			 */
			function isAssetPurchasedOrSubscribed(technicalAssetId) {
				if (aclAssets[technicalAssetId] || subscribedAssetsByTechnical[technicalAssetId]) {
					return true;
				}
				return false;
			}

			/**
			 * Determines if a bundle (identified by a policy group) was purchased
			 *
			 * @method isPolicyGroupPurchased
			 * @param {String} policyGroupUID UID of the policy group
			 * @return {Boolean} true if the policy group was purchased; false otherwise
			 */
			function isPolicyGroupPurchased(policyGroupUID) {
				return polGroupFrequencyType.hasOwnProperty(policyGroupUID);
			}

			/**
			 * Gets a list of all acquired technical assets
			 *
			 * @method getAssets
			 * @return {Array} a list of subscribed assets
			 */
			function getAssets() {
				var arrayOfAssets = [],
					id,
					asset;
				for (id in aclAssets) {
					if (aclAssets.hasOwnProperty(id)) {
						asset = aclAssets[id].scheduledTechnicalItems[0].technicalAsset;
						arrayOfAssets.push(asset);
					}
				}
				return arrayOfAssets;
			}

			/**
			 * Gets a list of all acquired assets, with editorial data
			 * @method getAssetsWithEditorialData
			 * @return {Array} a list of purchased assets
			 */
			function getAssetsWithEditorialData() {
				var arrayOfAssets = [],
					id;
				for (id in aclAssets) {
					if (aclAssets.hasOwnProperty(id)) {
						arrayOfAssets.push(aclAssets[id]);
					}
				}
				return arrayOfAssets;
			}

			/**
			 * Gets the acquired policy groups of a particular frequency type or all if unspecified
			 *
			 * @method getPolicyGroups
			 * @param {String} frequency Optional, the desired frequency type.
			 * @return {Array} list of policy groups
			 */
			function getPolicyGroups(frequency) {
				if (frequency) {
					var retrievedPolicyGroups = [];
					var i;
					for (i in aclPolicyGroups) {
						if (aclPolicyGroups.hasOwnProperty(i) && aclPolicyGroups[i].frequencyType === frequency) {
							retrievedPolicyGroups.push(aclPolicyGroups[i]);
						}
					}
					return retrievedPolicyGroups;
				}
				return aclPolicyGroups;
			}

			/**
			 * Gets the expiry date of the asset identified by its technical asset id
			 *
			 * @method getAssetExpiryDate
			 * @param {String} technicalAssetId technical asset id of the asset in question
			 * @return {Date | null} the expiry date of the asset, or null if technicalAssetId was invalid
			 */
			function getAssetExpiryDate(technicalAssetId) {
				return aclAssets[technicalAssetId] ? aclAssets[technicalAssetId].scheduledTechnicalItems[0].technicalAsset.expiryDate : null;
			}

			/**
			 * Returns the expiry date of the given policy group
			 *
			 * @method getPolicyGroupExpiryDate
			 * @param {String} policyGroupUID UID of the policy group
			 * @return {Date | null} the expiry date of the policy group, or null if the UID is invalid
			 */
			function getPolicyGroupExpiryDate(policyGroupUID) {
				return aclPolicyGroups[policyGroupUID] ? aclPolicyGroups[policyGroupUID].expiryDate : null;
			}

			/**
			 * Retrieve ACL items of a particular product type
			 *
			 * @method getAclItemsByProductType
			 * @param {String} productType Type of product
			 * @return {Array} An array of ACL items
			 */
			function getAclItemsByProductType(productType) {
				var retrievedAclItems = [];
				var i;
				for (i in aclItems) {
					if (aclItems.hasOwnProperty(i)) {
						if (aclItems[i].productType === productType || !productType) {
							retrievedAclItems.push(aclItems[i]);
						}
					}
				}
				return retrievedAclItems;
			}

			/**
			 * Set the call back method to be called when the ACL changes
			 *
			 * @method registerAclChangeCallBack
			 * @param {Function} callback The call back function
			 */
			function registerAclChangeCallBack(callback) {
				aclChangeListener = callback;
			}

			/**
			 * Removes the current ACL change call back function.
			 *
			 * @method removeAclChangeCallback
			 */
			function removeAclChangeCallback() {
				aclChangeListener = null;
			}

			/**
			 * Forces a refresh of the cached ACL with content retrieved from SDP.
			 *
			 * @method refresh
			 */
			function refresh() {
				log("refresh", "Refreshing ACL");
				AclService.getByAccountUID(this, getACLSuccess, getACLFail, USER_ACCOUNT_UID, "CURRENT");
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
			 *
			 * @method init
			 * @param {String} userAccountUID Users account UID
			 * @param {String} [locale='en_gb'] user's locale. Defaults to en_gb.
			 */
			function init(userAccountUID, locale) {
				log("init", "user account " + userAccountUID);
				AclService = $N.services.sdp.ServiceFactory.get('AcquiredContentListService');
				PolicyGroupService = $N.services.sdp.ServiceFactory.get('PolicyGroupService');
				USER_ACCOUNT_UID = userAccountUID;
				if (locale) {
					setLocale(locale);
				} else {
					setLocale("en_gb");
				}
				refresh();
			}

			/**
			 * Initialise class
			 *
			 * @method initialise
			 * @deprecated use init()
			 * @param {String} userAccountUID Users account UID
			 * @param {String} [locale='en_gb'] user's locale. Defaults to en_gb.
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
				isAnyScheduledAssetsPurchased: isAnyScheduledAssetsPurchased,
				getPurchasedScheduledAssets: getPurchasedScheduledAssets,
				isAssetPurchased: isAssetPurchased,
				doesContainPurchasedAsset: doesContainPurchasedAsset,
				isAssetSubscribed: isAssetSubscribed,
				isAssetPurchasedOrSubscribed: isAssetPurchasedOrSubscribed,
				doesContainSubscribedAsset: doesContainSubscribedAsset,
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
				POLICY_GROUP_IMPULSE : 'IMP',

				/**
				 * Policy group of type recurring subscription.
				 * @property {String} POLICY_GROUP_SUBSCRIPTION
				 * @readonly
				 */
				POLICY_GROUP_SUBSCRIPTION : 'REC',

				/**
				 * Policy group of type multiple bundle.
				 * @property {String} POLICY_GROUP_BUNDLE
				 * @readonly
				 */
				POLICY_GROUP_BUNDLE : 'MUL',

				/**
				 * Product of type NPVR.
				 * @property {String} PRODUCT_NPVR
				 * @readonly
				 */
				PRODUCT_NPVR : 'NPVR'
			};
		}());
		return $N.services.sdp.AcquiredContent;
	}
);