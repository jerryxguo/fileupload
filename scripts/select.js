/*
 * Processing script for the selection page.
 */
module.exports = function (req, res, next) {

	var arrErrors = new Array();

	// Determine the type of image that is being uploaded and read other entered details from the form
	var strImageType = req.body.imageType;
	var strVODContentID = req.body.vodContentID;
	var strVODImageCategory = req.body.vodImageCategory;
	var strNODENodeID = req.body.nodeNodeID;
	var strNODEImageCategory = req.body.nodeImageCategory;
	var strSERIESSeriesID = req.body.seriesSeriesID;
	var strSERIESImageCategory = req.body.seriesImageCategory;
	var objImage_single = req.files.imageFile_single;
	var objImage_background = req.files.imageFile_background;
	var objImage_logo = req.files.imageFile_logo;
	var objImage_cover = req.files.imageFile_cover;

	// Determine the category and ID of the images being uploaded
	var strImageID = (strImageType == IMAGE_TYPE_VOD ? strVODContentID : (strImageType == IMAGE_TYPE_NODE ? strNODENodeID : (strImageType == IMAGE_TYPE_SERIES ? strSERIESSeriesID : "")));
	var strImageCategory = (strImageType == IMAGE_TYPE_VOD ? strVODImageCategory : (strImageType == IMAGE_TYPE_NODE ? strNODEImageCategory : (strImageType == IMAGE_TYPE_SERIES ? strSERIESImageCategory : "")));

	// Validate the submitted form: check for an image ID
	if (strImageType == IMAGE_TYPE_VOD && strImageID.length == 0) {
		arrErrors.push("Please enter a Content ID for the VOD image.");
	} else if (strImageType == IMAGE_TYPE_NODE && strImageID.length == 0) {
		arrErrors.push("Please enter a Node ID for the Node image.");
	} else if (strImageType == IMAGE_TYPE_SERIES && strImageID.length == 0) {
		arrErrors.push("Please enter a Series ID for the Series image.");
	}

	// Validate the submitted form: check that all required files have been uploaded
	var blnSingleImage = (strImageType == IMAGE_TYPE_VOD) || (strImageType == IMAGE_TYPE_SERIES) || (strImageType == IMAGE_TYPE_NODE && strNODEImageCategory != IMAGE_CATEGORY_CHANNELPAGE);
	if (blnSingleImage) {

		// For VOD, SERIES and non-channel NODE image categories only one image file is required
		console.log(global.logMessagePrefix() + "Image selected: " + objImage_single.name + " (" + objImage_single.type + ")");

		// Check for the existence of the file, whether it is an image, and a valid type
		if (objImage_single.name.length == 0) {
			arrErrors.push("Please select an image to upload.");
		} else if (objImage_single.type.indexOf("image") == -1) {
			arrErrors.push("The selected file is not an image.");
		} else {
			var arrValidTypes = m_objConfig.imageValidTypes;
			if (arrValidTypes instanceof Array) {
				if (arrValidTypes.indexOf(objImage_single.type) == -1) {
					strValidTypes = arrValidTypes.join(", ").replace(/image\//g, "");
					arrErrors.push("The selected file is not a valid image type. Valid image types are: " + strValidTypes.toUpperCase() + ".");
				}
			} else {
				arrErrors.push("The selected file is not an image.");
			}
		}

	} else {

		// For NODE channel image categories the background and logo image files are required
		console.log(global.logMessagePrefix() + "Image selected: " + objImage_background.name + " (" + objImage_background.type + ")");
		console.log(global.logMessagePrefix() + "Image selected: " + objImage_logo.name + " (" + objImage_logo.type + ")");
		console.log(global.logMessagePrefix() + "Image selected: " + objImage_cover.name + " (" + objImage_cover.type + ")");

		// Check for the existence of the Background file, whether it is an image, and a valid type
		if (objImage_background.name.length == 0) {
			arrErrors.push("Please select a Background image to upload.");
		} else if (objImage_background.type.indexOf("image") == -1) {
			arrErrors.push("The selected Background file is not an image.");
		} else {
			var arrValidTypes = m_objConfig.imageValidTypes;
			if (arrValidTypes instanceof Array) {
				if (arrValidTypes.indexOf(objImage_background.type) == -1) {
					strValidTypes = arrValidTypes.join(", ").replace(/image\//g, "");
					arrErrors.push("The selected Background file is not a valid image type. Valid image types are: " + strValidTypes.toUpperCase() + ".");
				}
			} else {
				arrErrors.push("The selected Background file is not an image.");
			}
		}

		// Check for the existence of the Logo file, whether it is an image, and a valid type
		if (objImage_logo.name.length == 0) {
			arrErrors.push("Please select a Logo image to upload.");
		} else if (objImage_logo.type.indexOf("image") == -1) {
			arrErrors.push("The selected Logo file is not an image.");
		} else {
			var arrValidTypes = m_objConfig.imageValidTypes;
			if (arrValidTypes instanceof Array) {
				if (arrValidTypes.indexOf(objImage_logo.type) == -1) {
					strValidTypes = arrValidTypes.join(", ").replace(/image\//g, "");
					arrErrors.push("The selected Logo file is not a valid image type. Valid image types are: " + strValidTypes.toUpperCase() + ".");
				}
			} else {
				arrErrors.push("The selected Logo file is not an image.");
			}
		}

		// Check that the Cover file (if uploaded) is an image and a valid type
		if (objImage_cover.name.length > 0) {
			if (objImage_cover.type.indexOf("image") == -1) {
				arrErrors.push("The selected Cover file is not an image.");
			} else {
				var arrValidTypes = m_objConfig.imageValidTypes;
				if (arrValidTypes instanceof Array) {
					if (arrValidTypes.indexOf(objImage_cover.type) == -1) {
						strValidTypes = arrValidTypes.join(", ").replace(/image\//g, "");
						arrErrors.push("The selected Cover file is not a valid image type. Valid image types are: " + strValidTypes.toUpperCase() + ".");
					}
				} else {
					arrErrors.push("The selected Cover file is not an image.");
				}
			}
		}
	}

	if (arrErrors.length == 0) {
		// If there are no errors then rename and move the files into the temporary directory

		var fs = require("fs");
		if (blnSingleImage) {
			// Using the current date (in ISO format) as part of the filename will allow the application
			// to periodically cleanup older files, as well as ensure that the filename will be unique
			var strPathName = objImage_single.path;
			var strTemporaryFilename = new Date().toISOString() + "_" + objImage_single.name;

			// Replace colons with underscores in the filename in case the file will be saved to a Windows server
			strTemporaryFilename = strTemporaryFilename.replace(/:/g, "_");

			fs.rename(strPathName, m_objConfig.previewImageLocation + strTemporaryFilename, function (err) {
				if (!err) {
					console.log(global.logMessagePrefix() + "Renaming temporary image: " + strTemporaryFilename);

					// When the rename operation has passed redirect the user to the preview page
					res.redirect("/imageupload/preview?imageType=" + strImageType + "&imageCategory=" + strImageCategory + "&imageID=" + strImageID
						+ "&name_single=" + objImage_single.name + "&location_single=" + strTemporaryFilename);
				} else {
					next(err);
				}
			});
		} else {
			// Using the current date (in ISO format) as part of the filename will allow the application
			// to periodically cleanup older files, as well as ensure that the filename will be unique
			var strPathName_background = objImage_background.path;
			var strTemporaryFilename_background = IMAGE_PREFIX_BACKGROUND + new Date().toISOString() + "_" + objImage_background.name;
			strTemporaryFilename_background = strTemporaryFilename_background.replace(/:/g, "_");

			var strPathName_logo = objImage_logo.path;
			var strTemporaryFilename_logo = IMAGE_PREFIX_LOGO + new Date().toISOString() + "_" + objImage_logo.name;
			strTemporaryFilename_logo = strTemporaryFilename_logo.replace(/:/g, "_");

			var strPathName_cover = objImage_cover.path;
			var strTemporaryFilename_cover = IMAGE_PREFIX_COVER + new Date().toISOString() + "_" + objImage_cover.name;
			strTemporaryFilename_cover = strTemporaryFilename_cover.replace(/:/g, "_");

			// Rename the Background image
			fs.rename(strPathName_background, m_objConfig.previewImageLocation + strTemporaryFilename_background, function (err) {
				if (!err) {
					console.log(global.logMessagePrefix() + "Renaming temporary image: " + strTemporaryFilename_background);

					// Rename the Logo image
					fs.rename(strPathName_logo, m_objConfig.previewImageLocation + strTemporaryFilename_logo, function (err) {
						if (!err) {
							console.log(global.logMessagePrefix() + "Renaming temporary image: " + strTemporaryFilename_logo);

							if (objImage_cover.name.length > 0) {

								// Rename the Cover image
								fs.rename(strPathName_cover, m_objConfig.previewImageLocation + strTemporaryFilename_cover, function (err) {
									if (!err) {
										console.log(global.logMessagePrefix() + "Renaming temporary image: " + strTemporaryFilename_cover);

										// When the rename operation has passed redirect the user to the preview page
										res.redirect("/imageupload/preview?imageType=" + strImageType + "&imageCategory=" + strImageCategory + "&imageID=" + strImageID
											+ "&name_background=" + objImage_background.name + "&location_background=" + strTemporaryFilename_background
											+ "&name_logo=" + objImage_logo.name + "&location_logo=" + strTemporaryFilename_logo
											+ "&name_cover=" + objImage_cover.name + "&location_cover=" + strTemporaryFilename_cover);
									} else {
										next(err);
									}
								});
							} else {
								// When the rename operation has passed redirect the user to the preview page
								res.redirect("/imageupload/preview?imageType=" + strImageType + "&imageCategory=" + strImageCategory + "&imageID=" + strImageID
									+ "&name_background=" + objImage_background.name + "&location_background=" + strTemporaryFilename_background
									+ "&name_logo=" + objImage_logo.name + "&location_logo=" + strTemporaryFilename_logo);
							}
						} else {
							next(err);
						}
					});
				} else {
					next(err);
				}
			});
		}

	} else {
		// If there are errors then re-render the selection page
		req.body.error = arrErrors.join("\n");
		m_objRoutes.showSelect(req, res, next);
	}
};
