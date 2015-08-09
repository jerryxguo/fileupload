/**
 * This class interacts with a specified MDS server to allow the retrieval of promotions data.
 * The data is cached locally and is accessible through a number of convenience methods.
 *
 * @class $N.services.sdp.Promotions
 * @static
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.MetadataService
 */

/* global window, $N, define */
define('jsfw/services/sdp/Promotions',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/MetadataService'
	],
	function (Log, MetadataService) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.Promotions = (function () {
			var promotions = {},
				promotionsArray = [],
				promotionsLookup = {},
				refreshEventListeners = [],
				log = new $N.apps.core.Log("sdp", "Promotions"),
				DiscountTypes = {
					PERCENTAGE : "percentage",
					FINAL_PRICE : "finalPrice"
				},
				Config = {
					DEFAULT_INTERVAL : 2
				};

			function isCurrentPromotion(promotion) {
				var result = false,
					currentTime = Date.now() / 1000;

				if (promotion && promotion.startAvailability && promotion.endAvailability) {
					if (currentTime >= promotion.startAvailability && currentTime <= promotion.endAvailability) {
						result = true;
					}
				}
				return result;
			}

			function filterCurrentPromotions(promos) {
				var filteredPromotions = [],
					i,
					len;

				if (promos) {
					for (i = 0, len = promos.length; i < len; i++) {
						if (isCurrentPromotion(promos[i])) {
							filteredPromotions.push(promos[i]);
						}
					}
				}
				return filteredPromotions;
			}

			function processResponse(result) {
				var i,
					len,
					promos;

				promotionsLookup = {};
				if (result.promotions) {
					promos = result.promotions;
					for (i = 0, len = promos.length; i < len; i++) {
						promotionsLookup[promos[i].id] = promos[i];
					}
				}
				for (i = 0; i < refreshEventListeners.length; i++) {
					refreshEventListeners[i]();
				}
			}

			function calculatePrice(product, promotion) {
				var discountType = promotion.discountType,
					discountValue = promotion.discountValue,
					price = product.price,
					result;

				if (discountType && discountValue && price) {
					switch (discountType) {
					case DiscountTypes.PERCENTAGE:
						result = Math.round((price.value - (price.value / 100) * discountValue) * 100) / 100;
						break;
					case DiscountTypes.FINAL_PRICE:
						result = discountValue;
						break;
					default:
						result = price.value;
					}
				}
				return result;
			}

			/**
			 * Performs a promotion refresh.
			 * @async
			 * @method fetchPromotions
			 * @param {Function} successCallback
			 * @param {Function} failureCallback
			 */
			function fetchPromotions(successCallback, failureCallback) {
				log("fetchPromotions", "Enter");
				var mdsSuccessCallback = function (result) {
					if (result.promotions && result.total_records) {
						promotions.promotions = filterCurrentPromotions(result.promotions);
						promotions.total_records = result.total_records;
					} else {
						promotions = result;
					}
					processResponse(promotions);
					successCallback(promotions);
				};
				MetadataService.getOfferData(this, mdsSuccessCallback, failureCallback, MetadataService.RequestType.Promotions);
			}

			/**
			 * Performs a promotion refresh.
			 * @method refreshPromotions
			 */
			function refreshPromotions() {
				log("refreshPromotions", "Enter");
				fetchPromotions(function () {}, function () {});
			}

			/**
			 * Returns a promotion object containing an array of currently valid promotions and total promotions count.
			 * @method getPromotions
			 * @return {Object} Promotion object containing an array of current promotions and a record count. Record count refers to the number of
			 * items retrieved the last time data was synchronised with the server and may not reflect the length of the actual promotions array returned.
			 *
			 */
			function getPromotions() {
				log("getPromotions", "Enter");
				var filteredPromoObject = {};
				if (promotions.promotions && promotions.total_records) {
					filteredPromoObject.total_records = promotions.total_records;
					filteredPromoObject.promotions = filterCurrentPromotions(promotions.promotions);
				}
				return filteredPromoObject;
			}

			/**
			 * Returns promotion object for a supplied promotion id.
			 * @method getPromotionById
			 * @param {String} promotion id
			 * @return {Object} promotion object.
			 */
			function getPromotionById(promotionId) {
				log("getPromotionById", "Enter");
				return promotionsLookup[promotionId] || null;
			}

			/**
			 * Gets current valid promotions for a supplied product
			 * @method getPromotionsForProduct
			 * @param {Object} a product containing an array of promotion ids
			 * @return {Object} an array of promotion objects.
			 */
			function getPromotionsForProduct(product) {
				log("getPromotionsForProduct", "Enter");
				var i,
					len,
					prodPromos,
					matchedPromo,
					result = [];

				if (product.promotions) {
					prodPromos = product.promotions;
					for (i = 0, len = prodPromos.length; i < len; i++) {
						matchedPromo = promotionsLookup[prodPromos[i]];
						if (matchedPromo && isCurrentPromotion(matchedPromo)) {
							result.push(matchedPromo);
						}
					}
				}
				return result;
			}

			/**
			 * Gets all current valid promotions for a supplied asset (editorial).
			 * @method getPromotionsForAsset
			 * @param {Object} a full asset object containing products and promotion id's.
			 * @return {Object} a lookup table keyed by product id with a value of an array of promotions.
			 * Duplicate products will not be returned. Non existent promotions will not be returned.
			 */
			function getPromotionsForAsset(asset) {
				log("getPromotionsForAsset", "Enter");
				var i,
					j,
					technicalsLen,
					productsLen,
					technicalProducts,
					productPromotions,
					resultLookup = {};

				if (asset.technicals) {
					for (i = 0, technicalsLen = asset.technicals.length; i < technicalsLen; i++) {
						technicalProducts = asset.technicals[i].products;
						if (technicalProducts) {
							for (j = 0, productsLen = technicalProducts.length; j < productsLen; j++) {
								productPromotions = filterCurrentPromotions(getPromotionsForProduct(technicalProducts[j]));
								if (productPromotions.length > 0) {
									resultLookup[technicalProducts[j].id] = productPromotions;
								}
							}
						}
					}
				}
				return resultLookup;
			}

			/**
			 * Identifies whether or not one or more current valid promotions are associated with the supplied asset
			 * @method isPromotionAvailableForAsset
			 * @param {Object} asset
			 * @return {Boolean} true/false value depending on whether or not any promotion ids are associated with the asset.
			 */
			function isPromotionAvailableForAsset(asset) {
				log("isPromotionAvailableForAsset", "Enter");
				var assetPromotions = getPromotionsForAsset(asset);
				return (Object.keys(assetPromotions).length > 0) ? true : false;
			}

			/**
			 * Initialises the Promotions class, populates the Promotions cache if use cache is set and sets a Timer
			 * for the cache refresh.
			 * @method init
			 * @param {Object} configuration
			 */
			function init(configuration) {
				log("init", "initialising Promotions");
				var refreshInterval;
				MetadataService = $N.services.sdp.MetadataService;
				promotions = [];
				promotionsLookup = {};
				if (!configuration) {
					configuration = {
						autoUpdateCache: true,
						refreshInterval: 12
					};
				}
				if (configuration.autoUpdateCache) {
					refreshInterval = configuration.refreshInterval || Config.DEFAULT_INTERVAL;
					refreshPromotions();
					setTimeout(function () {
						refreshPromotions();
					}, refreshInterval * 60 * 1000);
				} else {
					refreshPromotions();
				}
			}

			/**
			 * Initialises the Promotions class, populates the Promotions cache if use cache is set and sets a Timer
			 * for the cache refresh.
			 * @method initialise
			 * @deprecated use init method
			 * @param {Object} configuration
			 */
			function initialise(configuration) {
				init(configuration);
			}

			/**
			 * Registers a listener for the refresh promotions event
			 * @method addRefreshEventListener
			 * @param {Object} listener
			 */
			function addRefreshEventListener(listener) {
				log("addRefreshEventListener", "enter");
				refreshEventListeners.push(listener);
			}

			/**
			 * Unregisters a listener for the refresh promotions event
			 * @method removeEventListener
			 * @param {Object} listener
			 */
			function removeRefreshEventListener(listener) {
				log("removeRefreshEventListener", "enter");
				var i;
				for (i = 0; i < refreshEventListeners.length; i++) {
					if (refreshEventListeners[i] === listener) {
						refreshEventListeners.splice(i, 1);
					}
				}
			}

			/**
			 * Gets the best price for a product based on its associated current valid promotions
			 * @method getBestPriceForProduct
			 * @param {Object} product
			 * @return {Object} an object containing the best price and the ID of the promotion used to calculate that price.
			 */
			function getBestPriceForProduct(product) {
				log("getBestPriceForProduct", "enter");
				var i,
					len,
					currentPromotion,
					promotionPrice,
					result = {};

				if (product.promotions) {
					for (i = 0, len = product.promotions.length; i < len; i++) {
						currentPromotion = getPromotionById(product.promotions[i]);
						if (currentPromotion && isCurrentPromotion(currentPromotion)) {
							promotionPrice = calculatePrice(product, currentPromotion);
							if (promotionPrice && (!result.bestPrice || promotionPrice < result.bestPrice)) {
								result.bestPrice = promotionPrice;
								result.promotionId = currentPromotion.id;
							}
						}
					}
				}
				if (!result.bestPrice) {
					result.bestPrice = (product.price && product.price.value) ? product.price.value : null;
					result.promotionId = null;
				}
				return result;
			}

			/**
			 * Gets all prices for a product based on its associated current valid promotions
			 * @method getAllPricesForProduct
			 * @param {Object} product
			 * @return {Object} a lookup table keyed by promotion id with a value of price, calculated by applying the promotion on the supplied product.
			 */
			function getAllPricesForProduct(product) {
				log("getAllPricesForProduct", "enter");
				var i,
					len,
					currentPromotion,
					result = {};

				if (product.promotions) {
					for (i = 0, len = product.promotions.length; i < len; i++) {
						currentPromotion = getPromotionById(product.promotions[i]);
						if (currentPromotion && isCurrentPromotion(currentPromotion)) {
							result[product.promotions[i]] = calculatePrice(product, currentPromotion);
						}
					}
				}
				return result;
			}

			/*
			 * Public API
			 */
			return {
				init: init,
				initialise: initialise,
				isPromotionAvailableForAsset: isPromotionAvailableForAsset,
				fetchPromotions: fetchPromotions,
				getPromotions: getPromotions,
				refreshPromotions: refreshPromotions,
				getPromotionById: getPromotionById,
				getPromotionsForProduct: getPromotionsForProduct,
				addRefreshEventListener: addRefreshEventListener,
				removeRefreshEventListener: removeRefreshEventListener,
				getPromotionsForAsset: getPromotionsForAsset,
				getBestPriceForProduct: getBestPriceForProduct,
				getAllPricesForProduct: getAllPricesForProduct,

				/**
				 * Defines enumeration values for discount types associated with the promotion
				 * Either PERCENTAGE or FINAL_PRICE:
				 * @property {String} DISCOUNT_TYPES
				 */
				DISCOUNT_TYPES: DiscountTypes
			};
		}());

		return $N.services.sdp.Promotions;
	});
