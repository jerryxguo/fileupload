var m_objXMLBuilder = require("xmlbuilder");
var m_objFS = require("fs");
var m_objWatch = require("node-watch");
var m_arrChangedFiles = [];
var m_arrWatchedFiles = [];
var m_fnCFIComplete;

// Start watching CFI's "Status" directory for changed files
m_objWatch(m_objConfig.cfi.statusLocation, function (strFilename) {
	// Remove the status directory from the filename before logging the file as having changed
	var strWatchedFilename = strFilename.substr(m_objConfig.cfi.statusLocation.length);
	m_arrChangedFiles[strWatchedFilename] = true;

	console.log(global.logMessagePrefix() + "CFI file found: " + strWatchedFilename);

	// Check to see if all the watched files are present
	var iFilesAvailable = 0;
	for (var i = 0; i < m_arrWatchedFiles.length; i++) {
		if (m_arrChangedFiles[m_arrWatchedFiles[i]] == true)
			iFilesAvailable++;
	}

	// If all files are available then trigger the callback
	if (iFilesAvailable > 0 && iFilesAvailable == m_arrWatchedFiles.length) {
		console.log(global.logMessagePrefix() + "CFI transfer complete");
		m_arrWatchedFiles = [];
		m_fnCFIComplete();
	}
});

