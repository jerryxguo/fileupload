/*
 * Processing script for image publishing.
 */
var m_objFTP = require("./ftp.js");

/**
 * Convert a Javascript object into a querystring.
 */
function convertObjectToQueryString(obj) {
	var arrValues = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p))
			arrValues.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	return arrValues.join("&");
}

/**
 * Publishes a VOD image and its ingest file to CIS.
 */
function publishVODImage(strImageCategory, strImageID, arrImages, arrJobs, arrPublishedFilenames, fnCallback) {

	console.log(global.logMessagePrefix() + "VOD images left to publish: " + String(arrImages.length));

	// Set the FTP location for VOD images to the CIS server
	var strFTP_uri = m_objConfig.publishServers.cis.uri;
	var strFTP_imageTarget = m_objConfig.publishServers.cis.imageTarget;
	var strFTP_ingestTarget = m_objConfig.publishServers.cis.ingestTarget;

	// Read the details of the next image to publish
	var objImage = arrImages.shift();

	// Determine the CMS image type
	if (strImageCategory == IMAGE_CATEGORY_LANDSCAPE) {
		var strCMSImageType = m_objConfig.publishServers.cis.cmsImageType.Landscape;
	} else if (strImageCategory == IMAGE_CATEGORY_POSTER) {
		var strCMSImageType = m_objConfig.publishServers.cis.cmsImageType.Poster;
	} else {
		var strCMSImageType = m_objConfig.publishServers.cis.cmsImageType.Square;
	}

	// Determine the new filename for the VOD image
	// The current filename will be in the format: yyyy-MM-ddTHH_mm_ss.SSSZ_<OriginalImageFilename>_<CMSImageType>.<FileExtension>
	// The new filename format is: <OriginalImageFilename>_<CMSImageType>.<FileExtension>
	var strRenamedImageFilename = objImage.location.substring(objImage.location.indexOf("Z_") + 2, objImage.location.lastIndexOf(".")) + "_" + strCMSImageType + objImage.location.substr(objImage.location.lastIndexOf("."));
	console.log(global.logMessagePrefix() + "Renamed image filename will be: " + strRenamedImageFilename);

	// Create the command file XML for the image FTP using the source and target filenames
	var strSourceURI = FILE_PROTOCOL + m_objConfig.previewImageLocation + objImage.location;
	var strTargetURI = strFTP_uri + strFTP_imageTarget + strRenamedImageFilename;
	var strCommandFileXML = m_objFTP.createCommandFileXML(strSourceURI, strTargetURI);

	console.log(global.logMessagePrefix() + "Command file XML created for image FTP: \n" + strCommandFileXML);

	// Create the command file for the image FTP and save it to CFI's "Polling" directory
	var strJobFilename = strRenamedImageFilename + XML_FILE_TYPE;
	m_objFTP.saveCommandFile(m_objConfig.cfi.pollingLocation + strJobFilename, strCommandFileXML, function (err) {
		if (!err) {

			console.log(global.logMessagePrefix() + "Command file for image FTP has been saved to: " + m_objConfig.cfi.pollingLocation + strJobFilename);

			// For VOD images a CIS ingest file must also be created
			m_objFTP.saveIngestFile(m_objConfig.previewImageLocation + objImage.location, strRenamedImageFilename, strImageID, strCMSImageType, function (err) {

				if (!err) {
					// Create a command file for the ingest file FTP and save it to CFI's "Polling" directory
					var strIngestSourceURI = FILE_PROTOCOL + m_objConfig.previewImageLocation + strRenamedImageFilename + INGEST_FILE_TYPE + XML_FILE_TYPE;
					var strIngestTargetURI = strFTP_uri + strFTP_ingestTarget + strRenamedImageFilename + INGEST_FILE_TYPE + XML_FILE_TYPE;
					var strIngestCommandFileXML = m_objFTP.createCommandFileXML(strIngestSourceURI, strIngestTargetURI);

					console.log(global.logMessagePrefix() + "Command file XML created for ingest FTP: \n" + strIngestCommandFileXML);

					var strIngestJobFilename = objImage.location + objImage.suffix + INGEST_FILE_TYPE + XML_FILE_TYPE;
					m_objFTP.saveCommandFile(m_objConfig.cfi.pollingLocation + strIngestJobFilename, strIngestCommandFileXML, function (err) {
						if (!err) {

							console.log(global.logMessagePrefix() + "Command file for ingest FTP has been saved to: " + m_objConfig.cfi.pollingLocation + strIngestJobFilename);

							// Add the filename to the list of published filenames
							arrPublishedFilenames.push({ "filename": FTP_PROTOCOL + strTargetURI.substr(strTargetURI.lastIndexOf("@") + 1).replace(/\.\//g, "") });

							// Add the FTP command filenames to the list of filenames to poll for
							arrJobs.push(strJobFilename, strIngestJobFilename);

							// Publish the next image if there is one, otherwise call the callback with a successful response
							if (arrImages.length > 0) {
								publishVODImage(strImageCategory, strImageID, arrImages, arrJobs, arrPublishedFilenames, fnCallback);
							} else {
								console.log(global.logMessagePrefix() + "VOD image publication completed");

								// Cleanup any previous temporary image/ingest files
								require("./cleanup.js")();

								// Wait for the CFI jobs to be successful
								m_objFTP.pollForFTPSuccess(arrJobs, function (err) {
									if (!err) {
										// Return to the main script that will redirect the user to the published page
										fnCallback(null, arrPublishedFilenames);
									} else {
										fnCallback(err);
									}
								});
							}
						} else {
							fnCallback(err);
						}
					});
				} else {
					fnCallback(err);
				}
			});
		} else {
			fnCallback(err);
		}
	});
}

/**
 * Publishes a node image to Origin.
 */
function publishNodeImage(strImageCategory, strImageID, arrImages, arrJobs, arrPublishedFilenames, fnCallback) {

	console.log(global.logMessagePrefix() + "NODE images left to publish: " + String(arrImages.length));

	// Set the FTP location for node images to the Origin server
	var strFTP_uri = m_objConfig.publishServers.origin.uri;
	var strFTP_imageTarget = m_objConfig.publishServers.origin.imageTarget;

	// Read the details of the next image to publish
	var objImage = arrImages.shift();

	// YG - Carries same file name in V 1.1.3.0
	var strRenamedImageFilename = objImage.location.substr(objImage.location.indexOf("Z_") + 2);

	// Create the command file XML for the image FTP using the source and target filenames
	var strSourceURI = FILE_PROTOCOL + m_objConfig.previewImageLocation + objImage.location;
	var strTargetURI = strFTP_uri + strFTP_imageTarget + strRenamedImageFilename;
	var strCommandFileXML = m_objFTP.createCommandFileXML(strSourceURI, strTargetURI);

	console.log(global.logMessagePrefix() + "Command file XML created for image FTP: \n" + strCommandFileXML);

	// Create the command file for the image FTP and save it to CFI's "Polling" directory
	var strJobFilename = objImage.location + XML_FILE_TYPE;
	m_objFTP.saveCommandFile(m_objConfig.cfi.pollingLocation + strJobFilename, strCommandFileXML, function (err) {
		if (!err) {

			console.log(global.logMessagePrefix() + "Command file for image FTP has been saved to: " + m_objConfig.cfi.pollingLocation + strJobFilename);

			// Add the filename to the list of published filenames
			arrPublishedFilenames.push({ "filename": m_objConfig.publishServers.origin.cdnURLBasePath + strRenamedImageFilename, "type": objImage.suffix });

			// Add the FTP command filenames to the list of filenames to poll for
			arrJobs.push(strJobFilename);

			// Publish the next image if there is one, otherwise call the callback with a successful response
			if (arrImages.length > 0) {
				publishNodeImage(strImageCategory, strImageID, arrImages, arrJobs, arrPublishedFilenames, fnCallback);
			} else {
				console.log(global.logMessagePrefix() + "NODE image publication completed");

				// Cleanup any previous temporary image/ingest files
				require("./cleanup.js")();

				// Wait for the CFI jobs to be successful
				m_objFTP.pollForFTPSuccess(arrJobs, function (err) {
					if (!err) {
						// Return to the main script that will redirect the user to the published page
						fnCallback(null, arrPublishedFilenames);
					} else {
						fnCallback(err);
					}
				});
			}
		} else {
			fnCallback(err);
		}
	});
}

/**
 * Publishes a series image to Origin.
 */
function publishSeriesImage(strImageCategory, strImageID, arrImages, arrJobs, arrPublishedFilenames, fnCallback) {

	console.log(global.logMessagePrefix() + "SERIES images left to publish: " + String(arrImages.length));

	// Set the FTP location for series images to the Origin server
	var strFTP_uri = m_objConfig.publishServers.origin.uri;
	var strFTP_imageTarget = m_objConfig.publishServers.origin.imageTarget;

	// Read the details of the next image to publish
	var objImage = arrImages.shift();

    // YG - Carries same file name in V 1.1.3.0
	var strRenamedImageFilename = objImage.location.substr(objImage.location.indexOf("Z_") + 2);

	// Create the command file XML for the image FTP using the source and target filenames
	var strSourceURI = FILE_PROTOCOL + m_objConfig.previewImageLocation + objImage.location;
	var strTargetURI = strFTP_uri + strFTP_imageTarget + strRenamedImageFilename;
	var strCommandFileXML = m_objFTP.createCommandFileXML(strSourceURI, strTargetURI);

	console.log(global.logMessagePrefix() + "Command file XML created for image FTP: \n" + strCommandFileXML);

	// Create the command file for the image FTP and save it to CFI's "Polling" directory
	var strJobFilename = objImage.location + XML_FILE_TYPE;
	m_objFTP.saveCommandFile(m_objConfig.cfi.pollingLocation + strJobFilename, strCommandFileXML, function (err) {
		if (!err) {

			console.log(global.logMessagePrefix() + "Command file for image FTP has been saved to: " + m_objConfig.cfi.pollingLocation + strJobFilename);

			// Add the filename to the list of published filenames
			arrPublishedFilenames.push({ "filename": m_objConfig.publishServers.origin.cdnURLBasePath + strRenamedImageFilename });

			// Add the FTP command filenames to the list of filenames to poll for
			arrJobs.push(strJobFilename);

			// Publish the next image if there is one, otherwise call the callback with a successful response
			if (arrImages.length > 0) {
				publishSeriesImage(strImageCategory, strImageID, arrImages, arrJobs, arrPublishedFilenames, fnCallback);
			} else {
				console.log(global.logMessagePrefix() + "SERIES image publication completed");

				// Cleanup any previous temporary image/ingest files
				require("./cleanup.js")();

				// Wait for the CFI jobs to be successful
				m_objFTP.pollForFTPSuccess(arrJobs, function (err) {
					if (!err) {
						// Return to the main script that will redirect the user to the published page
						fnCallback(null, arrPublishedFilenames);
					} else {
						fnCallback(err);
					}
				});
			}
		} else {
			fnCallback(err);
		}
	});
}

/**
 * Publish processing starts here.
 */
module.exports = function (req, res, next) {

	// Retrieve the image metadata that has been entered
	var strImageType = req.body.imageType;
	var strImageCategory = req.body.imageCategory;
	var strImageID = req.body.imageID;

	// Read from the form the filenames and locations of the images that will be published
	var arrImages = [];
	if (!(strImageType == IMAGE_TYPE_NODE && strImageCategory == IMAGE_CATEGORY_CHANNELPAGE)) {
		arrImages.push({ "name": req.body.name_0, "location": req.body.location_0, "suffix": "" });
	} else {
		arrImages.push({ "name": req.body.name_0, "location": req.body.location_0, "suffix": "_background" });
		arrImages.push({ "name": req.body.name_1, "location": req.body.location_1, "suffix": "_logo" });
		if (req.body.name_2) {
			arrImages.push({ "name": req.body.name_2, "location": req.body.location_2, "suffix": "_cover" });
		}
	}

	console.log(global.logMessagePrefix() + "Receiving upload: type=" + strImageType + ", category=" + strImageCategory + ", id=" + strImageID);
	for (var i = 0; i < arrImages.length; i++) {
		console.log(global.logMessagePrefix() + "Image " + String(i + 1) + ": name=" + arrImages[i].name + ", location=" + arrImages[i].location);
	}

	var strError;
	if (strImageType == IMAGE_TYPE_VOD) {

		publishVODImage(strImageCategory, strImageID, arrImages, [], [], function (err, arrPublishedFilenames) {
			if (!err) {
				// Upon a successful publish of the VOD image redirect the user to the published page
				res.render("published_vod",
				{
					title: m_objConfig.applicationTitle,
					locations: arrPublishedFilenames,
					successMessage: m_objConfig.publishServers.cis.successMessage
				});
			} else {
				// Upon an error pass control back to the calling route which will handle it
				next(err);
			}
		});

	} else if (strImageType == IMAGE_TYPE_NODE) {

		publishNodeImage(strImageCategory, strImageID, arrImages, [], [], function (err, arrPublishedFilenames) {
		    if (!err) {
				// Build a comma-delimited list of filenames to display
			    var arrFilenames = [];
			    var strPromoImagesJson = "";
			        for (var i = 0; i < arrPublishedFilenames.length; i++) {
			            var strFileName = arrPublishedFilenames[i].filename;
			            var strType = arrPublishedFilenames[i].type;
			            if (strImageCategory == IMAGE_CATEGORY_CHANNELPAGE) { //if channel page, construct the json
			                if (strType.search("_background") != -1)
			                    arrFilenames.push("\"background\":\"" + strFileName + "\"");
			                else if (strType.search("_logo") != -1)
			                    arrFilenames.push("\"logo\":\""  + strFileName + "\"");
			                else if (strType.search("_cover") != -1)
			                    arrFilenames.push("\"cover\":\"" + strFileName + "\"");
			            }
			            else {
			                arrFilenames.push(strFileName);
			            }
			        }

			        if (strImageCategory == IMAGE_CATEGORY_CHANNELPAGE) {
			            if (arrFilenames.length==2) {
			                arrFilenames.push("\"cover\":\"\""); //cover is optional
			            }
			            strPromoImagesJson = "{" + arrFilenames.join(",") + "}";
			        }
			        else
			            strPromoImagesJson = arrFilenames.join(",");
                        

				// Upon a successful publish of the NODE image redirect the user to the published page
				res.render("published_node",
				{
					title: m_objConfig.applicationTitle,
					isMultipleImages: (arrPublishedFilenames.length > 1),
					locations: arrPublishedFilenames,
					filenames: strPromoImagesJson, 
					displayLink: (m_objConfig.publishServers.origin.cdnURLBasePath.length > 0),
					copyMessage: m_objConfig.publishServers.origin.copyMessage
				});
			} else {
				// Upon an error pass control back to the calling route which will handle it
				next(err);
			}
		});

	} else if (strImageType == IMAGE_TYPE_SERIES) {

		publishSeriesImage(strImageCategory, strImageID, arrImages, [], [], function (err, arrPublishedFilenames) {
			if (!err) {
				// Build a comma-delimited list of filenames to display
				var arrFilenames = [];
				for (var i = 0; i < arrPublishedFilenames.length; i++) {
				    arrFilenames.push(arrPublishedFilenames[i].filename);
				}

				// Upon a successful publish of the SERIES image redirect the user to the published page
				res.render("published_series",
				{
					title: m_objConfig.applicationTitle,
					isMultipleImages: (arrPublishedFilenames.length > 1),
					locations: arrPublishedFilenames,
					filenames: arrFilenames.join(";"),
					displayLink: (m_objConfig.publishServers.origin.cdnURLBasePath.length > 0),
					copyMessage: m_objConfig.publishServers.origin.copyMessage
				});
			} else {
				// Upon an error pass control back to the calling route which will handle it
				next(err);
			}
		});
	}
};
