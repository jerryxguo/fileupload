/**
 * This is the superclass of all services provided in the HUE gateway interface. The
 * class offers 2 public class methods, involkMethod used by the subclasses to make
 * an Ajax call using a `$N.services.sdp.RequestWorker` object and Init, which must be called
 * to set the URL of the HUE gateway prior to any service calls.  The default behaviour
 * of this class is to only allow the sign on service to be called first before
 * any other services, it also maintains outstanding requests and reauthorisation for
 * a new token.
 * @class $N.services.sdp.BaseService
 * @singleton
 * @requires $N.apps.core.Log
 * @requires $N.services.sdp.RequestWorker
 */
/*global $N,setInterval, define */
define('jsfw/services/sdp/BaseService',
	[
		'jsfw/apps/core/Log',
		'jsfw/Config',
		'jsfw/services/sdp/RequestWorker'
	],
	function (Log, Config, RequestWorker) {
		var BaseService = function () {
			/**
			 * Indicates whether SDP requests are to be sent using the HTTPS protocol
			 * @property {Boolean} securityRequired
			 */
			this.securityRequired = false;
		};

		var log = new $N.apps.core.Log("sdp", "BaseService");

		BaseService._HUE_GATEWAY_URL = "";
		BaseService._USE_INLINE_AUTH_TOKEN = true;
		BaseService._AUTH_TOKEN = "";
		BaseService._SECURITY_PORT = null;
		BaseService._REAP_FREQ_MILLIS = 30000; // Check for timeouts every 30s
		BaseService._RE_AUTHORISE_REQUEST = null;
		BaseService._RE_AUTHORISING = false;
		BaseService._QSP_PATH = "/qsp/gateway/http/js";
		BaseService._SIGNED_ON = false;
		BaseService._SIGNON_REQUEST_FAILED = false;
		BaseService._securityRequired = false;

		/**
		 * Override if you don't want services to be blocked if not signed on
		 * @property {Boolean} ONLY_ALLOW_SIGNON
		 */
		BaseService.ONLY_ALLOW_SIGNON = true;

		// Stores pending requests
		BaseService._outstandingRequests = [];
		BaseService._requestsPendingSignon = [];

		/**
		 * Returns the number of open requests in the queue
		 * @method getOutstandingRequestCount
		 * @return {Number}
		 */
		BaseService.getOutstandingRequestCount = function () {
			return BaseService._outstandingRequests.length;
		};

		/**
		 * Returns the number of open requests in the queue
		 * @method getNumberOfRequestsPendingSignon
		 * @return {Number}
		 */
		BaseService.getNumberOfRequestsPendingSignon = function () {
			return BaseService._requestsPendingSignon.length;
		};

		/**
		 * Must be called prior to any service called and must pass the hueGatewayAddress that
		 * corresponds to the SDP address and port number e.g. dev13:13566
		 * @method init
		 * @param {String} hueGatewayAddress Base URL of the SDP
		 * @param {Boolean} useToken optional parameter to override the use of a token for authentication
		 * @param {Number} securityPort optional parameter to set the HTTPS port
		 * @param {Number} timeoutCheckMS optional parameter to override default time the outstanding requests are checked
		 * @param {String} [sdpPath="/qsp/gateway/http/js"] URI prefix for SDP requests
		 * @param {Boolean} [onlyAllowAfterSignon=true] determines whether or not signing on is mandatory before SDP calls. If set to
		 * false, queues up requests and processes them after a successful sign on. If sign on fails, then all such queued requests
		 * are deemed failures as well. Note that requests that depend on values returned from sign on will return unknown results
		 * if called before sign on.
		 * @param {Boolean} [useHttps=false] Makes all requests use https instead of http
		 */
		BaseService.init = function (hueGatewayAddress, useToken, securityPort, timeoutCheckMS, sdpPath, onlyAllowAfterSignon, useHttps) {
			BaseService._HUE_GATEWAY_URL = hueGatewayAddress;
			BaseService._USE_INLINE_AUTH_TOKEN = (useToken === false || useToken === true) ? useToken : BaseService._USE_INLINE_AUTH_TOKEN;
			if (securityPort) {
				BaseService._SECURITY_PORT = securityPort;
			}
			BaseService._REAP_FREQ_MILLIS = timeoutCheckMS || BaseService._REAP_FREQ_MILLIS;
			BaseService._QSP_PATH = (sdpPath !== null && sdpPath !== undefined) ? sdpPath : "/qsp/gateway/http/js";
			BaseService.ONLY_ALLOW_SIGNON = (onlyAllowAfterSignon !== undefined && onlyAllowAfterSignon !== null) ? onlyAllowAfterSignon : true;
			BaseService._reaperTimeout = setInterval(
				function () {
					BaseService._reapTimedOutRequests();
				},
				BaseService._REAP_FREQ_MILLIS
			);
			BaseService._securityRequired = useHttps || false;
		};

		/**
		 * Must be called prior to any service called and must pass the hueGatewayAddress that
		 * corresponds to the SDP address and port number e.g. dev13:13566
		 * @method initialise
		 * @deprecated use init()
		 * @param {String} hueGatewayAddress Base URL of the SDP
		 * @param {Boolean} useToken optional parameter to override the use of a token for authentication
		 * @param {Number} securityPort optional parameter to set the HTTPS port
		 * @param {Number} timeoutCheckMS optional parameter to override default time the outstanding requests are checked
		 * @param {String} [sdpPath="/qsp/gateway/http/js"] URI prefix for SDP requests
		 * @param {Boolean} [onlyAllowAfterSignon=true] determines whether or not signing on is mandatory before SDP calls. If set to
		 * false, queues up requests and processes them after a successful sign on. If sign on fails, then all such queued requests
		 * are deemed failures as well. Note that requests that depend on values returned from sign on will return unknown results
		 * if called before sign on.
		 * @param {Boolean} [useHttps=false] Makes all requests use https instead of http
		 */
		BaseService.initialise = function (hueGatewayAddress, useToken, securityPort, timeoutCheckMS, sdpPath, onlyAllowAfterSignon, useHttps) {
			BaseService.init(hueGatewayAddress, useToken, securityPort, timeoutCheckMS, sdpPath, onlyAllowAfterSignon, useHttps);
		};

		/**
		 * Sets the authorisation token to be used by the HTTP requests. This
		 * is generally provided post-signon
		 * @method setAuthToken
		 * @param {String} token
		 * @chainable
		 */
		BaseService.setAuthToken = function (token) {
			BaseService._AUTH_TOKEN = token;
			return this;
		};

		/**
		 * Returns the HUE gateway server address
		 * @method getServerURL
		 * @return {String} the HUE gateway server address
		 */
		BaseService.getServerURL = function () {
			return BaseService._HUE_GATEWAY_URL;
		};

		//set the callback to execute on the request worker complete event
		$N.services.sdp.RequestWorker.setPostResponseCallback(
			function (responseCode, requestWorker, data) {
				switch (responseCode) {
				case $N.services.sdp.RequestWorker.SUCCESS:
					if (data.token) {
						BaseService._AUTH_TOKEN = data.token;
					}

					if (requestWorker.getServiceName() === "signonService" || requestWorker.getServiceName() === "homeDomainManagerService") {
						BaseService._RE_AUTHORISE_REQUEST = requestWorker;
						BaseService.ONLY_ALLOW_SIGNON = false;
						BaseService._RE_AUTHORISING = false;
						BaseService._SIGNED_ON = true;
						BaseService._SIGNON_REQUEST_FAILED = false;
						BaseService._processPendingRequests();
					}
					break;
				case $N.services.sdp.RequestWorker.FAILED:
					if (requestWorker.getServiceName() === "signonService" || requestWorker.getServiceName() === "homeDomainManagerService") {
						BaseService._abortPendingRequests();
						BaseService._RE_AUTHORISING = false;
						BaseService._SIGNED_ON = false;
						BaseService._SIGNON_REQUEST_FAILED = true;
					}
					break;
				case $N.services.sdp.RequestWorker.NOT_AUTHORISED:
					if (BaseService._RE_AUTHORISE_REQUEST && !BaseService._RE_AUTHORISING) {
						BaseService._outstandingRequests.push(BaseService._RE_AUTHORISE_REQUEST.reIssueRequest());
						BaseService._RE_AUTHORISING = true;
					}
					BaseService._requestsPendingSignon.push(requestWorker);
					break;
				}
				BaseService._removeFromOutstanding(requestWorker);
			}
		);

		/**
		 * Cancels any requests that have been queued up during
		 * reauthorisation
		 * @method _abortPendingRequests
		 * @private
		 */
		BaseService._abortPendingRequests = function () {
			var i;
			for (i = 0; i < BaseService._requestsPendingSignon.length; i++) {
				BaseService._requestsPendingSignon[i].failRequest();
			}
			BaseService._requestsPendingSignon = [];
		};

		/**
		 * Processes any requests that have been queued up during
		 * reauthorisation
		 * @method _processPendingRequests
		 * @private
		 */
		BaseService._processPendingRequests = function () {
			var i;
			for (i = 0; i < BaseService._requestsPendingSignon.length; i++) {
				BaseService._requestsPendingSignon[i].reIssueRequest(BaseService._AUTH_TOKEN);
			}
			BaseService._requestsPendingSignon = [];
		};

		/**
		 * Removes the given request worker object from the outstanding
		 * requests queue.
		 * @method _removeFromOutstanding
		 * @private
		 * @param {Object} requestWorker
		 */
		BaseService._removeFromOutstanding = function (requestWorker) {
			var i;
			for (i = 0; i < BaseService._outstandingRequests.length; i++) {
				if (BaseService._outstandingRequests[i] === requestWorker) {
					BaseService._outstandingRequests[i] = null;
					BaseService._outstandingRequests.splice(i, 1);
				}
			}
		};

		/**
		 * Checks through the current requests in the outstanding request
		 * queue and aborts any requests that have timed out
		 * @method _reapTimedOutRequests
		 * @private
		 */
		BaseService._reapTimedOutRequests = function () {
			log("_reapTimedOutRequests", "Enter (" + String(BaseService._outstandingRequests.length) + " requests outstanding)");
			// Ensure we get our own copy of array to avoid being tripped up if requestFail alters the original array
			var requestsToCheck = [].concat(BaseService._outstandingRequests),
				i;

			for (i = 0; i < requestsToCheck.length; i++) {
				if (requestsToCheck[i].hasTimedOut()) {
					log("_reapTimedOutRequests", "(" + requestsToCheck[i].getServiceName() + "." + requestsToCheck[i].getMethodName() + ") Request has timed out");
					requestsToCheck[i].abortRequest();
				}
			}
			log("_reapTimedOutRequests", "Exit (" + String(BaseService._outstandingRequests.length) + " requests outstanding)");
		};

		var proto = BaseService.prototype;

		/**
		 * Asynchronously invokes a service API using the HUE gateway interface. Note that all parameters
		 * following the ones specified here are 'escaped' and passed to the service.  This method is called
		 * by the subclassed services provided by the SDP as client stubs
		 * @method invokeMethod
		 * @async
		 * @param {Object} caller The object to be notified when call completes.
		 * @param {Function} successCallback The method to call when invocation completes successfully.
		 * @param {Function} failureCallback The method to call when invocation fails.
		 * @param {String} methodName The name of the method to invoke.
		 * @chainable
		 */
		proto.invokeMethod = function (caller, successCallback, failureCallback, methodName) {
			log("invokeMethod", "Enter");
			var qspPath = BaseService._QSP_PATH;
			if (this._serviceName === 'signonService') {
				BaseService._SIGNED_ON = false;
				BaseService._AUTH_TOKEN = "";
			}
			var url = "",
				token = "",
				urlPref = "",
				postData = "",
				i;

			if (methodName === "tearDown" || methodName === "getBookmarkForOrigin" || methodName === "setBookmarkForOrigin" || methodName === "deleteBookmarkByUid") {
				qspPath = '/hue-gateway/gateway/http/js';
			} else {
				if (this._isAdapted) { // for API Adaptor services (MDS)
					qspPath = '/adaptor/hue-gateway/gateway/http/js';
				}
			}
			log("invokeMethod", "HUE GATEWAY URL: " + BaseService._HUE_GATEWAY_URL + ", is security required: " + String(this.securityRequired));
			if ((this.securityRequired === true && BaseService._SECURITY_PORT) || BaseService._securityRequired) {
				urlPref = this._updatePortForSecurity(BaseService._HUE_GATEWAY_URL, BaseService._SECURITY_PORT);
				url = "https://" + urlPref + qspPath;
			} else {
				url = "http://" + BaseService._HUE_GATEWAY_URL + qspPath;
			}
			url += "/" + this._serviceName + "/" + methodName;
			// pick up any arguments passed to this method and include them in the request
			for (i = 4; i < arguments.length; i++) {
				if (postData !== "") {
					postData += "&";
				}
				// TODO: remove the following if condition once METADATASRV-492 has been fixed
				if ((this._serviceName === 'acquiredContentListService' && methodName === "getByAccountUID" && i === 6) ||
						(this._isAdapted && this._serviceName === 'acquiredContentListService' && methodName === "getByAccountUIDAndItemType" && i === 7) ||
						(this._serviceName === "bookmarkService" && methodName === "setBookmarkForContent" && i === 7) ||
						(this._serviceName === "bookmarkService" && methodName === "getBookmarkForContent" && i === 6)) {
					postData += "locale=" + encodeURIComponent(arguments[i]);
				} else {
					postData += "arg" + String(i - 4) + "=" + encodeURIComponent(arguments[i]);
				}
			}
			if (BaseService._USE_INLINE_AUTH_TOKEN) {
				token = BaseService._AUTH_TOKEN;
			}
			log("invokeMethod", "(" + this._serviceName + "." + methodName + ") Request: " + postData);
			log("invokeMethod", "(" + this._serviceName + "." + methodName + ") URL: " + url);
			log("invokeMethod", "(" + this._serviceName + "." + methodName + ") Token: " + token);

			if (BaseService._SIGNED_ON || this._serviceName === 'signonService' || this._serviceName === 'provisionService') {
				BaseService._outstandingRequests.push(new $N.services.sdp.RequestWorker(token, this._serviceName, methodName, url, caller, successCallback, failureCallback, postData, false));
			} else if (!BaseService.ONLY_ALLOW_SIGNON && !BaseService._SIGNON_REQUEST_FAILED) {
				log("invokeMethod", "Not signed on, so queuing request");
				BaseService._requestsPendingSignon.push(new $N.services.sdp.RequestWorker(token, this._serviceName, methodName, url, caller, successCallback, failureCallback, postData, false, true));
			}
			log("invokeMethod", "Exit");
			return this;
		};

		/**
		 * Sets the TLS Port if security is intended for the Service
		 * @private
		 * @method _updatePortForSecurity
		 * @param {String} httpURL The URL that is used to invoke a service
		 * @param {String} httpsPort The port for HTTPS requests
		 * @return the HTTP Address if security is not desired or the HTTPS Address if security is desired
		 */
		proto._updatePortForSecurity = function (httpURL, httpsPort) {
			var httpsURL = httpURL;
			if (httpURL.indexOf(":") !== -1) {
				httpsURL = httpURL.substring(0, httpURL.indexOf(":") + 1);
				httpsURL = httpsURL + httpsPort;
				log("_updatePortForSecurity", "isSet: " + String(this.securityRequired));
				log("_updatePortForSecurity", "URL: " + httpsURL);
			} else {
				httpsURL = httpURL + ":" + httpsPort;
			}
			return httpsURL;
		};

		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};
		$N.services.sdp.BaseService = BaseService;
		window.BaseService = $N.services.sdp.BaseService;
		return BaseService;
	});
