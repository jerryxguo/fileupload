/**
 * Manages the list of favourite channels and VOD items created by the user.
 *
 * @class $N.services.sdp.Favourites
 * @singleton
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.Preferences
 * @requires $N.platform.system.Preferences
 */

/* global define */
define('jsfw/services/sdp/Favourites',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/Preferences',
		'jsfw/platform/system/Preferences'
	],
	function (Log, SDPPreferences, SystemPreferences) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.Favourites = (function () {
			var log = new $N.apps.core.Log('sdp', 'Favourites'),
				FAVOURITES = 'FAVOURITES',
				preferences,
				maxNumberOfFavourites,
				isLocalStorage = false,
				DEFAULT_MAX_ITEMS = 100;

			function getItemIndexInArray(item, type, array) {
				var returnIndex = -1,
					i;
				for (i = array.length - 1; i >= 0; i--) {
					if (array[i].cId === item && array[i].cT === type) {
						returnIndex = i;
						break;
					}
				}
				return returnIndex;
			}

			function doesItemExistInArray(item, type, array) {
				return getItemIndexInArray(item, type, array) > -1 ? true : false;
			}

			function removeFromArray(item, type, array) {
				var index = getItemIndexInArray(item, type, array);
				if (index > -1) {
					array.splice(index, 1);
				}
				return array;
			}

			/**
			 * Gets favourites (VOD & BTV) stored in SDP preferences
			 * @method getFavourites
			 * @param {Function} successCallback function to be called when favourites have been retrieved.
			 * @async
			 */
			function getFavourites(successCallback) {
				var failureCallback = function () {
						successCallback([]);
					},
					getSuccessCallback = function (items) {
						if (items) {
							if (items.length > 0) {
								try {
									items = JSON.parse(items);
									successCallback(items);
									log('getFavourites', 'Exit');
								} catch (e) {
									failureCallback();
									log('getFavourites', 'Exit');
								}
							} else {
								successCallback([]);
							}
						}
					},
					response;
				if (isLocalStorage) {
					response = preferences.get(FAVOURITES);
					if (response) {
						getSuccessCallback(response);
					} else {
						failureCallback();
					}
				} else {
					preferences.get(FAVOURITES, getSuccessCallback,	failureCallback);
				}
			}

			/**
			 * Adds favourite (BTV & VOD) to SDP preferences
			 * @method addToFavourites
			 * @param {String} favouriteToAdd the new favourite to be added
			 * @param {String} type the type of favourite (BTV or VOD)
			 * @param {Function} successCallback function to be called when favourite has been added.
			 * @async
			 */
			function addToFavourites(favouriteToAdd, type, successCallback) {
				log('addFavourites', 'Enter');
				var j,
					response,
					allFavourites = [],
					failureCallback = function () {
						successCallback(false);
					};

				if (favouriteToAdd) {
					getFavourites(function (storedFavourites) {
						var item = {
								cId: favouriteToAdd,
								cT: type
							};
						if (storedFavourites) {
							for (j = 0; j < storedFavourites.length; j++) {
								if (favouriteToAdd === storedFavourites[j].cId && type === storedFavourites[j].cT) {
									storedFavourites.splice(j, 1);
								}
							}
							if (storedFavourites.length < maxNumberOfFavourites) {
								if (storedFavourites.length > 0) {
									storedFavourites.unshift(item);
								} else {
									storedFavourites.push(item);
								}
							} else {
								storedFavourites.pop();
								storedFavourites.unshift(item);
							}
						} else {
							storedFavourites = [];
							storedFavourites.push(item);
						}
						if (isLocalStorage) {
							response = preferences.set(FAVOURITES, JSON.stringify(storedFavourites));
							if (response) {
								successCallback();
							} else {
								failureCallback();
							}
						} else {
							preferences.set(FAVOURITES, JSON.stringify(storedFavourites), 'String', '', successCallback, failureCallback);
						}
					},
						failureCallback);
				} else {
					successCallback(true);
					log('addFavourites', 'Exit');
				}
			}

			/**
			 * Removes favourite (BTV or VOD) from SDP preferences
			 * @method removeFromFavourites
			 * @param {String} favouriteToRemove the new favourite to be added
			 * @param {String} type the type of favourite (BTV or VOD)
			 * @param {Function} successCallback function to be called when favourite has been removed.
			 * @async
			 */
			function removeFromFavourites(favouriteToRemove, type, successCallback) {
				log('removeFavourites', 'Enter');
				var i,
					allFavourites = [],
					response,
					failureCallback = function () {
						successCallback(false);
					};
				if (favouriteToRemove) {
					getFavourites(function (storedFavourites) {
						if (favouriteToRemove) {
							allFavourites = removeFromArray(favouriteToRemove, type, storedFavourites);
							if (isLocalStorage) {
								response = preferences.set(FAVOURITES, JSON.stringify(allFavourites));
								if (response) {
									successCallback();
								} else {
									failureCallback();
								}
							} else {
								preferences.set(FAVOURITES, JSON.stringify(allFavourites), 'String', '', successCallback, failureCallback);
							}
						}
					}, failureCallback);
				} else {
					successCallback();
				}
				log('removeFavourites', 'Exit');
			}

			/**
			 * Test as to whether an item (BTV or VOD) is stored as a favourite in SDP preferences
			 * @method isItemInFavourites
			 * @param {String} item the item id to be checked
			 * @param {String} type the type of item (BTV or VOD)
			 * @param {Function} successCallback function to be called when item has been checked.
			 * A boolean value is passed in as a parameter to the callback.
			 * @async
			 */
			function isItemInFavourites(item, type, successCallback) {
				log('isItemInFavourites', 'Enter');
				getFavourites(function (items) {
					if (items && items.length && successCallback) {
						successCallback(doesItemExistInArray(item, type, items));
					} else if (successCallback) {
						successCallback(false);
					}
				}, function () {

					successCallback(false);
				});
				log('isItemInFavourites', 'Exit');
			}

			/**
			 * Deletes all favourites from SDP preferences.
			 * @method deleteAll
			 * @param {Function} successCallback function to be called when favourites have been deleted.
			 * @async
			 */
			function deleteAll(successCallback) {
				var failureCallback = function () {
						successCallback(false);
					},
					deleteSuccessCallback = function () {
						if (successCallback) {
							successCallback();
						}
					},
					response;
				if (isLocalStorage) {
					response = preferences.deletePreference(FAVOURITES);
					if (response) {
						deleteSuccessCallback();
					} else {
						failureCallback();
					}
				} else {
					preferences.deletePreference(FAVOURITES, deleteSuccessCallback, failureCallback);
				}
			}

			return {
				/**
				 * Initialises the class
				 * @method init
				 * @param {Number} maxItems the maximum number of favourites to be stored.
				 * @param {Boolean} useLocalStorage if set to true will write favourites to local storage as opposed to SDP
				 */
				init: function (maxItems, useLocalStorage) {
					isLocalStorage = useLocalStorage;
					preferences = useLocalStorage ? $N.platform.system.Preferences : $N.services.sdp.Preferences;
					maxNumberOfFavourites = maxItems || DEFAULT_MAX_ITEMS;
				},
				getFavourites: getFavourites,
				addToFavourites: addToFavourites,
				removeFromFavourites: removeFromFavourites,
				isItemInFavourites: isItemInFavourites,
				deleteAll: deleteAll,

				/**
				 * One of CONTENT_TYPE.BTV and CONTENT_TYPE.VOD
				 * @property {Number} CONTENT_TYPE
				 * @readonly
				 */
				CONTENT_TYPE: {
					BTV: 1,
					VOD: 2
				}
			};
		}());
		return $N.services.sdp.Favourites;
	}
);