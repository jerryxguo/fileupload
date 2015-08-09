function enableFields(blnEnable, arrLabels, arrFields) {
	for (var i = 0; i < arrLabels.length; i++) {
		if (blnEnable) {
			document.getElementById(arrLabels[i]).className = "";
		} else {
			document.getElementById(arrLabels[i]).className = "disabled";
		}
	}
	for (var i = 0; i < arrFields.length; i++) {
		document.getElementById(arrFields[i]).disabled = !blnEnable;
	}
}

function enableImageTypeFields() {
	if (document.getElementById("radImageType_VOD").checked) {
		// Enable the VOD metadata fields
		enableFields(
			true,
			["lblVODContentID", "lblVODImageCategory", "lblVODImageCategory_LANDSCAPE", "lblVODImageCategory_POSTER", "lblVODImageCategory_SQUARE"],
			["txtVODContentID", "radVODImageCategory_LANDSCAPE", "radVODImageCategory_POSTER", "radVODImageCategory_SQUARE"]
		);

		// Disable the NODE metadata fields
		enableFields(
			false,
			["lblNODENodeID", "lblNODEImageCategory", "lblNODEImageCategory_SINGLEIMAGE", "lblNODEImageCategory_CHANNELPAGE"],
			["txtNODENodeID", "radNODEImageCategory_SINGLEIMAGE", "radNODEImageCategory_CHANNELPAGE"]
		);

		// Disable the SERIES metadata fields
		enableFields(
			false,
			["lblSERIESSeriesID"],
			["txtSERIESSeriesID"]
		);
	} else if (document.getElementById("radImageType_NODE").checked) {
		// Enable the NODE metadata fields
		enableFields(
			true,
			["lblNODENodeID", "lblNODEImageCategory", "lblNODEImageCategory_SINGLEIMAGE", "lblNODEImageCategory_CHANNELPAGE"],
			["txtNODENodeID", "radNODEImageCategory_SINGLEIMAGE", "radNODEImageCategory_CHANNELPAGE"]
		);

		// Disable the VOD metadata fields
		enableFields(
			false,
			["lblVODContentID", "lblVODImageCategory", "lblVODImageCategory_LANDSCAPE", "lblVODImageCategory_POSTER", "lblVODImageCategory_SQUARE"],
			["txtVODContentID", "radVODImageCategory_LANDSCAPE", "radVODImageCategory_POSTER", "radVODImageCategory_SQUARE"]
		);

		// Disable the SERIES metadata fields
		enableFields(
			false,
			["lblSERIESSeriesID"],
			["txtSERIESSeriesID"]
		);
	} else if (document.getElementById("radImageType_SERIES").checked) {
		// Enable the SERIES metadata fields
		enableFields(
			true,
			["lblSERIESSeriesID"],
			["txtSERIESSeriesID"]
		);

		// Disable the VOD metadata fields
		enableFields(
			false,
			["lblVODContentID", "lblVODImageCategory", "lblVODImageCategory_LANDSCAPE", "lblVODImageCategory_POSTER", "lblVODImageCategory_SQUARE"],
			["txtVODContentID", "radVODImageCategory_LANDSCAPE", "radVODImageCategory_POSTER", "radVODImageCategory_SQUARE"]
		);

		// Disable the NODE metadata fields
		enableFields(
			false,
			["lblNODENodeID", "lblNODEImageCategory", "lblNODEImageCategory_SINGLEIMAGE", "lblNODEImageCategory_CHANNELPAGE"],
			["txtNODENodeID", "radNODEImageCategory_SINGLEIMAGE", "radNODEImageCategory_CHANNELPAGE"]
		);
	}

	// Update the image category fields as well to ensure the correct number of file input fields are displayed
	enableImageCategoryFields();
}