module.exports = {

	/**
	 * Create the command file XML and return it in string format.
	 */
	createCommandFileXML: function (strSourceURI, strTargetURI) {

		// Create the root node "job"
		var objXML = m_objXMLBuilder.create("job");

		// Set the file transfer method to PUT
		objXML.att("method", "PUT");

		// Create the SrcUri parameter with the details of the source file to be transfered
		var objParameter_SrcUri = objXML.ele("parameter");
		objParameter_SrcUri.att("name", "SrcUri");
		objParameter_SrcUri.ele("value", strSourceURI);

		// Create the TargetUri parameter with the details of the file that will be created as part of the transfer
		var objParameter_TargetUri = objXML.ele("parameter");
		objParameter_TargetUri.att("name", "TargetUri");
		objParameter_TargetUri.ele("value", strTargetURI);

		// Return the XML as a string that has been formatted
		return objXML.end({ pretty: true, indent: "\t", newline: "\n" });
	},

	/**
	 * Save the command file to a specific location.
	 */
	saveCommandFile: function (strJobFilename, strCommandFileXML, fnCallback) {
		m_objFS.writeFile(strJobFilename, strCommandFileXML, function (err) {
			fnCallback(err);
		});
	},

	/**
	 * Creates a CMS native ingest file in preparation for upload to CIS.
	 */
	saveIngestFile: function (strImageFilePath, strRenamedImageFilename, strContentID, strCMSImageType, fnCallback) {

		// Get the statistics of the image file to FTP prior to creating the ingest
		m_objFS.stat(strImageFilePath, function (err, stats) {

			if (!err) {
				var strIngestLocation = strRenamedImageFilename + INGEST_FILE_TYPE;

				// Generate a start date from the current server time and remove the milliseconds
				var dtCurrentDate = new Date();
				var strStartDate = dtCurrentDate.toISOString();
				strStartDate = strStartDate.substr(0, strStartDate.length - 5) + strStartDate.substr(strStartDate.length - 1);

				// Determine the expiry date from the start date and the image expiry hours from configuration
				dtCurrentDate.setHours(dtCurrentDate.getHours() + Number(m_objConfig.publishServers.cis.imageExpiryHours));
				var strExpiryDate = dtCurrentDate.toISOString();
				strExpiryDate = strExpiryDate.substr(0, strExpiryDate.length - 5) + strExpiryDate.substr(strExpiryDate.length - 1);

				// Create the root node "LysisData" and set its attributes
				var objXML = m_objXMLBuilder.create("LysisData");
				objXML.att("id", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_scheduleDate);
				objXML.att("scheduleDate", strStartDate);

				// Create the child node "Image" under "LysisData" and set its attributes
				var objImage = objXML.ele("Image");
				objImage.att("id", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_ID_prefix + strContentID + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_ID_suffix + "_" + strCMSImageType + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_TITLE_suffix);
				objImage.att("title", strContentID + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_ID_suffix + "_" + strCMSImageType + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_TITLE_suffix);
				objImage.att("illustratedRef", strContentID);
				objImage.att("startDate", strStartDate);
				objImage.att("expiryDate", strExpiryDate);

				// Create the child node "Media" under "Image" and set its attributes
				var objImageMedia = objImage.ele("Media");
				objImageMedia.att("id", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Media_ID_prefix + strContentID + "_" + strCMSImageType);
				objImageMedia.att("fileName", strRenamedImageFilename);
				objImageMedia.att("format", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Media_format);
				objImageMedia.att("fileSize", String(stats.size));
				objImageMedia.att("srcAssetType", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Media_srcAssetType);

				// Create the child node "AssetDeviceLink" under "Media" and set its attributes
				var objImageMediaAssetDeviceLink = objImageMedia.ele("AssetDeviceLink");
				objImageMediaAssetDeviceLink.att("storageDevice", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Media_AssetDeviceLink_storageDevice);
				objImageMediaAssetDeviceLink.att("relativePath", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Media_AssetDeviceLink_relativePath);
				objImageMediaAssetDeviceLink.att("type", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Media_AssetDeviceLink_type);

				// Create the child node "Image" under "Image" and set its attributes
				var objImageImage = objImage.ele("Image");
				objImageImage.att("id", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Image_ID_prefix + strContentID + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_ID_suffix + "_" + strCMSImageType + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Image_TITLE_suffix);
				objImageImage.att("title", strContentID + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_ID_suffix + "_" +strCMSImageType + m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Image_TITLE_suffix);
				objImageImage.att("startDate", strStartDate);
				objImageImage.att("expiryDate", strExpiryDate);
				objImageImage.att("encProfileName", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Image_endProfileName);
				objImageImage.att("preLoaded", m_objConfig.publishServers.cis.ingestFixedFields.LysisData_Image_Image_preLoaded);

				// Create the child node "EPGDescription" under "Image"
				var objImageImageEPGDescription = objImageImage.ele("EpgDescription");

				// Create the child node "EPGElement" under "EPGDescription" and set its key attribute
				var objImageImageEPGDescriptionEPGElement = objImageImageEPGDescription.ele("EpgElement", strCMSImageType);
				objImageImageEPGDescriptionEPGElement.att("key", "ImageType");

				// Convert the XML object into a formatted string
				var strIngestXML = objXML.end({ pretty: true, indent: "\t", newline: "\n" });

				// Save the XML into the ingest file
				var strIngestFilename = m_objConfig.previewImageLocation + strIngestLocation + XML_FILE_TYPE;
				m_objFS.writeFile(strIngestFilename, strIngestXML, function (err) {
					if (!err) {
						console.log(global.logMessagePrefix() + "Ingest file created: " + strIngestFilename);
					}
					fnCallback(err);
				});
			} else {
				fnCallback(err);
			}
		});
	},

	/**
	 * Polls CFI's "Status" directory looking for successful jobs.
	 */
	pollForFTPSuccess: function (arrFiles, fnCallback) {

		console.log(global.logMessagePrefix() + "Polling for CFI success files: " + arrFiles.join(", "));

		// Set the callback that will be triggered when all CFI success files are available
		m_fnCFIComplete = fnCallback;

		// Successful CFI jobs will replace the .xml extension of the command file with a .success extension,
		// so modify the filenames being polled for so that the .success files will be watched out for
		var iFilesAvailable = 0;
		for (var i = 0; i < arrFiles.length; i++) {
			arrFiles[i] = arrFiles[i].substr(0, arrFiles[i].lastIndexOf(XML_FILE_TYPE)) + CFI_SUCCESS_FILE_TYPE;

			// Check if the CFI success file is already present
			if (m_objFS.existsSync(m_objConfig.cfi.statusLocation + arrFiles[i])) {
				console.log(global.logMessagePrefix() + "CFI success file found: " + arrFiles[i]);
				iFilesAvailable++;
			}
		}

		// Determine if the app still needs to watch for polled files
		if (iFilesAvailable == arrFiles.length) {
			console.log(global.logMessagePrefix() + "CFI transfer complete");
			m_fnCFIComplete();
		} else {
			// Set the list of files to currently watch out for
			m_arrWatchedFiles = arrFiles;
		}
	}
};
