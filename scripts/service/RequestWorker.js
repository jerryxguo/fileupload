/**
 * Request worker class. Each instance is responsible for a single service invocation.
 * The request worker creates a XMLHttpRequest (AJAX) object that incorporates
 * functionality specific to SDP / MetaData server requests.  It is used exclusively by BaseService.
 * @class $N.services.sdp.RequestWorker
 * @requires $N.apps.core.Log
 *
 * @constructor
 * @param {String} token authentication token, empty string if not required
 * @param {String} serviceName SDP service name
 * @param {String} methodName SDP service method name
 * @param {String} url for the HTTP GET request
 * @param {Object} callbackObj The object that created the request
 * @param {Function} successCallback Function to be called when the request is successful
 * @param {Function} failureCallback Function to be called when the request has failed
 * @param {String} params parameters for the HTTP GET request
 * @param {Boolean} reRequest true if this is the second request
 * @param {Boolean} [toQueue=false] If true, specifies if the request is to be processed later. Requests are
 * not queued by default.
 * @param {Function} [postResponseCallback=null] Function to be called when the request has failed
 */
/*global XDomainRequest,$,$N, define*/
/*jslint browser: true*/
define('jsfw/services/sdp/RequestWorker',
	[
		'jsfw/apps/core/Log'
	],
	function (Log) {
		var log = new $N.apps.core.Log("sdp", "RequestWorker"),
			fallbackToJquery = false,
			onReadyStateChangedTimer = null,
			TIME_TO_CHECK_XHR_STATE_CHANGE_MS = 1000,
			firstTime = true,
			isEkioh = navigator.userAgent.indexOf("Ekioh") > -1;

		/**
		 * Determines whether a given service method is targeted at MDS
		 * @method isMdsRequest
		 * @private
		 * @param {String} method the method name
		 * @return {Boolean} true if the request is an MDS request, false otherwise
		 */
		function isMdsRequest(method) {
			return (method.indexOf('btv/') !== -1 || method.indexOf('vod/') !== -1 || method.indexOf('offers/') !== -1 || method.indexOf('/search') !== -1 || method.indexOf('/suggest') !== -1);
		}

		/**
		 * Determines whether an adaptor URL for MDS is being used
		 * @method isMdsAdaptorURL
		 * @private
		 * @param {String} url the url
		 * @return {Boolean} true if the request is an MDS adaptor request, false otherwise
		 */
		function isMdsAdaptorURL(url) {
			return (url.indexOf('adaptor') !== -1);
		}

		/**
		 * Determines whether a given service method is targeted at Home Domain Manager
		 * @method isHDMS
		 * @private
		 * @param {String} service the service name
		 * @return {Boolean} true if the request is an HDM request, false otherwise
		 */
		function isHDMS(service) {
			return (service === 'homeDomainManagerService');
		}

		/**
		 * Returns the value to return to the app. If the service is HDMS then the response.token is returned
		 * @method getReturnValue
		 * @private
		 * @param {Object} response
		 * @param {String} serviceName
		 */
		function getReturnValue(response, serviceName) {
			if (isHDMS(serviceName)) {
				return response.token;
			}
			return response;
		}

		/**
		 * Makes an asynchronous request to the specified SDP service and method. Uses XHR, XDR or JQuery depending
		 * on what's available on the current platform
		 * @method xssRequest
		 * @private
		 * @param {String} url SDP URL
		 * @param {String} completeParams a query string containing all the parameters required for the request
		 * @param {String} serviceName name of the SDP service
		 * @param {String} methodName name of the SDP service method
		 * @param {Function} successCallback callback that should be invoked if the SDP call is successful. This
		 * function receives the data object returned by SDP
		 * @param {Function} failCallback callback that handles any failures
		 * @param {Boolean} [toQueue=false] indicates whether the request is to be queued
		 * @return {Object} the XHR, XDR or JQuery request object
		 */
		function xssRequest(url, completeParams, serviceName, methodName, successCallback, failCallback, toQueue) {
			var returnValue = null,
				req,
				xdr,
				isGetRequest = false;
			toQueue = (toQueue !== undefined && toQueue !== null) ? toQueue : false;
			if (!toQueue) {
				if (window.XDomainRequest) {
					xdr = new XDomainRequest();
					completeParams = (completeParams && url.indexOf("?") === -1 ? ("?" + completeParams) : '');
					xdr.open("GET", url + completeParams);
					xdr.onerror = function (e) {
						log("_statechange", "(" + serviceName + "." + methodName + ") Request incomplete - HTTP Response Code: " + String(e || null));
						failCallback();
					};
					xdr.onload = function () {
						var returnValue = null;
						try {
							/*jslint evil: true */
							returnValue = eval('(' + xdr.responseText + ')'); // we use eval to work around non-JSON-compliant SDP data
							/*jslint evil: false */
						} catch (e) {
							log("_statechange", "Eval of returned JSON string failed.");
						}
						returnValue = getReturnValue(returnValue, serviceName);
						if (returnValue && (isMdsRequest(methodName) || returnValue.resultCode === "0")) {
							log("_statechange", "(" + serviceName + "." + methodName + ") Request complete.");
							successCallback(returnValue);
						} else {
							log("_statechange", "(" + serviceName + "." + methodName + ") Request incomplete: " + String(returnValue));
							failCallback(returnValue);
						}
					};
					xdr.onprogress = function () {};
					xdr.ontimeout = function () {};
					setTimeout(function () {
						xdr.send();
					}, 0);
					return xdr;
				}
				if (!fallbackToJquery || isEkioh) {
					req = new XMLHttpRequest();
					req.onreadystatechange = function () {
						firstTime = false;
						if (onReadyStateChangedTimer) {
							clearTimeout(onReadyStateChangedTimer);
							onReadyStateChangedTimer = null;
						}
						switch (req.readyState) {
						case 0:
							log("_statechange", "(" + serviceName + "." + methodName + ") Request Unitiliased");
							break;
						case 1:
							log("_statechange", "(" + serviceName + "." + methodName + ") Request Open");
							break;
						case 4:
							log("_statechange", "(" + serviceName + "." + methodName + ") Request data received");
							returnValue = null;
							try {
								/*jslint evil: true */
								returnValue = eval("returnValue = " + req.responseText + ";");
								/*jslint evil: false */
							} catch (error) {
								log("_statechange", "Eval of returned JSON string failed.");
							}
							if (req.status === 0 && req.getAllResponseHeaders()) {
								log("_statechange", "blocked by cross site scripting browser security");
								fallbackToJquery = true;
								failCallback(returnValue, true);
							} else if (req.status === 200) {
								returnValue = getReturnValue(returnValue, serviceName);
								if (returnValue && (isMdsRequest(methodName) || returnValue.resultCode === "0")) {
									log("_statechange", "(" + serviceName + "." + methodName + ") Request complete.");
									successCallback(returnValue);
								} else {
									log("_statechange", "(" + serviceName + "." + methodName + ") Request incomplete - HTTP Response Code: " + String(req.status));
									failCallback(returnValue);
								}
							} else {
								log("_statechange", "(" + serviceName + "." + methodName + ") Request incomplete - HTTP Response Code: " + String(req.status));
								failCallback(returnValue);
							}
							break;
						}
					};

					// TODO: remove the following if condition once METADATASRV-490 has been fixed

					if ((serviceName === 'acquiredContentListService' || serviceName === 'bookmarkService') && isMdsAdaptorURL(url)) {
						completeParams = (completeParams ? ("?" + completeParams) : '');
						isGetRequest = true;
						req.open("GET", url + completeParams, true);
					} else if (isMdsRequest(methodName) || isHDMS(serviceName)) {
						isGetRequest = true;
						req.open("GET", url, true);
					} else {
						req.open("POST", url, true);
					}


					if (completeParams) {
						req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
					}
					try {
						if (!isGetRequest) {
							req.send(completeParams);
						} else {
							req.send();
						}
					} catch (e) {
						if (req.status !== 0 && e.code === 11) {
							req.abort();
							log("_statechange", "(" + serviceName + "." + methodName + ") Request incomplete - HTTP Response Code: " + String(req.status));
							failCallback(returnValue);
						}
					}


					if (firstTime && !isEkioh) {
						onReadyStateChangedTimer = setTimeout(function () {
							fallbackToJquery = true;
							failCallback({}, true);
						}, TIME_TO_CHECK_XHR_STATE_CHANGE_MS);
					}
					return req;
				}
				log('_statechange', 'sending the request using JQuery now');
				completeParams = (completeParams ? ("?" + completeParams) : '');
				return $.get(url + completeParams, null, null, 'text')
					.done(function (data) {
						var returnValue;
						try {
							/*jslint evil: true */
							returnValue = eval('(' + data + ')');
							/*jslint evil: false */
						} catch (e) {
							log("_statechange", "Eval of returned JSON string failed.");
						}
						returnValue = getReturnValue(returnValue, serviceName);
						successCallback(returnValue);
					})
					.fail(function (jqxhr, status, error) {
						log('_statechange', 'Error retrieving data from SDP: ' + error, Log.LOG_ERROR);
						failCallback();
					});
			}
			log('xssRequest', '---------------request to be processed later, so not creating XHR/XDR, etc------------------');
		}

		function RequestWorker(token, serviceName, methodName, url, callbackObj, successCallback, failureCallback, params, reRequest, toQueue, postResponseCallback) {
			this._serviceName = serviceName;
			this._methodName = methodName;
			this._sentTime = new Date().getTime();
			this._url = url;
			this._requestContext = {
				callbackObj: callbackObj,
				successCallback: successCallback,
				failureCallback: failureCallback
			};
			this._params = params;
			this._reRequest = reRequest;
			this._callPostResponse = function () {
				if (postResponseCallback) {
					postResponseCallback.apply(callbackObj, arguments);
				} else {
					RequestWorker._postResponseCallback.apply(callbackObj, arguments);
				}
			};
			this._isMdsRequest = isMdsRequest(methodName);

			var completeParams = token ? params + "&token=" + token : params,
				thisObj = this,
				failCallback = function (obj, reRequest) {
					if (reRequest) {
						thisObj._req = xssRequest(url, completeParams, serviceName, methodName, function (obj) {
							thisObj._requestSuccess(obj);
						}, failCallback, toQueue);
						return;
					}
					thisObj._requestFail(obj);
				};
			this._req = xssRequest(url, completeParams, serviceName, methodName, function (obj) {
				thisObj._requestSuccess(obj);
			}, failCallback, toQueue);
		}

		var proto = RequestWorker.prototype;

		/**
		 * Sets the function to be called after every successful or failed
		 * service call. This allows classes using a RequestWorker e.g.
		 * BaseService, to be notified about the completion of a service call
		 * and allows them to implement behaviour around that event.
		 * @method setPostResponseCallback
		 * @param {Function} callback
		 */
		RequestWorker.setPostResponseCallback = function (callback) {
			RequestWorker._postResponseCallback = callback;
		};

		RequestWorker._postResponseCallback = function (responseCode, requestWorker, data) {
			//empty function can be set by service creating a RequestWorker object
		};

		/**
		 * The maximum time that should be allowed before requests are cancelled
		 * @property {Number} TIMEOUT_DURATION
		 */
		RequestWorker.TIMEOUT_DURATION = 120000; //2 minutes

		/**
		 * Constant property for a successful call passed back in the
		 * postResponseCallback
		 * @property {Number} SUCCESS
		 * @readonly
		 */
		RequestWorker.SUCCESS = 0;

		/**
		 * Constant property for a unsuccessful call passed back in the
		 * postResponseCallback
		 * @property {Number} FAILED
		 * @readonly
		 */
		RequestWorker.FAILED = 1;

		/**
		 * Constant property for a unsuccessful call because of not being
		 * signed on, passed back in the postResponseCallback
		 * @property {Number} NOT_AUTHORISED
		 * @readonly
		 */
		RequestWorker.NOT_AUTHORISED = 2;

		/**
		 * Callback function for when a service call has been successful
		 * @method _requestSuccess
		 * @private
		 * @param {Object} returnValue The value returned on a successful request.
		 */
		proto._requestSuccess = function (returnValue) {
			log("_requestSuccess", "Enter");

			var token = returnValue.token || null,
				result = (this._isMdsRequest ? returnValue : returnValue.result);

			if (this.hasTimedOut()) {
				log("_requestSuccess", "(" + this._serviceName + "." + this._methodName + ") " +
					" ignoring response which arrived after timeout period (because has already been signalled as failed).");
				return;
			}

			// No data received in response
			if (!result) {
				log("_requestSuccess", "(" + this._serviceName + "." + this._methodName + ") No data received in response!");
			}

			this._callPostResponse(RequestWorker.SUCCESS, this, returnValue);
			this._requestContext.successCallback.apply(this._requestContext.callbackObj, [result, token]);

			log("_requestSuccess", "Exit");
		};

		/**
		 * Callback function for when a service call has been unsuccessful
		 * @method _requestFail
		 * @private
		 * @param {Object} rv object containing details of failure
		 */
		proto._requestFail = function (rv) {
			log("_requestFail", "Enter");

			var resultCode = "-1",
				result = "";

			if (rv) {
				resultCode = this._isMdsRequest ? resultCode : rv.resultCode;
				result = this._isMdsRequest ? rv : rv.result;
			}

			if (this._hasTokenExpired(resultCode) && !this._reRequest) {
				this._callPostResponse(RequestWorker.NOT_AUTHORISED, this, rv);
				return;
			}
			this._callPostResponse(RequestWorker.FAILED, this, rv);

			if (this._requestContext.failureCallback) {
				this._requestContext.failureCallback.apply(this._requestContext.callbackObj, ["[" + resultCode + "]" + result]);
			}

			log("_requestFail", "Exit");
		};

		/**
		 * Returns true if the result of a service call indicates
		 * that a HTTP 403 error (security) occurred, can flag
		 * back that signon is required for re-authentication
		 * @method _hasTokenExpired
		 * @private
		 * @param {String} resultCode the result as returned by the server
		 * @return {Boolean}
		 */
		proto._hasTokenExpired = function (resultCode) {
			var errorCodes = resultCode ? resultCode.split(":") : [],
				i;
			for (i = 0; i < errorCodes.length; i++) {
				if (errorCodes[i] === "403") {
					return true;
				}
			}
			return false;
		};

		/**
		 * Returns the name of the SDP service that this request
		 * relates to
		 * @method getServiceName
		 * @return {String}
		 */
		proto.getServiceName = function () {
			return this._serviceName;
		};

		/**
		 * Returns the name of the SDP service method that this request
		 * relates to
		 * @method getMethodName
		 * @return {String}
		 */
		proto.getMethodName = function () {
			return this._methodName;
		};


		/**
		 * Returns true if the request has become older than is
		 * allowed as defined by the TIMEOUT_DURATION.
		 * @method hasTimedOut
		 * @return {Boolean}
		 */
		proto.hasTimedOut = function () {
			return (new Date().getTime() - this._sentTime) > RequestWorker.TIMEOUT_DURATION;
		};

		/**
		 * Reissues the AJAX call to the server, if a request failed for
		 * authentication purposes this method can be called once signed
		 * on again.
		 * @method reIssueRequest
		 * @param {String} newToken
		 * @return {Object} new RequestWorker instance. This instance uses the new authorisation token passed to it.
		 */
		proto.reIssueRequest = function (newToken) {
			var newParams = newToken ? this._params + "&token=" + newToken : this._params;
			return new RequestWorker(this._useInlineToken, this._serviceName, this._methodName, this._url, this._requestContext.callbackObj, this._requestContext.successCallback, this._requestContext.failureCallback, newParams, true);
		};

		/**
		 * Aborts the underlying AJAX request, generally useful
		 * for instances where you no longer care about the results
		 * e.g. due to timeout.
		 * @method abortRequest
		 */
		proto.abortRequest = function () {
			if (this._req && this._req.abort) {
				this._req.abort();
			}
		};

		/**
		 * Calls the requests failure callback routine, generally used for
		 * cancelling requests that have been queued because of authorisation
		 * failure.
		 * @method failRequest
		 */
		proto.failRequest = function () {
			this._requestContext.failureCallback.apply(this._requestContext.callbackObj);
		};

		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};
		$N.services.sdp.RequestWorker = RequestWorker;
		return RequestWorker;
	}

);
