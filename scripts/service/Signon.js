/**
 * Abstraction class to simplify the SDP sign on process. There are currently
 * 3 different ways we can sign on by:
 *
 * - SmartCard
 * - CASN
 * - MAC Address
 *
 * By default, repeated attempts are made to sign on at intervals of 1 minute, 2 minutes,
 * 4 minutes, etc. (basically, powers of 2) up to a maximum of 8 attempts. This default
 * interval can be overridden by passing appropriate parameters into the `$N.services.sdp.Signon.init()` method,
 * which must be called prior to any other method in this class. Upon sign on success,
 * any registered listeners will be executed.
 * @class $N.services.sdp.Signon
 * @static
 * @singleton
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.ServiceFactory
 */
/*global window, $N, drmAgent, userAgent, define*/
define('jsfw/services/sdp/Signon',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/ServiceFactory',
		'jsfw/Config'
	],
	function (Log, ServiceFactory, Config) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.Signon = (function () {
			var log = new $N.apps.core.Log("sdp", "Signon"),
				authToken = null,
				signonService,
				HDMS,
				state = null,
				listeners = [],
				signonFailedCallback = function () {},
				retryInterval = 60000,
				retryTimeout = null,
				signonParameters = [],
				homeDomainSignonDetails = {},
				retryCount = 0,
				retryMax = 8,
				retryBackOff = 2,
				deviceInitialisedResponse = null,
				signonForNMP = false,
				signonProperties = {},
				platform,
				isHomeDomainSignon = false,
				upgradeRecommended = false,
				upgradeData = {};

			// Private helper methods

			/**
			 * Calls the registered listeners
			 * @method applyListeners
			 * @private
			 */
			function applyListeners() {
				log("applyListeners", "Enter");
				var i,
					param = [];
				if (signonForNMP && upgradeRecommended) {
					param.push({upgradeRecommended: true, upgradeData : upgradeData});
				}
				for (i = listeners.length - 1; i >= 0; i--) {
					log("applyListeners", "Applying listener...");
					listeners[i].listener.apply(listeners[i].listeningObject, param);
				}
				upgradeRecommended = false;
				upgradeData = {};
				log("applyListeners", "Exit");
			}

			/**
			 * Called after a successful signon, updates the internal state
			 * to STATE_SIGNED_ON and executes the registered listeners.
			 * @method signonSuccess
			 * @private
			 * @param {Object} result The result object returned by the signon service
			 * @param {String} token The token generated from the signon
			 */
			function signonSuccess(result, token) {
				log("signonSuccess", "Signed In.");
				if (token) {
					authToken = token;
				} else {
					log("signonSuccess", "No token returned!");
				}
				state = $N.services.sdp.Signon.STATE_SIGNED_ON;
				applyListeners();
				signonForNMP = false;
				log("signonSuccess", "Exit");
			}

			/**
			 * Sets up a retry timeout to re-attempt signon, upon every call to this
			 * method the retry timeout period increases up to a  maximum of the retryMax.
			 * @method setFailedSignonToPending
			 * @private
			 * @param {Function} signonMethod the signon function to use
			 * @param {String} parameter the value of MAC address, smartcardId or CASN
			 */
			function setFailedSignonToPending(signonMethod, parameters) {

				var actualRetryInterval = retryInterval * Math.pow(retryBackOff, retryCount);
				retryCount++;
				if (retryCount <= retryMax) {
					log("setFailedSignonToPending", "Will retry signon in: " + String((actualRetryInterval / 1000) / 60) + " minute(s).", "warn");
					retryTimeout = setTimeout(function () { state = $N.services.sdp.Signon.STATE_NOT_SIGNED; signonMethod(parameters[0], parameters[1], parameters[2]); }, actualRetryInterval);
				} else {
					$N.services.sdp.Signon.cancelOutstandingSignon();
					state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
					log("setFailedSignonToPending", "All signon retry attempts used up, failed to signon", "warn");
				}
			}

			/**
			 * Called in case of a signon failure, if set notifies the calling function
			 * by executing the signonFailedCallback
			 * @method signonFailureMAC
			 * @private
			 * @param {Object} result The result returned by signing on with the signon service
			 */
			function signonFailureMAC(result) {
				log("signonFailureMAC", "Sign in failed: " + result, "warn");
				authToken = null;
				if (signonFailedCallback) {
					signonFailedCallback(result);
				}
				setFailedSignonToPending($N.services.sdp.Signon.signonByMACAddress, signonParameters);
				log("signonFailureMAC", "Exit");
			}

			/**
			 * Called in case of a signon failure, if set notifies the calling function
			 * by executing the signonFailedCallback
			 * @method signonFailureSCID
			 * @private
			 * @param {Object} result The result returned by the signon service
			 */
			function signonFailureSCID(result) {
				log("signonFailureSCID", "Signed In Failed: " + result, "warn");
				authToken = null;
				if (signonFailedCallback) {
					signonFailedCallback(result);
				}
				setFailedSignonToPending($N.services.sdp.Signon.signonBySmartcardID, signonParameters);
				log("signonFailureSCID", "Exit");
			}

			/**
			 * Called in case of a signon failure, if set notifies the calling function
			 * by executing the signonFailedCallback
			 * @method signonFailureCASN
			 * @private
			 * @param {Object} result The result returned by the signon service
			 */
			function signonFailureCASN(result) {
				log("signonFailureCASN", "Signed In Failed: " + result, "warn");
				authToken = null;
				if (signonFailedCallback) {
					signonFailedCallback(result);
				}
				setFailedSignonToPending($N.services.sdp.Signon.signonByCASN, signonParameters);
				log("signonFailureCASN", "Exit");
			}

			/**
			 * Called in case of a signon failure, if set notifies the calling function
			 * by executing the signonFailedCallback
			 * @method signonFailureUserID
			 * @private
			 * @param {Object} result The result returned by the signon service
			 */
			function signonFailureUserID(result) {
				log("signonFailureUserID", "Signed In Failed: " + result, "warn");
				authToken = null;
				if (signonFailedCallback) {
					signonFailedCallback(result);
				}
				// if the reason for failure is invalid UID / Password combo then don't retry
				if (result.indexOf("code=23017") === -1) {
					setFailedSignonToPending($N.services.sdp.Signon.signonByUser, signonParameters);
				} else {
					state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
				}
				log("signonFailureUserID", "Exit");
			}

			/**
			 * Called in case of a signon failure, if set notifies the calling function
			 * by executing the signonFailedCallback
			 * @method signonFailureUserDeviceID
			 * @private
			 * @param {Object} result The result returned by the signon service
			 */
			function signonFailureUserDeviceID(result) {
				log("signonFailureUserDeviceID", "Signed In Failed: " + result, "warn");
				authToken = null;
				if (signonFailedCallback) {
					signonFailedCallback(result);
				}
				// if the reason for failure is invalid UID / Password combo then don't retry
				if (result.indexOf("code=23017") === -1) {
					setFailedSignonToPending($N.services.sdp.Signon.signonByUserAndDevice, signonParameters);
				} else {
					state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
				}
				log("signonFailureUserDeviceID", "Exit");
			}

			/**
			 * Called in the case of signon or initialization failing after the app calls signonAndInitialiseForNMP.
			 * Sends the failure callback an object consisting of error type and response from sdp
			 * @method signonOrInitializationForNMPFailure
			 * @private
			 * @param {Number} failType
			 * @param {Object} result
			 */
			function signonOrInitializationForNMPFailure(failType, result) {
				log("signonOrInitializationForNMPFailure", "Signed In Failed: " + result, "warn");
				switch (failType) {
				case $N.services.sdp.Signon.ERROR.SIGNON_BY_USER:
				case $N.services.sdp.Signon.ERROR.SIGNON_BY_USER_DEVICE_ID:
				case $N.services.sdp.Signon.ERROR.MAXIMUM_DEVICES_REACHED:
				case $N.services.sdp.Signon.ERROR.DEVICE_LIMIT_REACHED:
				case $N.services.sdp.Signon.ERROR.DEVICE_CLASS_LIMIT_REACHED:
				case $N.services.sdp.Signon.ERROR.DEVICE_ACTIVATION_LIMIT_REACHED:
					// if the reason for failure is invalid UID / Password combo then don't retry
					if (typeof result === "String" && result.indexOf("code=23017") === -1) {
						setFailedSignonToPending($N.services.sdp.Signon.signonByUserAndDevice, signonParameters);
					} else {
						state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
					}
					authToken = null;
					break;
				}
				if (signonFailedCallback) {
					signonFailedCallback({
						response: result,
						failure: failType
					});
				}
				log("signonOrInitializationForNMPFailure", "Exit");
			}

			function signonFailureHomeDomain(result) {
				log('signonFailureHomeDomain', 'Sign-on failed: ' + result, 'warn');
				authToken = null;
				if (signonFailedCallback) {
					signonFailedCallback(result);
				}
				// if the reason for failure is invalid username / password / deviceId combo then don't retry
				/*if (result.indexOf("code=23017") === -1) {
					setFailedSignonToPending($N.services.sdp.Signon.signonByUserAndDevice, signonParameters);
				} else {
					state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
				}*/
				log('signonFailureHomeDomain', 'Exit');
			}

			/**
			 * Sets the device id on the signonProperties object and $N.env.deviceId
			 * @method setDeviceId
			 * @private
			 * @param {Number} deviceId
			 */
			function setDeviceId(deviceId) {
				signonProperties.deviceId = deviceId;
				$N.env.deviceId = deviceId;
			}

			/**
			 * Checks if the status of the initializeDevice call is ok. otherwise player may need upgrading.
			 * If unsuccessful the failure callback is fired
			 * @method isInitializationSuccessful
			 * @private
			 * @param {Object} data
			 */
			function isInitializationSuccessful(data) {
				upgradeRecommended = false;
				upgradeData = {};
				switch (data.status) {
				case "OK":
					return true;
				case "PLAYER_UPGRADE_RECOMMENDED":
					upgradeRecommended = true;
					upgradeData = data;
					return true;
				case "MAXIMUM_DEVICE_PER_ACCOUNT_REACHED":
					signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.MAXIMUM_DEVICES_REACHED, data);
					break;
				case "PLAYER_UPGRADE_REQUIRED":
					signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.PLAYER_UPGRADE_REQUIRED, data);
					break;
				case "DEVICE_LIMIT_REACHED":
					signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.DEVICE_LIMIT_REACHED, data);
					break;
				case "DEVICE_CLASS_LIMIT_REACHED":
					signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.DEVICE_CLASS_LIMIT_REACHED, data);
					break;
				case "DEVICE_ACTIVATION_LIMIT_REACHED":
					signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.DEVICE_ACTIVATION_LIMIT_REACHED, data);
					break;
				default:
					signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.INITIALIZE_DEVICE, data);
				}
				return false;
			}

			/**
			 * Initialises the drm agent and calls sign on success so the registered listeners can be fired
			 * @method initialiseDRMAgent
			 * @private
			 * @param {Object} result
			 * @param {String} token
			 */
			function initialiseDRMAgent(result, token) {
				log("initialiseDRMAgent", "Enter");
				drmAgent.initialize(deviceInitialisedResponse.response);
				if (signonProperties && signonProperties.deviceName) {
					$N.services.sdp.Signon.setDeviceNameForNMPId(signonProperties.deviceId, signonProperties.deviceName, function () {
						signonSuccess(result, token);
					}, function (result) {
						signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SET_DEVICE_NAME, result);
					});
				} else {
					signonSuccess(result, token);
				}
				log("initialiseDRMAgent", "Exit");
			}

			/**
			 * Callback after successful signon by device id
			 * Either makes call to initialise player with SDP or if
			 * this call has already been made, initialises drm agent
			 * @method signedOnByDeviceCallback
			 * @private
			 * @param {Object} result
			 * @param {String} token
			 */
			function signedOnByDeviceCallback(result, token) {
				log("signedOnByDeviceCallback", "Enter");
				var intialiseDeviceCallback = function (data) {
					if (isInitializationSuccessful(data)) {
						deviceInitialisedResponse = data;
						initialiseDRMAgent(result, token);
					}
				};
				if (token) {
					authToken = token;
				}
				if (!deviceInitialisedResponse) {
					$N.services.sdp.ServiceFactory.get("NmpExtendedService").initializeDevice(this, intialiseDeviceCallback,
						function (result) {
							signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.INITIALIZE_DEVICE, result);
						}, signonProperties.playerVersion, signonProperties.playerType, signonProperties.initializationPayload);
				} else {
					initialiseDRMAgent(result, token);
				}
				log("signedOnByDeviceCallback", "Exit");
			}

			/**
			 * Callback for request to drm agent for global attributes
			 * @method GetAttributesCallback
			 * @private
			 */
			function GetAttributesCallback() {
				this.attributes = function (attributes) {
					signonProperties.initializationPayload = attributes.initializationPayloadForServer;
					setDeviceId(attributes.deviceId);
					doSDPOrHomeDomainSignon();
				};
			}

			/**
			 * Makes a request to the DRM agent to retrieve the global attributes (deviceid, state and payload)
			 * @method getGlobalAttributes
			 * @private
			 */
			function getGlobalAttributes() {
				$N.services.sdp.Signon._getAttributesCallbackInstance = new GetAttributesCallback();
				drmAgent.getGlobalAttributes("$N.services.sdp.Signon._getAttributesCallbackInstance");
			}

			/**
			 * Callback after successful sign on by user
			 * Makes call to initialise device
			 * @method signedOnByUserCallback
			 * @private
			 * @param {Object} result
			 * @param {String} token
			 */
			function signedOnByUserCallback(result, token) {
				log("signedOnByUserCallback", "Enter");
				var drmAgentInitialised = false; //workaround due to NMP firing callback twice
				var intialiseDeviceCallback = function (data) {
					var initialisedCallback;
					if (isInitializationSuccessful(data)) {
						deviceInitialisedResponse = data;
						if (signonProperties.deviceId === "") {
							if (platform === "IOS" || platform === "ANDROID") {
								$N.services.sdp.Signon._drmInitializedCallback = {
									initialized: function (sessions) {
										if (!drmAgentInitialised) {
											drmAgent.unregisterEventListener("$N.services.sdp.Signon._drmInitializedCallback");
											getGlobalAttributes();
											drmAgentInitialised = true;
										}
									}
								};
								drmAgent.registerEventListener("$N.services.sdp.Signon._drmInitializedCallback");
								drmAgent.initialize(deviceInitialisedResponse.response);
							} else if (platform === "PC") {
								drmAgent.initialized.connect(function () {
									if (!drmAgentInitialised) {
										setDeviceId(drmAgent.deviceId);
										doSDPOrHomeDomainSignon();
										drmAgentInitialised = true;
									}
								});
								drmAgent.initialize(deviceInitialisedResponse.response);
							} else if (platform === "NMP_PLUGIN") {
								initialisedCallback = function () {
									if (!drmAgentInitialised) {
										setDeviceId(drmAgent.deviceId);
										drmAgent.removeEventListener("initialized", initialisedCallback);
										doSDPOrHomeDomainSignon();
										drmAgentInitialised = true;
									}
								};
								if (navigator.userAgent.indexOf("MSIE") === -1 && navigator.userAgent.indexOf("Trident") === -1) {
									drmAgent.addEventListener("initialized", initialisedCallback, false);
								} else {
									drmAgent.attachEvent("oninitialized", initialisedCallback);
								}
								drmAgent.initialize(deviceInitialisedResponse.response);
							}
						} else {
							doSDPOrHomeDomainSignon();
						}
					}
				};
				if (token) {
					authToken = token;
				}
				$N.services.sdp.ServiceFactory.get("NmpExtendedService").initializeDevice(this, intialiseDeviceCallback,
					function (result) {
						signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.INITIALIZE_DEVICE, result);
					}, signonProperties.playerVersion, signonProperties.playerType, signonProperties.initializationPayload);
				log("signedOnByUserCallback", "Exit");
			}

			/**
			 * Callback for request to user agent for global attributes
			 * @method GetUserAgentCallback
			 * @private
			 */
			function GetUserAgentCallback() {
				this.attributes = function (attributes) {
					if (typeof attributes === "string") {
						attributes = eval(attributes);
						attributes = attributes[0];
					}
					signonProperties.playerType = attributes.platform;
					signonProperties.playerVersion = attributes.version;
				};
			}
			/**
			 * Makes a request to the user agent to retrieve the global attributes (platform and version)
			 * @method setPlatformVersion
			 * @private
			 */
			function setPlatformVersion() {
				var videoTag,
					objectElements = document.getElementsByTagName("object"),
					i;

				for (i = 0; i < objectElements.length; i++) {
					if (objectElements[i].drmAgent) {
						videoTag = objectElements[i];
						platform = "NMP_PLUGIN";
						signonProperties.playerType = videoTag.userAgent.platform;
						signonProperties.playerVersion = $N.Config.PLUGIN_VER_PREFIX + videoTag.userAgent.version;
					}
				}
				if (!platform) {
					if (navigator.userAgent.indexOf('Windows') !== -1 && window.userAgent) {
						platform = "PC";
						signonProperties.playerVersion = window.userAgent.version;
						signonProperties.playerType = window.userAgent.platform;
					} else if (navigator.userAgent.indexOf('Android') !== -1 && window.userAgent) {
						platform = "ANDROID";
						$N.services.sdp.Signon._userAgentAttributesCallbackInstance = new GetUserAgentCallback();
						userAgent.getGlobalAttributes("$N.services.sdp.Signon._userAgentAttributesCallbackInstance");
					} else if ((navigator.userAgent.indexOf('iPad') !== -1 || navigator.userAgent.indexOf('iPhone') !== -1) && window.userAgent) {
						platform = "IOS";
						$N.services.sdp.Signon._userAgentAttributesCallbackInstance = new GetUserAgentCallback();
						userAgent.getGlobalAttributes("$N.services.sdp.Signon._userAgentAttributesCallbackInstance");
					}
				}


			}

			/**
			 * Performs signon to SDP or Home Domain. Which kind of signon is performed depends
			 * on the properties set on the signonProperties object
			 * @method doSDPOrHomeDomainSignon
			 * @private
			 */
			function doSDPOrHomeDomainSignon() {
				var signonDetails = {};
				if (isHomeDomainSignon) {
					signonDetails.username = signonProperties.username;
					signonDetails.password = signonProperties.password;
					signonDetails.smartcardId = signonProperties.smartcardId;
					if ($N.env.deviceId) {
						signonDetails.deviceId = $N.env.deviceId;
						signonDetails.provisioned = true;
						HDMS.signon(this, signonSuccess, signonFailureHomeDomain, signonDetails);
					} else {
						signonDetails.provisioned = false;
						HDMS.signon(this, signedOnByUserCallback, signonFailureHomeDomain, signonDetails);
					}
				} else {
					if (signonProperties.deviceId !== "" && signonProperties.username) {
						$N.services.sdp.Signon.signonByUserAndDevice(signonProperties.username, signonProperties.password, signonProperties.deviceId);
					} else if (signonProperties.deviceId === "" && signonProperties.username) {
						$N.services.sdp.Signon.signonByUser(signonProperties.username, signonProperties.password);
					} else if (signonProperties.deviceId !== "") {
						$N.services.sdp.Signon.signonByDevice(signonProperties.deviceId);
					} else {
						signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.INVALID_DEVICE_ID, "");
					}
				}
			}

			/**
			 * Retrieves the intialization payload and device id from drm agent and sets them on
			 * the signonProperties object
			 * @method getDrmAgentProperties
			 * @private
			 */
			function getDrmAgentProperties() {
				if (platform === "IOS" || platform === "ANDROID") {
					getGlobalAttributes();
				} else if (platform === "PC") {
					signonProperties.initializationPayload = drmAgent.initializationPayloadForServer;
					setDeviceId(drmAgent.deviceId);
					doSDPOrHomeDomainSignon();
				} else {
					signonProperties.initializationPayload = drmAgent.initializationPayloadForServer;
					setDeviceId(drmAgent.deviceId);
					doSDPOrHomeDomainSignon();
				}
			}

			/**
			* Checks whether there is a server connection error and returns a boolean
			* @method isConnectionError
			* @private
			* @param {String} result The result from the SDP call
			* @return {Boolean} true if there is a server connection error
			*/
			function isConnectionError(result) {
				if (result === "[-1]") {
					return true;
				}
				return false;
			}

			// public API

			return {
				/**
				 * State denotes signon is in progress
				 * @property {Number} STATE_SIGNING_ON
				 * @readonly
				 */
				STATE_SIGNING_ON: 0,
				/**
				 * State denotes signon is complete
				 * @property {Number} STATE_SIGNED_ON
				 * @readonly
				 */
				STATE_SIGNED_ON: 1,
				/**
				 * State denotes signon has not happened
				 * @property {Number} STATE_NOT_SIGNED
				 * @readonly
				 */
				STATE_NOT_SIGNED: 2,

				/**
				 * Defines constants for error types,
				 * one of SIGNON_BY_USER, INITIALIZE_DEVICE,
				 * PERSONALIZE_DEVICE, SIGNON_BY_USER_DEVICE_ID,
				 * SIGNON_BY_DEVICE_ID, INVALID_DEVICE_ID, MAXIMUM_DEVICES_REACHED
				 * @property {Number} ERROR
				 */
				ERROR: {
					SERVER_CONNECTION: -1,
					SIGNON_BY_USER: 1,
					INITIALIZE_DEVICE: 2,
					PERSONALIZE_DEVICE: 3,
					SIGNON_BY_USER_DEVICE_ID: 4,
					SIGNON_BY_DEVICE_ID: 5,
					INVALID_DEVICE_ID: 6,
					MAXIMUM_DEVICES_REACHED: 7,
					SET_DEVICE_NAME: 8,
					PLAYER_UPGRADE_REQUIRED: 9,
					DEVICE_LIMIT_REACHED: 10,
					DEVICE_CLASS_LIMIT_REACHED: 11,
					DEVICE_ACTIVATION_LIMIT_REACHED: 12
				},

				/**
				 * Initialises the class for use, allows optional parameters to be passed
				 * in which affect the way unsuccessful sign ons will be retried.
				 * @method init
				 * @param {Number} [initialInterval=60000] Milliseconds between trying to re-signon
				 * @param {Number} [maximumRetries=8] maximum number of re-attempts to signon
				 * @param {Number} [backoffValue=2] Base value used to increase retry gap.
				 */
				init: function (initialInterval, maximumRetries, backoffValue) {
					signonService = $N.services.sdp.ServiceFactory.get("SignonService");
					HDMS = $N.services.sdp.ServiceFactory.get("HomeDomainManagerService");
					state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
					retryInterval = initialInterval || retryInterval;
					retryMax = (maximumRetries !== undefined) ? maximumRetries : retryMax;
					retryBackOff = backoffValue || retryBackOff;
					setPlatformVersion();
				},

				/**
				 * Sets the callback to be executed if signon fails, this allows the class
				 * calling the signon method to be notified of the failure.
				 * @method setSignonFailedCallback
				 * @param {Function} callback
				 */
				setSignonFailedCallback: function (callback) {
					signonFailedCallback = callback;
				},

				/**
				 * Calls the signon service with the given MAC address
				 * @method signonByMACAddress
				 * @param {String} macAddress
				 */
				signonByMACAddress: function (macAddress) {
					log("signonByMACAddress", "Enter");
					if (macAddress) {
						if (state !== $N.services.sdp.Signon.STATE_SIGNING_ON) {
							log("signonByMACAddress", "Mac Address: " + macAddress);
							signonParameters = [];
							signonParameters[0] = macAddress;
							state = $N.services.sdp.Signon.STATE_SIGNING_ON;
							signonService.signonByMACAddress(this, signonSuccess, signonFailureMAC, macAddress);
						} else {
							log("signonByMACAddress", "signon request ignored - already attempting signon.");
						}
					} else {
						log("signonByMACAddress", "No MAC Address.", "error");
					}
					log("signonByMACAddress", "Exit");
				},

				/**
				 * Calls the signon service with the given smart card ID
				 * @method signonBySmartcardID
				 * @param {String} scid Smart Card ID.
				 */
				signonBySmartcardID: function (scid) {
					log("signonBySmartcardID", "Enter");
					if (scid) {
						scid = scid.replace(/\s*/g, "");
						if (state !== $N.services.sdp.Signon.STATE_SIGNING_ON) {
							log("signonBySmartcardID", "Smartcard ID: " + scid);
							signonParameters = [];
							signonParameters[0] = scid;
							state = $N.services.sdp.Signon.STATE_SIGNING_ON;
							signonService.signonBySmartcardID(this, signonSuccess, signonFailureSCID, scid);
						} else {
							log("signonBySmartcardID", "signon request ignored - already attempting signon.");
						}
					} else {
						log("signonBySmartcardID", "No SCID!", "error");
					}
					log("signonBySmartcardID", "Exit");
				},

				/**
				 * Calls the signon service with the given CASN
				 * @method signonByCASN
				 * @param {String} casn The CA Serial Number
				 */
				signonByCASN: function (casn) {
					log("signonByCASN", "Enter");
					if (casn) {
						casn = casn.replace(/\s*/g, "");
						if (state !== $N.services.sdp.Signon.STATE_SIGNING_ON) {
							log("signonByCASN", "CASN: " + casn);
							signonParameters = [];
							signonParameters[0] = casn;
							state = $N.services.sdp.Signon.STATE_SIGNING_ON;
							signonService.signonByCASN(this, signonSuccess, signonFailureCASN, casn);
						} else {
							log("signonByCASN", "signon request ignored - already attempting signon.");
						}
					} else {
						log("signonByCASN", "No CASN!", "error");
					}
					log("signonByCASN", "Exit");
				},

				/**
				 * Returns the authorisation token that was obtained after successful
				 * sign on, otherwise returns null
				 * @method getAuthorisationToken
				 * @return {String}
				 */
				getAuthorisationToken: function () {
					return authToken;
				},

				/**
				 * Stops any re-attempts to signon if a previous request was unsuccessful.
				 * @method cancelOutstandingSignon
				 */
				cancelOutstandingSignon: function () {
					signonParameters = [];
					retryCount = 0;
					if (retryTimeout) {
						clearTimeout(retryTimeout);
					}
					state = $N.services.sdp.Signon.STATE_NOT_SIGNED;
				},

				/**
				 * Determines if the system is successfully signed on to SDP
				 * @method isSignedOn
				 * @return {Boolean} true if successfully signed on; false otherwise
				 */
				isSignedOn: function () {
					return (state === $N.services.sdp.Signon.STATE_SIGNED_ON);
				},

				/**
				 * Registers a function to be executed upon successful signon, many
				 * methods can be registered by repeat calls. If using signonAndInitialiseForNMP or performing
				 * Companion Device sign on using signonToHomeDomain, this listener will be passed an object containing an
				 * upgradeRecommended property if a player upgrade is recommended.
				 * @method registerListener
				 * @param {Function} listener a function to execute on signon
				 * @param {Object} listeningObject a reference back to the object containing the listener
				 */
				registerListener: function (listener, listeningObject) {
					log("registerListener", "New Listener Added");
					listeners.push({listener: listener, listeningObject: listeningObject});
				},

				/**
				 * Unregisters the previously registered function identified by the
				 * listener parameter, after calling this method the function will
				 * no longer execute upon successful signon
				 * @method unregisterListener
				 * @param {Function} listener
				 */
				unregisterListener: function (listener) {
					var i;
					for (i = 0; i < listeners.length; i++) {
						if (listeners[i].listener === listener) {
							log("unregisterListener", "Listener Removed");
							listeners.splice(i, 1);
							break;
						}
					}
				},

				/**
				 * Calls the signon service with the given username and password
				 * @method signonByUser
				 * @param {String} userID The User ID
				 * @param {String} password The Password (Param will be null when this is recalled after a timeout)
				 */
				signonByUser: function (userID, password) {
					log("signonByUser", "Enter");
					var signonSuccessCallback = signonForNMP ? signedOnByUserCallback : signonSuccess;
					if (userID && password) {
						if (state !== $N.services.sdp.Signon.STATE_SIGNING_ON) {
							log("signonByUser", "userID: " + userID);
							signonParameters = [];
							signonParameters[0] = userID;
							signonParameters[1] = password;
							state = $N.services.sdp.Signon.STATE_SIGNING_ON;
							signonService.signonByUser(this, signonSuccessCallback, function (result) {
								if (signonForNMP) {
									if (isConnectionError(result)) {
										signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SERVER_CONNECTION, result);
									} else {
										signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SIGNON_BY_USER, result);
									}
								} else {
									signonFailureUserID(result);
								}
							}, userID, password);
						} else {
							log("signonByUser", "signon request ignored - already attempting signon.");
						}
					} else {
						log("signonByUser", "No user ID.", "error");
					}
					log("signonByUser", "Exit");
				},

				/**
				 * Calls the signon service with the given username and password and device ID
				 * @method signonByUserAndDevice
				 * @param {String} userID The User ID
				 * @param {String} password The Password (Param will be null when this is recalled after a timeout)
				 * @param {String} deviceID The Device ID (Param will be null when this is recalled after a timeout)
				 */
				signonByUserAndDevice: function (userID, password, deviceID) {
					log("signonByUserAndDevice", "Enter");
					var signonSuccessCallback = signonForNMP ? signedOnByDeviceCallback : signonSuccess;
					if (userID && password && deviceID) {
						if (signonForNMP || state !== $N.services.sdp.Signon.STATE_SIGNING_ON) {
							log("signonByUserAndDevice", "userID: " + userID);
							signonParameters = [];
							signonParameters[0] = userID;
							signonParameters[1] = password;
							signonParameters[2] = deviceID;
							state = $N.services.sdp.Signon.STATE_SIGNING_ON;
							signonService.signonByMpDeviceIdAndUser(this, signonSuccessCallback, function (result) {
								if (signonForNMP) {
									if (isConnectionError(result)) {
										signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SERVER_CONNECTION, result);
									} else {
										signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SIGNON_BY_USER_DEVICE_ID, result);
									}
								} else {
									signonFailureUserDeviceID(result);
								}
							}, deviceID, userID, password);
						} else {
							log("signonByUserAndDevice", "signon request ignored - already attempting signon.");
						}
					} else {
						log("signonByUserAndDevice", "No user ID.", "error");
					}
					log("signonByUserAndDevice", "Exit");
				},

				/**
				 * Calls the signon service with the given device ID
				 * @method signonByDevice
				 * @param {String} deviceID The Device ID (Param will be null when this is recalled after a timeout)
				 */
				signonByDevice: function (deviceID) {
					log("signonByDevice", "Enter");
					var signonSuccessCallback = signonForNMP ? signedOnByDeviceCallback : signonSuccess;
					if (deviceID) {
						if (signonForNMP || state !== $N.services.sdp.Signon.STATE_SIGNING_ON) {
							log("signonByDevice", "deviceID: " + deviceID);
							signonParameters = [];
							signonParameters[1] = deviceID;
							state = $N.services.sdp.Signon.STATE_SIGNING_ON;
							signonService.signonByMpDeviceId(this, signonSuccessCallback, function (result) {
								if (signonForNMP) {
									if (isConnectionError(result)) {
										signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SERVER_CONNECTION, result);
									} else {
										signonOrInitializationForNMPFailure($N.services.sdp.Signon.ERROR.SIGNON_BY_DEVICE_ID, result);
									}
								} else {
									signonFailureUserDeviceID(result);
								}
							}, deviceID);
						} else {
							log("signonByDevice", "signon request ignored - already attempting signon.");
						}
					} else {
						log("signonByDevice", "No device ID.", "error");
					}
					log("signonByDevice", "Exit");
				},

				/**
				 * Will check if drmAgent.deviceId exists, if so will signon by userId,
				 * password and deviceId otherwise will initially signon by userId and password,
				 * then initialiseDevice with NMPExtendedService
				 * and then sign on by userId, password and deviceId. Will also initialise the drmAgent
				 * If successful the listeners registered with registerListener will be fired
				 * If deviceName passed in then this will be stored against the device id in SDP
				 * @method signonAndInitialiseForNMP
				 * @param {String} userId
				 * @param {String} password
				 * @param {String} deviceName
				 */
				signonAndInitialiseForNMP: function (userId, password, deviceName) {
					log("signonAndInitialiseForNMP", "Enter");
					signonProperties.username = userId;
					signonProperties.password = password;
					signonProperties.deviceName = deviceName;
					signonForNMP = true;
					log('signonAndInitialiseForNMP', 'platform: ' + platform);
					getDrmAgentProperties();
					log("signonAndInitialiseForNMP", "Exit");
				},

				/**
				 * Signs on a device to the Home Domain Manager
				 * @method
				 * @param {Object} signonDetails contains the sign-on credentials.
				 * @param {String} signonDetails.nuId NUID of the device. Mandatory for STB sign-on.
				 * @param {String} signonDetails.caSn CAS Number of the device. Mandatory for STB sign-on.
				 * @param {String} signonDetails.csadList Mandatory for STB sign-on.
				 * @param {String} signonDetails.smartcardId the smart card id. Mandatory for STB and Companion Device sign-on.
				 * @param {String} signonDetails.username user name required for sign-on. Mandatory for companion device sign-on.
				 * @param {String} signonDetails.password password for the user name. Mandatory for companion device sign-on.
				 * @param {Boolean} [signonDetails.provisioned=true] indicates whether the device has been provisioned already.
				 * This will determine the Home Domain Manager API method that will be called internally. By default, devices
				 * are assumed to be provisioned unless explicitly specified otherwise.
				 */
				signonToHomeDomain: function (signonDetails) {
					log('signonToHomeDomain', 'Enter');
					if (signonDetails) {
						if (signonDetails.nuId || (signonDetails.username && signonDetails.password && signonDetails.smartcardId)) {
							if (signonDetails.nuId) {
								log('signonToHomeDomain', 'STB signon');
								signonDetails.provisioned = (signonDetails.provisioned === null || signonDetails.provisioned === undefined) ? true : signonDetails.provisioned;
								HDMS.signon(this, signonSuccess, signonFailureHomeDomain, signonDetails);
							} else {
								log('signonToHomeDomain', 'Companion Device signon');
								signonForNMP = true;
								signonProperties.username = signonDetails.username;
								signonProperties.password = signonDetails.password;
								signonProperties.smartcardId = signonDetails.smartcardId;
								isHomeDomainSignon = true;
								getDrmAgentProperties();
							}
						} else { // mandatory values for STB/Companion Device not present
							signonFailureHomeDomain();
						}
					}
					log('signonToHomeDomain', 'Exit');
				},

				/**
				 * Sets the device name for the given device id
				 * @method setDeviceNameForNMPId
				 * @param {Number} deviceId
				 * @param {String} deviceName
				 * @param {Function} success Called if the name is set successfully
				 * @param {Function} failure Called if fails to set the name
				 */
				setDeviceNameForNMPId: function (deviceId, deviceName, success, failure) {
					$N.services.sdp.ServiceFactory.get("DeviceService").updateMpName(this, success, failure, deviceId, deviceName);
				}

			};

		}());
		return $N.services.sdp.Signon;
	}
);
