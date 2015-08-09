function buildErrorArray(strErrors) {
	var arrErrorList = [];
	if (strErrors) {
		var arrErrors = strErrors.split("\n");
		for (var i = 0; i < arrErrors.length; i++) {
			arrErrorList.push({ "error": arrErrors[i] });
		}
	}
	return arrErrorList;
}

function buildFilenameArray(req, blnIsSingleFileUpload) {
	var arrFilenameList = [];
	if (blnIsSingleFileUpload) {
		arrFilenameList.push({ "index": 0, "filename": req.query.name_single, "location": req.query.location_single });
	} else {
		arrFilenameList.push({ "index": 0, "title": "Background: ", "filename": req.query.name_background, "location": req.query.location_background });
		arrFilenameList.push({ "index": 1, "title": "Logo: ", "filename": req.query.name_logo, "location": req.query.location_logo });
		if (req.query.name_cover) {
			arrFilenameList.push({ "index": 2, "title": "Cover: ", "filename": req.query.name_cover, "location": req.query.location_cover });
		}
	}
	return arrFilenameList;
}

/*
 * Route for the index page. This will redirect to select.html.
 * The exports variable exposes the objects defined in this file to other files ("modules").
 */
exports.index = function (req, res, next) {
	try {
		res.redirect("/imageupload/select");
	} catch (err) {
		throw err;
	}
};

/*
 * Route for the selection page. This will use the select.mustache template to render the page.
 */
exports.showSelect = function (req, res, next) {
	try {
		var strImageType = req.body.imageType;
		var blnIsSingleFileUpload = (strImageType == null)
			|| (strImageType == IMAGE_TYPE_VOD)
			|| (strImageType == IMAGE_TYPE_SERIES)
			|| (strImageType == IMAGE_TYPE_NODE && req.body.nodeImageCategory != IMAGE_CATEGORY_CHANNELPAGE);
		var arrErrorList = buildErrorArray(req.body.error);

		res.render("select",
		{
			title: m_objConfig.applicationTitle,
			errors: arrErrorList,
			isVOD: (strImageType == IMAGE_TYPE_VOD || strImageType == null),
			vodContentID: req.body.vodContentID,
			vodImageCategory: req.body.vodImageCategory,
			isVOD_LANDSCAPE: (req.body.vodImageCategory == IMAGE_CATEGORY_LANDSCAPE || req.body.vodImageCategory == null),
			isVOD_POSTER: (req.body.vodImageCategory == IMAGE_CATEGORY_POSTER),
			isVOD_SQUARE: (req.body.vodImageCategory == IMAGE_CATEGORY_SQUARE),
			isNODE: (strImageType == IMAGE_TYPE_NODE),
			nodeNodeID: req.body.nodeNodeID,
			nodeImageCategory: req.body.nodeImageCategory,
			isNODE_SINGLEIMAGE: (req.body.nodeImageCategory == IMAGE_CATEGORY_SINGLEIMAGE),
			isNODE_CHANNELPAGE: (req.body.nodeImageCategory == IMAGE_CATEGORY_CHANNELPAGE),
			isSERIES: (strImageType == IMAGE_TYPE_SERIES),
			seriesSeriesID: req.body.seriesSeriesID,
			isSingleFileUpload: blnIsSingleFileUpload
		});
	} catch (err) {
		throw err;
	}
};

/*
 * Route for the /select script. This will process the form being submitted that includes the image.
 */
exports.processSelect = function (req, res, next) {
	try {
		if (req.body.onPreviewPage) {
			var strImageType = req.body.imageType;

			req.body.vodContentID = (strImageType == IMAGE_TYPE_VOD ? req.body.imageID : "");
			req.body.vodImageCategory = (strImageType == IMAGE_TYPE_VOD ? req.body.imageCategory : "");
			req.body.nodeNodeID = (strImageType == IMAGE_TYPE_NODE ? req.body.imageID : "");
			req.body.nodeImageCategory = (strImageType == IMAGE_TYPE_NODE ? req.body.imageCategory : "");
			req.body.seriesSeriesID = (strImageType == IMAGE_TYPE_SERIES ? req.body.imageID : "");
			req.body.seriesImageCategory = (strImageType == IMAGE_TYPE_SERIES ? req.body.imageCategory : "");

			m_objRoutes.showSelect(req, res, next);
		} else {
			var objSelectScript = require("../scripts/select.js");
			objSelectScript(req, res, next);
		}
	} catch (err) {
		throw err;
	}
};

/*
 * Route for the preview page. This will use the preview.mustache template to render the page.
 */
exports.showPreview = function (req, res, next) {
	try {
		var strImageType = req.query.imageType;
		var blnIsSingleFileUpload = !(strImageType == IMAGE_TYPE_NODE && req.query.imageCategory == IMAGE_CATEGORY_CHANNELPAGE);
		var arrErrorList = buildErrorArray(req.query.error);
		var arrFilenameList = buildFilenameArray(req, blnIsSingleFileUpload);

		res.render("preview",
		{
			title: m_objConfig.applicationTitle,
			minimumAspectRatio: m_objConfig.imageCategoryRules.minimumAspectRatioSquare,
			maximumAspectRatio: m_objConfig.imageCategoryRules.maximumAspectRatioSquare,
			errors: arrErrorList,
			filenames: arrFilenameList,
			imageBase: "../temp/",
			isSingleFileUpload: blnIsSingleFileUpload,
			imageType: strImageType,
			imageCategory: req.query.imageCategory,
			imageID: req.query.imageID,
			isVOD: (strImageType == IMAGE_TYPE_VOD || strImageType == null),
			isVOD_LANDSCAPE: (strImageType == IMAGE_TYPE_VOD ? (req.query.imageCategory == IMAGE_CATEGORY_LANDSCAPE) : false),
			isVOD_POSTER: (strImageType == IMAGE_TYPE_VOD ? (req.query.imageCategory == IMAGE_CATEGORY_POSTER) : false),
			isVOD_SQUARE: (strImageType == IMAGE_TYPE_VOD ? (req.query.imageCategory == IMAGE_CATEGORY_SQUARE) : false),
			isNODE: (strImageType == IMAGE_TYPE_NODE),
			isNODE_SINGLEIMAGE: (strImageType == IMAGE_TYPE_NODE ? (req.query.imageCategory == IMAGE_CATEGORY_SINGLEIMAGE) : false),
			isNODE_CHANNELPAGE: (strImageType == IMAGE_TYPE_NODE ? (req.query.imageCategory == IMAGE_CATEGORY_CHANNELPAGE) : false),
			isSERIES: (strImageType == IMAGE_TYPE_SERIES)
		});
	} catch (err) {
		throw err;
	}
};

/*
 * Route for the /publish script. This will process the form being submitted that includes image metadata.
 */
exports.processPublish = function (req, res, next) {
	var objPublishScript = require("../scripts/publish.js");
	try {
		objPublishScript(req, res, next);
	} catch (err) {
		throw err;
	}
};
