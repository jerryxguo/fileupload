/*
$Header: //OTV_APPS/Foxtel/MediaLiveCustomization/ImageUpload/application_releases/ImageUpload/imageupload_application.js#2 $
$DateTime: 2014/04/10 23:26:08 $
$Revision: #2 $
$Author: ygupta $

@copyright (c) 2013 Nagra Ltd. All rights reserved.
*/

// Module dependencies
var express = require("express");
var m_objHTTP = require("http");
var m_objPath = require("path");
var m_objTimeout = require("connect-timeout");

// Create the express framework application
global.g_objApplication = express();

// Read the application configuration
global.m_objConfig = require("./config.json");

// Allow the routes script to be globally accessible
global.m_objRoutes = require("./routes/routes.js");

// Define constants
global.IMAGE_TYPE_VOD = "VOD";
global.IMAGE_TYPE_NODE = "NODE";
global.IMAGE_TYPE_SERIES = "SERIES";
global.IMAGE_CATEGORY_LANDSCAPE = "LANDSCAPE";
global.IMAGE_CATEGORY_POSTER = "POSTER";
global.IMAGE_CATEGORY_SQUARE = "SQUARE";
global.IMAGE_CATEGORY_SINGLEIMAGE = "SINGLEIMAGE";
global.IMAGE_CATEGORY_CHANNELPAGE = "CHANNELPAGE";
global.IMAGE_PREFIX_BACKGROUND = "background_";
global.IMAGE_PREFIX_LOGO = "logo_";
global.IMAGE_PREFIX_COVER = "cover_";
global.INGEST_FILE_TYPE = ".ingest";
global.XML_FILE_TYPE = ".xml";
global.CFI_SUCCESS_FILE_TYPE = ".success";
global.FILE_PROTOCOL = "file://";
global.FTP_PROTOCOL = "ftp://";

// Define settings for all environments
g_objApplication.set("views", m_objPath.join(__dirname, "views"));
g_objApplication.set("view engine", "mustache");
g_objApplication.set("uploadDir", m_objConfig.previewImageLocation.slice(0, -1));
g_objApplication.engine("mustache", require("hogan-middleware").__express);
g_objApplication.use(express.favicon());
g_objApplication.use(express.bodyParser({ uploadDir: m_objConfig.previewImageLocation.slice(0, -1), keepExtensions: true }));
g_objApplication.use(express.logger("dev"));
g_objApplication.use(express.json());
g_objApplication.use(express.urlencoded());
g_objApplication.use(express.multipart());
g_objApplication.use(express.methodOverride());
g_objApplication.use(express.cookieParser("your secret here"));
g_objApplication.use(express.session());
g_objApplication.use("/imageupload", g_objApplication.router);
g_objApplication.use(express["static"](m_objPath.join(__dirname, "public")));

// Setup routes for all GET and POST requests (i.e. the set of path in URLs that load pages or run scripts)
g_objApplication.get("/", m_objRoutes.index);
g_objApplication.get("/select", m_objRoutes.showSelect);
g_objApplication.post("/select", m_objRoutes.processSelect);
g_objApplication.get("/preview", m_objRoutes.showPreview);
g_objApplication.post("/publish", m_objTimeout({ time: Number(m_objConfig.cfi.statusCheckTimeout) }), m_objRoutes.processPublish);

// Setup the error handler
global.logMessagePrefix = function () { return "[Image Upload] [" + new Date().toISOString() + "] "; };
g_objApplication.use(function (err, req, res, next) {
	console.error(logMessagePrefix() + "ERROR: " + err);
	res.render("error",
	{
		title: m_objConfig.applicationTitle,
		error: err
	});
});

// Create the web server and set the port to listen on
m_objHTTP.createServer(g_objApplication).listen(m_objConfig.listenPort, function () {
	console.log(global.logMessagePrefix() + "Express server listening on port " + m_objConfig.listenPort);
	console.log(global.logMessagePrefix() + "Mode: " + g_objApplication.get("env"));

	// Upon startup cleanup any previous temporary image/ingest files
	require("./scripts/cleanup.js")();
});
