/*
 * Processing script for cleaning up old temporary images and ingests.
 */
module.exports = function () {

	var m_objFS = require("fs");

	// Read the contents of the temporary directory
	m_objFS.readdir(m_objConfig.previewImageLocation, function (err, files) {

		if (!err) {

			files.forEach(function (file) {

				var strFilePath = m_objConfig.previewImageLocation + file;

				m_objFS.stat(strFilePath, function (err, stats) {

					if (!err) {

						// Set the expiration cutoff time to the current time, minus the number of hours specified in the configuration
						var dtFileExpiry = new Date();
						dtFileExpiry.setHours(dtFileExpiry.getHours() - Number(m_objConfig.previewImageExpiryHours));
						
						if (stats.ctime.getTime() < dtFileExpiry.getTime()) {
							m_objFS.unlink(strFilePath, function (err) {
								if (err) {
									console.err(global.logMessagePrefix() + "Cannot delete old file: " + strFilePath);
								} else {
									console.log(global.logMessagePrefix() + "Successfully deleted old file: " + strFilePath);
								}
							});
						}
					}
				});
			});
		}
	});
};
