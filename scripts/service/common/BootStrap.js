/**
 * Handles the bootstrap process and manages the data that's retrieved at that time.
 * The retrieved data pertains to the user's account and STB. Applications would
 * typically call methods like `$N.platform.btv.EPG.getSubscribedChannelList`.
 * After boot strap success, the SDP `$N.apps.core.ServiceFactory` is initialised.
 *
 * @class $N.services.sdp.BootStrap
 * @static
 * @singleton
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.ServiceFactory
 * @requires $N.services.sdp.BaseService
 * @requires $N.services.sdp.MetadataService
 * @author D Thomas
 */
/*global drmAgent, define */
define('jsfw/services/sdp/BootStrap',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/ServiceFactory',
		'jsfw/services/sdp/BaseService',
		'jsfw/Config'
	],
	function (Log, ServiceFactory, BaseService, Config) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.BootStrap = (function () {
			var log = new $N.apps.core.Log("sdp", "BootStrap");

			/* local variables */
			var postBootCallback = null,
				macaddress = null,
				autoInitMDS = true;

			/**
			 * Called in case of a successful bootstrap, the retrieved data is populated to
			 * the session.
			 * @method bootstrapSuccess
			 * @private
			 * @param {Object} result retrieved initialisation data from boot strap service
			 */
			function bootstrapSuccess(result) {
				var successResult = true,
					locale,
					underScorePosition,
					serviceProviderId,
					convertedLocale = '';
				try {
					if (result.accountUID === null || result.accountUID === "") {
						throw "Invalid accountUID returned from getInit data";
					}
					if (!result.users || result.users.length === 0) {
						throw "Invalid or empty users list returned from getInit data";
					}
					if (result.publicAddressSTS === null) {
						throw "No publicAddressSTS (access point) returned from getInit data";
					}
				} catch (x) {
					log("bootstrapSuccess", "getInitData successful but with errors: " + x);
					successResult = false;
				}

				if (autoInitMDS) {
					log('bootstrapSuccess', 'initialising MetadataService with ' + $N.services.sdp.BaseService.getServerURL());

					locale = result.defaultLocale;
					underScorePosition = locale.indexOf('_');
					if (result.accountPreferences && result.accountPreferences[0]) {
						serviceProviderId = result.accountPreferences[0].serviceProviderID;
					} else {
						serviceProviderId = result.users[0].serviceProviderID;
					}
					convertedLocale = locale.substr(0, underScorePosition + 1) + locale.substr(underScorePosition + 1).toUpperCase();
					require(['jsfw/services/sdp/MetadataService'], function (MetadataService) {
						$N.services.sdp.MetadataService.init($N.services.sdp.BaseService.getServerURL(), null, '', serviceProviderId, null, convertedLocale);
						$N.services.sdp.ServiceFactory.preCache();
						if (postBootCallback) {
							postBootCallback(result, successResult);
						}
					});
				} else {
					$N.services.sdp.ServiceFactory.preCache();

					// execute call back
					if (postBootCallback) {
						postBootCallback(result, successResult);
					}
				}
			}

			/**
			 * Called in case of a bootstrap failure
			 * @method _bootstrapFailure
			 * @private
			 * @param {Object} result retrieved initialisation data from boot strap service
			 */
			function bootstrapFailure(result) {
				log("bootstrapFailure", "getInitData failed with result code: " + result);
			}

			/**
			 * Initialises the boot strap with a MAC address and callback function.
			 * This method is no longer necessary as the callback can now be specified
			 * with the `startBootStrapByMac` and `startBootStrapBySmartCard` methods.
			 * @method init
			 * @async
			 * @param {String} macAddress the STB's MAC address
			 * @param {Function} callback Call back after boot strap success
			 * @param {Boolean} [initMDS=true] Specifies whether `$N.services.sdp.MetadataService` should be initialised after
			 * boot strap completes successfully.
			 */
			function init(macAddress, callback, initMDS) {
				macaddress = macAddress;
				postBootCallback = callback;
				autoInitMDS = (initMDS !== undefined && initMDS !== null) ? initMDS : autoInitMDS;
			}

			/**
			 * Initialises the boot strap with a MAC address and callback function.
			 * This method is no longer necessary as the callback can now be specified
			 * with the `startBootStrapByMac` and `startBootStrapBySmartCard` methods.
			 * @method initialise
			 * @deprecated use init()
			 * @async
			 * @param {String} macAddress the STB's MAC address
			 * @param {Function} callback Call back after boot strap success
			 * @param {Boolean} [initMDS=true] Specifies whether `$N.services.sdp.MetadataService` should be initialised after
			 * boot strap completes successfully.
			 */
			function initialise(macAddress, callback, initMDS) {
				init(macAddress, callback, initMDS);
			}

			/**
			 * Starts the boot strap service to get the cache-able data via MAC address.
			 * @method startBootStrapByMac
			 * @async
			 * @param {String} macAddress the STB's MAC address
			 * @param {Function} callback The function to execute after boot strap completes.
			 * @param {Boolean} [initMDS=true] Specifies whether `$N.services.sdp.MetadataService` should be initialised after
			 * boot strap completes successfully.
			 */
			function startBootStrapByMac(macAddress, callback, initMDS) {
				log("startBootStrapByMac", "Using MAC:" + macAddress);
				var bootstrapService = $N.services.sdp.ServiceFactory.get("InitialisationService");
				if (callback) {
					postBootCallback = callback;
				}
				autoInitMDS = (initMDS !== undefined && initMDS !== null) ? initMDS : autoInitMDS;
				bootstrapService.getInitDataByMacAddress(this, bootstrapSuccess, bootstrapFailure, macAddress);
			}

			/**
			 * Starts the boot strap service to get the cache-able data via CASN ID.
			 * @method startBootStrapByCASN
			 * @async
			 * @param {String} casn The CASN ID
			 * @param {Function} callback The function to execute after boot strap completes.
			 * @param {Boolean} [initMDS=true] Specifies whether `$N.services.sdp.MetadataService` should be initialised after
			 * boot strap completes successfully.
			 */
			function startBootStrapByCASN(casn, callback, initMDS) {
				log("startBootStrapByCASN", "Using CASN:" + casn);
				var bootstrapService = $N.services.sdp.ServiceFactory.get("InitialisationService");
				if (callback) {
					postBootCallback = callback;
				}
				autoInitMDS = (initMDS !== undefined && initMDS !== null) ? initMDS : autoInitMDS;
				bootstrapService.getInitDataByCASN(this, bootstrapSuccess, bootstrapFailure, casn);
			}

			/**
			 * Starts the boot strap service to get the cache-able data via smart card id.
			 * @method startBootStrapBySmartCard
			 * @async
			 * @param {String} macAddress the STB's smart card id
			 * @param {Function} callback The function to execute after boot strap completes.
			 * @param {Boolean} [initMDS=true] Specifies whether `$N.services.sdp.MetadataService` should be initialised after
			 * boot strap completes successfully.
			 */
			function startBootStrapBySmartCard(smartCardId, callback, initMDS) {
				log("startBootStrapBySmartCard", "Using smart card :" + smartCardId);
				var bootstrapService = $N.services.sdp.ServiceFactory.get("InitialisationService");
				if (callback) {
					postBootCallback = callback;
				}
				autoInitMDS = (initMDS !== undefined && initMDS !== null) ? initMDS : autoInitMDS;
				bootstrapService.getInitDataBySmartCardId(this, bootstrapSuccess, bootstrapFailure, smartCardId);
			}

			/**
			 * Starts the boot strap service to get the cache-able data via Media Player ID.
			 * @method startBootStrapForNMP
			 * @async
			 * @param {Function} callback The function to execute after boot strap completes.
			 * @param {Boolean} [initMDS=true] Specifies whether `$N.services.sdp.MetadataService` should be initialised after
			 * boot strap completes successfully.
			 */
			function startBootStrapForNMP(callback, initMDS) {
				var deviceId = drmAgent.deviceId;
				autoInitMDS = (initMDS !== undefined && initMDS !== null) ? initMDS : autoInitMDS;
				if (!deviceId) {
					deviceId = $N.env ? $N.env.deviceId : null;
				}
				if (deviceId) {
					log("startBootStrapForNMP", "Using Device ID:" + deviceId);
					if (callback) {
						postBootCallback = callback;
					}
					$N.services.sdp.ServiceFactory.get("DeviceService").getMpById(this, bootstrapSuccess, bootstrapFailure, deviceId);
				} else {
					bootstrapFailure("");
				}
			}

			/**
			 * Starts the boot strap service to get the cache-able data.
			 * @method startBootStrap
			 * @deprecated Use `startBootStrapByMac` or `startBootStrapBySmartCard` instead.
			 */
			function startBootStrap() {
				log("startBootStrap", "Deprecated");
				startBootStrapByMac(macaddress);
			}

			/**
			 * Sets the call back to execute after a successful boot strap cycle.
			 * @method setPostBootCallback
			 * @param {Function} callback Call back function.
			 */
			function setPostBootCallback(callback) {
				postBootCallback = callback;
			}

			/* Public API */
			return {
				init: init,
				initialise: initialise,
				setPostBootCallback: setPostBootCallback,
				startBootStrap: startBootStrap,
				startBootStrapByMac: startBootStrapByMac,
				startBootStrapBySmartCard: startBootStrapBySmartCard,
				startBootStrapForNMP: startBootStrapForNMP,
				startBootStrapByCASN: startBootStrapByCASN
			};

		}());
		return $N.services.sdp.BootStrap;
	}
);
