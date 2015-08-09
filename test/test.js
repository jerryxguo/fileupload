/*
Unit test scripts.
*/
var assert = require("chai").assert;
var routes = require("../routes/routes.js");

suite("Routes", function() {
	test("index route is defined", function () {
		assert.isDefined(routes.index);
	});
	test("select route is defined", function () {
		assert.isDefined(routes.showSelect);
	});
	test("process select route is defined", function () {
		assert.isDefined(routes.processSelect);
	});
	test("show preview route is defined", function () {
		assert.isDefined(routes.showPreview);
	});
	test("process publish route is defined", function () {
		assert.isDefined(routes.processPublish);
	});
});
