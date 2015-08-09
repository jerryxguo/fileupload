/**
 * This class manages instances of SDP service Javascript interfaces.
 * The `$N.services.sdp.ServiceFactory.preCache()` method can be called to pre cache some of the more
 * frequently used services. References to services can then be obtained
 * using the `$N.services.sdp.ServiceFactory.get()` method.
 *
 * @class $N.services.sdp.ServiceFactory
 * @author D Thomas
 * @static
 * @singleton
 * @requires $N.apps.core.Log
 */
/* global define */
define('jsfw/services/sdp/ServiceFactory',
	[
		'jsfw/apps/core/Log',
		'jsfw/services/sdp/stubs/allServices',
		'jsfw/services/sdp/HomeDomainManagerService'
	],
	function (Log, allServices, HomeDomainManagerService) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};

		$N.services.sdp.ServiceFactory = (function () {

			// service class instance repository
			var instances = {};
			var log = new $N.apps.core.Log("sdp", "ServiceFactory");

			/**
			 * Creates a new instance of the specified class. If the class specifies an
			 * `init()` method then this is called after creation.
			 * @method newInstance
			 * @private
			 * @param {String} className The class to create.
			 * @return {Object} The Service Factory object.
			 */
			function newInstance(className) {
				try {
					return new window[className]();
				} catch (e) {
					log("newInstance", ">>>>No class " + className + " found<<<", "warn");
				}
			}

			/**
			 * Adds an instance to the instances array using the class name as the key.
			 * @method set
			 * @param {String} className
			 * @param {Object} instance
			 */
			function set(className, instance) {
				instances[className] = instance;
			}

			/**
			 * Creates an instance of the specified class if one has not been created
			 * already, otherwise the original instance is returned. If the class specifies
			 * an init method then this is called after creation.
			 *
			 * Note that any additional arguments specified after className
			 * will be passed to the initialisation method (if, and only if, the specified
			 * object is being created).
			 * @method get
			 * @param {String} className The class to create.
			 * @return {Object} Service object
			 */
			function get(className) {
				log("get", className + ": " + (instances[className] ? "returning existing instance" : "creating new instance"));

				var i = 1,
					initArgs,
					instance;

				if (instances[className]) {
					return instances[className];
				}

				instance = newInstance.apply(this, arguments);
				set(className, instance);
				// Initialise object if it has an init method
				if (instance && instance.init) {
					initArgs = [];
					for (i = 1; i < arguments.length; i++) {
						initArgs.push(arguments[i]);
					}
					instance.init.apply(instance, initArgs);
				}
				return instance;
			}

			/**
			 * Initialises the service factory by pre caching order dependent services.
			 * This method should be called during boot process after sign on.
			 * @method preCache
			 */
			function preCache() {
				// Cache instances of required services.
			    get("BTVService");
			    get("ChannelService");
			    get("UserService");
			    get("FavouriteService");
			    get("IntervalService");
			    get("AcquiredContentListService");
			    get("CODService");
			    get("CodHelperService");
			    get("NPVRService");
			    get("AssetService");
			    get("CatalogueService");
			    get("EventService");
			    get("BillingService");
			    get("DeviceService");
			    get("PackageService");
			    get("PreferenceService");
			    get("AccountService");
			    get("RatingService");
			    get("SubscriptionService");
			    get("BookmarkService");
			    get("LicenseService");
			    get("ProvisionService");
				get("ContextService");
				get("BocPurchaseService");
			}

			/* Public API */
			return {
				preCache: preCache,
				get: get,
				set: set
			};

		}());
		return $N.services.sdp.ServiceFactory;
	}
);