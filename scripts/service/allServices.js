/**
 * Defines all SDP web services on the window object
 * @class $N.services.sdp.stubs.allServices
 * @requires $N.services.sdp.BaseService
 * @singleton
 */
define('jsfw/services/sdp/stubs/allServices', [
        'jsfw/services/sdp/BaseService'
    ],
    function(BaseService) {
        window.$N = $N || {};
        $N.services = $N.services || {};
        $N.services.sdp = $N.services.sdp || {};
        $N.services.sdp.stubs = $N.services.sdp.stubs || {};
        $N.services.sdp.stubs.allServices = (function() {

            function ALaCarteService() {}
            ALaCarteService.prototype = new BaseService();
            ALaCarteService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "aLaCarteService"
            };
            ALaCarteService.prototype.getAlaCarteProductList = function(b, d, c, e, f, a) {
                this.invokeMethod(b, d, c, "getAlaCarteProductList", e, f, a)
            };
            ALaCarteService.prototype.getProductListByChannel = function(b, d, c, e, g, f, a) {
                this.invokeMethod(b, d, c, "getProductListByChannel", e, g, f, a)
            };
            ALaCarteService.prototype.getPagedAlaCarteProductList = function(c, f, d, g, h, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAlaCarteProductList", g, h, b, a, e)
            };
            ALaCarteService.prototype.getChannelListByProduct = function(b, e, d, c, f, a) {
                this.invokeMethod(b, e, d, "getChannelListByProduct", c, f, a)
            };
            ALaCarteService.prototype.getPagedChannelListByProduct = function(c, g, e, d, h, b, a, f) {
                this.invokeMethod(c, g, e, "getPagedChannelListByProduct", d, h, b, a, f)
            };
            ALaCarteService.prototype.subscribeToAlaCarteProduct = function(a, d, c, b, f, h, g, e) {
                this.invokeMethod(a, d, c, "subscribeToAlaCarteProduct", b, f, h, g, e)
            };
            ALaCarteService.prototype.unSubscribeAlaCarteProduct = function(a, d, c, b, f, h, g, e) {
                this.invokeMethod(a, d, c, "unSubscribeAlaCarteProduct", b, f, h, g, e)
            };
            ALaCarteService.prototype.getPagedProductListByChannel = function(g, e, d, b, f, a, h, i, c) {
                this.invokeMethod(g, e, d, "getPagedProductListByChannel", b, f, a, h, i, c)
            };

            function AccessPointService() {}
            AccessPointService.prototype = new BaseService();
            AccessPointService.prototype.init = function() {
                this._serviceName = "accessPointService"
            };
            AccessPointService.prototype.getAllAccessPoints = function(a, c, b) {
                this.invokeMethod(a, c, b, "getAllAccessPoints")
            };
            AccessPointService.prototype.getDeviceGroups = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getDeviceGroups", b)
            };
            AccessPointService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function AccountAggregateService() {}
            AccountAggregateService.prototype = new BaseService();
            AccountAggregateService.prototype.init = function() {
                this._serviceName = "accountAggregateService"
            };

            function AccountService() {}
            AccountService.prototype = new BaseService();
            AccountService.prototype.init = function() {
                this._serviceName = "accountService"
            };
            AccountService.prototype.getAccByUserUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAccByUserUID", d)
            };
            AccountService.prototype.getByAccountNumber = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByAccountNumber", d)
            };
            AccountService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            AccountService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function AcquiredContentListService() {}
            AcquiredContentListService.prototype = new BaseService();
            AcquiredContentListService.prototype.init = function() {
                this._serviceName = "acquiredContentListService"
            };
            AcquiredContentListService.prototype.getByAccountUID = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "getByAccountUID", c, e)
            };
            AcquiredContentListService.prototype.getByAccountUIDWithDate = function(a, d, b, e, c, f) {
                this.invokeMethod(a, d, b, "getByAccountUIDWithDate", e, c, f)
            };
            AcquiredContentListService.prototype.getByAccountUIDWithDateAndStatus = function(a, e, c, f, d, g, b) {
                this.invokeMethod(a, e, c, "getByAccountUIDWithDateAndStatus", f, d, g, b)
            };
            AcquiredContentListService.prototype.getByUserUID = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getByUserUID", e, d)
            };
            AcquiredContentListService.prototype.getByUserUIDWithDate = function(a, c, b, d, f, e) {
                this.invokeMethod(a, c, b, "getByUserUIDWithDate", d, f, e)
            };
            AcquiredContentListService.prototype.getByAccountUIDAndItemType = function(a, d, b, c, e, f) {
                this.invokeMethod(a, d, b, "getByAccountUIDAndItemType", c, e, f)
            };
            AcquiredContentListService.prototype.getByUserUIDAndItemType = function(a, c, b, f, d, e) {
                this.invokeMethod(a, c, b, "getByUserUIDAndItemType", f, d, e)
            };
            AcquiredContentListService.prototype.getByAccountUIDAndItemTypeWithDate = function(a, d, b, e, c, f, g) {
                this.invokeMethod(a, d, b, "getByAccountUIDAndItemTypeWithDate", e, c, f, g)
            };
            AcquiredContentListService.prototype.getByUserUIDAndItemTypeWithDate = function(a, c, b, d, g, e, f) {
                this.invokeMethod(a, c, b, "getByUserUIDAndItemTypeWithDate", d, g, e, f)
            };
            AcquiredContentListService.prototype.getByItemAndAccountUID = function(a, e, c, d, f, b, g) {
                this.invokeMethod(a, e, c, "getByItemAndAccountUID", d, f, b, g)
            };
            AcquiredContentListService.prototype.getByItemAndAccountUIDSmartCard = function(a, f, c, d, g, b, h, e) {
                this.invokeMethod(a, f, c, "getByItemAndAccountUIDSmartCard", d, g, b, h, e)
            };
            AcquiredContentListService.prototype.getByItemAndAccountUIDWithDate = function(a, f, c, d, g, b, h, e) {
                this.invokeMethod(a, f, c, "getByItemAndAccountUIDWithDate", d, g, b, h, e)
            };
            AcquiredContentListService.prototype.getByItemAndAccountUIDWithDateSmartCard = function(h, f, e, c, a, i, d, b, g) {
                this.invokeMethod(h, f, e, "getByItemAndAccountUIDWithDateSmartCard", c, a, i, d, b, g)
            };
            AcquiredContentListService.prototype.getValidAClByItemAndAccountUID = function(a, f, c, d, g, b, h, e) {
                this.invokeMethod(a, f, c, "getValidAClByItemAndAccountUID", d, g, b, h, e)
            };
            AcquiredContentListService.prototype.getBySmartcard = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getBySmartcard", d, e)
            };
            AcquiredContentListService.prototype.getByItemAndSmartcard = function(a, c, b, d, g, f, e) {
                this.invokeMethod(a, c, b, "getByItemAndSmartcard", d, g, f, e)
            };
            AcquiredContentListService.prototype.getByItemAndSmartcardWithDate = function(a, e, c, g, f, b, h, d) {
                this.invokeMethod(a, e, c, "getByItemAndSmartcardWithDate", g, f, b, h, d)
            };
            AcquiredContentListService.prototype.getByItemTypeAndSmartcardValidForDates = function(g, e, d, i, h, f, c, a, b) {
                this.invokeMethod(g, e, d, "getByItemTypeAndSmartcardValidForDates", i, h, f, c, a, b)
            };
            AcquiredContentListService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            AcquiredContentListService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function AdLogService() {}
            AdLogService.prototype = new BaseService();
            AdLogService.prototype.init = function() {
                this._serviceName = "adLogService"
            };
            AdLogService.prototype.createAdAdvertLog = function(a, d, c, g, e, f, b, h) {
                this.invokeMethod(a, d, c, "createAdAdvertLog", g, e, f, b, h)
            };
            AdLogService.prototype.createAdAssetLog = function(g, d, c, l, b, e, f, k, a, j, i, h) {
                this.invokeMethod(g, d, c, "createAdAssetLog", l, b, e, f, k, a, j, i, h)
            };
            AdLogService.prototype.createAdPolLog = function(h, g, f, l, i, k, a, b, d, c, j, e) {
                this.invokeMethod(h, g, f, "createAdPolLog", l, i, k, a, b, d, c, j, e)
            };
            AdLogService.prototype.getLogsByAssetType = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLogsByAssetType", d)
            };
            AdLogService.prototype.getLogsByEntertainmentAssetUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLogsByEntertainmentAssetUID", d)
            };
            AdLogService.prototype.getLogsByAdvertAssetUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLogsByAdvertAssetUID", d)
            };
            AdLogService.prototype.getLogsByAccountUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLogsByAccountUID", d)
            };
            AdLogService.prototype.getLogsByPolGrpUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getLogsByPolGrpUID", c)
            };
            AdLogService.prototype.getLogsByAccountAndAssetUID = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLogsByAccountAndAssetUID", e, d)
            };
            AdLogService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function AdManagementService() {}
            AdManagementService.prototype = new BaseService();
            AdManagementService.prototype.init = function() {
                this._serviceName = "adManagementService"
            };
            AdManagementService.prototype.addPreAdvertisement = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "addPreAdvertisement", e, d)
            };
            AdManagementService.prototype.addPostAdvertisement = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "addPostAdvertisement", e, d)
            };
            AdManagementService.prototype.addPreAndPostAdvertisements = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "addPreAndPostAdvertisements", f, e, d)
            };
            AdManagementService.prototype.addAnAdvertisement = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "addAnAdvertisement", f, e, d)
            };
            AdManagementService.prototype.addBulkAdvertisements = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "addBulkAdvertisements", c)
            };
            AdManagementService.prototype.deletePreAdvertisement = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "deletePreAdvertisement", e, d)
            };
            AdManagementService.prototype.deletePostAdvertisement = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "deletePostAdvertisement", e, d)
            };
            AdManagementService.prototype.deletePreAndPostAdvertisements = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "deletePreAndPostAdvertisements", f, e, d)
            };
            AdManagementService.prototype.deleteAnAdvertisement = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "deleteAnAdvertisement", f, e, d)
            };
            AdManagementService.prototype.deleteAdvertisements = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "deleteAdvertisements", d)
            };
            AdManagementService.prototype.deleteBulkAdvertisements = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "deleteBulkAdvertisements", c)
            };
            AdManagementService.prototype.getCurrentPreAdvertisement = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getCurrentPreAdvertisement", d)
            };
            AdManagementService.prototype.getCurrentPostAdvertisement = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getCurrentPostAdvertisement", d)
            };
            AdManagementService.prototype.getPreAdvertisementsByDate = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "getPreAdvertisementsByDate", f, e, d)
            };
            AdManagementService.prototype.getPostAdvertisementsByDate = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "getPostAdvertisementsByDate", f, e, d)
            };
            AdManagementService.prototype.getPreAdvertisements = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getPreAdvertisements", d)
            };
            AdManagementService.prototype.getPostAdvertisements = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getPostAdvertisements", d)
            };

            function AdMetadataService() {}
            AdMetadataService.prototype = new BaseService();
            AdMetadataService.prototype.init = function() {
                this._serviceName = "adMetadataService"
            };
            AdMetadataService.prototype.create = function(f, e, d, b, i, g, h, c, a) {
                this.invokeMethod(f, e, d, "create", b, i, g, h, c, a)
            };
            AdMetadataService.prototype.update = function(h, f, d, g, b, k, i, j, c, a, e) {
                this.invokeMethod(h, f, d, "update", g, b, k, i, j, c, a, e)
            };
            AdMetadataService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            AdMetadataService.prototype.getMetPlgList = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getMetPlgList", e, a)
            };
            AdMetadataService.prototype.addPolicyGroup = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "addPolicyGroup", e, d)
            };
            AdMetadataService.prototype.removePolicyGroup = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "removePolicyGroup", e, d)
            };
            AdMetadataService.prototype.getByPolicyGroupUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByPolicyGroupUID", e, a)
            };
            AdMetadataService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function AdvertDecisionService() {}
            AdvertDecisionService.prototype = new BaseService();
            AdvertDecisionService.prototype.init = function() {
                this._serviceName = "advertDecisionService"
            };

            function AdvertMaintenanceService() {}
            AdvertMaintenanceService.prototype = new BaseService();
            AdvertMaintenanceService.prototype.init = function() {
                this._serviceName = "advertMaintenanceService"
            };
            AdvertMaintenanceService.prototype.associateAdvertToTargetArea = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "associateAdvertToTargetArea", e, c)
            };
            AdvertMaintenanceService.prototype.getAdvertsByTargetArea = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getAdvertsByTargetArea", e, a)
            };
            AdvertMaintenanceService.prototype.disassociateAdvertAndTargetArea = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "disassociateAdvertAndTargetArea", e, c)
            };

            function AlaCarteValidationService() {}
            AlaCarteValidationService.prototype = new BaseService();
            AlaCarteValidationService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "alaCarteValidationService"
            };

            function AladdinSmsGwCasIntegrationFactoryService() {}
            AladdinSmsGwCasIntegrationFactoryService.prototype = new BaseService();
            AladdinSmsGwCasIntegrationFactoryService.prototype.init = function() {
                this._serviceName = "aladdinSmsGwCasIntegrationFactoryService"
            };

            function ApplicationServerTelemetryService() {}
            ApplicationServerTelemetryService.prototype = new BaseService();
            ApplicationServerTelemetryService.prototype.init = function() {
                this._serviceName = "applicationServerTelemetryService"
            };
            ApplicationServerTelemetryService.prototype.getSystemList = function(a, c, b) {
                this.invokeMethod(a, c, b, "getSystemList")
            };
            ApplicationServerTelemetryService.prototype.getRAGStatusList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getRAGStatusList", a)
            };
            ApplicationServerTelemetryService.prototype.getRAGStatus = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getRAGStatus", d)
            };
            ApplicationServerTelemetryService.prototype.getTelemetry = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getTelemetry", d)
            };

            function AssetGroupService() {}
            AssetGroupService.prototype = new BaseService();
            AssetGroupService.prototype.init = function() {
                this._serviceName = "assetGroupService"
            };
            AssetGroupService.prototype.create = function(q, y, z, C, u, s, v, n, j, e, o, h, B, f, a, m, t, g, b, i, x, r, k, l, A, d, p, c, w) {
                this.invokeMethod(q, y, z, "create", C, u, s, v, n, j, e, o, h, B, f, a, m, t, g, b, i, x, r, k, l, A, d, p, c, w)
            };
            AssetGroupService.prototype.update = function(p, x, y, j, B, t, r, u, m, n, g, A, e, a, l, s, f, b, h, w, q, i, k, z, d, o, c, v) {
                this.invokeMethod(p, x, y, "update", j, B, t, r, u, m, n, g, A, e, a, l, s, f, b, h, w, q, i, k, z, d, o, c, v)
            };
            AssetGroupService.prototype.getByOriginAnyServiceProvider = function(b, e, c, d, f, a) {
                this.invokeMethod(b, e, c, "getByOriginAnyServiceProvider", d, f, a)
            };
            AssetGroupService.prototype.getList = function(b, f, c, a, e, d) {
                this.invokeMethod(b, f, c, "getList", a, e, d)
            };
            AssetGroupService.prototype.getAvailableAssetGroupListCount = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getAvailableAssetGroupListCount", a)
            };
            AssetGroupService.prototype.getAssets = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAssets", d)
            };
            AssetGroupService.prototype.getAssetGroupsByScheduleUID = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getAssetGroupsByScheduleUID", b, a)
            };
            AssetGroupService.prototype.getPagedList = function(c, f, d, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedList", b, a, e)
            };
            AssetGroupService.prototype.getPagedAssets = function(b, e, c, f, a, d) {
                this.invokeMethod(b, e, c, "getPagedAssets", f, a, d)
            };
            AssetGroupService.prototype.getPagedAssetGroupsByCatalogueUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAssetGroupsByCatalogueUID", g, b, a, e)
            };
            AssetGroupService.prototype.getPagedAssetGroupsByAssetUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAssetGroupsByAssetUID", g, b, a, e)
            };
            AssetGroupService.prototype.getPagedAssetGroupsByScheduleUID = function(d, g, e, c, b, a, f) {
                this.invokeMethod(d, g, e, "getPagedAssetGroupsByScheduleUID", c, b, a, f)
            };
            AssetGroupService.prototype.getPagedAssetGroupsByCODCategoryUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAssetGroupsByCODCategoryUID", g, b, a, e)
            };
            AssetGroupService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function AssetSearchService() {}
            AssetSearchService.prototype = new BaseService();
            AssetSearchService.prototype.init = function() {
                this._serviceName = "assetSearchService"
            };
            AssetSearchService.prototype.searchByTitle = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "searchByTitle", e, a)
            };
            AssetSearchService.prototype.searchCataloguedByTitle = function(c, e, d, f, b, a) {
                this.invokeMethod(c, e, d, "searchCataloguedByTitle", f, b, a)
            };

            function AssetService() {}
            AssetService.prototype = new BaseService();
            AssetService.prototype.init = function() {
                this._serviceName = "assetService"
            };
            AssetService.prototype.create = function(h, b, p, z, q, H, y, F, n, v, u, B, f, w, s, d, M, i, c, E, L, r, k, t, g, A, a, K, D, e, x, C, N, o, m, j, J, l, G, I) {
                this.invokeMethod(h, b, p, "create", z, q, H, y, F, n, v, u, B, f, w, s, d, M, i, c, E, L, r, k, t, g, A, a, K, D, e, x, C, N, o, m, j, J, l, G, I)
            };
            AssetService.prototype.update = function(h, b, p, e, F, y, D, n, v, u, A, f, w, s, d, K, i, c, C, J, r, k, t, g, z, a, I, x, B, L, o, m, j, H, q, l, E, G) {
                this.invokeMethod(h, b, p, "update", e, F, y, D, n, v, u, A, f, w, s, d, K, i, c, C, J, r, k, t, g, z, a, I, x, B, L, o, m, j, H, q, l, E, G)
            };
            AssetService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            AssetService.prototype.addAudioPid = function(a, e, c, g, b, f, d) {
                this.invokeMethod(a, e, c, "addAudioPid", g, b, f, d)
            };
            AssetService.prototype.modifyAudioPid = function(a, f, d, h, c, g, b, e) {
                this.invokeMethod(a, f, d, "modifyAudioPid", h, c, g, b, e)
            };
            AssetService.prototype.removeAudioPid = function(a, d, c, f, e, b) {
                this.invokeMethod(a, d, c, "removeAudioPid", f, e, b)
            };
            AssetService.prototype.getByOriginID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByOriginID", e, a)
            };
            AssetService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            AssetService.prototype.getAvailableList = function(c, g, d, b, f, e, a) {
                this.invokeMethod(c, g, d, "getAvailableList", b, f, e, a)
            };
            AssetService.prototype.getAssetsByAssetGroupUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getAssetsByAssetGroupUID", e, a)
            };
            AssetService.prototype.getAssetsByScheduleUID = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getAssetsByScheduleUID", b, a)
            };
            AssetService.prototype.getAssetAudioPids = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAssetAudioPids", d)
            };
            AssetService.prototype.getPagedAssetsByOriginID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAssetsByOriginID", g, b, a, e)
            };
            AssetService.prototype.getPagedList = function(c, f, d, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedList", b, a, e)
            };
            AssetService.prototype.getAvailablePagedAssetList = function(d, g, e, c, b, f, a) {
                this.invokeMethod(d, g, e, "getAvailablePagedAssetList", c, b, f, a)
            };
            AssetService.prototype.getAvailableAssetListCount = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getAvailableAssetListCount", b, a)
            };
            AssetService.prototype.getPagedAssetsByCatalogueUID = function(d, g, e, c, b, a, f) {
                this.invokeMethod(d, g, e, "getPagedAssetsByCatalogueUID", c, b, a, f)
            };
            AssetService.prototype.getPagedAssetsByAssetGroupUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAssetsByAssetGroupUID", g, b, a, e)
            };
            AssetService.prototype.getPagedAssetsByScheduleUID = function(d, g, e, c, b, a, f) {
                this.invokeMethod(d, g, e, "getPagedAssetsByScheduleUID", c, b, a, f)
            };
            AssetService.prototype.getPagedAssetsByCODCategoryUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAssetsByCODCategoryUID", g, b, a, e)
            };
            AssetService.prototype.getAssetListByTrailerUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getAssetListByTrailerUID", e, a)
            };
            AssetService.prototype.getTrailersForAssetUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getTrailersForAssetUID", c)
            };
            AssetService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function AuthnEchoService() {}
            AuthnEchoService.prototype = new BaseService();
            AuthnEchoService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "authnEchoService"
            };
            AuthnEchoService.prototype.echo = function(a, c, b) {
                this.invokeMethod(a, c, b, "echo")
            };

            function BTVService() {}
            BTVService.prototype = new BaseService();
            BTVService.prototype.init = function() {
                this._serviceName = "BTVService"
            };
            BTVService.prototype.getChannelsByCatAndPkgUID = function(b, d, c, f, g, a, e) {
                this.invokeMethod(b, d, c, "getChannelsByCatAndPkgUID", f, g, a, e)
            };
            BTVService.prototype.getPagedChannelsByCatAndPkgUID = function(f, e, d, h, c, i, g, a, b) {
                this.invokeMethod(f, e, d, "getPagedChannelsByCatAndPkgUID", h, c, i, g, a, b)
            };
            BTVService.prototype.getDetEvtsByPkgUIDIndexedByChannel = function(c, f, d, h, e, b, a, g) {
                this.invokeMethod(c, f, d, "getDetEvtsByPkgUIDIndexedByChannel", h, e, b, a, g)
            };
            BTVService.prototype.getPagedDetEvtsByPkgUIDIndexedByChannel = function(f, e, d, h, j, c, i, g, a, b) {
                this.invokeMethod(f, e, d, "getPagedDetEvtsByPkgUIDIndexedByChannel", h, j, c, i, g, a, b)
            };
            BTVService.prototype.getDetEvtsByPkgPatternIndexedByChannel = function(c, f, d, h, e, b, a, g) {
                this.invokeMethod(c, f, d, "getDetEvtsByPkgPatternIndexedByChannel", h, e, b, a, g)
            };
            BTVService.prototype.getPagedDetEvtsByPkgPatternIndexedByChannel = function(g, f, e, c, j, d, i, h, a, b) {
                this.invokeMethod(g, f, e, "getPagedDetEvtsByPkgPatternIndexedByChannel", c, j, d, i, h, a, b)
            };
            BTVService.prototype.getDetEvtsByCatAndPkgUIDIndexedByChannel = function(e, d, c, g, b, i, a, h, f) {
                this.invokeMethod(e, d, c, "getDetEvtsByCatAndPkgUIDIndexedByChannel", g, b, i, a, h, f)
            };
            BTVService.prototype.getPagedDetEvtsByCatAndPkgUIDIndexedByChannel = function(g, f, e, i, d, k, c, j, h, a, b) {
                this.invokeMethod(g, f, e, "getPagedDetEvtsByCatAndPkgUIDIndexedByChannel", i, d, k, c, j, h, a, b)
            };
            BTVService.prototype.getDetEvtsByChannelList = function(d, g, e, c, f, b, a, h) {
                this.invokeMethod(d, g, e, "getDetEvtsByChannelList", c, f, b, a, h)
            };
            BTVService.prototype.getPagedDetEvtsByChannelList = function(g, e, d, f, j, c, i, h, a, b) {
                this.invokeMethod(g, e, d, "getPagedDetEvtsByChannelList", f, j, c, i, h, a, b)
            };
            BTVService.prototype.getChannelsByPkgPattern = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getChannelsByPkgPattern", e, a)
            };
            BTVService.prototype.getPagedChannelsByPkgPattern = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannelsByPkgPattern", g, b, a, e)
            };
            BTVService.prototype.getChannelsByPkgPatternAndCategory = function(b, e, c, f, d, a) {
                this.invokeMethod(b, e, c, "getChannelsByPkgPatternAndCategory", f, d, a)
            };
            BTVService.prototype.getPagedChannelsByPkgPatternAndCategory = function(c, g, d, h, f, b, a, e) {
                this.invokeMethod(c, g, d, "getPagedChannelsByPkgPatternAndCategory", h, f, b, a, e)
            };
            BTVService.prototype.getDetEventsByChannelUIDTimeAndType = function(b, e, c, h, f, d, g, a) {
                this.invokeMethod(b, e, c, "getDetEventsByChannelUIDTimeAndType", h, f, d, g, a)
            };
            BTVService.prototype.getSOCUEventsByIdentifierTimeAndType = function(b, e, c, h, f, d, g, a) {
                this.invokeMethod(b, e, c, "getSOCUEventsByIdentifierTimeAndType", h, f, d, g, a)
            };
            BTVService.prototype.getPackagesByAccountUID = function(a, e, b, c, d) {
                this.invokeMethod(a, e, b, "getPackagesByAccountUID", c, d)
            };
            BTVService.prototype.subscribeToChannel = function(f, d, c, b, a, h, i, e, g) {
                this.invokeMethod(f, d, c, "subscribeToChannel", b, a, h, i, e, g)
            };
            BTVService.prototype.unsubscribeChannel = function(b, f, c, d, g, e, a) {
                this.invokeMethod(b, f, c, "unsubscribeChannel", d, g, e, a)
            };
            BTVService.prototype.subscribeToPolicyGroup = function(b, f, d, g, h, c, e, a) {
                this.invokeMethod(b, f, d, "subscribeToPolicyGroup", g, h, c, e, a)
            };
            BTVService.prototype.subscribeToEvent = function(d, b, a, g, e, j, i, f, c, h) {
                this.invokeMethod(d, b, a, "subscribeToEvent", g, e, j, i, f, c, h)
            };
            BTVService.prototype.subscribeToPackage = function(f, d, c, b, a, h, i, e, g) {
                this.invokeMethod(f, d, c, "subscribeToPackage", b, a, h, i, e, g)
            };
            BTVService.prototype.unsubscribePackage = function(b, f, c, d, g, e, a) {
                this.invokeMethod(b, f, c, "unsubscribePackage", d, g, e, a)
            };
            BTVService.prototype.getSPChannelsByPkgUID = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "getSPChannelsByPkgUID", f, a, e)
            };
            BTVService.prototype.getSPChannelsByChannelUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getSPChannelsByChannelUID", d)
            };
            BTVService.prototype.getSPChannelList = function(a, c, b) {
                this.invokeMethod(a, c, b, "getSPChannelList")
            };
            BTVService.prototype.getSPChannelsByPkgPattern = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getSPChannelsByPkgPattern", e, a)
            };
            BTVService.prototype.getPagedSPChannelsByPkgPattern = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedSPChannelsByPkgPattern", g, b, a, e)
            };
            BTVService.prototype.getSPChannelsByPkgPatternAndCategory = function(b, e, c, f, d, a) {
                this.invokeMethod(b, e, c, "getSPChannelsByPkgPatternAndCategory", f, d, a)
            };
            BTVService.prototype.getPagedSPChannelsByPkgPatternAndCategory = function(c, g, d, h, f, b, a, e) {
                this.invokeMethod(c, g, d, "getPagedSPChannelsByPkgPatternAndCategory", h, f, b, a, e)
            };
            BTVService.prototype.getPagedDetEventsByChannelUIDTimeAndType = function(g, e, d, c, i, f, h, j, a, b) {
                this.invokeMethod(g, e, d, "getPagedDetEventsByChannelUIDTimeAndType", c, i, f, h, j, a, b)
            };
            BTVService.prototype.getPagedSOCUEventsByIdentifierTimeAndType = function(f, d, c, j, h, e, g, i, a, b) {
                this.invokeMethod(f, d, c, "getPagedSOCUEventsByIdentifierTimeAndType", j, h, e, g, i, a, b)
            };

            function BillingService() {}
            BillingService.prototype = new BaseService();
            BillingService.prototype.init = function() {
                this._serviceName = "billingService"
            };
            BillingService.prototype.getByAccountUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByAccountUID", c)
            };
            BillingService.prototype.getByAccountUIDAndUser = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "getByAccountUIDAndUser", c, e)
            };
            BillingService.prototype.getByAccountUIDAndRange = function(b, e, c, d, a, f) {
                this.invokeMethod(b, e, c, "getByAccountUIDAndRange", d, a, f)
            };
            BillingService.prototype.getByAccountUIDAndStatus = function(a, e, c, d, b) {
                this.invokeMethod(a, e, c, "getByAccountUIDAndStatus", d, b)
            };
            BillingService.prototype.getByAccountUIDStatusAndRange = function(b, f, d, e, c, a, g) {
                this.invokeMethod(b, f, d, "getByAccountUIDStatusAndRange", e, c, a, g)
            };
            BillingService.prototype.getMoneySpentByAccountAndDateAndBillType = function(b, f, d, e, a, g, c) {
                this.invokeMethod(b, f, d, "getMoneySpentByAccountAndDateAndBillType", e, a, g, c)
            };
            BillingService.prototype.getMoneySpentInLastNDaysByAccountAndBillType = function(a, f, c, d, e, b) {
                this.invokeMethod(a, f, c, "getMoneySpentInLastNDaysByAccountAndBillType", d, e, b)
            };
            BillingService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            BillingService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function BlockingService() {}
            BlockingService.prototype = new BaseService();
            BlockingService.prototype.init = function() {
                this._serviceName = "blockingService"
            };
            BlockingService.prototype.create = function(l, i, g, e, c, k, f, h, b, j, a, d) {
                this.invokeMethod(l, i, g, "create", e, c, k, f, h, b, j, a, d)
            };
            BlockingService.prototype.update = function(l, h, e, j, c, b, k, d, g, a, i, f) {
                this.invokeMethod(l, h, e, "update", j, c, b, k, d, g, a, i, f)
            };
            BlockingService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            BlockingService.prototype.getBlockedStatusForItem = function(b, e, c, d, g, a, f) {
                this.invokeMethod(b, e, c, "getBlockedStatusForItem", d, g, a, f)
            };
            BlockingService.prototype.getByOriginUID = function(a, e, b, d, c, f) {
                this.invokeMethod(a, e, b, "getByOriginUID", d, c, f)
            };
            BlockingService.prototype.getList = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "getList", c, e)
            };
            BlockingService.prototype.getBlockedItemList = function(a, d, b, c, f, e) {
                this.invokeMethod(a, d, b, "getBlockedItemList", c, f, e)
            };
            BlockingService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            BlockingService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function BocAssetService() {}
            BocAssetService.prototype = new BaseService();
            BocAssetService.prototype.init = function() {
                this._serviceName = "bocAssetService"
            };

            function BocContentTypeService() {}
            BocContentTypeService.prototype = new BaseService();
            BocContentTypeService.prototype.init = function() {
                this._serviceName = "bocContentTypeService"
            };
            BocContentTypeService.prototype.getByContentId = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByContentId", d)
            };

            function BocLicenseCRUDService() {}
            BocLicenseCRUDService.prototype = new BaseService();
            BocLicenseCRUDService.prototype.init = function() {
                this._serviceName = "bocLicenseCRUDService"
            };
            BocLicenseCRUDService.prototype.getByUID = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getByUID", b)
            };
            BocLicenseCRUDService.prototype.getByLicenseReference = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByLicenseReference", c)
            };
            BocLicenseCRUDService.prototype.getByCasnAndContentId = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getByCasnAndContentId", d, e)
            };
            BocLicenseCRUDService.prototype.getByCasnAndContentIdWithoutSP = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getByCasnAndContentIdWithoutSP", d, e)
            };
            BocLicenseCRUDService.prototype.getByCasnAndStatus = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "getByCasnAndStatus", e, b)
            };
            BocLicenseCRUDService.prototype.getByNuidAndContentId = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getByNuidAndContentId", d, e)
            };
            BocLicenseCRUDService.prototype.getByNuidAndContentIdWithoutSP = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getByNuidAndContentIdWithoutSP", d, e)
            };
            BocLicenseCRUDService.prototype.getByMediaPlayerIdAndContentId = function(b, d, c, a, e) {
                this.invokeMethod(b, d, c, "getByMediaPlayerIdAndContentId", a, e)
            };
            BocLicenseCRUDService.prototype.getByMediaPlayerIdAndContentIdWithoutSP = function(b, d, c, a, e) {
                this.invokeMethod(b, d, c, "getByMediaPlayerIdAndContentIdWithoutSP", a, e)
            };
            BocLicenseCRUDService.prototype.getByNuidAndStatus = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "getByNuidAndStatus", e, b)
            };
            BocLicenseCRUDService.prototype.getByMediaPlayerIdAndStatus = function(b, e, d, a, c) {
                this.invokeMethod(b, e, d, "getByMediaPlayerIdAndStatus", a, c)
            };
            BocLicenseCRUDService.prototype.getByAccountNumberAndStatusForDates = function(b, e, d, g, c, a, f) {
                this.invokeMethod(b, e, d, "getByAccountNumberAndStatusForDates", g, c, a, f)
            };
            BocLicenseCRUDService.prototype.getByContentIdAndStatusForDates = function(b, e, d, g, c, a, f) {
                this.invokeMethod(b, e, d, "getByContentIdAndStatusForDates", g, c, a, f)
            };
            BocLicenseCRUDService.prototype.getByCasnAndStatusForDates = function(b, e, d, f, c, a, g) {
                this.invokeMethod(b, e, d, "getByCasnAndStatusForDates", f, c, a, g)
            };
            BocLicenseCRUDService.prototype.getByNuidAndStatusForDates = function(b, e, d, f, c, a, g) {
                this.invokeMethod(b, e, d, "getByNuidAndStatusForDates", f, c, a, g)
            };
            BocLicenseCRUDService.prototype.getByMediaPlayerIdAndStatusForDates = function(c, f, e, b, d, a, g) {
                this.invokeMethod(c, f, e, "getByMediaPlayerIdAndStatusForDates", b, d, a, g)
            };

            function BocLicenseProxyService() {}
            BocLicenseProxyService.prototype = new BaseService();
            BocLicenseProxyService.prototype.init = function() {
                this._serviceName = "bocLicenseProxyService"
            };

            function BocPurchaseService() {}
            BocPurchaseService.prototype = new BaseService();
            BocPurchaseService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "bocPurchaseService"
            };
            BocPurchaseService.prototype.purchasePolicy = function(a, c, b, d, e, f) {
                this.invokeMethod(a, c, b, "purchasePolicy", d, e, f)
            };
            BocPurchaseService.prototype.purchasePolicyAndGetLicense = function(a, c, b, d, e, f, g) {
                this.invokeMethod(a, c, b, "purchasePolicyAndGetLicense", d, e, f, g)
            };
            BocPurchaseService.prototype.getPaymentOptionsForAccount = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getPaymentOptionsForAccount", d, e)
            };
            BocPurchaseService.prototype.purchasePolicyAndPay = function(a, d, c, e, b, f, g) {
                this.invokeMethod(a, d, c, "purchasePolicyAndPay", e, b, f, g)
            };
            BocPurchaseService.prototype.purchasePolicyPayAndGetLicense = function(a, e, c, f, b, g, d, h) {
                this.invokeMethod(a, e, c, "purchasePolicyPayAndGetLicense", f, b, g, d, h)
            };
            BocPurchaseService.prototype.getExternalPaymentSignature = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getExternalPaymentSignature", d)
            };
            BocPurchaseService.prototype.purchasePolicyWithProofOfPayment = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "purchasePolicyWithProofOfPayment", d)
            };
            BocPurchaseService.prototype.acquireZeroPricedPolicy = function(a, d, c, e, b, f) {
                this.invokeMethod(a, d, c, "acquireZeroPricedPolicy", e, b, f)
            };

            function BookmarkService() {}
            BookmarkService.prototype = new BaseService();
            BookmarkService.prototype.init = function() {
                this._serviceName = "bookmarkService"
            };
            BookmarkService.prototype.deleteBookmarkByUid = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "deleteBookmarkByUid", d)
            };
            BookmarkService.prototype.setBookmarkForOrigin = function(jsCaller, jsSuccessCallback, jsFailureCallback, originUid, originKey, originContentType, contentTypeName, position) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "setBookmarkForOrigin", originUid, originKey, originContentType, contentTypeName, position)
            };
            BookmarkService.prototype.getBookmarkForOrigin = function(jsCaller, jsSuccessCallback, jsFailureCallback, originUid, originKey, originContentType, contentTypeName) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getBookmarkForOrigin", originUid, originKey, originContentType, contentTypeName)
            };
            BookmarkService.prototype.getBookmarkForContent = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getBookmarkForContent", e, d)
            };
            BookmarkService.prototype.setBookmarkForContent = function(b, d, c, f, e, a) {
                this.invokeMethod(b, d, c, "setBookmarkForContent", f, e, a)
            };
            BookmarkService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            BookmarkService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function BtvBrowsingService() {}
            BtvBrowsingService.prototype = new BaseService();
            BtvBrowsingService.prototype.init = function() {
                this._serviceName = "btvBrowsingService"
            };
            BtvBrowsingService.prototype.getChannels = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getChannels", d)
            };
            BtvBrowsingService.prototype.getChannelsCount = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getChannelsCount", d)
            };

            function BtvConaxAzmiLicenseService() {}
            BtvConaxAzmiLicenseService.prototype = new BaseService();
            BtvConaxAzmiLicenseService.prototype.init = function() {
                this._serviceName = "btvConaxAzmiLicenseService"
            };

            function BtvConaxOESLicenseService() {}
            BtvConaxOESLicenseService.prototype = new BaseService();
            BtvConaxOESLicenseService.prototype.init = function() {
                this._serviceName = "btvConaxOESLicenseService"
            };

            function BtvLicenseValidityService() {}
            BtvLicenseValidityService.prototype = new BaseService();
            BtvLicenseValidityService.prototype.init = function() {
                this._serviceName = "btvLicenseValidityService"
            };

            function BtvNagraDVSLicenseService() {}
            BtvNagraDVSLicenseService.prototype = new BaseService();
            BtvNagraDVSLicenseService.prototype.init = function() {
                this._serviceName = "btvNagraDVSLicenseService"
            };
            BtvNagraDVSLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            BtvNagraDVSLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            BtvNagraDVSLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            BtvNagraDVSLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            BtvNagraDVSLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function BtvViaccessLicenseService() {}
            BtvViaccessLicenseService.prototype = new BaseService();
            BtvViaccessLicenseService.prototype.init = function() {
                this._serviceName = "btvViaccessLicenseService"
            };

            function CDNService() {}
            CDNService.prototype = new BaseService();
            CDNService.prototype.init = function() {
                this._serviceName = "CDNService"
            };
            CDNService.prototype.getCdnUrl = function(i, f, d, j, b, h, g, e, a, c) {
                this.invokeMethod(i, f, d, "getCdnUrl", j, b, h, g, e, a, c)
            };
            CDNService.prototype.validateToken = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "validateToken", d)
            };

            function CODService() {}
            CODService.prototype = new BaseService();
            CODService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "CODService"
            };
            CODService.prototype.getCatalogueChildAssetGroupsNodes = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getCatalogueChildAssetGroupsNodes", e, a)
            };
            CODService.prototype.getCatalogueChildCatalogueNodes = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getCatalogueChildCatalogueNodes", e, a)
            };
            CODService.prototype.subscribeToAsset = function(f, d, b, i, g, h, c, a, e) {
                this.invokeMethod(f, d, b, "subscribeToAsset", i, g, h, c, a, e)
            };
            CODService.prototype.subscribeToAssetGroup = function(g, d, b, i, h, c, f, a, e) {
                this.invokeMethod(g, d, b, "subscribeToAssetGroup", i, h, c, f, a, e)
            };
            CODService.prototype.isSubscribed = function(e, b, a, i, d, g, f, c, h) {
                this.invokeMethod(e, b, a, "isSubscribed", i, d, g, f, c, h)
            };
            CODService.prototype.getSubscribedPolicyGroups = function(a, e, c, f, b, h, d, g) {
                this.invokeMethod(a, e, c, "getSubscribedPolicyGroups", f, b, h, d, g)
            };
            CODService.prototype.subscribeToPolicyGroup = function(a, e, c, b, g, f, h, d) {
                this.invokeMethod(a, e, c, "subscribeToPolicyGroup", b, g, f, h, d)
            };
            CODService.prototype.getCataloguesByAccountUID = function(a, e, b, c, d) {
                this.invokeMethod(a, e, b, "getCataloguesByAccountUID", c, d)
            };
            CODService.prototype.subscribeToCatalogue = function(g, e, c, i, h, b, d, a, f) {
                this.invokeMethod(g, e, c, "subscribeToCatalogue", i, h, b, d, a, f)
            };
            CODService.prototype.getPagedCatalogueChildAssetGroupsNodes = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedCatalogueChildAssetGroupsNodes", g, b, a, e)
            };
            CODService.prototype.getPagedCatalogueChildCatalogueNodes = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedCatalogueChildCatalogueNodes", g, b, a, e)
            };
            CODService.prototype.getSubscribedBaseCatalogues = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getSubscribedBaseCatalogues", a)
            };
            CODService.prototype.unsubscribePolicyGroup = function(a, e, c, b, f, d) {
                this.invokeMethod(a, e, c, "unsubscribePolicyGroup", b, f, d)
            };
            CODService.prototype.purchaseContentAndGetLicense = function(g, f, e, b, a, j, d, i, c, h) {
                this.invokeMethod(g, f, e, "purchaseContentAndGetLicense", b, a, j, d, i, c, h)
            };
            CODService.prototype.purchaseContentAndGetLicenseWithAdditionalInfo = function(h, g, f, b, a, l, e, j, d, i, k, c) {
                this.invokeMethod(h, g, f, "purchaseContentAndGetLicenseWithAdditionalInfo", b, a, l, e, j, d, i, k, c)
            };
            CODService.prototype.getPagedPolicyForCatAndAssetGroupAndAsset = function(i, g, f, e, h, j, d, k, a, b, c) {
                this.invokeMethod(i, g, f, "getPagedPolicyForCatAndAssetGroupAndAsset", e, h, j, d, k, a, b, c)
            };
            CODService.prototype.getAssetGroupAssetCountByCat = function(b, e, c, g, f, a, d) {
                this.invokeMethod(b, e, c, "getAssetGroupAssetCountByCat", g, f, a, d)
            };
            CODService.prototype.getAssetGroupCountByCatAndGenre = function(b, g, d, f, e, c, a) {
                this.invokeMethod(b, g, d, "getAssetGroupCountByCatAndGenre", f, e, c, a)
            };
            CODService.prototype.getPagedAssetGroupsByCatAndGenre = function(h, f, e, c, d, g, i, a, b) {
                this.invokeMethod(h, f, e, "getPagedAssetGroupsByCatAndGenre", c, d, g, i, a, b)
            };
            CODService.prototype.isSubscribedSpidKnown = function(f, b, a, j, e, h, g, d, i, c) {
                this.invokeMethod(f, b, a, "isSubscribedSpidKnown", j, e, h, g, d, i, c)
            };

            function CasConfigurationService() {}
            CasConfigurationService.prototype = new BaseService();
            CasConfigurationService.prototype.init = function() {
                this._serviceName = "casConfigurationService"
            };

            function CasInstanceService() {}
            CasInstanceService.prototype = new BaseService();
            CasInstanceService.prototype.init = function() {
                this._serviceName = "casInstanceService"
            };

            function CasIntegrationFactoryService() {}
            CasIntegrationFactoryService.prototype = new BaseService();
            CasIntegrationFactoryService.prototype.init = function() {
                this._serviceName = "casIntegrationFactoryService"
            };

            function CatalogueService() {}
            CatalogueService.prototype = new BaseService();
            CatalogueService.prototype.init = function() {
                this._serviceName = "catalogueService"
            };
            CatalogueService.prototype.getCatalogueTree = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "getCatalogueTree", e, b)
            };
            CatalogueService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            CatalogueService.prototype.getAllCatalogues = function(a, c, b) {
                this.invokeMethod(a, c, b, "getAllCatalogues")
            };
            CatalogueService.prototype.getByName = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByName", d, a)
            };
            CatalogueService.prototype.getBaseCataloguesByAccptUid = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getBaseCataloguesByAccptUid", d, a)
            };
            CatalogueService.prototype.getCataloguesByCatUidAndByAccptUid = function(c, f, d, b, e, a) {
                this.invokeMethod(c, f, d, "getCataloguesByCatUidAndByAccptUid", b, e, a)
            };
            CatalogueService.prototype.getCataloguesByScheduleUID = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getCataloguesByScheduleUID", b, a)
            };
            CatalogueService.prototype.getPagedCatalogueTree = function(b, f, d, g, c, a, e) {
                this.invokeMethod(b, f, d, "getPagedCatalogueTree", g, c, a, e)
            };
            CatalogueService.prototype.getPagedList = function(c, f, d, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedList", b, a, e)
            };
            CatalogueService.prototype.getPagedCatalogues = function(b, e, c, a, d) {
                this.invokeMethod(b, e, c, "getPagedCatalogues", a, d)
            };
            CatalogueService.prototype.getPagedCatsBySbscrProfUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedCatsBySbscrProfUID", g, b, a, e)
            };
            CatalogueService.prototype.getPagedCataloguesByCatalogueUid = function(d, g, e, c, b, a, f) {
                this.invokeMethod(d, g, e, "getPagedCataloguesByCatalogueUid", c, b, a, f)
            };
            CatalogueService.prototype.getPagedCataloguesByNodeUidAndType = function(c, g, e, h, d, b, a, f) {
                this.invokeMethod(c, g, e, "getPagedCataloguesByNodeUidAndType", h, d, b, a, f)
            };
            CatalogueService.prototype.getPagedCataloguesByScheduleUID = function(d, g, e, c, b, a, f) {
                this.invokeMethod(d, g, e, "getPagedCataloguesByScheduleUID", c, b, a, f)
            };
            CatalogueService.prototype.getRootCatalogue = function(a, c, b) {
                this.invokeMethod(a, c, b, "getRootCatalogue")
            };
            CatalogueService.prototype.getCataloguesByAccpt = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getCataloguesByAccpt", c)
            };
            CatalogueService.prototype.getParentCatalogue = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getParentCatalogue", e, c)
            };
            CatalogueService.prototype.getPossibleChildrenCatalogueList = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getPossibleChildrenCatalogueList", e, a)
            };
            CatalogueService.prototype.getSubscribedBaseCatalogues = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getSubscribedBaseCatalogues", c)
            };
            CatalogueService.prototype.getPagedSubscribedBaseCatalogues = function(a, f, b, e, d, c) {
                this.invokeMethod(a, f, b, "getPagedSubscribedBaseCatalogues", e, d, c)
            };
            CatalogueService.prototype.getProfIdForCatalogue = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getProfIdForCatalogue", d)
            };
            CatalogueService.prototype.getAssetCountByCatalogueUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getAssetCountByCatalogueUID", e, a)
            };
            CatalogueService.prototype.getBaseChildCataloguesByAccptUidAndName = function(b, e, c, d, h, a, f, g) {
                this.invokeMethod(b, e, c, "getBaseChildCataloguesByAccptUidAndName", d, h, a, f, g)
            };
            CatalogueService.prototype.getBaseChildCataloguesByAccptUidAndNameCount = function(b, e, c, d, f, a) {
                this.invokeMethod(b, e, c, "getBaseChildCataloguesByAccptUidAndNameCount", d, f, a)
            };
            CatalogueService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function CategoryService() {}
            CategoryService.prototype = new BaseService();
            CategoryService.prototype.init = function() {
                this._serviceName = "categoryService"
            };
            CategoryService.prototype.create = function(f, e, d, a, i, g, c, b, h) {
                this.invokeMethod(f, e, d, "create", a, i, g, c, b, h)
            };
            CategoryService.prototype.update = function(a, c, b, d, f, e) {
                this.invokeMethod(a, c, b, "update", d, f, e)
            };
            CategoryService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            CategoryService.prototype.addChannel = function(a, d, c, b, e) {
                this.invokeMethod(a, d, c, "addChannel", b, e)
            };
            CategoryService.prototype.removeChannel = function(a, d, c, b, e) {
                this.invokeMethod(a, d, c, "removeChannel", b, e)
            };
            CategoryService.prototype.addMultiLanguage = function(b, e, c, f, d, g, a) {
                this.invokeMethod(b, e, c, "addMultiLanguage", f, d, g, a)
            };
            CategoryService.prototype.modifyMultiLanguage = function(b, f, d, g, e, h, a, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", g, e, h, a, c)
            };
            CategoryService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            CategoryService.prototype.getAllCategories = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getAllCategories", a)
            };
            CategoryService.prototype.getByOriginUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByOriginUID", e, a)
            };
            CategoryService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function CcaCcomService() {}
            CcaCcomService.prototype = new BaseService();
            CcaCcomService.prototype.init = function() {
                this._serviceName = "ccaCcomService"
            };

            function CdnTokenService() {}
            CdnTokenService.prototype = new BaseService();
            CdnTokenService.prototype.init = function() {
                this._serviceName = "cdnTokenService"
            };
            CdnTokenService.prototype.create = function(j, g, f, b, d, i, h, k, e, c, a) {
                this.invokeMethod(j, g, f, "create", b, d, i, h, k, e, c, a)
            };
            CdnTokenService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            CdnTokenService.prototype.update = function(h, e, d, c, a, b, g, f, i) {
                this.invokeMethod(h, e, d, "update", c, a, b, g, f, i)
            };
            CdnTokenService.prototype.getAccountUIDByGeneratedURL = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAccountUIDByGeneratedURL", d)
            };
            CdnTokenService.prototype.getDeviceUIDByGeneratedURL = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getDeviceUIDByGeneratedURL", d)
            };
            CdnTokenService.prototype.getSpidByGeneratedURL = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getSpidByGeneratedURL", d)
            };
            CdnTokenService.prototype.getOriginalURLByGeneratedURL = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getOriginalURLByGeneratedURL", d)
            };
            CdnTokenService.prototype.incrementSuccessCountOnGeneratedURL = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "incrementSuccessCountOnGeneratedURL", d)
            };
            CdnTokenService.prototype.incrementFailureCountOnGeneratedURL = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "incrementFailureCountOnGeneratedURL", d)
            };
            CdnTokenService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ChallengeAggregateService() {}
            ChallengeAggregateService.prototype = new BaseService();
            ChallengeAggregateService.prototype.init = function() {
                this._serviceName = "challengeAggregateService"
            };
            ChallengeAggregateService.prototype.acquireSecureChallenge = function(a, c, b) {
                this.invokeMethod(a, c, b, "acquireSecureChallenge")
            };
            ChallengeAggregateService.prototype.acquireSecureChallengeWithAdditionalInfo = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "acquireSecureChallengeWithAdditionalInfo", d, e)
            };
            ChallengeAggregateService.prototype.verifySecureChallengeWithContext = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "verifySecureChallengeWithContext", d)
            };

            function ChallengeService() {}
            ChallengeService.prototype = new BaseService();
            ChallengeService.prototype.init = function() {
                this._serviceName = "challengeService"
            };
            ChallengeService.prototype.del = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "delete", c)
            };
            ChallengeService.prototype.getByChallengeID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByChallengeID", d)
            };
            ChallengeService.prototype.getByDeviceUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByDeviceUID", d)
            };
            ChallengeService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ChannelService() {}
            ChannelService.prototype = new BaseService();
            ChannelService.prototype.init = function() {
                this._serviceName = "channelService"
            };
            ChannelService.prototype.getAllChannelsByLocale = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getAllChannelsByLocale", a)
            };
            ChannelService.prototype.getAllChannels = function(b, d, c, a, e) {
                this.invokeMethod(b, d, c, "getAllChannels", a, e)
            };
            ChannelService.prototype.getAllChannelsAllLocales = function(a, c, b) {
                this.invokeMethod(a, c, b, "getAllChannelsAllLocales")
            };
            ChannelService.prototype.getByCatUID = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "getByCatUID", f, a, e)
            };
            ChannelService.prototype.getByPkgUID = function(b, d, c, e, a, f) {
                this.invokeMethod(b, d, c, "getByPkgUID", e, a, f)
            };
            ChannelService.prototype.getByOriginUID = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "getByOriginUID", f, a, e)
            };
            ChannelService.prototype.getChannelType = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getChannelType", d)
            };
            ChannelService.prototype.getByPkgPattern = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByPkgPattern", e, a)
            };
            ChannelService.prototype.getPagedChannels = function(c, f, d, b, g, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannels", b, g, a, e)
            };
            ChannelService.prototype.getPagedChannelsByCatUID = function(c, f, d, h, b, g, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannelsByCatUID", h, b, g, a, e)
            };
            ChannelService.prototype.getPagedChannelsByPkgUID = function(c, f, d, h, b, g, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannelsByPkgUID", h, b, g, a, e)
            };
            ChannelService.prototype.getPagedChannelsByOriginUID = function(c, f, d, h, b, g, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannelsByOriginUID", h, b, g, a, e)
            };
            ChannelService.prototype.getPagedChannelsByPkgPattern = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannelsByPkgPattern", g, b, a, e)
            };
            ChannelService.prototype.getByNumber = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByNumber", e, a)
            };
            ChannelService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function CodAclFinderService() {}
            CodAclFinderService.prototype = new BaseService();
            CodAclFinderService.prototype.init = function() {
                this._serviceName = "codAclFinderService"
            };

            function CodBrowsingService() {}
            CodBrowsingService.prototype = new BaseService();
            CodBrowsingService.prototype.init = function() {
                this._serviceName = "codBrowsingService"
            };
            CodBrowsingService.prototype.getScheduledItemsForCurrentContext = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledItemsForCurrentContext", b)
            };
            CodBrowsingService.prototype.getScheduledItemsForCurrentContextCount = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledItemsForCurrentContextCount", b)
            };
            CodBrowsingService.prototype.getScheduledItems = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledItems", b)
            };
            CodBrowsingService.prototype.getScheduledItemsCount = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledItemsCount", b)
            };
            CodBrowsingService.prototype.getScheduledAssetGroupsForCurrentContext = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledAssetGroupsForCurrentContext", b)
            };
            CodBrowsingService.prototype.getScheduledAssetGroupsForCurrentContextCount = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledAssetGroupsForCurrentContextCount", b)
            };
            CodBrowsingService.prototype.getScheduledAssetGroups = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledAssetGroups", b)
            };
            CodBrowsingService.prototype.getScheduledAssetGroupsCount = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getScheduledAssetGroupsCount", b)
            };
            CodBrowsingService.prototype.getTrailerItems = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getTrailerItems", b)
            };
            CodBrowsingService.prototype.getTrailerItemsForCurrentContext = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getTrailerItemsForCurrentContext", b)
            };
            CodBrowsingService.prototype.getCurrentContext = function(a, c, b) {
                this.invokeMethod(a, c, b, "getCurrentContext")
            };

            function CodBuyService() {}
            CodBuyService.prototype = new BaseService();
            CodBuyService.prototype.init = function() {
                this._serviceName = "codBuyService"
            };

            function CodCategoryService() {}
            CodCategoryService.prototype = new BaseService();
            CodCategoryService.prototype.init = function() {
                this._serviceName = "codCategoryService"
            };
            CodCategoryService.prototype.create = function(g, f, d, i, e, b, j, h, a, c) {
                this.invokeMethod(g, f, d, "create", i, e, b, j, h, a, c)
            };
            CodCategoryService.prototype.update = function(a, e, c, f, b, g, d) {
                this.invokeMethod(a, e, c, "update", f, b, g, d)
            };
            CodCategoryService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            CodCategoryService.prototype.addMultiLanguage = function(b, e, c, f, a, d, g) {
                this.invokeMethod(b, e, c, "addMultiLanguage", f, a, d, g)
            };
            CodCategoryService.prototype.modifyMultiLanguage = function(b, f, d, g, a, e, h, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", g, a, e, h, c)
            };
            CodCategoryService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            CodCategoryService.prototype.addAssetGroup = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "addAssetGroup", c, e)
            };
            CodCategoryService.prototype.removeAsset = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "removeAsset", c, e)
            };
            CodCategoryService.prototype.removeAssetGroup = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "removeAssetGroup", c, e)
            };
            CodCategoryService.prototype.getAssetUIDList = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getAssetUIDList", c)
            };
            CodCategoryService.prototype.getAssetGroupUIDList = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getAssetGroupUIDList", c)
            };
            CodCategoryService.prototype.getCategoryList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getCategoryList", a)
            };
            CodCategoryService.prototype.getCategoryListByItemUidAndType = function(b, d, c, e, f, a) {
                this.invokeMethod(b, d, c, "getCategoryListByItemUidAndType", e, f, a)
            };
            CodCategoryService.prototype.getByName = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByName", d, a)
            };
            CodCategoryService.prototype.getPagedCategoryList = function(c, f, d, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedCategoryList", b, a, e)
            };
            CodCategoryService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function CodConaxAzmiLicenseService() {}
            CodConaxAzmiLicenseService.prototype = new BaseService();
            CodConaxAzmiLicenseService.prototype.init = function() {
                this._serviceName = "codConaxAzmiLicenseService"
            };
            CodConaxAzmiLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            CodConaxAzmiLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            CodConaxAzmiLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            CodConaxAzmiLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            CodConaxAzmiLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function CodConaxOESLicenseService() {}
            CodConaxOESLicenseService.prototype = new BaseService();
            CodConaxOESLicenseService.prototype.init = function() {
                this._serviceName = "codConaxOESLicenseService"
            };
            CodConaxOESLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            CodConaxOESLicenseService.prototype.getLicenseWithChipsetInfo = function(a, c, b, f, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChipsetInfo", f, e, d)
            };
            CodConaxOESLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            CodConaxOESLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };

            function CodFilterScheduleService() {}
            CodFilterScheduleService.prototype = new BaseService();
            CodFilterScheduleService.prototype.init = function() {
                this._serviceName = "codFilterScheduleService"
            };
            CodFilterScheduleService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function CodFilterService() {}
            CodFilterService.prototype = new BaseService();
            CodFilterService.prototype.init = function() {
                this._serviceName = "codFilterService"
            };

            function CodHelperService() {}
            CodHelperService.prototype = new BaseService();
            CodHelperService.prototype.init = function() {
                this._serviceName = "codHelperService"
            };
            CodHelperService.prototype.hasPurchaseAllAvailableForCatAndTvodAssetGroup = function(b, e, c, d, f, a) {
                this.invokeMethod(b, e, c, "hasPurchaseAllAvailableForCatAndTvodAssetGroup", d, f, a)
            };

            function CodLicenseService() {}
            CodLicenseService.prototype = new BaseService();
            CodLicenseService.prototype.init = function() {
                this._serviceName = "codLicenseService"
            };
            CodLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            CodLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            CodLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            CodLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };

            function CodLicenseValidityService() {}
            CodLicenseValidityService.prototype = new BaseService();
            CodLicenseValidityService.prototype.init = function() {
                this._serviceName = "codLicenseValidityService"
            };

            function CodNagraDVSLicenseService() {}
            CodNagraDVSLicenseService.prototype = new BaseService();
            CodNagraDVSLicenseService.prototype.init = function() {
                this._serviceName = "codNagraDVSLicenseService"
            };
            CodNagraDVSLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            CodNagraDVSLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            CodNagraDVSLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            CodNagraDVSLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            CodNagraDVSLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function CodNoopLicenseService() {}
            CodNoopLicenseService.prototype = new BaseService();
            CodNoopLicenseService.prototype.init = function() {
                this._serviceName = "codNoopLicenseService"
            };
            CodNoopLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            CodNoopLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            CodNoopLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };

            function CodScheduleService() {}
            CodScheduleService.prototype = new BaseService();
            CodScheduleService.prototype.init = function() {
                this._serviceName = "codScheduleService"
            };
            CodScheduleService.prototype.create = function(a, d, c, e, f, b) {
                this.invokeMethod(a, d, c, "create", e, f, b)
            };
            CodScheduleService.prototype.update = function(a, d, c, e, f, g, b) {
                this.invokeMethod(a, d, c, "update", e, f, g, b)
            };
            CodScheduleService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            CodScheduleService.prototype.getValidPagedList = function(b, f, c, e, a, d) {
                this.invokeMethod(b, f, c, "getValidPagedList", e, a, d)
            };
            CodScheduleService.prototype.getPagedList = function(b, e, c, a, d) {
                this.invokeMethod(b, e, c, "getPagedList", a, d)
            };
            CodScheduleService.prototype.getPagedAvailableScheduleList = function(b, e, c, a, d) {
                this.invokeMethod(b, e, c, "getPagedAvailableScheduleList", a, d)
            };
            CodScheduleService.prototype.addPolicyGroup = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "addPolicyGroup", e, d)
            };
            CodScheduleService.prototype.removePolicyGroup = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "removePolicyGroup", e, d)
            };
            CodScheduleService.prototype.getSchedulesByPolicyGroupUid = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getSchedulesByPolicyGroupUid", d)
            };
            CodScheduleService.prototype.getSchedulesByPolicyGroupUidSpidKnown = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getSchedulesByPolicyGroupUidSpidKnown", d, e)
            };
            CodScheduleService.prototype.getAssetValidInterval = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAssetValidInterval", d)
            };
            CodScheduleService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function CodSubscriptionBuyService() {}
            CodSubscriptionBuyService.prototype = new BaseService();
            CodSubscriptionBuyService.prototype.init = function() {
                this._serviceName = "codSubscriptionBuyService"
            };

            function CodSubscriptionConsumService() {}
            CodSubscriptionConsumService.prototype = new BaseService();
            CodSubscriptionConsumService.prototype.init = function() {
                this._serviceName = "codSubscriptionConsumService"
            };

            function CodViaccessLicenseService() {}
            CodViaccessLicenseService.prototype = new BaseService();
            CodViaccessLicenseService.prototype.init = function() {
                this._serviceName = "codViaccessLicenseService"
            };
            CodViaccessLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            CodViaccessLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            CodViaccessLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };

            function CompanionMessageService() {}
            CompanionMessageService.prototype = new BaseService();
            CompanionMessageService.prototype.init = function() {
                this._serviceName = "companionMessageService"
            };
            CompanionMessageService.prototype.getMessage = function(a, c, b) {
                this.invokeMethod(a, c, b, "getMessage")
            };
            CompanionMessageService.prototype.getAccountDevices = function(a, c, b) {
                this.invokeMethod(a, c, b, "getAccountDevices")
            };
            CompanionMessageService.prototype.postMessage = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "postMessage", e, d)
            };

            function Conax() {}
            Conax.prototype = new BaseService();
            Conax.prototype.init = function() {
                this._serviceName = "conax"
            };

            function ConaxAzmiGatewayService() {}
            ConaxAzmiGatewayService.prototype = new BaseService();
            ConaxAzmiGatewayService.prototype.init = function() {
                this._serviceName = "conaxAzmiGatewayService"
            };

            function ConaxAzmiLicenseService() {}
            ConaxAzmiLicenseService.prototype = new BaseService();
            ConaxAzmiLicenseService.prototype.init = function() {
                this._serviceName = "conaxAzmiLicenseService"
            };
            ConaxAzmiLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            ConaxAzmiLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            ConaxAzmiLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            ConaxAzmiLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };
            ConaxAzmiLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };

            function ConaxCasIntegrationFactoryService() {}
            ConaxCasIntegrationFactoryService.prototype = new BaseService();
            ConaxCasIntegrationFactoryService.prototype.init = function() {
                this._serviceName = "conaxCasIntegrationFactoryService"
            };

            function ConaxOESLicenseService() {}
            ConaxOESLicenseService.prototype = new BaseService();
            ConaxOESLicenseService.prototype.init = function() {
                this._serviceName = "conaxOESLicenseService"
            };
            ConaxOESLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            ConaxOESLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            ConaxOESLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            ConaxOESLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            ConaxOESLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function ConaxOESgwService() {}
            ConaxOESgwService.prototype = new BaseService();
            ConaxOESgwService.prototype.init = function() {
                this._serviceName = "conaxOESgwService"
            };

            function ConfigurationService() {}
            ConfigurationService.prototype = new BaseService();
            ConfigurationService.prototype.init = function() {
                this._serviceName = "configurationService"
            };

            function ContentConsumptionService() {}
            ContentConsumptionService.prototype = new BaseService();
            ContentConsumptionService.prototype.init = function() {
                this._serviceName = "contentConsumptionService"
            };
            ContentConsumptionService.prototype.create = function(j, f, e, n, m, g, c, b, p, l, i, o, a, h, k, d) {
                this.invokeMethod(j, f, e, "create", n, m, g, c, b, p, l, i, o, a, h, k, d)
            };
            ContentConsumptionService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ContentUsageService() {}
            ContentUsageService.prototype = new BaseService();
            ContentUsageService.prototype.init = function() {
                this._serviceName = "contentUsageService"
            };

            function ContextService() {}
            ContextService.prototype = new BaseService();
            ContextService.prototype.init = function() {
                this._serviceName = "contextService"
            };
            ContextService.prototype.getCurrentContext = function(a, c, b) {
                this.invokeMethod(a, c, b, "getCurrentContext")
            };

            function CpvrOperationService() {}
            CpvrOperationService.prototype = new BaseService();
            CpvrOperationService.prototype.init = function() {
                this._serviceName = "cpvrOperationService"
            };
            CpvrOperationService.prototype.create = function(k, q, r, g, e, n, i, o, m, c, j, f, h, a, l, p, b, d) {
                this.invokeMethod(k, q, r, "create", g, e, n, i, o, m, c, j, f, h, a, l, p, b, d)
            };
            CpvrOperationService.prototype.update = function(o, l, j, m, g, e, f, q, b, i, p, a, n, c, d, h, k) {
                this.invokeMethod(o, l, j, "update", m, g, e, f, q, b, i, p, a, n, c, d, h, k)
            };
            CpvrOperationService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            CpvrOperationService.prototype.getByAccount = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByAccount", c)
            };
            CpvrOperationService.prototype.getByAccountVerbose = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByAccountVerbose", c)
            };
            CpvrOperationService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function CpvrService() {}
            CpvrService.prototype = new BaseService();
            CpvrService.prototype.init = function() {
                this._serviceName = "cpvrService"
            };
            CpvrService.prototype.create = function(n, l, j, f, g, q, b, k, o, a, e, i, m, d, p, c, h) {
                this.invokeMethod(n, l, j, "create", f, g, q, b, k, o, a, e, i, m, d, p, c, h)
            };
            CpvrService.prototype.update = function(n, k, i, l, e, f, p, b, h, o, a, m, c, d, g, j) {
                this.invokeMethod(n, k, i, "update", l, e, f, p, b, h, o, a, m, c, d, g, j)
            };
            CpvrService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            CpvrService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            CpvrService.prototype.getByAccount = function(a, c, b) {
                this.invokeMethod(a, c, b, "getByAccount")
            };
            CpvrService.prototype.getByAccountVerbose = function(a, c, b) {
                this.invokeMethod(a, c, b, "getByAccountVerbose")
            };

            function DataextractService() {}
            DataextractService.prototype = new BaseService();
            DataextractService.prototype.init = function() {
                this._serviceName = "dataextractService"
            };
            DataextractService.prototype.getPublicKeyList = function(a, e, c, f, d, b) {
                this.invokeMethod(a, e, c, "getPublicKeyList", f, d, b)
            };

            function DeviceAggregateService() {}
            DeviceAggregateService.prototype = new BaseService();
            DeviceAggregateService.prototype.init = function() {
                this._serviceName = "deviceAggregateService"
            };
            DeviceAggregateService.prototype.updateDeviceWithNewAccount = function(a, e, c, d, f, g, h, b) {
                this.invokeMethod(a, e, c, "updateDeviceWithNewAccount", d, f, g, h, b)
            };
            DeviceAggregateService.prototype.deleteSTB = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "deleteSTB", e, d)
            };
            DeviceAggregateService.prototype.rebootSTB = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "rebootSTB", d, e)
            };
            DeviceAggregateService.prototype.deleteMp = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "deleteMp", d)
            };

            function DeviceClassifierService() {}
            DeviceClassifierService.prototype = new BaseService();
            DeviceClassifierService.prototype.init = function() {
                this._serviceName = "deviceClassifierService"
            };
            DeviceClassifierService.prototype.create = function(k, i, g, c, h, l, j, f, d, b, m, a, e) {
                this.invokeMethod(k, i, g, "create", c, h, l, j, f, d, b, m, a, e)
            };
            DeviceClassifierService.prototype.update = function(k, h, e, j, b, g, l, i, d, c, a, m, f) {
                this.invokeMethod(k, h, e, "update", j, b, g, l, i, d, c, a, m, f)
            };
            DeviceClassifierService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            DeviceClassifierService.prototype.getList = function(a, c, b) {
                this.invokeMethod(a, c, b, "getList")
            };
            DeviceClassifierService.prototype.getListOrderedByMatchingOrderAnyServiceProvider = function(a, c, b) {
                this.invokeMethod(a, c, b, "getListOrderedByMatchingOrderAnyServiceProvider")
            };
            DeviceClassifierService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function DeviceService() {}
            DeviceService.prototype = new BaseService();
            DeviceService.prototype.init = function() {
                this._serviceName = "deviceService"
            };
            DeviceService.prototype.getDeviceByCASN = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getDeviceByCASN", d)
            };
            DeviceService.prototype.getDeviceByNUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getDeviceByNUID", c)
            };
            DeviceService.prototype.getDeviceByMACAddress = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getDeviceByMACAddress", d)
            };
            DeviceService.prototype.getDeviceBySmartcardID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getDeviceBySmartcardID", c)
            };
            DeviceService.prototype.updateMpName = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "updateMpName", e, c)
            };
            DeviceService.prototype.updateMpState = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "updateMpState", d, e)
            };
            DeviceService.prototype.getMpById = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getMpById", d)
            };

            function DevicegroupService() {}
            DevicegroupService.prototype = new BaseService();
            DevicegroupService.prototype.init = function() {
                this._serviceName = "devicegroupService"
            };
            DevicegroupService.prototype.create = function(f, e, d, b, i, h, c, g, a) {
                this.invokeMethod(f, e, d, "create", b, i, h, c, g, a)
            };
            DevicegroupService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            DevicegroupService.prototype.update = function(a, c, b, h, d, g, e, f) {
                this.invokeMethod(a, c, b, "update", h, d, g, e, f)
            };
            DevicegroupService.prototype.addDevice = function(a, d, b, c, e, f) {
                this.invokeMethod(a, d, b, "addDevice", c, e, f)
            };
            DevicegroupService.prototype.removeDevice = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "removeDevice", e, b)
            };
            DevicegroupService.prototype.getAllDeviceGroups = function(a, c, b) {
                this.invokeMethod(a, c, b, "getAllDeviceGroups")
            };
            DevicegroupService.prototype.getDevices = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getDevices", b)
            };
            DevicegroupService.prototype.getDevicesByDeviceUID = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getDevicesByDeviceUID", e, c)
            };
            DevicegroupService.prototype.getByAccessPointUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByAccessPointUID", d)
            };
            DevicegroupService.prototype.getDeviceGroupByDeviceUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getDeviceGroupByDeviceUID", d)
            };
            DevicegroupService.prototype.getStreamingServerDeviceGroups = function(a, c, b) {
                this.invokeMethod(a, c, b, "getStreamingServerDeviceGroups")
            };
            DevicegroupService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function DrmService() {}
            DrmService.prototype = new BaseService();
            DrmService.prototype.init = function() {
                this._serviceName = "drmService"
            };
            DrmService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function Drmworkflowservice() {}
            Drmworkflowservice.prototype = new BaseService();
            Drmworkflowservice.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "drmworkflowservice"
            };
            Drmworkflowservice.prototype.getMarlinMs3Token = function(b, d, c, a, e) {
                this.invokeMethod(b, d, c, "getMarlinMs3Token", a, e)
            };

            function DynamicAdvertsService() {}
            DynamicAdvertsService.prototype = new BaseService();
            DynamicAdvertsService.prototype.init = function() {
                this._serviceName = "dynamicAdvertsService"
            };
            DynamicAdvertsService.prototype.getAdverts = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getAdverts", e, c)
            };

            function EventService() {}
            EventService.prototype = new BaseService();
            EventService.prototype.init = function() {
                this._serviceName = "eventService"
            };
            EventService.prototype.create = function(i, f, c, d, g, k, l, e, b, h, a, j) {
                this.invokeMethod(i, f, c, "create", d, g, k, l, e, b, h, a, j)
            };
            EventService.prototype.update = function(i, f, c, j, d, g, k, l, e, b, h, a) {
                this.invokeMethod(i, f, c, "update", j, d, g, k, l, e, b, h, a)
            };
            EventService.prototype.getEvtsByPkgUID = function(a, d, b, e, f, c) {
                this.invokeMethod(a, d, b, "getEvtsByPkgUID", e, f, c)
            };
            EventService.prototype.getEvtsByChnUID = function(b, e, c, a, f, d) {
                this.invokeMethod(b, e, c, "getEvtsByChnUID", a, f, d)
            };
            EventService.prototype.getEvtsByAllChnls = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getEvtsByAllChnls", e, c)
            };
            EventService.prototype.getEvtsByCatUID = function(a, d, b, f, e, c) {
                this.invokeMethod(a, d, b, "getEvtsByCatUID", f, e, c)
            };
            EventService.prototype.getEvtsByPgmUID = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "getEvtsByPgmUID", f, a, e)
            };
            EventService.prototype.getEvtsByChnlAcct = function(b, e, c, a, f, d) {
                this.invokeMethod(b, e, c, "getEvtsByChnlAcct", a, f, d)
            };
            EventService.prototype.getEvtsByPkgAcct = function(b, e, c, a, f, d) {
                this.invokeMethod(b, e, c, "getEvtsByPkgAcct", a, f, d)
            };
            EventService.prototype.getEvtsByOriginUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getEvtsByOriginUID", d)
            };
            EventService.prototype.getDetEvtByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getDetEvtByUID", e, a)
            };
            EventService.prototype.getDetEvtsByPkgUID = function(b, e, c, f, h, d, a, g) {
                this.invokeMethod(b, e, c, "getDetEvtsByPkgUID", f, h, d, a, g)
            };
            EventService.prototype.getDetEvtsByPkgPattern = function(b, e, c, f, h, d, a, g) {
                this.invokeMethod(b, e, c, "getDetEvtsByPkgPattern", f, h, d, a, g)
            };
            EventService.prototype.getDetEvtsByChnUID = function(c, f, d, b, h, e, a, g) {
                this.invokeMethod(c, f, d, "getDetEvtsByChnUID", b, h, e, a, g)
            };
            EventService.prototype.getDetEvtsByAllChnls = function(b, e, c, g, d, a, f) {
                this.invokeMethod(b, e, c, "getDetEvtsByAllChnls", g, d, a, f)
            };
            EventService.prototype.getDetEvtsByCatUID = function(b, e, c, h, g, d, a, f) {
                this.invokeMethod(b, e, c, "getDetEvtsByCatUID", h, g, d, a, f)
            };
            EventService.prototype.getDetEvtsByChnlAcct = function(c, f, d, b, h, e, a, g) {
                this.invokeMethod(c, f, d, "getDetEvtsByChnlAcct", b, h, e, a, g)
            };
            EventService.prototype.getDetEvtsByPkgAcct = function(c, f, d, b, h, e, a, g) {
                this.invokeMethod(c, f, d, "getDetEvtsByPkgAcct", b, h, e, a, g)
            };
            EventService.prototype.getDetEvtsMultiLanguageList = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getDetEvtsMultiLanguageList", d)
            };
            EventService.prototype.search = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "search", d)
            };
            EventService.prototype.addPolicyGroup = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "addPolicyGroup", c, e)
            };
            EventService.prototype.removePolicyGroup = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "removePolicyGroup", c, e)
            };
            EventService.prototype.getPagedEventsByPkgUID = function(b, f, c, g, h, d, a, e) {
                this.invokeMethod(b, f, c, "getPagedEventsByPkgUID", g, h, d, a, e)
            };
            EventService.prototype.getPagedEventsByChnUID = function(c, g, d, b, h, e, a, f) {
                this.invokeMethod(c, g, d, "getPagedEventsByChnUID", b, h, e, a, f)
            };
            EventService.prototype.getPagedEventsByAllChnls = function(b, f, c, g, d, a, e) {
                this.invokeMethod(b, f, c, "getPagedEventsByAllChnls", g, d, a, e)
            };
            EventService.prototype.getPagedEventsByCatUID = function(b, f, c, h, g, d, a, e) {
                this.invokeMethod(b, f, c, "getPagedEventsByCatUID", h, g, d, a, e)
            };
            EventService.prototype.getPagedEventsByPgmUID = function(c, f, d, h, b, g, a, e) {
                this.invokeMethod(c, f, d, "getPagedEventsByPgmUID", h, b, g, a, e)
            };
            EventService.prototype.getPagedEventsByChnlAcct = function(c, g, d, b, h, e, a, f) {
                this.invokeMethod(c, g, d, "getPagedEventsByChnlAcct", b, h, e, a, f)
            };
            EventService.prototype.getPagedEventsByPkgAcct = function(c, g, d, b, h, e, a, f) {
                this.invokeMethod(c, g, d, "getPagedEventsByPkgAcct", b, h, e, a, f)
            };
            EventService.prototype.getPagedDetailEventsByPkgUID = function(h, f, d, e, g, c, j, i, a, b) {
                this.invokeMethod(h, f, d, "getPagedDetailEventsByPkgUID", e, g, c, j, i, a, b)
            };
            EventService.prototype.getPagedDetailEventsByPkgPattern = function(g, e, d, i, f, c, j, h, a, b) {
                this.invokeMethod(g, e, d, "getPagedDetailEventsByPkgPattern", i, f, c, j, h, a, b)
            };
            EventService.prototype.getPagedDetailEventsByChnUID = function(g, e, d, j, f, c, i, h, a, b) {
                this.invokeMethod(g, e, d, "getPagedDetailEventsByChnUID", j, f, c, i, h, a, b)
            };
            EventService.prototype.getPagedSOCUEventsByChnIdentifier = function(h, f, e, d, g, c, j, i, a, b) {
                this.invokeMethod(h, f, e, "getPagedSOCUEventsByChnIdentifier", d, g, c, j, i, a, b)
            };
            EventService.prototype.getPagedDetailEventsByAllChnls = function(g, e, d, f, c, i, h, a, b) {
                this.invokeMethod(g, e, d, "getPagedDetailEventsByAllChnls", f, c, i, h, a, b)
            };
            EventService.prototype.getPagedDetailEventsByCatUID = function(h, f, e, d, g, c, j, i, a, b) {
                this.invokeMethod(h, f, e, "getPagedDetailEventsByCatUID", d, g, c, j, i, a, b)
            };
            EventService.prototype.getPagedDetailEventsByChnlAcct = function(h, e, d, f, g, c, j, i, a, b) {
                this.invokeMethod(h, e, d, "getPagedDetailEventsByChnlAcct", f, g, c, j, i, a, b)
            };
            EventService.prototype.getPagedDetailEventsByPkgAcct = function(h, e, d, f, g, c, j, i, a, b) {
                this.invokeMethod(h, e, d, "getPagedDetailEventsByPkgAcct", f, g, c, j, i, a, b)
            };
            EventService.prototype.getPagedDetailEventsMultiLanguageList = function(b, e, c, f, a, d) {
                this.invokeMethod(b, e, c, "getPagedDetailEventsMultiLanguageList", f, a, d)
            };
            EventService.prototype.getByPolicyGroupUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByPolicyGroupUID", d)
            };
            EventService.prototype.getByMediaFileName = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByMediaFileName", d)
            };
            EventService.prototype.getPpvEventPolicyGroupByEvent = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getPpvEventPolicyGroupByEvent", d)
            };
            EventService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ExternalGroupService() {}
            ExternalGroupService.prototype = new BaseService();
            ExternalGroupService.prototype.init = function() {
                this._serviceName = "externalGroupService"
            };
            ExternalGroupService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ExternalSystemStatusService() {}
            ExternalSystemStatusService.prototype = new BaseService();
            ExternalSystemStatusService.prototype.init = function() {
                this._serviceName = "externalSystemStatusService"
            };
            ExternalSystemStatusService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function FavouriteService() {}
            FavouriteService.prototype = new BaseService();
            FavouriteService.prototype.init = function() {
                this._serviceName = "favouriteService"
            };
            FavouriteService.prototype.create = function(i, g, f, c, h, e, b, a, d) {
                this.invokeMethod(i, g, f, "create", c, h, e, b, a, d)
            };
            FavouriteService.prototype.update = function(i, f, d, g, b, h, c, a, e) {
                this.invokeMethod(i, f, d, "update", g, b, h, c, a, e)
            };
            FavouriteService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            FavouriteService.prototype.getFavouriteStatusForItem = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "getFavouriteStatusForItem", f, a, e)
            };
            FavouriteService.prototype.getByOriginUID = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "getByOriginUID", c, e)
            };
            FavouriteService.prototype.getList = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getList", d)
            };
            FavouriteService.prototype.getFavouriteItemList = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getFavouriteItemList", e, d)
            };
            FavouriteService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            FavouriteService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function FeatureService() {}
            FeatureService.prototype = new BaseService();
            FeatureService.prototype.init = function() {
                this._serviceName = "featureService"
            };
            FeatureService.prototype.create = function(h, e, d, b, j, f, g, i, k, c, a) {
                this.invokeMethod(h, e, d, "create", b, j, f, g, i, k, c, a)
            };
            FeatureService.prototype.update = function(h, d, b, f, a, j, e, g, i, k, c) {
                this.invokeMethod(h, d, b, "update", f, a, j, e, g, i, k, c)
            };
            FeatureService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            FeatureService.prototype.getByName = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByName", c)
            };
            FeatureService.prototype.getByType = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByType", d)
            };
            FeatureService.prototype.getFeaturesByProfUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getFeaturesByProfUID", d)
            };
            FeatureService.prototype.getByUids = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUids", d)
            };
            FeatureService.prototype.getByTypeAndNames = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getByTypeAndNames", e, d)
            };
            FeatureService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function FirmwareRegistrationService() {}
            FirmwareRegistrationService.prototype = new BaseService();
            FirmwareRegistrationService.prototype.init = function() {
                this._serviceName = "firmwareRegistrationService"
            };

            function FirmwareUpgradeService() {}
            FirmwareUpgradeService.prototype = new BaseService();
            FirmwareUpgradeService.prototype.init = function() {
                this._serviceName = "firmwareUpgradeService"
            };

            function InitialisationService() {}
            InitialisationService.prototype = new BaseService();
            InitialisationService.prototype.init = function() {
                this._serviceName = "initialisationService"
            };
            InitialisationService.prototype.getInitDataBySmartCardId = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getInitDataBySmartCardId", c)
            };
            InitialisationService.prototype.getInitDataByCASN = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getInitDataByCASN", d)
            };
            InitialisationService.prototype.getInitDataByMacAddress = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getInitDataByMacAddress", d)
            };
            InitialisationService.prototype.getAccountPreferences = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getAccountPreferences", c)
            };
            InitialisationService.prototype.getAccountCatalogues = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getAccountCatalogues", c)
            };
            InitialisationService.prototype.getAccountPackages = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getAccountPackages", c)
            };
            InitialisationService.prototype.getAccountBlockings = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getAccountBlockings", c)
            };
            InitialisationService.prototype.getUsers = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getUsers", c)
            };
            InitialisationService.prototype.getUserFavourites = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getUserFavourites", c)
            };
            InitialisationService.prototype.getActivePurchases = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getActivePurchases", c)
            };

            function IntervalService() {}
            IntervalService.prototype = new BaseService();
            IntervalService.prototype.init = function() {
                this._serviceName = "intervalService"
            };
            IntervalService.prototype.create = function(g, f, e, b, l, i, d, k, h, a, c, j) {
                this.invokeMethod(g, f, e, "create", b, l, i, d, k, h, a, c, j)
            };
            IntervalService.prototype.update = function(f, e, b, d, h, a, i, g, c) {
                this.invokeMethod(f, e, b, "update", d, h, a, i, g, c)
            };
            IntervalService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            IntervalService.prototype.addMultiLanguage = function(b, e, c, g, d, f, a) {
                this.invokeMethod(b, e, c, "addMultiLanguage", g, d, f, a)
            };
            IntervalService.prototype.modifyMultiLanguage = function(b, f, d, h, e, g, a, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", h, e, g, a, c)
            };
            IntervalService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            IntervalService.prototype.getByName = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByName", d, a)
            };
            IntervalService.prototype.getByType = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByType", e, a)
            };
            IntervalService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            IntervalService.prototype.getListByTypeValueFrequency = function(b, d, c, e, h, f, g, a) {
                this.invokeMethod(b, d, c, "getListByTypeValueFrequency", e, h, f, g, a)
            };
            IntervalService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function LicenseCRUDService() {}
            LicenseCRUDService.prototype = new BaseService();
            LicenseCRUDService.prototype.init = function() {
                this._serviceName = "licenseCRUDService"
            };
            LicenseCRUDService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            LicenseCRUDService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function LicenseService() {}
            LicenseService.prototype = new BaseService();
            LicenseService.prototype.init = function() {
                this._serviceName = "licenseService"
            };
            LicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            LicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            LicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            LicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            LicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function LicenseValidityService() {}
            LicenseValidityService.prototype = new BaseService();
            LicenseValidityService.prototype.init = function() {
                this._serviceName = "licenseValidityService"
            };
            LicenseValidityService.prototype.calculateNagraDvsLicenseValidityInformation = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "calculateNagraDvsLicenseValidityInformation", d, e)
            };

            function LinkedStbService() {}
            LinkedStbService.prototype = new BaseService();
            LinkedStbService.prototype.init = function() {
                this._serviceName = "linkedStbService"
            };
            LinkedStbService.prototype.joinHomeDomain = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "joinHomeDomain", e, c)
            };
            LinkedStbService.prototype.refurbish = function(a, d, b, e, c, g, f) {
                this.invokeMethod(a, d, b, "refurbish", e, c, g, f)
            };

            function LoggingService() {}
            LoggingService.prototype = new BaseService();
            LoggingService.prototype.init = function() {
                this._serviceName = "loggingService"
            };
            LoggingService.prototype.log = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "log", e, d)
            };

            function MerlinSmsGwCasIntegrationFactoryService() {}
            MerlinSmsGwCasIntegrationFactoryService.prototype = new BaseService();
            MerlinSmsGwCasIntegrationFactoryService.prototype.init = function() {
                this._serviceName = "merlinSmsGwCasIntegrationFactoryService"
            };

            function NPVRService() {}
            NPVRService.prototype = new BaseService();
            NPVRService.prototype.init = function() {
                this._serviceName = "NPVRService"
            };
            NPVRService.prototype.npvrSearch = function(h, e, d, k, f, g, c, i, a, j, b) {
                this.invokeMethod(h, e, d, "npvrSearch", k, f, g, c, i, a, j, b)
            };
            NPVRService.prototype.npvrSearchByDate = function(j, f, e, m, g, i, d, k, b, a, h, l, c) {
                this.invokeMethod(j, f, e, "npvrSearchByDate", m, g, i, d, k, b, a, h, l, c)
            };
            NPVRService.prototype.cancelRecordingByAccAndDevice = function(a, e, c, b, f, d) {
                this.invokeMethod(a, e, c, "cancelRecordingByAccAndDevice", b, f, d)
            };
            NPVRService.prototype.cancelRecordingByAccount = function(a, e, c, b, f, d) {
                this.invokeMethod(a, e, c, "cancelRecordingByAccount", b, f, d)
            };
            NPVRService.prototype.fetchRecordingsByAccAndDevice = function(a, e, b, d, c) {
                this.invokeMethod(a, e, b, "fetchRecordingsByAccAndDevice", d, c)
            };
            NPVRService.prototype.fetchRecordingsByAccount = function(a, e, b, d, c) {
                this.invokeMethod(a, e, b, "fetchRecordingsByAccount", d, c)
            };
            NPVRService.prototype.setRecording = function(a, e, c, b, f, d) {
                this.invokeMethod(a, e, c, "setRecording", b, f, d)
            };
            NPVRService.prototype.fetchNPVREventsByAccAndDevice = function(b, f, c, a, e, d) {
                this.invokeMethod(b, f, c, "fetchNPVREventsByAccAndDevice", a, e, d)
            };
            NPVRService.prototype.fetchNPVREventsByAccount = function(b, f, c, a, e, d) {
                this.invokeMethod(b, f, c, "fetchNPVREventsByAccount", a, e, d)
            };

            function NagraDVSLicenseService() {}
            NagraDVSLicenseService.prototype = new BaseService();
            NagraDVSLicenseService.prototype.init = function() {
                this._serviceName = "nagraDVSLicenseService"
            };
            NagraDVSLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            NagraDVSLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            NagraDVSLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            NagraDVSLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            NagraDVSLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function NagraDVSgwService() {}
            NagraDVSgwService.prototype = new BaseService();
            NagraDVSgwService.prototype.init = function() {
                this._serviceName = "nagraDVSgwService"
            };

            function NmpExtendedService() {}
            NmpExtendedService.prototype = new BaseService();
            NmpExtendedService.prototype.init = function() {
                this._serviceName = "NmpExtendedService"
            };
            NmpExtendedService.prototype.initializeDevice = function(b, d, c, f, e, a) {
                this.invokeMethod(b, d, c, "initializeDevice", f, e, a)
            };
            NmpExtendedService.prototype.getEntitlements = function(b, d, c, g, e, a, f) {
                this.invokeMethod(b, d, c, "getEntitlements", g, e, a, f)
            };
            NmpExtendedService.prototype.transformEntitlements = function(b, d, c, g, e, a, f) {
                this.invokeMethod(b, d, c, "transformEntitlements", g, e, a, f)
            };

            function NmpOperatorService() {}
            NmpOperatorService.prototype = new BaseService();
            NmpOperatorService.prototype.init = function() {
                this._serviceName = "NmpOperatorService"
            };

            function NmpsCoreService() {}
            NmpsCoreService.prototype = new BaseService();
            NmpsCoreService.prototype.init = function() {
                this._serviceName = "NmpsCoreService"
            };

            function Noop() {}
            Noop.prototype = new BaseService();
            Noop.prototype.init = function() {
                this._serviceName = "noop"
            };

            function NoopLicenseService() {}
            NoopLicenseService.prototype = new BaseService();
            NoopLicenseService.prototype.init = function() {
                this._serviceName = "noopLicenseService"
            };
            NoopLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            NoopLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            NoopLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            NoopLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            NoopLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function NpvrSearchService() {}
            NpvrSearchService.prototype = new BaseService();
            NpvrSearchService.prototype.init = function() {
                this._serviceName = "npvrSearchService"
            };

            function NpvrrecordingService() {}
            NpvrrecordingService.prototype = new BaseService();
            NpvrrecordingService.prototype.init = function() {
                this._serviceName = "npvrrecordingService"
            };
            NpvrrecordingService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function NullObjectCASIntegrationService() {}
            NullObjectCASIntegrationService.prototype = new BaseService();
            NullObjectCASIntegrationService.prototype.init = function() {
                this._serviceName = "nullObjectCASIntegrationService"
            };

            function NvodChannelService() {}
            NvodChannelService.prototype = new BaseService();
            NvodChannelService.prototype.init = function() {
                this._serviceName = "nvodChannelService"
            };
            NvodChannelService.prototype.create = function(i, o, p, m, s, l, a, k, c, g, e, n, h, q, r, d, j, b, f) {
                this.invokeMethod(i, o, p, "create", m, s, l, a, k, c, g, e, n, h, q, r, d, j, b, f)
            };
            NvodChannelService.prototype.update = function(k, h, f, i, c, d, m, o, b, j, n, p, l, a, e, g) {
                this.invokeMethod(k, h, f, "update", i, c, d, m, o, b, j, n, p, l, a, e, g)
            };
            NvodChannelService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            NvodChannelService.prototype.addMultiLanguage = function(b, e, c, f, a, d, g) {
                this.invokeMethod(b, e, c, "addMultiLanguage", f, a, d, g)
            };
            NvodChannelService.prototype.modifyMultiLanguage = function(b, f, d, g, a, e, h, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", g, a, e, h, c)
            };
            NvodChannelService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            NvodChannelService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };
            NvodChannelService.prototype.getByOrigin = function(b, f, c, d, e, a) {
                this.invokeMethod(b, f, c, "getByOrigin", d, e, a)
            };
            NvodChannelService.prototype.getByOriginUID = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByOriginUID", d, a)
            };
            NvodChannelService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            NvodChannelService.prototype.getMultiLanguageList = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getMultiLanguageList", d)
            };
            NvodChannelService.prototype.isNvodChannel = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "isNvodChannel", d)
            };

            function NvodEventService() {}
            NvodEventService.prototype = new BaseService();
            NvodEventService.prototype.init = function() {
                this._serviceName = "nvodEventService"
            };
            NvodEventService.prototype.create = function(h, e, d, i, g, b, f, a, c) {
                this.invokeMethod(h, e, d, "create", i, g, b, f, a, c)
            };
            NvodEventService.prototype.update = function(h, d, b, f, i, g, a, e, c) {
                this.invokeMethod(h, d, b, "update", f, i, g, a, e, c)
            };
            NvodEventService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            NvodEventService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            NvodEventService.prototype.getByOrigin = function(a, e, b, c, d) {
                this.invokeMethod(a, e, b, "getByOrigin", c, d)
            };
            NvodEventService.prototype.getDetailsByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getDetailsByUID", e, a)
            };
            NvodEventService.prototype.getByOriginUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByOriginUID", c)
            };
            NvodEventService.prototype.getDetailedList = function(b, e, c, f, d, a) {
                this.invokeMethod(b, e, c, "getDetailedList", f, d, a)
            };
            NvodEventService.prototype.getDetailedListForChannel = function(b, e, c, g, f, d, a) {
                this.invokeMethod(b, e, c, "getDetailedListForChannel", g, f, d, a)
            };

            function NvodProgramService() {}
            NvodProgramService.prototype = new BaseService();
            NvodProgramService.prototype.init = function() {
                this._serviceName = "nvodProgramService"
            };
            NvodProgramService.prototype.create = function(n, s, t, q, w, p, a, j, u, h, v, m, f, k, o, d, g, b, r, l, e, c, i) {
                this.invokeMethod(n, s, t, "create", q, w, p, a, j, u, h, v, m, f, k, o, d, g, b, r, l, e, c, i)
            };
            NvodProgramService.prototype.update = function(m, o, q, i, a, h, r, f, s, l, d, j, n, c, e, b, p, k, g) {
                this.invokeMethod(m, o, q, "update", i, a, h, r, f, s, l, d, j, n, c, e, b, p, k, g)
            };
            NvodProgramService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            NvodProgramService.prototype.addMultiLanguage = function(c, f, d, g, b, e, h, a) {
                this.invokeMethod(c, f, d, "addMultiLanguage", g, b, e, h, a)
            };
            NvodProgramService.prototype.modifyMultiLanguage = function(g, e, d, f, h, a, i, c, b) {
                this.invokeMethod(g, e, d, "modifyMultiLanguage", f, h, a, i, c, b)
            };
            NvodProgramService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            NvodProgramService.prototype.addAltAudioPID = function(b, e, d, f, a, g, c) {
                this.invokeMethod(b, e, d, "addAltAudioPID", f, a, g, c)
            };
            NvodProgramService.prototype.modifyAltAudioPID = function(b, f, d, g, a, h, c, e) {
                this.invokeMethod(b, f, d, "modifyAltAudioPID", g, a, h, c, e)
            };
            NvodProgramService.prototype.removeAltAudioPID = function(a, d, c, e, f, b) {
                this.invokeMethod(a, d, c, "removeAltAudioPID", e, f, b)
            };
            NvodProgramService.prototype.getSimpleProgramByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getSimpleProgramByUID", e, a)
            };
            NvodProgramService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };
            NvodProgramService.prototype.getByOrigin = function(b, f, c, d, e, a) {
                this.invokeMethod(b, f, c, "getByOrigin", d, e, a)
            };
            NvodProgramService.prototype.getByOriginUID = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByOriginUID", d, a)
            };
            NvodProgramService.prototype.getMultiLanguageList = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getMultiLanguageList", d)
            };
            NvodProgramService.prototype.getAltAudioPIDList = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAltAudioPIDList", d)
            };

            function OpenEchoService() {}
            OpenEchoService.prototype = new BaseService();
            OpenEchoService.prototype.init = function() {
                this._serviceName = "openEchoService"
            };
            OpenEchoService.prototype.echo = function(a, c, b) {
                this.invokeMethod(a, c, b, "echo")
            };

            function OriginToUidService() {}
            OriginToUidService.prototype = new BaseService();
            OriginToUidService.prototype.init = function() {
                this._serviceName = "originToUidService"
            };

            function OriginToUid_v1_1Service() {}
            OriginToUid_v1_1Service.prototype = new BaseService();
            OriginToUid_v1_1Service.prototype.init = function() {
                this._serviceName = "originToUid_v1_1Service"
            };

            function OttSessionService() {}
            OttSessionService.prototype = new BaseService();
            OttSessionService.prototype.init = function() {
                this._serviceName = "ottSessionService"
            };
            OttSessionService.prototype.setUp = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "setUp", e, d)
            };
            OttSessionService.prototype.tearDown = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "tearDown", d)
            };
            OttSessionService.prototype.getMPDevicesWithOpenSessions = function(a, e, b, d, c) {
                this.invokeMethod(a, e, b, "getMPDevicesWithOpenSessions", d, c)
            };

            function OttUpgradeService() {}
            OttUpgradeService.prototype = new BaseService();
            OttUpgradeService.prototype.init = function() {
                this._serviceName = "ottUpgradeService"
            };
            OttUpgradeService.prototype.upgrade = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "upgrade", e, b)
            };

            function PAVService() {}
            PAVService.prototype = new BaseService();
            PAVService.prototype.init = function() {
                this._serviceName = "PAVService"
            };
            PAVService.prototype.getPlayListByMacAddress = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getPlayListByMacAddress", d, e)
            };
            PAVService.prototype.getPlayListBySmartCard = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getPlayListBySmartCard", d, e)
            };

            function PPVService() {}
            PPVService.prototype = new BaseService();
            PPVService.prototype.init = function() {
                this._serviceName = "PPVService"
            };
            PPVService.prototype.getPagedPPVEventList = function(h, e, d, g, a, b, f, j, c, i) {
                this.invokeMethod(h, e, d, "getPagedPPVEventList", g, a, b, f, j, c, i)
            };
            PPVService.prototype.getPPVEventList = function(c, e, d, h, f, b, g, a) {
                this.invokeMethod(c, e, d, "getPPVEventList", h, f, b, g, a)
            };
            PPVService.prototype.getPagedPPVEventListByChannel = function(i, f, e, h, b, c, g, a, k, d, j) {
                this.invokeMethod(i, f, e, "getPagedPPVEventListByChannel", h, b, c, g, a, k, d, j)
            };
            PPVService.prototype.getPPVEventListByChannel = function(h, e, d, g, b, c, f, a, i) {
                this.invokeMethod(h, e, d, "getPPVEventListByChannel", g, b, c, f, a, i)
            };
            PPVService.prototype.getPagedChannelListWithPPVEvents = function(g, d, c, f, a, e, i, b, h) {
                this.invokeMethod(g, d, c, "getPagedChannelListWithPPVEvents", f, a, e, i, b, h)
            };
            PPVService.prototype.getChannelListWithPPVEvents = function(c, e, d, g, b, f, a) {
                this.invokeMethod(c, e, d, "getChannelListWithPPVEvents", g, b, f, a)
            };
            PPVService.prototype.getPagedPurchasedPPVEventList = function(h, e, d, g, a, b, f, j, c, i) {
                this.invokeMethod(h, e, d, "getPagedPurchasedPPVEventList", g, a, b, f, j, c, i)
            };
            PPVService.prototype.getPurchasedPPVEventList = function(c, e, d, h, f, b, g, a) {
                this.invokeMethod(c, e, d, "getPurchasedPPVEventList", h, f, b, g, a)
            };
            PPVService.prototype.purchasePPVEventByProduct = function(b, d, c, h, e, g, f, a) {
                this.invokeMethod(b, d, c, "purchasePPVEventByProduct", h, e, g, f, a)
            };
            PPVService.prototype.purchasePPVEventByPolicyGroup = function(b, d, c, h, f, g, e, a) {
                this.invokeMethod(b, d, c, "purchasePPVEventByPolicyGroup", h, f, g, e, a)
            };

            function PackageService() {}
            PackageService.prototype = new BaseService();
            PackageService.prototype.init = function() {
                this._serviceName = "packageService"
            };
            PackageService.prototype.create = function(j, h, g, e, m, b, a, d, i, f, l, c, k) {
                this.invokeMethod(j, h, g, "create", e, m, b, a, d, i, f, l, c, k)
            };
            PackageService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            PackageService.prototype.update = function(i, g, f, b, a, d, c, h, e) {
                this.invokeMethod(i, g, f, "update", b, a, d, c, h, e)
            };
            PackageService.prototype.addMultiLanguage = function(b, d, c, a, e, g, f) {
                this.invokeMethod(b, d, c, "addMultiLanguage", a, e, g, f)
            };
            PackageService.prototype.modifyMultiLanguage = function(b, d, c, f, e, g, a) {
                this.invokeMethod(b, d, c, "modifyMultiLanguage", f, e, g, a)
            };
            PackageService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            PackageService.prototype.addChannel = function(b, d, c, f, e, a) {
                this.invokeMethod(b, d, c, "addChannel", f, e, a)
            };
            PackageService.prototype.updateChannel = function(b, d, c, f, e, a) {
                this.invokeMethod(b, d, c, "updateChannel", f, e, a)
            };
            PackageService.prototype.removeChannel = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "removeChannel", e, d)
            };
            PackageService.prototype.getQspDefaultPackage = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getQspDefaultPackage", a)
            };
            PackageService.prototype.getAllPackages = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getAllPackages", a)
            };
            PackageService.prototype.getPkgsByChanUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getPkgsByChanUID", e, a)
            };
            PackageService.prototype.getChannels = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getChannels", e, a)
            };
            PackageService.prototype.getPkgMapsByPkgPattern = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getPkgMapsByPkgPattern", e, a)
            };
            PackageService.prototype.getPkgMapsByPkgID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getPkgMapsByPkgID", e, a)
            };
            PackageService.prototype.getPkgMapsByPkgPatternAndCatUID = function(b, d, c, e, f, a) {
                this.invokeMethod(b, d, c, "getPkgMapsByPkgPatternAndCatUID", e, f, a)
            };
            PackageService.prototype.getByOriginUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByOriginUID", e, a)
            };
            PackageService.prototype.getPkgBySbscrProfUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getPkgBySbscrProfUID", e, a)
            };
            PackageService.prototype.getPagedPackages = function(c, f, d, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPackages", b, a, e)
            };
            PackageService.prototype.getALaCartePackages = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getALaCartePackages", a)
            };
            PackageService.prototype.getPagedPkgsByChanUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPkgsByChanUID", g, b, a, e)
            };
            PackageService.prototype.getPagedChannels = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedChannels", g, b, a, e)
            };
            PackageService.prototype.getPagedPkgMapsByPkgPattern = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPkgMapsByPkgPattern", g, b, a, e)
            };
            PackageService.prototype.getPagedPkgMapsByPkgID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPkgMapsByPkgID", g, b, a, e)
            };
            PackageService.prototype.getPagedPkgMapsByPkgPatternAndCatUID = function(c, f, d, g, h, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPkgMapsByPkgPatternAndCatUID", g, h, b, a, e)
            };
            PackageService.prototype.getPagedPkgsBySbscrProfUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPkgsBySbscrProfUID", g, b, a, e)
            };
            PackageService.prototype.getPagedPkgsByOriginUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPkgsByOriginUID", g, b, a, e)
            };
            PackageService.prototype.getPagedPackagesByChannelUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedPackagesByChannelUID", g, b, a, e)
            };
            PackageService.prototype.getPagedAlacartePackagesByChannelNetCarry = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAlacartePackagesByChannelNetCarry", g, b, a, e)
            };
            PackageService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function PasswordHashService() {}
            PasswordHashService.prototype = new BaseService();
            PasswordHashService.prototype.init = function() {
                this._serviceName = "passwordHashService"
            };

            function PayWizardCardService() {}
            PayWizardCardService.prototype = new BaseService();
            PayWizardCardService.prototype.init = function() {
                this._serviceName = "payWizardCardService"
            };

            function PaymentGatewayService() {}
            PaymentGatewayService.prototype = new BaseService();
            PaymentGatewayService.prototype.init = function() {
                this._serviceName = "paymentGatewayService"
            };

            function PingService() {}
            PingService.prototype = new BaseService();
            PingService.prototype.init = function() {
                this._serviceName = "pingService"
            };
            PingService.prototype.ping = function(a, c, b) {
                this.invokeMethod(a, c, b, "ping")
            };

            function PolicyGroupService() {}
            PolicyGroupService.prototype = new BaseService();
            PolicyGroupService.prototype.init = function() {
                this._serviceName = "policyGroupService"
            };
            PolicyGroupService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            PolicyGroupService.prototype.addMultiLanguage = function(b, e, c, f, d, g, a) {
                this.invokeMethod(b, e, c, "addMultiLanguage", f, d, g, a)
            };
            PolicyGroupService.prototype.modifyMultiLanguage = function(b, f, d, g, e, h, a, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", g, e, h, a, c)
            };
            PolicyGroupService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            PolicyGroupService.prototype.getByName = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByName", d, a)
            };
            PolicyGroupService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            PolicyGroupService.prototype.getMultiLanguageList = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getMultiLanguageList", d)
            };
            PolicyGroupService.prototype.getByBasePriceUID = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getByBasePriceUID", b, a)
            };
            PolicyGroupService.prototype.getByPolicyUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByPolicyUID", e, a)
            };
            PolicyGroupService.prototype.addAccessPoint = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "addAccessPoint", b, a)
            };
            PolicyGroupService.prototype.removeAccessPoint = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "removeAccessPoint", b, a)
            };
            PolicyGroupService.prototype.getPolicyGroupsByAccpt = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getPolicyGroupsByAccpt", a)
            };
            PolicyGroupService.prototype.getPolicyGroupsBySchedule = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getPolicyGroupsBySchedule", d)
            };
            PolicyGroupService.prototype.getPolicyGroupsByScheduleAndLocale = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getPolicyGroupsByScheduleAndLocale", e, a)
            };
            PolicyGroupService.prototype.getScheduledValidPolicyGroups = function(a, c, b) {
                this.invokeMethod(a, c, b, "getScheduledValidPolicyGroups")
            };
            PolicyGroupService.prototype.getPolicyGroupsByScheduleAndAccessPoint = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getPolicyGroupsByScheduleAndAccessPoint", e, c)
            };
            PolicyGroupService.prototype.getPolicyGroupsByScheduleAndAccessPointAndLocale = function(b, e, c, f, d, a) {
                this.invokeMethod(b, e, c, "getPolicyGroupsByScheduleAndAccessPointAndLocale", f, d, a)
            };
            PolicyGroupService.prototype.getByEvent = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByEvent", d, a)
            };
            PolicyGroupService.prototype.getDefaultQspZeroPrice = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getDefaultQspZeroPrice", a)
            };
            PolicyGroupService.prototype.getByType = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByType", c)
            };
            PolicyGroupService.prototype.getByTypeLocaleAndValidity = function(c, g, d, f, b, h, a, e) {
                this.invokeMethod(c, g, d, "getByTypeLocaleAndValidity", f, b, h, a, e)
            };
            PolicyGroupService.prototype.getPagedPolicyForCatAndAssetGroupAndAsset = function(i, f, e, d, h, j, c, k, a, b, g) {
                this.invokeMethod(i, f, e, "getPagedPolicyForCatAndAssetGroupAndAsset", d, h, j, c, k, a, b, g)
            };
            PolicyGroupService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function PolicyGrpSubscriptionAggreService() {}
            PolicyGrpSubscriptionAggreService.prototype = new BaseService();
            PolicyGrpSubscriptionAggreService.prototype.init = function() {
                this._serviceName = "policyGrpSubscriptionAggreService"
            };
            PolicyGrpSubscriptionAggreService.prototype.subscribeToPolicyGroup = function(a, e, c, b, g, f, h, d) {
                this.invokeMethod(a, e, c, "subscribeToPolicyGroup", b, g, f, h, d)
            };

            function PolicyService() {}
            PolicyService.prototype = new BaseService();
            PolicyService.prototype.init = function() {
                this._serviceName = "policyService"
            };
            PolicyService.prototype.create = function(f, e, d, b, l, g, k, j, m, i, a, c, h) {
                this.invokeMethod(f, e, d, "create", b, l, g, k, j, m, i, a, c, h)
            };
            PolicyService.prototype.createBasePrice = function(g, f, e, b, m, l, n, k, a, d, i, h, o, c, j) {
                this.invokeMethod(g, f, e, "createBasePrice", b, m, l, n, k, a, d, i, h, o, c, j)
            };
            PolicyService.prototype.update = function(e, d, b, a, f, i, h, j, g, c) {
                this.invokeMethod(e, d, b, "update", a, f, i, h, j, g, c)
            };
            PolicyService.prototype.updateBasePrice = function(f, e, c, a, j, k, i, h, g, l, b, d) {
                this.invokeMethod(f, e, c, "updateBasePrice", a, j, k, i, h, g, l, b, d)
            };
            PolicyService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            PolicyService.prototype.deleteBasePrice = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "deleteBasePrice", a)
            };
            PolicyService.prototype.addMultiLanguage = function(b, e, c, h, d, g, a, f) {
                this.invokeMethod(b, e, c, "addMultiLanguage", h, d, g, a, f)
            };
            PolicyService.prototype.modifyMultiLanguage = function(f, e, d, c, a, i, h, b, g) {
                this.invokeMethod(f, e, d, "modifyMultiLanguage", c, a, i, h, b, g)
            };
            PolicyService.prototype.removeMultiLanguage = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", f, a, e)
            };
            PolicyService.prototype.getByUIDAndType = function(b, d, c, f, a, e) {
                this.invokeMethod(b, d, c, "getByUIDAndType", f, a, e)
            };
            PolicyService.prototype.getByName = function(b, e, c, d, a, f) {
                this.invokeMethod(b, e, c, "getByName", d, a, f)
            };
            PolicyService.prototype.getByType = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByType", e, a)
            };
            PolicyService.prototype.getByPolicyGroupUID = function(b, d, c, f, e, a) {
                this.invokeMethod(b, d, c, "getByPolicyGroupUID", f, e, a)
            };
            PolicyService.prototype.isPolicyApplied = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "isPolicyApplied", e, d)
            };
            PolicyService.prototype.getMultiLanguageListByType = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getMultiLanguageListByType", e, d)
            };
            PolicyService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function PostPaidService() {}
            PostPaidService.prototype = new BaseService();
            PostPaidService.prototype.init = function() {
                this._serviceName = "postPaidService"
            };

            function PreferenceService() {}
            PreferenceService.prototype = new BaseService();
            PreferenceService.prototype.init = function() {
                this._serviceName = "preferenceService"
            };
            PreferenceService.prototype.create = function(k, i, h, f, g, c, j, d, b, a, e) {
                this.invokeMethod(k, i, h, "create", f, g, c, j, d, b, a, e)
            };
            PreferenceService.prototype.update = function(k, h, f, j, d, e, c, i, b, a, g) {
                this.invokeMethod(k, h, f, "update", j, d, e, c, i, b, a, g)
            };
            PreferenceService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            PreferenceService.prototype.getByOriginUID = function(a, e, b, d, c, f, g) {
                this.invokeMethod(a, e, b, "getByOriginUID", d, c, f, g)
            };
            PreferenceService.prototype.getList = function(a, d, b, c, e, f) {
                this.invokeMethod(a, d, b, "getList", c, e, f)
            };
            PreferenceService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function PresenceService() {}
            PresenceService.prototype = new BaseService();
            PresenceService.prototype.init = function() {
                this._serviceName = "presenceService"
            };
            PresenceService.prototype.addUserToAccount = function(k, j, i, g, o, a, c, b, e, l, n, m, f, h, d) {
                this.invokeMethod(k, j, i, "addUserToAccount", g, o, a, c, b, e, l, n, m, f, h, d)
            };
            PresenceService.prototype.removeUserFromAccount = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "removeUserFromAccount", b)
            };
            PresenceService.prototype.removeUserByNameAndAccountNumber = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "removeUserByNameAndAccountNumber", c, e)
            };

            function ProductService() {}
            ProductService.prototype = new BaseService();
            ProductService.prototype.init = function() {
                this._serviceName = "productService"
            };
            ProductService.prototype.create = function(f, e, d, g, a, h, i, b, c) {
                this.invokeMethod(f, e, d, "create", g, a, h, i, b, c)
            };
            ProductService.prototype.update = function(a, d, b, e, f, c) {
                this.invokeMethod(a, d, b, "update", e, f, c)
            };
            ProductService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            ProductService.prototype.addMultiLanguage = function(b, e, c, f, a, d, g) {
                this.invokeMethod(b, e, c, "addMultiLanguage", f, a, d, g)
            };
            ProductService.prototype.modifyMultiLanguage = function(b, f, d, g, a, e, h, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", g, a, e, h, c)
            };
            ProductService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            ProductService.prototype.associateEvent = function(a, d, c, e, b, f) {
                this.invokeMethod(a, d, c, "associateEvent", e, b, f)
            };
            ProductService.prototype.dissociateEvent = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "dissociateEvent", e, b)
            };
            ProductService.prototype.getByOriginUID = function(b, e, c, d, a) {
                this.invokeMethod(b, e, c, "getByOriginUID", d, a)
            };
            ProductService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            ProductService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function ProfileService() {}
            ProfileService.prototype = new BaseService();
            ProfileService.prototype.init = function() {
                this._serviceName = "profileService"
            };
            ProfileService.prototype.create = function(g, e, d, b, i, f, h, j, c, a) {
                this.invokeMethod(g, e, d, "create", b, i, f, h, j, c, a)
            };
            ProfileService.prototype.update = function(g, d, b, e, a, i, f, h, j, c) {
                this.invokeMethod(g, d, b, "update", e, a, i, f, h, j, c)
            };
            ProfileService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            ProfileService.prototype.getByName = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByName", c)
            };
            ProfileService.prototype.getByType = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByType", d)
            };
            ProfileService.prototype.getALaCarteProfiles = function(a, c, b) {
                this.invokeMethod(a, c, b, "getALaCarteProfiles")
            };
            ProfileService.prototype.getEmptyProfiles = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getEmptyProfiles", d)
            };
            ProfileService.prototype.getEmptyProfileUids = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getEmptyProfileUids", d)
            };
            ProfileService.prototype.getPagedAlacarteProfilesByChannelNetCarry = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedAlacarteProfilesByChannelNetCarry", g, b, a, e)
            };
            ProfileService.prototype.getProfiles = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getProfiles", e, c)
            };
            ProfileService.prototype.getByFeatureUIDAndProfileType = function(b, d, c, a, e) {
                this.invokeMethod(b, d, c, "getByFeatureUIDAndProfileType", a, e)
            };
            ProfileService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ProgramService() {}
            ProgramService.prototype = new BaseService();
            ProgramService.prototype.init = function() {
                this._serviceName = "programService"
            };
            ProgramService.prototype.create = function(s, u, y, c, i, j, e, l, k, g, h, d, o, b, x, q, z, p, D, a, C, B, n, m, w, t, A, f, v, r) {
                this.invokeMethod(s, u, y, "create", c, i, j, e, l, k, g, h, d, o, b, x, q, z, p, D, a, C, B, n, m, w, t, A, f, v, r)
            };
            ProgramService.prototype.update = function(q, s, w, l, h, d, j, i, f, g, b, m, a, v, o, x, n, z, c, k, u, r, y, e, t, p) {
                this.invokeMethod(q, s, w, "update", l, h, d, j, i, f, g, b, m, a, v, o, x, n, z, c, k, u, r, y, e, t, p)
            };
            ProgramService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            ProgramService.prototype.addMultiLanguage = function(f, d, c, e, b, j, h, i, g, a, k) {
                this.invokeMethod(f, d, c, "addMultiLanguage", e, b, j, h, i, g, a, k)
            };
            ProgramService.prototype.modifyMultiLanguage = function(g, e, d, f, c, k, i, j, a, h, b, l) {
                this.invokeMethod(g, e, d, "modifyMultiLanguage", f, c, k, i, j, a, h, b, l)
            };
            ProgramService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            ProgramService.prototype.addProgramAltAudioPID = function(b, e, d, a, g, f, c) {
                this.invokeMethod(b, e, d, "addProgramAltAudioPID", a, g, f, c)
            };
            ProgramService.prototype.modifyProgramAltAudioPID = function(b, e, d, a, h, g, c, f) {
                this.invokeMethod(b, e, d, "modifyProgramAltAudioPID", a, h, g, c, f)
            };
            ProgramService.prototype.removeProgramAltAudioPID = function(b, e, d, a, f, c) {
                this.invokeMethod(b, e, d, "removeProgramAltAudioPID", a, f, c)
            };
            ProgramService.prototype.getSimpleProgramByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getSimpleProgramByUID", e, a)
            };
            ProgramService.prototype.getVerboseProgramByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getVerboseProgramByUID", e, a)
            };
            ProgramService.prototype.getVerboseProgramByEventUID = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getVerboseProgramByEventUID", d, e)
            };
            ProgramService.prototype.getAudioPIDsByPgmUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAudioPIDsByPgmUID", d)
            };
            ProgramService.prototype.getVerboseProgramByOriginUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getVerboseProgramByOriginUID", e, a)
            };
            ProgramService.prototype.getPagedVerboseProgramsByOriginUID = function(c, f, d, g, b, a, e) {
                this.invokeMethod(c, f, d, "getPagedVerboseProgramsByOriginUID", g, b, a, e)
            };
            ProgramService.prototype.getPagedPgmAltAudioPIDsByPgmUID = function(b, e, c, f, a, d) {
                this.invokeMethod(b, e, c, "getPagedPgmAltAudioPIDsByPgmUID", f, a, d)
            };
            ProgramService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function ProtectedFirmwareService_v1_0() {}
            ProtectedFirmwareService_v1_0.prototype = new BaseService();
            ProtectedFirmwareService_v1_0.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "protectedFirmwareService_v1_0"
            };
            ProtectedFirmwareService_v1_0.prototype.getShroudedFirmwareKey = function(a, d, b, c, e, f) {
                this.invokeMethod(a, d, b, "getShroudedFirmwareKey", c, e, f)
            };

            function ProvisionService() {}
            ProvisionService.prototype = new BaseService();
            ProvisionService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "provisionService"
            };
            ProvisionService.prototype.postProvisionByMACAddress = function(b, d, c, a, g, f, e) {
                this.invokeMethod(b, d, c, "postProvisionByMACAddress", a, g, f, e)
            };
            ProvisionService.prototype.postProvisionBySmartcardID = function(b, e, c, a, h, f, g, d) {
                this.invokeMethod(b, e, c, "postProvisionBySmartcardID", a, h, f, g, d)
            };
            ProvisionService.prototype.postProvisionCardless = function(b, d, c, a, h, f, e, g) {
                this.invokeMethod(b, d, c, "postProvisionCardless", a, h, f, e, g)
            };
            ProvisionService.prototype.postProvisionCardbased = function(b, e, c, a, h, f, g, d) {
                this.invokeMethod(b, e, c, "postProvisionCardbased", a, h, f, g, d)
            };
            ProvisionService.prototype.fullPostProvision = function(m, i, h, e, n, g, j, f, o, l, c, b, k, p, d, a) {
                this.invokeMethod(m, i, h, "fullPostProvision", e, n, g, j, f, o, l, c, b, k, p, d, a)
            };
            ProvisionService.prototype.fullPostProvisionCardless = function(l, i, h, e, m, g, j, f, n, c, b, k, o, d, a) {
                this.invokeMethod(l, i, h, "fullPostProvisionCardless", e, m, g, j, f, n, c, b, k, o, d, a)
            };
            ProvisionService.prototype.provisionMediaPlayer = function(b, e, c, g, a, d, f) {
                this.invokeMethod(b, e, c, "provisionMediaPlayer", g, a, d, f)
            };

            function QamService() {}
            QamService.prototype = new BaseService();
            QamService.prototype.init = function() {
                this._serviceName = "qamService"
            };
            QamService.prototype.createServiceGroup = function(k, j, h, n, c, l, o, e, m, d, i, a, g, b, f) {
                this.invokeMethod(k, j, h, "createServiceGroup", n, c, l, o, e, m, d, i, a, g, b, f)
            };
            QamService.prototype.createServiceGroupResource = function(m, k, i, l, f, h, n, p, j, c, e, b, o, g, a, d) {
                this.invokeMethod(m, k, i, "createServiceGroupResource", l, f, h, n, p, j, c, e, b, o, g, a, d)
            };
            QamService.prototype.createQamLog = function(g, e, c, f, h, i, a, d, b) {
                this.invokeMethod(g, e, c, "createQamLog", f, h, i, a, d, b)
            };
            QamService.prototype.updateServiceGroup = function(k, i, f, j, n, b, l, o, d, m, c, h, a, g, e) {
                this.invokeMethod(k, i, f, "updateServiceGroup", j, n, b, l, o, d, m, c, h, a, g, e)
            };
            QamService.prototype.updateServiceGroupResource = function(n, k, h, m, l, e, f, o, q, j, b, d, g, a, p, i, c) {
                this.invokeMethod(n, k, h, "updateServiceGroupResource", m, l, e, f, o, q, j, b, d, g, a, p, i, c)
            };
            QamService.prototype.deleteServiceGroup = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "deleteServiceGroup", d)
            };
            QamService.prototype.deleteServiceGroupResource = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "deleteServiceGroupResource", d)
            };
            QamService.prototype.getServiceGroups = function(a, c, b) {
                this.invokeMethod(a, c, b, "getServiceGroups")
            };
            QamService.prototype.getServiceGroupReport = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getServiceGroupReport", d)
            };
            QamService.prototype.getServiceGroupsByQamUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getServiceGroupsByQamUID", c)
            };
            QamService.prototype.getServiceGroupsResourceByServiceGroupUID = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getServiceGroupsResourceByServiceGroupUID", a)
            };
            QamService.prototype.getServiceGroupsResourceByServiceGroupFreq = function(b, d, c, a, e) {
                this.invokeMethod(b, d, c, "getServiceGroupsResourceByServiceGroupFreq", a, e)
            };
            QamService.prototype.getServiceGroupsResourceByServiceGroupFreqIpPort = function(b, e, d, a, g, f, c) {
                this.invokeMethod(b, e, d, "getServiceGroupsResourceByServiceGroupFreqIpPort", a, g, f, c)
            };
            QamService.prototype.getServiceGroupResourceByQamUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getServiceGroupResourceByQamUID", c)
            };
            QamService.prototype.getServiceGroupByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getServiceGroupByUID", d)
            };
            QamService.prototype.getNodeGroupByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getNodeGroupByUID", d)
            };
            QamService.prototype.getServiceGroupByOrigin = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getServiceGroupByOrigin", e, d)
            };
            QamService.prototype.getServiceGroupByErm = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getServiceGroupByErm", a)
            };
            QamService.prototype.getServiceGroupByQamSvcGrpID = function(a, d, c, b, e) {
                this.invokeMethod(a, d, c, "getServiceGroupByQamSvcGrpID", b, e)
            };
            QamService.prototype.getServiceGroupResources = function(a, c, b) {
                this.invokeMethod(a, c, b, "getServiceGroupResources")
            };
            QamService.prototype.getServiceGroupRscByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getServiceGroupRscByUID", d)
            };
            QamService.prototype.getServiceGroupRscBySessionID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getServiceGroupRscBySessionID", d)
            };
            QamService.prototype.deAllocateResource = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "deAllocateResource", d)
            };
            QamService.prototype.getQamLogs = function(a, c, b) {
                this.invokeMethod(a, c, b, "getQamLogs")
            };
            QamService.prototype.getQamLogsBySmartcardID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getQamLogsBySmartcardID", c)
            };
            QamService.prototype.getQamLogsBySessionID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getQamLogsBySessionID", d)
            };
            QamService.prototype.getQamLogsByRscUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getQamLogsByRscUID", d)
            };
            QamService.prototype.getQamLogsByStreamingServerUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getQamLogsByStreamingServerUID", d)
            };
            QamService.prototype.getQamLogsWithCreationDateByServiceGroupUIDAndTime = function(a, f, c, b, e, d) {
                this.invokeMethod(a, f, c, "getQamLogsWithCreationDateByServiceGroupUIDAndTime", b, e, d)
            };
            QamService.prototype.getQamLogsByServiceGroupUIDAndTime = function(a, f, c, b, e, d) {
                this.invokeMethod(a, f, c, "getQamLogsByServiceGroupUIDAndTime", b, e, d)
            };
            QamService.prototype.getAvailableSvcGrpRsc = function(a, e, c, d, b) {
                this.invokeMethod(a, e, c, "getAvailableSvcGrpRsc", d, b)
            };
            QamService.prototype.getServiceGroupByName = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getServiceGroupByName", c)
            };
            QamService.prototype.createNodeGroup = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "createNodeGroup", d)
            };
            QamService.prototype.getNodeGroupsByServiceGroup = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getNodeGroupsByServiceGroup", d)
            };
            QamService.prototype.getServiceGroupsByNodeGroupName = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getServiceGroupsByNodeGroupName", d)
            };

            function RatingService() {}
            RatingService.prototype = new BaseService();
            RatingService.prototype.init = function() {
                this._serviceName = "ratingService"
            };
            RatingService.prototype.create = function(f, e, d, a, g, i, b, c, h, j) {
                this.invokeMethod(f, e, d, "create", a, g, i, b, c, h, j)
            };
            RatingService.prototype.update = function(g, f, e, c, a, h, j, b, d, i, k) {
                this.invokeMethod(g, f, e, "update", c, a, h, j, b, d, i, k)
            };
            RatingService.prototype.del = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "delete", a)
            };
            RatingService.prototype.addMultiLanguage = function(b, e, c, f, d, g, a) {
                this.invokeMethod(b, e, c, "addMultiLanguage", f, d, g, a)
            };
            RatingService.prototype.modifyMultiLanguage = function(b, f, d, g, e, h, a, c) {
                this.invokeMethod(b, f, d, "modifyMultiLanguage", g, e, h, a, c)
            };
            RatingService.prototype.removeMultiLanguage = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "removeMultiLanguage", e, a)
            };
            RatingService.prototype.getList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getList", a)
            };
            RatingService.prototype.getDefaultRating = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getDefaultRating", a)
            };
            RatingService.prototype.getRatingByRatingCode = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getRatingByRatingCode", b, a)
            };
            RatingService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function RolloutManagerClientService() {}
            RolloutManagerClientService.prototype = new BaseService();
            RolloutManagerClientService.prototype.init = function() {
                this._serviceName = "rolloutManagerClientService"
            };

            function RtspsessionService() {}
            RtspsessionService.prototype = new BaseService();
            RtspsessionService.prototype.init = function() {
                this._serviceName = "rtspsessionService"
            };
            RtspsessionService.prototype.createRtspSessionDetails = function(h, f, d, k, m, i, n, b, e, l, j, g, c, a) {
                this.invokeMethod(h, f, d, "createRtspSessionDetails", k, m, i, n, b, e, l, j, g, c, a)
            };
            RtspsessionService.prototype.createRtspSession = function(i, f, d, l, n, j, g, b, e, m, k, h, c, a) {
                this.invokeMethod(i, f, d, "createRtspSession", l, n, j, g, b, e, m, k, h, c, a)
            };
            RtspsessionService.prototype.updateRtspSession = function(j, f, d, h, n, p, l, g, b, e, o, m, i, c, a, k) {
                this.invokeMethod(j, f, d, "updateRtspSession", h, n, p, l, g, b, e, o, m, i, c, a, k)
            };
            RtspsessionService.prototype.endRtspSession = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "endRtspSession", d)
            };
            RtspsessionService.prototype.endRtspSessionBySessionUuid = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "endRtspSessionBySessionUuid", b)
            };
            RtspsessionService.prototype.getRtspSessionByClientID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getRtspSessionByClientID", d)
            };
            RtspsessionService.prototype.getRtspSessionBySessionID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getRtspSessionBySessionID", d)
            };
            RtspsessionService.prototype.getRtspSessionBySessionUuid = function(a, d, c, b) {
                this.invokeMethod(a, d, c, "getRtspSessionBySessionUuid", b)
            };
            RtspsessionService.prototype.getUniqueClientIDsBySmartcardID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getUniqueClientIDsBySmartcardID", c)
            };
            RtspsessionService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function SPChannelMapService() {}
            SPChannelMapService.prototype = new BaseService();
            SPChannelMapService.prototype.init = function() {
                this._serviceName = "sPChannelMapService"
            };
            SPChannelMapService.prototype.create = function(a, e, b, g, f, d, c) {
                this.invokeMethod(a, e, b, "create", g, f, d, c)
            };
            SPChannelMapService.prototype.update = function(a, d, b, e, g, f, c) {
                this.invokeMethod(a, d, b, "update", e, g, f, c)
            };
            SPChannelMapService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            SPChannelMapService.prototype.getByChannelUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByChannelUID", d)
            };
            SPChannelMapService.prototype.isChannelNumberUsed = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "isChannelNumberUsed", d)
            };
            SPChannelMapService.prototype.getList = function(a, c, b) {
                this.invokeMethod(a, c, b, "getList")
            };
            SPChannelMapService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ScsLogService() {}
            ScsLogService.prototype = new BaseService();
            ScsLogService.prototype.init = function() {
                this._serviceName = "scsLogService"
            };
            ScsLogService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function ScsSessionService() {}
            ScsSessionService.prototype = new BaseService();
            ScsSessionService.prototype.init = function() {
                this._serviceName = "scsSessionService"
            };
            ScsSessionService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function SecureEchoService() {}
            SecureEchoService.prototype = new BaseService();
            SecureEchoService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "secureEchoService"
            };
            SecureEchoService.prototype.echo = function(a, c, b) {
                this.invokeMethod(a, c, b, "echo")
            };

            function SetTopBoxTelemetryService() {}
            SetTopBoxTelemetryService.prototype = new BaseService();
            SetTopBoxTelemetryService.prototype.init = function() {
                this._serviceName = "setTopBoxTelemetryService"
            };
            SetTopBoxTelemetryService.prototype.getSystemList = function(a, c, b) {
                this.invokeMethod(a, c, b, "getSystemList")
            };
            SetTopBoxTelemetryService.prototype.getRAGStatusList = function(b, d, c, a) {
                this.invokeMethod(b, d, c, "getRAGStatusList", a)
            };
            SetTopBoxTelemetryService.prototype.getRAGStatus = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getRAGStatus", d)
            };
            SetTopBoxTelemetryService.prototype.getTelemetry = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getTelemetry", d)
            };

            function SignonService() {}
            SignonService.prototype = new BaseService();
            SignonService.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "signonService"
            };
            SignonService.prototype.signonByMACAddress = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "signonByMACAddress", d)
            };
            SignonService.prototype.signonBySmartcardID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "signonBySmartcardID", c)
            };
            SignonService.prototype.signonByCASN = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "signonByCASN", d)
            };
            SignonService.prototype.signonByMpDeviceId = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "signonByMpDeviceId", d)
            };
            SignonService.prototype.signonByMpDeviceIdAndUser = function(a, d, b, f, e, c) {
                this.invokeMethod(a, d, b, "signonByMpDeviceIdAndUser", f, e, c)
            };
            SignonService.prototype.signonByUser = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "signonByUser", e, c)
            };
            SignonService.prototype.updateTokenWithMediaPlayer = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "updateTokenWithMediaPlayer", d)
            };
            SignonService.prototype.signonInitialByUserAndSpid = function(a, d, b, f, c, e) {
                this.invokeMethod(a, d, b, "signonInitialByUserAndSpid", f, c, e)
            };
            SignonService.prototype.signonByUserMpIdAndSpid = function(a, d, b, f, c, e, g) {
                this.invokeMethod(a, d, b, "signonByUserMpIdAndSpid", f, c, e, g)
            };

            function SmartCardService() {}
            SmartCardService.prototype = new BaseService();
            SmartCardService.prototype.init = function() {
                this._serviceName = "smartCardService"
            };
            SmartCardService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function SmsServiceCasDecorator() {}
            SmsServiceCasDecorator.prototype = new BaseService();
            SmsServiceCasDecorator.prototype.init = function() {
                this._serviceName = "smsServiceCasDecorator"
            };

            function SmsServiceCrudDecorator() {}
            SmsServiceCrudDecorator.prototype = new BaseService();
            SmsServiceCrudDecorator.prototype.init = function() {
                this._serviceName = "smsServiceCrudDecorator"
            };

            function SmsServiceProductManager() {}
            SmsServiceProductManager.prototype = new BaseService();
            SmsServiceProductManager.prototype.init = function() {
                this._serviceName = "smsServiceProductManager"
            };

            function SmsServiceValidationDecorator() {}
            SmsServiceValidationDecorator.prototype = new BaseService();
            SmsServiceValidationDecorator.prototype.init = function() {
                this._serviceName = "smsServiceValidationDecorator"
            };

            function Smsservice() {}
            Smsservice.prototype = new BaseService();
            Smsservice.prototype.init = function() {
                this.securityRequired = true;
                this._serviceName = "smsservice"
            };

            function SpecificationLookupService() {}
            SpecificationLookupService.prototype = new BaseService();
            SpecificationLookupService.prototype.init = function() {
                this._serviceName = "specificationLookupService"
            };

            function StatisticsCollectionService() {}
            StatisticsCollectionService.prototype = new BaseService();
            StatisticsCollectionService.prototype.init = function() {
                this._serviceName = "statisticsCollectionService"
            };

            function StatisticsReportingService() {}
            StatisticsReportingService.prototype = new BaseService();
            StatisticsReportingService.prototype.init = function() {
                this._serviceName = "statisticsReportingService"
            };

            function SubscriptionProfileService() {}
            SubscriptionProfileService.prototype = new BaseService();
            SubscriptionProfileService.prototype.init = function() {
                this._serviceName = "subscriptionProfileService"
            };
            SubscriptionProfileService.prototype.subscribeProfile = function(b, e, c, d, g, f, h, a) {
                this.invokeMethod(b, e, c, "subscribeProfile", d, g, f, h, a)
            };
            SubscriptionProfileService.prototype.unsubscribeProfile = function(a, d, b, c, e, f) {
                this.invokeMethod(a, d, b, "unsubscribeProfile", c, e, f)
            };
            SubscriptionProfileService.prototype.subscribeCatalogue = function(a, e, c, d, f, b) {
                this.invokeMethod(a, e, c, "subscribeCatalogue", d, f, b)
            };
            SubscriptionProfileService.prototype.subscribePackage = function(a, e, b, d, f, c) {
                this.invokeMethod(a, e, b, "subscribePackage", d, f, c)
            };
            SubscriptionProfileService.prototype.unsubscribeCatalogue = function(a, e, c, d, b) {
                this.invokeMethod(a, e, c, "unsubscribeCatalogue", d, b)
            };
            SubscriptionProfileService.prototype.unsubscribePackage = function(a, d, b, c, e) {
                this.invokeMethod(a, d, b, "unsubscribePackage", c, e)
            };
            SubscriptionProfileService.prototype.getProfilesByAccountUID = function(a, e, b, c, d) {
                this.invokeMethod(a, e, b, "getProfilesByAccountUID", c, d)
            };

            function SubscriptionService() {}
            SubscriptionService.prototype = new BaseService();
            SubscriptionService.prototype.init = function() {
                this._serviceName = "subscriptionService"
            };
            SubscriptionService.prototype.getCalculatedPrice = function(b, d, c, e, f, a) {
                this.invokeMethod(b, d, c, "getCalculatedPrice", e, f, a)
            };

            function TargetAreaService() {}
            TargetAreaService.prototype = new BaseService();
            TargetAreaService.prototype.init = function() {
                this._serviceName = "targetAreaService"
            };
            TargetAreaService.prototype.create = function(f, d, c, h, e, i, b, j, g, a) {
                this.invokeMethod(f, d, c, "create", h, e, i, b, j, g, a)
            };
            TargetAreaService.prototype.update = function(a, e, b, f, d, g, c) {
                this.invokeMethod(a, e, b, "update", f, d, g, c)
            };
            TargetAreaService.prototype.del = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "delete", d)
            };
            TargetAreaService.prototype.associatePostCode = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "associatePostCode", e, a)
            };
            TargetAreaService.prototype.associatePostCodeList = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "associatePostCodeList", e, b)
            };
            TargetAreaService.prototype.associateAsset = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "associateAsset", e, d)
            };
            TargetAreaService.prototype.associateAssetList = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "associateAssetList", e, b)
            };
            TargetAreaService.prototype.disassociatePostCode = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "disassociatePostCode", e, a)
            };
            TargetAreaService.prototype.disassociatePostCodeList = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "disassociatePostCodeList", e, b)
            };
            TargetAreaService.prototype.disassociateAsset = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "disassociateAsset", e, d)
            };
            TargetAreaService.prototype.disassociateAssetList = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "disassociateAssetList", e, b)
            };
            TargetAreaService.prototype.getByAssetUid = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByAssetUid", e, a)
            };
            TargetAreaService.prototype.getByPostCode = function(c, e, d, b, a) {
                this.invokeMethod(c, e, d, "getByPostCode", b, a)
            };
            TargetAreaService.prototype.getAssetUids = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getAssetUids", d)
            };
            TargetAreaService.prototype.getPostCodes = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getPostCodes", c)
            };
            TargetAreaService.prototype.getByUID = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "getByUID", e, a)
            };

            function TlsSupportService() {}
            TlsSupportService.prototype = new BaseService();
            TlsSupportService.prototype.init = function() {
                this._serviceName = "tlsSupportService"
            };

            function TunerService() {}
            TunerService.prototype = new BaseService();
            TunerService.prototype.init = function() {
                this._serviceName = "tunerService"
            };
            TunerService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function UserManagementService() {}
            UserManagementService.prototype = new BaseService();
            UserManagementService.prototype.init = function() {
                this._serviceName = "userManagementService"
            };
            UserManagementService.prototype.changePinByUserUid = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "changePinByUserUid", e, d)
            };
            UserManagementService.prototype.changePinByAccNumAndUserName = function(a, c, b, e, d, f) {
                this.invokeMethod(a, c, b, "changePinByAccNumAndUserName", e, d, f)
            };
            UserManagementService.prototype.getAccountUsers = function(a, c, b) {
                this.invokeMethod(a, c, b, "getAccountUsers")
            };
            UserManagementService.prototype.getSignedInUser = function(a, c, b) {
                this.invokeMethod(a, c, b, "getSignedInUser")
            };
            UserManagementService.prototype.createUser = function(f, d, c, a, b, i, g, h, e) {
                this.invokeMethod(f, d, c, "createUser", a, b, i, g, h, e)
            };
            UserManagementService.prototype.removeUser = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "removeUser", d)
            };
            UserManagementService.prototype.updatePassword = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "updatePassword", d, e)
            };
            UserManagementService.prototype.setAsDefault = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "setAsDefault", d)
            };
            UserManagementService.prototype.updateLogin = function(a, d, c, e, b) {
                this.invokeMethod(a, d, c, "updateLogin", e, b)
            };
            UserManagementService.prototype.updateRatingId = function(c, e, d, f, b, a) {
                this.invokeMethod(c, e, d, "updateRatingId", f, b, a)
            };
            UserManagementService.prototype.updateType = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "updateType", e, c)
            };
            UserManagementService.prototype.updateDateOfBirth = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "updateDateOfBirth", e, c)
            };
            UserManagementService.prototype.updatePurchaseAbility = function(b, d, c, e, a) {
                this.invokeMethod(b, d, c, "updatePurchaseAbility", e, a)
            };

            function UserService() {}
            UserService.prototype = new BaseService();
            UserService.prototype.init = function() {
                this._serviceName = "userService"
            };
            UserService.prototype.getByAcctUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByAcctUID", d)
            };
            UserService.prototype.getByOriginUID = function(a, d, b, c) {
                this.invokeMethod(a, d, b, "getByOriginUID", c)
            };
            UserService.prototype.getDefaultUserByAcctUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getDefaultUserByAcctUID", d)
            };
            UserService.prototype.getByLoginIDAndPin = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getByLoginIDAndPin", e, c)
            };
            UserService.prototype.getByLoginIdAndPasswordAfterPwdProcessing = function(a, d, b, e, c) {
                this.invokeMethod(a, d, b, "getByLoginIdAndPasswordAfterPwdProcessing", e, c)
            };
            UserService.prototype.getByNameAndPin = function(a, e, b, d, c) {
                this.invokeMethod(a, e, b, "getByNameAndPin", d, c)
            };
            UserService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };
            UserService.prototype.getByUID = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getByUID", d)
            };

            function Verimatrix() {}
            Verimatrix.prototype = new BaseService();
            Verimatrix.prototype.init = function() {
                this._serviceName = "verimatrix"
            };

            function VerimatrixCasIntegrationFactoryService() {}
            VerimatrixCasIntegrationFactoryService.prototype = new BaseService();
            VerimatrixCasIntegrationFactoryService.prototype.init = function() {
                this._serviceName = "verimatrixCasIntegrationFactoryService"
            };

            function ViaccessLicenseService() {}
            ViaccessLicenseService.prototype = new BaseService();
            ViaccessLicenseService.prototype.init = function() {
                this._serviceName = "viaccessLicenseService"
            };
            ViaccessLicenseService.prototype.getLicense = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "getLicense", d)
            };
            ViaccessLicenseService.prototype.getLicenseWithContext = function(a, c, b, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithContext", d, e)
            };
            ViaccessLicenseService.prototype.getLicenseWithChallengeAuthentication = function(a, c, b, e, d) {
                this.invokeMethod(a, c, b, "getLicenseWithChallengeAuthentication", e, d)
            };
            ViaccessLicenseService.prototype.getLicenseWithAdditionalInfo = function(a, c, b, g, f, d, e) {
                this.invokeMethod(a, c, b, "getLicenseWithAdditionalInfo", g, f, d, e)
            };
            ViaccessLicenseService.prototype.linkAuxiliarySTB = function(a, e, c, g, f, d, b) {
                this.invokeMethod(a, e, c, "linkAuxiliarySTB", g, f, d, b)
            };

            function WorkflowSubscriptionService() {}
            WorkflowSubscriptionService.prototype = new BaseService();
            WorkflowSubscriptionService.prototype.init = function() {
                this._serviceName = "workflowSubscriptionService"
            };
            WorkflowSubscriptionService.prototype.updateSubscription = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "updateSubscription", d)
            };
            WorkflowSubscriptionService.prototype.createSubscription = function(a, c, b, d) {
                this.invokeMethod(a, c, b, "createSubscription", d)
            };
            WorkflowSubscriptionService.prototype.createSmartCardSubscription = function(h, d, c, f, a, b, i, g, e, j) {
                this.invokeMethod(h, d, c, "createSmartCardSubscription", f, a, b, i, g, e, j)
            };
            WorkflowSubscriptionService.prototype.createNewSubscription = function(h, d, c, f, a, i, b, g, e) {
                this.invokeMethod(h, d, c, "createNewSubscription", f, a, i, b, g, e)
            };

            function WorkflowSwapDevicesService() {}
            WorkflowSwapDevicesService.prototype = new BaseService();
            WorkflowSwapDevicesService.prototype.init = function() {
                this._serviceName = "workflowSwapDevicesService"
            };

            function VisitorService() {};
            VisitorService.prototype = new BaseService();
            VisitorService.prototype.init = function() {
                this._serviceName = "VisitorService";
            };
            VisitorService.prototype.getValues = function(jsCaller, jsSuccessCallback, jsFailureCallback, hostName, hostProperty, spid, name) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getValues", hostName, hostProperty, spid, name);
            };
            VisitorService.prototype.getValue = function(jsCaller, jsSuccessCallback, jsFailureCallback, hostName, hostProperty, spid, name) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getValue", hostName, hostProperty, spid, name);
            };
            VisitorService.prototype.getValueAsInt = function(jsCaller, jsSuccessCallback, jsFailureCallback, hostName, hostProperty, spid, name) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getValueAsInt", hostName, hostProperty, spid, name);
            };
            VisitorService.prototype.getGroup = function(jsCaller, jsSuccessCallback, jsFailureCallback, hostName, hostProperty, grp, spid) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getGroup", hostName, hostProperty, grp, spid);
            };
            VisitorService.prototype.getByUID = function(jsCaller, jsSuccessCallback, jsFailureCallback, uid) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getByUID", uid);
            };
            VisitorService.prototype.getByOrigin = function(jsCaller, jsSuccessCallback, jsFailureCallback, originKey, originID) {
                this.invokeMethod(jsCaller, jsSuccessCallback, jsFailureCallback, "getByOrigin", originKey, originID);
            };

            window.ALaCarteService = ALaCarteService;
            window.AccessPointService = AccessPointService;
            window.AccountAggregateService = AccountAggregateService;
            window.AccountService = AccountService;
            window.AcquiredContentListService = AcquiredContentListService;
            window.AdLogService = AdLogService;
            window.AdManagementService = AdManagementService;
            window.AdMetadataService = AdMetadataService;
            window.AdvertDecisionService = AdvertDecisionService;
            window.AdvertMaintenanceService = AdvertMaintenanceService;
            window.AlaCarteValidationService = AlaCarteValidationService;
            window.AladdinSmsGwCasIntegrationFactoryService = AladdinSmsGwCasIntegrationFactoryService;
            window.ApplicationServerTelemetryService = ApplicationServerTelemetryService;
            window.AssetGroupService = AssetGroupService;
            window.AssetSearchService = AssetSearchService;
            window.AssetService = AssetService;
            window.AuthnEchoService = AuthnEchoService;
            window.BTVService = BTVService;
            window.BillingService = BillingService;
            window.BlockingService = BlockingService;
            window.BocAssetService = BocAssetService;
            window.BocContentTypeService = BocContentTypeService;
            window.BocLicenseCRUDService = BocLicenseCRUDService;
            window.BocLicenseProxyService = BocLicenseProxyService;
            window.BocPurchaseService = BocPurchaseService;
            window.BookmarkService = BookmarkService;
            window.BtvBrowsingService = BtvBrowsingService;
            window.BtvConaxAzmiLicenseService = BtvConaxAzmiLicenseService;
            window.BtvConaxOESLicenseService = BtvConaxOESLicenseService;
            window.BtvLicenseValidityService = BtvLicenseValidityService;
            window.BtvNagraDVSLicenseService = BtvNagraDVSLicenseService;
            window.BtvViaccessLicenseService = BtvViaccessLicenseService;
            window.CDNService = CDNService;
            window.CODService = CODService;
            window.CasConfigurationService = CasConfigurationService;
            window.CasInstanceService = CasInstanceService;
            window.CasIntegrationFactoryService = CasIntegrationFactoryService;
            window.CatalogueService = CatalogueService;
            window.CategoryService = CategoryService;
            window.CcaCcomService = CcaCcomService;
            window.CdnTokenService = CdnTokenService;
            window.ChallengeAggregateService = ChallengeAggregateService;
            window.ChallengeService = ChallengeService;
            window.ChannelService = ChannelService;
            window.CodAclFinderService = CodAclFinderService;
            window.CodBrowsingService = CodBrowsingService;
            window.CodBuyService = CodBuyService;
            window.CodCategoryService = CodCategoryService;
            window.CodConaxAzmiLicenseService = CodConaxAzmiLicenseService;
            window.CodConaxOESLicenseService = CodConaxOESLicenseService;
            window.CodFilterScheduleService = CodFilterScheduleService;
            window.CodFilterService = CodFilterService;
            window.CodHelperService = CodHelperService;
            window.CodLicenseService = CodLicenseService;
            window.CodLicenseValidityService = CodLicenseValidityService;
            window.CodNagraDVSLicenseService = CodNagraDVSLicenseService;
            window.CodNoopLicenseService = CodNoopLicenseService;
            window.CodScheduleService = CodScheduleService;
            window.CodSubscriptionBuyService = CodSubscriptionBuyService;
            window.CodSubscriptionConsumService = CodSubscriptionConsumService;
            window.CodViaccessLicenseService = CodViaccessLicenseService;
            window.CompanionMessageService = CompanionMessageService;
            window.Conax = Conax;
            window.ConaxAzmiGatewayService = ConaxAzmiGatewayService;
            window.ConaxAzmiLicenseService = ConaxAzmiLicenseService;
            window.ConaxCasIntegrationFactoryService = ConaxCasIntegrationFactoryService;
            window.ConaxOESLicenseService = ConaxOESLicenseService;
            window.ConaxOESgwService = ConaxOESgwService;
            window.ConfigurationService = ConfigurationService;
            window.ContentConsumptionService = ContentConsumptionService;
            window.ContentUsageService = ContentUsageService;
            window.ContextService = ContextService;
            window.CpvrOperationService = CpvrOperationService;
            window.CpvrService = CpvrService;
            window.DataextractService = DataextractService;
            window.DeviceAggregateService = DeviceAggregateService;
            window.DeviceClassifierService = DeviceClassifierService;
            window.DeviceService = DeviceService;
            window.DevicegroupService = DevicegroupService;
            window.DrmService = DrmService;
            window.Drmworkflowservice = Drmworkflowservice;
            window.DynamicAdvertsService = DynamicAdvertsService;
            window.EventService = EventService;
            window.ExternalGroupService = ExternalGroupService;
            window.ExternalSystemStatusService = ExternalSystemStatusService;
            window.FavouriteService = FavouriteService;
            window.FeatureService = FeatureService;
            window.FirmwareRegistrationService = FirmwareRegistrationService;
            window.FirmwareUpgradeService = FirmwareUpgradeService;
            window.InitialisationService = InitialisationService;
            window.IntervalService = IntervalService;
            window.LicenseCRUDService = LicenseCRUDService;
            window.LicenseService = LicenseService;
            window.LicenseValidityService = LicenseValidityService;
            window.LinkedStbService = LinkedStbService;
            window.LoggingService = LoggingService;
            window.MerlinSmsGwCasIntegrationFactoryService = MerlinSmsGwCasIntegrationFactoryService;
            window.NPVRService = NPVRService;
            window.NagraDVSLicenseService = NagraDVSLicenseService;
            window.NagraDVSgwService = NagraDVSgwService;
            window.NmpExtendedService = NmpExtendedService;
            window.NmpOperatorService = NmpOperatorService;
            window.NmpsCoreService = NmpsCoreService;
            window.Noop = Noop;
            window.NoopLicenseService = NoopLicenseService;
            window.NpvrSearchService = NpvrSearchService;
            window.NpvrrecordingService = NpvrrecordingService;
            window.NullObjectCASIntegrationService = NullObjectCASIntegrationService;
            window.NvodChannelService = NvodChannelService;
            window.NvodEventService = NvodEventService;
            window.NvodProgramService = NvodProgramService;
            window.OpenEchoService = OpenEchoService;
            window.OriginToUidService = OriginToUidService;
            window.OriginToUid_v1_1Service = OriginToUid_v1_1Service;
            window.OttSessionService = OttSessionService;
            window.OttUpgradeService = OttUpgradeService;
            window.PAVService = PAVService;
            window.PPVService = PPVService;
            window.PackageService = PackageService;
            window.PasswordHashService = PasswordHashService;
            window.PayWizardCardService = PayWizardCardService;
            window.PaymentGatewayService = PaymentGatewayService;
            window.PingService = PingService;
            window.PolicyGroupService = PolicyGroupService;
            window.PolicyGrpSubscriptionAggreService = PolicyGrpSubscriptionAggreService;
            window.PolicyService = PolicyService;
            window.PostPaidService = PostPaidService;
            window.PreferenceService = PreferenceService;
            window.PresenceService = PresenceService;
            window.ProductService = ProductService;
            window.ProfileService = ProfileService;
            window.ProgramService = ProgramService;
            window.ProtectedFirmwareService_v1_0 = ProtectedFirmwareService_v1_0;
            window.ProvisionService = ProvisionService;
            window.QamService = QamService;
            window.RatingService = RatingService;
            window.RolloutManagerClientService = RolloutManagerClientService;
            window.RtspsessionService = RtspsessionService;
            window.SPChannelMapService = SPChannelMapService;
            window.ScsLogService = ScsLogService;
            window.ScsSessionService = ScsSessionService;
            window.SecureEchoService = SecureEchoService;
            window.SetTopBoxTelemetryService = SetTopBoxTelemetryService;
            window.SignonService = SignonService;
            window.SmartCardService = SmartCardService;
            window.SmsServiceCasDecorator = SmsServiceCasDecorator;
            window.SmsServiceCrudDecorator = SmsServiceCrudDecorator;
            window.SmsServiceProductManager = SmsServiceProductManager;
            window.SmsServiceValidationDecorator = SmsServiceValidationDecorator;
            window.Smsservice = Smsservice;
            window.SpecificationLookupService = SpecificationLookupService;
            window.StatisticsCollectionService = StatisticsCollectionService;
            window.StatisticsReportingService = StatisticsReportingService;
            window.SubscriptionProfileService = SubscriptionProfileService;
            window.SubscriptionService = SubscriptionService;
            window.TargetAreaService = TargetAreaService;
            window.TlsSupportService = TlsSupportService;
            window.TunerService = TunerService;
            window.UserManagementService = UserManagementService;
            window.UserService = UserService;
            window.Verimatrix = Verimatrix;
            window.VerimatrixCasIntegrationFactoryService = VerimatrixCasIntegrationFactoryService;
            window.ViaccessLicenseService = ViaccessLicenseService;
            window.WorkflowSubscriptionService = WorkflowSubscriptionService;
            window.WorkflowSwapDevicesService = WorkflowSwapDevicesService;
            window.VisitorService = VisitorService;

        }());
        return $N.services.sdp.stubs.allServices;
    }
);