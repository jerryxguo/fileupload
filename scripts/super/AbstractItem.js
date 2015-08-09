/**
 * AbstractListItem provides core functionality and the interface
 * for concrete ListItem implementations used by the CustomisableList
 * component. It inherits from GUIObject which is the superclass
 * of all GUI objects in the framework.
 * @class $N.gui.AbstractListItem
 * @extends $N.gui.GUIObject
 *
 * @requires $N.gui.Util
 * @requires $N.gui.GUIObject
 *
 * @constructor
 * @param {Object} docRef DOM object
 * @param {Object} parent GUIObject
 */
define('jsfw/gui/GUIObjects/Controls/List/customisable/AbstractListItem',
    [
    'jsfw/gui/Logic/List/List',
    'jsfw/gui/helpers/Util',
    'jsfw/gui/GUIObjects/GUIObject'
    ],
    function (List, Util, GUIObject) {

		function AbstractListItem(docRef) {
			AbstractListItem.superConstructor.call(this, docRef);

			this._movementPositions = new $N.gui.BasicList();
			this._movementPositions.setWrapAround(true);
			this._opacityValues = null;
			this._width = 0;
			this._height = 0;

			// this is an example and needs to be overridden using the
			// setDataMapper method to allow dynamic data updates
			this._dataMapper = {
				getIcon: function (obj) {
					return obj.url;
				},
				getTitle: function (obj) {
					return obj.title;
				}
			};
		}

		$N.gui.Util.extend(AbstractListItem, $N.gui.GUIObject);

		var proto = AbstractListItem.prototype;

		/*
		 * Public API
		 */

		/**
		 * Returns an array of coordinates that represents the positions that
		 * this ListItem can move to using moveToNext and moveToPrevious.
		 * @method getMovementPositions
		 * @return {Array}
		 */
		proto.getMovementPositions = function () {
			return this._movementPositions.getData();
		};

		/**
		 * Takes an array of coordinate objects in the form {x:X, y:Y}
		 * that represent the positions that the list object can move to.
		 * @method setMovementPositions
		 * @param {Array} points
		 * @return {Object} this
		 */
		proto.setMovementPositions = function (points) {
			if (typeof points === "string") {
				points = this._convertStringToPoints(points);
			}
			this._movementPositions.setData(points);
			return this;
		};

		/**
		 * Sets the opacity values for each item in the list
		 * @method setOpacityValues
		 * @param {Object} valueArray Array of opacity values to set
		 */
		proto.setOpacityValues = function (valueArray) {
			if (typeof valueArray === "string") {
				valueArray = valueArray.split(",");
			}
			this._opacityValues = new $N.gui.BasicList();
			this._opacityValues.setWrapAround(true);
			this._opacityValues.setData(valueArray);
			return this;
		};

		/**
		 * Returns the opacity values for the list
		 * @method getOpacityValues
		 * @return {Object} Array of opacity values
		 */
		proto.getOpacityValues = function () {
			return this._opacityValues.getData();
		};

		/**
		 * Sets the scale values for each item in the list
		 * @method setScaleValues
		 * @param {Object} valueArray Array of scale values
		 */
		proto.setScaleValues = function (valueArray) {
			if (typeof valueArray === "string") {
				valueArray = valueArray.split(",");
			}
			this._scaleValues = new $N.gui.BasicList();
			this._scaleValues.setWrapAround(true);
			this._scaleValues.setData(valueArray);
			return this;
		};

		/**
		 * Returns the scale values for the list
		 * @method getScaleValues
		 * @return {Object} Array of scale values
		 */
		proto.getScaleValues = function () {
			return this._scaleValues.getData();
		};

		/**
		 * Returns the index in movementPositions list of where the
		 * ListItem object is currently at.
		 * @method getMovementPosition
		 * @return {Number}
		 */
		proto.getMovementPosition = function () {
			return this._movementPositions.getActualSelectedRowIndex();
		};

		/**
		 * Draws the ListItem at the coordinate specified in the
		 * given position of the movementPositions list.
		 * @method setMovementPosition
		 * @param {Number} position
		 * @return {Object} this
		 */
		proto.setMovementPosition = function (position) {
			if (this._movementPositions.getSize === 0) {
				throw ("AbstractListItem - setMovementPosition: Cannot set position in an empty list");
			}
			var opacity;
			this._movementPositions.selectRowAtIndex(position);
			var coord = this._movementPositions.getSelectedItem();
			this.setX(coord.x);
			this.setY(coord.y);
			if (this._opacityValues) {
				opacity = this._opacityValues.getRowAtIndex(position);
				this.setOpacity(opacity);
			}
			if (this._scaleValues) {
				this.setScale(this._scaleValues.getRowAtIndex(position));
			}
			return this;
		};

		/**
		 * Returns the width in pixels of the ListItem.
		 * @method getWidth
		 * @return {Number}
		 */
		proto.getWidth = function () {
			return this._width;
		};

		/**
		 * Abstract method must be defined in subclass
		 * @method setWidth
		 * @param {Number} width
		 */
		proto.setWidth = function (width) {
			throw ("AbstractListItem - setWidth: Illegal operation on an abstract method");
		};

		/**
		 * Returns the height in pixels of the ListItem.
		 * @method getHeight
		 * @return {Object}
		 */
		proto.getHeight = function () {
			return this._height;
		};

		/**
		 * Abstract method must be defined in subclass
		 * @method setHeight
		 * @param {Number} height
		 */
		proto.setHeight = function (height) {
			throw ("AbstractListItem - setHeight: Illegal operation on an abstract method");
		};

		/**
		 * Returns the dataMapper object that is associate with
		 * this ListItem.
		 * @method getDataMapper
		 * @return {Object}
		 */
		proto.getDataMapper = function () {
			return this._dataMapper;
		};

		/**
		 * Sets the dataMapper object that is to be used by the
		 * ListItem update method.
		 * @method setDataMapper
		 * @param {Object} dataMapper
		 * @return {Object}
		 */
		proto.setDataMapper = function (dataMapper) {
			this._dataMapper = dataMapper;
			return this;
		};

		/**
		 * Moves the ListItem to the next position defined in
		 * the movementPositions list and applies fade if enabled.
		 * @method moveToNext
		 */
		proto.moveToNext = function () {
			var instant = this._movementPositions.isSelectedAtLast();
			this._movementPositions.selectNext();
			var next = this._movementPositions.getSelectedItem();
			this._moveItem(next, instant);
		};

		/**
		 * Moves the ListItem to the previous position defined in
		 * the movementPositions list and applies fade if enabled.
		 * @method moveToPrevious
		 */
		proto.moveToPrevious = function () {
			var instant = this._movementPositions.isSelectedAtFirst();
			this._movementPositions.selectPrevious();
			var next = this._movementPositions.getSelectedItem();
			this._moveItem(next, instant);
		};

		/**
		 * Abstract method must be defined in subclass
		 * @method highlight
		 */
		proto.highlight = function () {
			throw ("AbstractListItem - highlight: Illegal operation on an abstract method");
		};

		/**
		 * Abstract method must be defined in subclass
		 * @method unHighlight
		 */
		proto.unHighlight = function () {
			throw ("AbstractListItem - unHighlight: Illegal operation on an abstract method");
		};

		/**
		 * Abstract method must be defined in subclass
		 * @method update
		 * @param {Object} data
		 * @param {Object} additionalData
		 */
		proto.update = function (data, additionalData) {
			throw ("AbstractListItem - update: Illegal operation on an abstract method");
		};

		/**
		 * Add additional points that the list item can displayed at
		 * @method setNewMovementPositions
		 * @param {Object} points
		 * @param {Object} redraw
		 */
		proto.setNewMovementPositions = function (points, redraw) {
			var currentIndex = this._movementPositions.getActualSelectedRowIndex();
			if (redraw) {
				this.setMovementPositions(points);
				this._movementPositions.selectRowAtIndex(currentIndex);
				var current = this._movementPositions.getSelectedItem();
				this._moveItem(current);
			} else {
				this.setMovementPositions(points);
				this._movementPositions.selectRowAtIndex(currentIndex);
			}
		};

		/*
		 * Private helper functions
		 */

		/**
		 * Helper function to move a ListItem
		 * @method _moveItem
		 * @private
		 * @param {Number} current
		 * @param {Number} next
		 */
		proto._moveItem = function (next, instant) {
			var opacity = this._opacityValues ? this._opacityValues.getRowAtIndex(this.getMovementPosition()) : null;
			var scale = this._scaleValues ? this._scaleValues.getRowAtIndex(this.getMovementPosition()) : null;

			if (instant) {
				this.move(next.x, next.y);
				if (scale !== null) {
					this.setScale(scale);
				}
				if (opacity !== null) {
					this.setOpacity(opacity);
				}
			} else {
				this.doMove(next.x, next.y);
				if (scale !== null) {
					this.doScale(scale);
				}
				if (opacity !== null) {
					this.doFade(opacity);
				}
			}
		};

		/**
		 * Converts a string containing points into an array. The array is returned.
		 * e.g. "12,16;15,89"
		 * will return
		 *
		 *     array[0].x = 12, array[0].y = 16
		 *     array[1].x = 15, array[1].y = 89
		 * @method _convertStringToPoints
		 * @param {String} stringOfPoints
		 * @private
		 */
		proto._convertStringToPoints = function (stringOfPoints) {
			var pointArray = stringOfPoints.split(";");
			var point;
			var points = [];
			var i = 0;

			for (i = 0; i < pointArray.length; i++) {
				point = pointArray[i].split(",");
				points.push({x: point[0], y: point[1]});
			}
			return points;
		};

		window.$N = $N || {};
		$N.gui = $N.gui || {};
		$N.gui.AbstractListItem = AbstractListItem;
		return AbstractListItem;
	}
);