function enableImageCategoryFields() {
	// Ensure category defaults are set if the image type is changed
	if (document.getElementById("radImageType_VOD").checked) {
		if (!document.getElementById("radVODImageCategory_LANDSCAPE").checked && !document.getElementById("radVODImageCategory_POSTER").checked && !document.getElementById("radVODImageCategory_SQUARE").checked) {
			document.getElementById("radVODImageCategory_LANDSCAPE").checked = true;
		}
	} else if (document.getElementById("radImageType_NODE").checked) {
		if (!document.getElementById("radNODEImageCategory_SINGLEIMAGE").checked && !document.getElementById("radNODEImageCategory_CHANNELPAGE").checked) {
			document.getElementById("radNODEImageCategory_SINGLEIMAGE").checked = true;
		}
	}

	// Ensure the correct number of file input boxes are displayed
	if ((document.getElementById("radImageType_VOD").checked) || (document.getElementById("radImageType_SERIES").checked)
	|| (document.getElementById("radImageType_NODE").checked && !document.getElementById("radNODEImageCategory_CHANNELPAGE").checked)) {
		document.getElementById("tblFileUpload_single").style.display = "block";
		document.getElementById("tblFileUpload_multiple").style.display = "none";
		document.getElementById("lblSelectFiles").innerText = "Please select the image to upload:";
	} else {
		document.getElementById("tblFileUpload_single").style.display = "none";
		document.getElementById("tblFileUpload_multiple").style.display = "block";
		document.getElementById("lblSelectFiles").innerText = "Please select the images to upload:";
	}
}

function setImageDimensions(event, element, index, imageType, imageCategory) {
	var objImage = element ? element : event.target;
	var objImageWidth = document.getElementById("txtImageWidth_" + String(index));
	if (objImageWidth) {
		objImageWidth.innerText = String(objImage.naturalWidth) + "px";
	}
	var objImageHeight = document.getElementById("txtImageHeight_" + String(index));
	if (objImageHeight) {
		objImageHeight.innerText = String(objImage.naturalHeight) + "px";
	}
	if (imageType == "VOD" && imageCategory) {
		var strImageCategoryLabel = imageCategory.substring(0, 1).toUpperCase() + imageCategory.substr(1).toLowerCase();
		var aspectRatio = objImage.naturalWidth / objImage.naturalHeight;
		if (aspectRatio < arrSquareAspectRatioRange[0]) {
			// The image is poster if the aspect ratio is below the minimum for square
			if (imageCategory != "POSTER") {
				document.getElementById("txtAspectMessage").style.display = "block";
				document.getElementById("txtAspectMessage").innerText = "Note: The selected image appears to be in Poster aspect, but you have selected " + strImageCategoryLabel + ". To continue to upload this image, press Continue, otherwise press Back to select another file or change the aspect you have selected.";
			}
		} else if (aspectRatio > arrSquareAspectRatioRange[1]) {
			// The image is landscape if the aspect ratio is above the maximum for square
			if (imageCategory != "LANDSCAPE") {
				document.getElementById("txtAspectMessage").style.display = "block";
				document.getElementById("txtAspectMessage").innerText = "Note: The selected image appears to be in Landscape aspect, but you have selected " + strImageCategoryLabel + ". To continue to upload this image, press Continue, otherwise press Back to select another file or change the aspect you have selected.";
			}
		} else {
			// The image is square if the aspect ratio is between the minimum and maximum for square
			if (imageCategory != "SQUARE") {
				document.getElementById("txtAspectMessage").style.display = "block";
				document.getElementById("txtAspectMessage").innerText = "Note: The selected image appears to be in Square aspect, but you have selected " + strImageCategoryLabel + ". To continue to upload this image, press Continue, otherwise press Back to select another file or change the aspect you have selected.";
			}
		}
	}
}

function togglePreview(strElementID) {
	var objOverlay = document.getElementById(strElementID);
	if (objOverlay) {
		if (objOverlay.className == "overlay") {
			objOverlay.className = "overlay overlay_visible";
		} else {
			objOverlay.className = "overlay";
		}
	}
}
