/**
 * This is a patch for adapted services that enables applications using MDS data to retrieve a list of purchased items
 * and query them using MDS-style ids (as opposed to SDP UIDs).
 * @class $N.services.sdp.stubs.allServicesPatch
 * @requires $N.services.sdp.stubs.allServices
 * @singleton
 */
/* global BookmarkService, OttSessionService, AcquiredContentListService, BillingService, FavouriteService, BlockingService */
define('jsfw/services/sdp/stubs/allServicesPatch',
	[
		'jsfw/services/sdp/stubs/allServices',
		'jsfw/Config'
	],
	function (allServices) {
		window.$N = $N || {};
		$N.services = $N.services || {};
		$N.services.sdp = $N.services.sdp || {};
		$N.services.sdp.stubs =  $N.services.sdp.stubs || {};
		$N.services.sdp.stubs.allServicesPatch = (function () {

			if (BookmarkService) {
				BookmarkService.prototype._isAdapted = true;
				BookmarkService.prototype.setBookmarkForContent = function (jsCaller, jsSuccessCallback, jsFailureCallback, id, type, pos, locale) {
					this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "setBookmarkForContent", id, type, pos, locale);
				};
				BookmarkService.prototype.getBookmarkForContent = function (jsCaller, jsSuccessCallback, jsFailureCallback, id, type, locale) {
					this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getBookmarkForContent", id, type, locale);
				};
			}

			if (OttSessionService) {
				OttSessionService.prototype._isAdapted = true;
			}

			if (AcquiredContentListService) {
				AcquiredContentListService.prototype._isAdapted = true;
				AcquiredContentListService.prototype.getByAccountUID = function (jsCaller, jsSuccessCallback, jsFailureCallback, accountUID, statusByDate, locale) {
					this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getByAccountUID", accountUID, statusByDate, locale);
				};
				AcquiredContentListService.prototype.getByAccountUIDAndItemType = function(jsCaller, jsSuccessCallback, jsFailureCallback, accountUID, statusByDate, itemType, locale) {
					this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getByAccountUIDAndItemType", accountUID, statusByDate, itemType, locale);
				};
			}

			if (BillingService) {
				BillingService.prototype._isAdapted = true;
			}

			if (FavouriteService) {
				FavouriteService.prototype._isAdapted = true;
			}

			if (BlockingService) {
				BlockingService.prototype._isAdapted = true;
			}
		}());
		return $N.services.sdp.stubs.allServicesPatch;
	}
);