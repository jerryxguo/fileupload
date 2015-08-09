/**
 * GUIObject is the super class for all graphical objects in the framework
 * it defines common methods and properties for positioning and identification
 * plus the keeps a reference to the root element of the GUIObject
 *
 * @class $N.gui.GUIObject
 *
 * @requires $N.gui.AnimTransform
 * @requires $N.gui.Animate
 * @requires $N.gui.AnimateHTML
 * @requires $N.gui.Util
 *
 * @constructor
 * @param {Object} docRef reference to the DOM document object
 *
 */

/*global navigator, document, OTV*/
define('jsfw/gui/GUIObjects/GUIObject',
    [
    'jsfw/gui/GUIObjects/Animations/AnimTransform',
 	'jsfw/gui/GUIObjects/Animations/Animate',
 	'jsfw/gui/GUIObjects/Animations/AnimateHTML',
    'jsfw/gui/helpers/Util'
    ],
    function (AnimTransform, Animate, AnimateHTML, Util) {

		var ENABLE_HTML_ANIMATIONS = true,
			mode = navigator.userAgent.indexOf("Ekioh") > -1 ? "SVG" : "HTML",
			abstractedMethods = {
				SVG: {
					bringToFront: function (guiObject) {
						var domNode = guiObject.getRootElement(),
							domRoot = domNode.parentNode;
						domRoot.appendChild(domNode);
					},
					changeStyle: function (element, attribute, style, guiObject) {
						var fullStyle = style;
						if (guiObject && guiObject.__rotate && attribute === "transform") {
							fullStyle += ", " + guiObject.__rotate;
						}
						element.setAttribute(attribute, fullStyle);
					},
					move: function (guiObject, x, y) {
						var	transform = "translate(" + x + " " + y + ")";
						if (guiObject._scale !== 1) {
							transform += ", scale(" + String(guiObject._scale) + ")";
						}
						if (guiObject._moveAnim) {
							guiObject._moveAnim.setFill("remove");
							this.changeStyle(guiObject.getRootElement(), "transform", transform, guiObject);
							guiObject._moveAnim.setFill("freeze");
						} else {
							this.changeStyle(guiObject.getRootElement(), "transform", transform, guiObject);
						}
					},
					scale: function (guiObject, scale) {
						var transform = "translate(" + guiObject._x + " " + guiObject._y + "), scale(" + scale + ")";
						if (guiObject._scaleAnim) {
							guiObject._scaleAnim.setFill("remove");
							this.changeStyle(guiObject.getRootElement(), "transform", transform, guiObject);
							guiObject._scaleAnim.setFill("freeze");
						} else {
							this.changeStyle(guiObject.getRootElement(), "transform", transform, guiObject);
						}
					},
					rotate: function (guiObject, degrees, x, y) {
						var transform = "translate(" + guiObject._x + " " + guiObject._y + ")";
						if (guiObject._scale !== 1) {
							transform += ", scale(" + String(guiObject._scale) + ")";
						}
						x = (x === undefined) ? guiObject._x : x;
						y = (y === undefined) ? guiObject._y : y;
						guiObject.__rotate = "rotate(" + degrees + ", " + x + ", " + y + ")";
						this.changeStyle(guiObject.getRootElement(), "transform", transform, guiObject);
					},
					attribute: function (guiObject, attribute, value) {
						if (guiObject._attributeAnim && guiObject._attributeAnim[attribute]) {
							guiObject._attributeAnim[attribute].setFill("remove");
							this.changeStyle(guiObject.getRootElement(), attribute, value);
							guiObject._attributeAnim[attribute].setFill("freeze");
						} else {
							this.changeStyle(guiObject.getRootElement(), attribute, value);
						}
					},
					addMoveAnim: function (guiObject) {
						guiObject._moveAnim = new $N.gui.AnimTransform(guiObject._docRef, guiObject).setAdditive(guiObject._animTransformAdditive).setDuration(guiObject.getAnimationDuration());
						guiObject._animTransformAdditive = "sum";
					},
					addScaleAnim: function (guiObject) {
						guiObject._scaleAnim = new $N.gui.AnimTransform(guiObject._docRef, guiObject).setAdditive(guiObject._animTransformAdditive).setType("scale").setDuration(guiObject.getAnimationDuration());
						guiObject._animTransformAdditive = "sum";
					},
					addAttributeAnim: function (guiObject, attribute) {
						if (!guiObject._attributeAnim) {
							guiObject._attributeAnim = {};
						}
						guiObject._attributeAnim[attribute] = new $N.gui.Animate(guiObject._docRef, guiObject);
						guiObject._attributeAnim[attribute].setAttributeName(attribute);
						guiObject._attributeAnim[attribute].setDuration(guiObject.getAnimationDuration());
					},
					animatedMove: function (guiObject, fromX, fromY, toX, toY, repeat, bounce) {
						var values = fromX + " " + fromY + ";" + toX + " " + toY;
						if (repeat) {
							guiObject._moveAnim.setRepeatCount('10000');
						} else {
							guiObject._moveAnim.setRepeatCount('1');
						}
						if (bounce) {
							values += "; " + fromX + ' ' + fromY;
							guiObject._moveAnim.setKeyTimes("0; 0.5; 1");
						} else {
							guiObject._moveAnim.setKeyTimes("");
						}
						guiObject._moveAnim.setValues(values);
						if (!guiObject._moveAnim.linked) {
							guiObject._moveAnim.animate();
						}
					},
					animatedScale: function (guiObject, from, to, repeat, bounce) {
						var values = from + ";" + to;
						if (repeat) {
							guiObject._scaleAnim.setRepeatCount('10000');
						} else {
							guiObject._scaleAnim.setRepeatCount('1');
						}
						if (bounce) {
							values += "; " + from;
							guiObject._scaleAnim.setKeyTimes("0; 0.5; 1");
						} else {
							guiObject._scaleAnim.setKeyTimes("");
						}
						guiObject._scaleAnim.setValues(values);
						guiObject._scaleAnim.animate();
					},
					animatedAttribute: function (guiObject, attribute, from, to, repeat, bounce) {
						if (guiObject._attributeAnim[attribute]) {
							if (repeat && bounce) {
								guiObject._attributeAnim[attribute].setRepeatCount("10000");
								guiObject._attributeAnim[attribute].setKeyTimes("0; 0.5; 1");
								guiObject._attributeAnim[attribute].setValues(from + "; " + to + "; " + from);
							} else if (repeat) {
								guiObject._attributeAnim[attribute].setRepeatCount("10000");
								guiObject._attributeAnim[attribute].setKeyTimes("");
								guiObject._attributeAnim[attribute].setValues(from + "; " + to);
							} else {
								guiObject._attributeAnim[attribute].setRepeatCount("1");
								guiObject._attributeAnim[attribute].setKeyTimes("");
								guiObject._attributeAnim[attribute].setValues(from + "; " + to);
							}
							if (!guiObject._attributeAnim[attribute].linked) {
								guiObject._attributeAnim[attribute].animate();
							}
						}
					}
				},
				HTML: {
					bringToFront: function (guiObject) {
						var domNode = guiObject.getRootElement(),
							domRoot = domNode.parentNode;
						if (domRoot.contains(domNode)) {
							domRoot.removeChild(domNode);
						}
						domRoot.appendChild(domNode);
					},
					changeStyle: function (domElement, attribute, style, guiObject) {
						var fullStyle = "";
						if (guiObject && (attribute === "-webkit-transform" || attribute === "-o-transform")) {
							fullStyle += guiObject.__move ? guiObject.__move + " " : "";
							fullStyle += guiObject.__scale ? guiObject.__scale + " " : "";
							fullStyle += guiObject.__rotate ? guiObject.__rotate : "";
							domElement.style[attribute] = fullStyle;
						} else {
							domElement.style[attribute] = style;
						}
					},
					move: function (guiObject, x, y) {
						if (guiObject._moveAnim) {
							guiObject._moveAnim.cancelAnimation();
						}
						guiObject._cancelRepeatAnimations();
						guiObject.getRootElement().style["-webkit-transition-duration"] = null;
						guiObject.getRootElement().style["transitionDuration"] = null;
						guiObject.getRootElement().style.OTransform = "translate(" + x + "px," + y + "px)";
						if (GUIObject.use3D) {
							guiObject.__move = "translate3d(" + x + "px," + y + "px, 0px)";
						} else {
							guiObject.__move = "translate(" + x + "px," + y + "px)";
						}
						this.changeStyle(guiObject.getRootElement(), "-webkit-transform", guiObject.__move, guiObject);
						this.changeStyle(guiObject.getRootElement(), "-o-transform", guiObject.__move, guiObject);
						guiObject._restartRepeatAnimations();
					},
					scale: function (guiObject, scale) {
						guiObject._cancelRepeatAnimations();
						guiObject.getRootElement().style["-webkit-transition-duration"] = null;
						guiObject.getRootElement().style["transitionDuration"] = null;
						this.changeStyle(guiObject.getRootElement(), "-webkit-transform-origin", "0px 0px");
						this.changeStyle(guiObject.getRootElement(), "transformOrigin", "0px 0px");
						guiObject.__scale = "scale(" + scale + ")";
						this.changeStyle(guiObject.getRootElement(), "-webkit-transform", guiObject.__scale, guiObject);
						this.changeStyle(guiObject.getRootElement(), "-o-transform", guiObject.__scale, guiObject);
						guiObject._restartRepeatAnimations();
					},
					rotate: function (guiObject, degrees, x, y) {
						x = x ? String(x) : "0";
						y = y ? String(y) : "0";
						this.changeStyle(guiObject.getRootElement(), "-webkit-transform-origin", x + "px " + y + "px");
						this.changeStyle(guiObject.getRootElement(), "transformOrigin", x + "px " + y + "px");
						guiObject.__rotate = "rotate(" + degrees + "deg)";
						this.changeStyle(guiObject.getRootElement(), "-webkit-transform", guiObject.__rotate, guiObject);
						this.changeStyle(guiObject.getRootElement(), "-o-transform", guiObject.__rotate, guiObject);
					},
					attribute: function (guiObject, attribute, value) {
						guiObject._cancelRepeatAnimations();
						guiObject.getRootElement().style["-webkit-transition-duration"] = null;
						guiObject.getRootElement().style["transitionDuration"] = null;
						this.changeStyle(guiObject.getRootElement(), attribute, value);
						guiObject._restartRepeatAnimations();
					},
					addMoveAnim: function (guiObject) {
						guiObject._moveAnim = new $N.gui.AnimateHTML(guiObject);
					},
					addScaleAnim: function (guiObject) {
						guiObject._scaleAnim = new $N.gui.AnimateHTML(guiObject);
					},
					addAttributeAnim: function (guiObject, attribute) {
						if (!guiObject._attributeAnim) {
							guiObject._attributeAnim = {};
						}
						guiObject._attributeAnim[attribute] = new $N.gui.AnimateHTML(guiObject, attribute);
					},
					animatedMove: function (guiObject, fromX, fromY, toX, toY, repeat, bounce) {
						if (!ENABLE_HTML_ANIMATIONS || parseFloat(guiObject.getAnimationDuration()) === 0) {
							this.move(guiObject, toX, toY);
							guiObject._moveAnim.animatedCallback();
						} else {
							guiObject._moveAnim.animatedMove(fromX, fromY, toX, toY, GUIObject.use3D, repeat, bounce);
						}
					},
					animatedScale: function (guiObject, from, to, repeat, bounce) {
						if (!ENABLE_HTML_ANIMATIONS || parseFloat(guiObject.getAnimationDuration()) === 0) {
							this.scale(guiObject, to);
							guiObject._scaleAnim.animatedCallback();
						} else {
							guiObject._scaleAnim.animatedScale(from, to, repeat, bounce);
						}
					},
					animatedAttribute: function (guiObject, attribute, from, to, repeat, bounce) {
						if (!ENABLE_HTML_ANIMATIONS || parseFloat(guiObject.getAnimationDuration()) === 0) {
							this.attribute(guiObject, attribute, to);
							guiObject._attributeAnim[attribute].animatedCallback();
						} else {
							guiObject._attributeAnim[attribute].animatedAttribute(from, to, repeat, bounce);
						}
					}
				}
			}[mode];

		function has3d() {
		    var el = document.createElement('p'),
		        has3d,
		        transforms = {
		            'webkitTransform': '-webkit-transform',
		            'OTransform': '-o-transform',
		            'msTransform': '-ms-transform',
		            'MozTransform': '-moz-transform',
		            'transform': 'transform'
		        };
		    document.body.insertBefore(el, null);
		    for (var t in transforms) {
		        if (el.style[t] !== undefined) {
		            el.style[t] = "translate3d(1px,1px,1px)";
		            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
		        }
		    }
		    document.body.removeChild(el);
		    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
		}

		var GUIObject = function (docRef) {
			var me = this;
			this._id = "";
			this._x = 0;
			this._y = 0;
			this._trueX = 0;
			this._trueY = 0;
			this._visible = true;
			this._scale = 1;
			this._opacity = 1;
			this._animationDuration = "0.250s";
			this._docRef = docRef || document;
			this._rootElement = {};
			this._animTransformAdditive = "replace";
			this._verticalAlignment = null;
			this._horizontalAlignment = null;
			this._parent = null;
			this._children = null;
			this._attributeAnim = null;
			// added to maintain backwards compatibility with GUI objects extended outside of the framework
			if (Object.defineProperty) {
	            Object.defineProperty(this, "_rootSVGRef", {
	                get: function () {
						return me._rootElement;
					},
	                set: function (val) {
						me._rootElement = val;
					}
				}, {writable: true});
		    } else {
				this.__defineGetter__("_rootSVGRef", function () {
					return me._rootElement;
				});
				this.__defineSetter__("_rootSVGRef", function (val) {
					me._rootElement = val;
				});
			}
		};

		GUIObject.use3D = false;
		if (navigator.userAgent.indexOf("Ekioh") === -1) {
			// 3D on Android isn't ready for the big time yet since there are graphical glitches
			// so this is currently disabled for android.
			if (navigator && navigator.userAgent && navigator.userAgent.indexOf('Android') === -1) {
				window.addEventListener("load", function (){ GUIObject.use3D = has3d();});
			}
		}

		/**
		 * Links the given array of animations to a master animation such that
		 * the begin animation is triggered by the beginning of the master animation
		 * @method linkAnimations
		 * @static
		 * @param {Object} mainAnim
		 * @param {Array} linkAnims
		 */
		GUIObject.linkAnimations = function (mainAnim, linkAnims) {
			var i;
			if (mode === "SVG") {
				for (i = 0; i < linkAnims.length; i++) {
					linkAnims[i].linked = true;
					linkAnims[i].setBegin(mainAnim.getId() + ".begin");
				}
			}
		};

		var proto = GUIObject.prototype;

		/**
		 * A value that will affect the horizontal position and width that a gui object gets
		 * drawn. For example, if the objects are drawn to a 1080p resolution then setting
		 * the factor to 0.667 allows the same object to draw correctly for 720p
		 * @property {Number} resolutionHorizontalFactor
		 * @readonly 1
		 */
		proto.resolutionHorizontalFactor = 1;

		/**
		 * A value that will affect the vertical position and height that a gui object gets
		 * drawn. For example, if the objects are drawn to a 1080p resolution then setting
		 * the factor to 0.667 allows the same object to draw correctly for 720p
		 * @property {Number} resolutionVerticalFactor
		 * @readonly 1
		 */
		proto.resolutionVerticalFactor = 1;

		/**
		 * Cancels all repeat animations on the gui object
		 * @method _cancelRepeatAnimations
		 * @private
		 */
		proto._cancelRepeatAnimations = function () {
			var attribute;
			if (this._moveAnim && this._moveAnim.isRepeat()) {
				this._moveAnim.cancelAnimation();
			}
			if (this._scaleAnim && this._scaleAnim.isRepeat()) {
				this._scaleAnim.cancelAnimation();
			}
			if (this._attributeAnim) {
				for (attribute in this._attributeAnim) {
					if (this._attributeAnim.hasOwnProperty(attribute) && this._attributeAnim[attribute].isRepeat()) {
						this._attributeAnim[attribute].cancelAnimation();
					}
				}
			}
		};

		/**
		 * Restarts all repeat animations on the gui object
		 * @method _restartRepeatAnimations
		 * @private
		 */
		proto._restartRepeatAnimations = function () {
			var attribute;
			if (this._moveAnim && this._moveAnim.isRepeat()) {
				this._moveAnim.restartAnimation();
			}
			if (this._scaleAnim && this._scaleAnim.isRepeat()) {
				this._scaleAnim.restartAnimation();
			}
			if (this._attributeAnim) {
				for (attribute in this._attributeAnim) {
					if (this._attributeAnim.hasOwnProperty(attribute) && this._attributeAnim[attribute].isRepeat()) {
						this._attributeAnim[attribute].restartAnimation();
					}
				}
			}
		};

		/**
		 * Makes the GUIObject invisible
		 * @method hide
		 */
		proto.hide = function () {
			abstractedMethods.changeStyle(this._rootElement, "display", "none");
			this._visible = false;
			return this;
		};

		/**
		 * Makes the GUIObject visible
		 * @method show
		 */
		proto.show = function () {
			abstractedMethods.changeStyle(this._rootElement, "display", "inline");
			this._visible = true;
			return this;
		};

		/**
		 * Reorders this GUI object so that is in front of the other GUI objects (if any)
		 * that are at the same "level".
		 * @method bringToFront
		 */
		proto.bringToFront = function () {
			abstractedMethods.bringToFront(this);
			return this;
		};

		/**
		 * Determines if the GUIObject is visible
		 * @method isVisible
		 * @return {Boolean} true if the object is visible; false otherwise
		 */
		proto.isVisible = function () {
			return this._visible;
		};

		/**
		 * Shows or hides the GUI object given the a boolean
		 * value.
		 * @method setVisible
		 * @param {Boolean} value
		 */
		proto.setVisible = function (value) {
			if (value === true || (typeof value === 'string' && value.toLowerCase() === 'true')) {
				this.show();
			} else {
				this.hide();
			}
			return this;
		};

		/**
		 * Sets the x position of the graphical object in relation to its parent
		 * @method setX
		 * @param {Number} newX the new x coordinate
		 */
		proto.setX = function (newX) {
			var w;
			this._trueX = 0;	// default trueX to 0 and amend in switch
			switch (newX) {
			case "center":
				this._horizontalAlignment = newX;
				if (this._parent && this._parent.getWidth) {
					w = this.getWidth ? this.getWidth() : 0;
					this._trueX = (this._parent.getWidth() - w) / 2;
				}
				break;
			case "right":
				this._horizontalAlignment = newX;
				if (this._parent && this._parent.getWidth) {
					w = this.getWidth ? this.getWidth() : 0;
					this._trueX = this._parent.getWidth() - w;
				}
				break;
			case "left":
				this._horizontalAlignment = null;
				break;
			default:
				this._horizontalAlignment = null;
				this._trueX = parseInt(newX, 10);
			}

			this._x = Math.round(this._trueX * this.resolutionHorizontalFactor);
			abstractedMethods.move(this, this._x, this._y);
			return this;
		};

		/**
		 * Sets the y position of the graphical object in relation to its parent
		 * @method setY
		 * @param {Number} newY the new y coordinate
		 */
		proto.setY = function (newY) {
			var h;
			this._trueY = 0;	// default trueY to 0 and ammend in switch
			switch (newY) {
			case "middle":
				this._verticalAlignment = newY;
				if (this._parent && this._parent.getHeight) {
					h = this.getHeight ? this.getHeight() : 0;
					this._trueY = (this._parent.getHeight() - h) / 2;
				}
				break;
			case "bottom":
				this._verticalAlignment = newY;
				if (this._parent && this._parent.getHeight) {
					h = this.getHeight ? this.getHeight() : 0;
					this._trueY = this._parent.getHeight() - h;
				}
				break;
			case "top":
				this._verticalAlignment = null;
				break;
			default:
				this._verticalAlignment = null;
				this._trueY = parseInt(newY, 10);
			}
			this._y = Math.round(this._trueY * this.resolutionVerticalFactor);
			abstractedMethods.move(this, this._x, this._y);
			return this;
		};

		/**
		 * Rotates the GUIObject
		 * @method setRotation
		 * @param {Number} degrees the amount in degrees to rotate
		 * @param {Number} xOrigin optional x origin to rotate around
		 * @param {Number} yOrigin optional y origin to rotate around
		 */
		proto.setRotation = function (degrees, xOrigin, yOrigin) {
			abstractedMethods.rotate(this, degrees, xOrigin, yOrigin);
			return this;
		};

		/**
		 * Moves the GUIObject to the new location
		 * @method move
		 * @param {Number} newX the new x coordinate
		 * @param {Number} newY the new y coordinate
		 */
		proto.move = function (newX, newY) {
			this._trueX = parseInt(newX, 10);
			this._trueY = parseInt(newY, 10);
			this._x = Math.round(this._trueX * this.resolutionHorizontalFactor);
			this._y = Math.round(this._trueY * this.resolutionVerticalFactor);
			abstractedMethods.move(this, this._x, this._y);
			if (this._animationDependents) {
				this._checkAnimationDependents();
			}
			return this;
		};

		/**
		 * Adds an animation to the attribute of the GUIObject
		 * @method addAttributeAnimation
		 */
		proto.addAttributeAnimation = function (attribute) {
			abstractedMethods.addAttributeAnim(this, attribute);
			return this;
		};

		/**
		 * Adds an animation to the fading of the GUIObject
		 * @method addFadeAnimation
		 */
		proto.addFadeAnimation = function () {
			abstractedMethods.addAttributeAnim(this, "opacity");
			return this;
		};

		/**
		 * Adds an animation to the scaling of the GUIObject
		 * @method addScaleAnimation
		 */
		proto.addScaleAnimation = function () {
			abstractedMethods.addScaleAnim(this);
			return this;
		};

		/**
		 * Adds an animation to the movement (translation) of the GUIObject
		 * @method addMoveAnimation
		 */
		proto.addMoveAnimation = function () {
			abstractedMethods.addMoveAnim(this);
			return this;
		};

		/**
		 * Moves the object from the specified location (if provided)
		 * to the specified new location and animates the movement.
		 * @method doMove
		 * @param {Number} newX the new x coordinate
		 * @param {Number} newY the new y coordinate
		 * @param {Number} [fromX] the original x coordinate. Defaults to the current x coordinate
		 * @param {Number} [fromY] the original y coordinate. Defaults to the current y coordinate
		 * @param {Boolean} repeat indicates whether the animation is to be repeated
		 * @param {Boolean} bounce indicates whether a repeated animation should be performed in reverse also
		 */
		proto.doMove = function (newX, newY, fromX, fromY, repeat, bounce) {
			if (fromX === undefined || fromX === null) {
				fromX = this.getX();
			}
			if (fromY === undefined || fromY === null) {
				fromY = this.getY();
			}
			if (!repeat) {
				this._trueX = parseInt(newX, 10);
				this._trueY = parseInt(newY, 10);
				this._x = Math.round(this._trueX * this.resolutionHorizontalFactor);
				this._y = Math.round(this._trueY * this.resolutionVerticalFactor);
				abstractedMethods.animatedMove(this, parseInt(fromX, 10), parseInt(fromY, 10), this._x, this._y, repeat, bounce);
			} else {
				abstractedMethods.animatedMove(this, parseInt(fromX, 10), parseInt(fromY, 10), Math.round(parseInt(newX, 10) * this.resolutionHorizontalFactor), Math.round(parseInt(newY, 10) * this.resolutionVerticalFactor), repeat, bounce);
			}
			return this;
		};

		/**
		 * Changes the attribute to the specified value and animates the change.
		 * Currently only caters for the attributes opacity, width and height.
		 * @method doAttributeAnimation
		 * @param {String} attribute The name of the attribute
		 * @param {Number} newValue the new attribute value
		 * @param {Boolean} repeat indicates whether the animation is to be repeated
		 * @param {Boolean} bounce indicates whether a repeated animation should be performed in reverse also
		 */
		proto.doAttributeAnimation = function (attribute, newValue, repeat, bounce) {
			var oldValue = null;
			switch (attribute) {
			case "opacity":
				oldValue = this.getOpacity();
				if (!repeat) {
					this._opacity = newValue;
				}
				break;
			case "width":
				oldValue = this.getWidth();
				if (!repeat) {
					this._width = newValue;
				}
				if (GUIObject.mode === "HTML") {
					oldValue += "px";
					newValue += "px";
				}
				break;
			case "height":
				oldValue = this.getHeight();
				if (!repeat) {
					this._height = newValue;
				}
				if (GUIObject.mode === "HTML") {
					oldValue += "px";
					newValue += "px";
				}
				break;
			case "x":
				oldValue = this.getX();
				if (!repeat) {
					this._x = newValue;
				}
				break;
			}
			abstractedMethods.animatedAttribute(this, attribute, oldValue, newValue);
			return this;
		};

		/**
		 * Changes the opacity attribute to the specified value and animates the change.
		 * @method doFade
		 * @param {Number} opacity the new opacity value
		 * @param {Boolean} repeat indicates whether the animation is to be repeated
		 * @param {Boolean} bounce indicates whether a repeated animation should be performed in reverse also
		 */
		proto.doFade = function (opacity, repeat, bounce) {
			var fromOpacity = this.getOpacity();
			if (!repeat) {
				this._opacity = opacity;
			}
			abstractedMethods.animatedAttribute(this, "opacity", fromOpacity, opacity, repeat, bounce);
			return this;
		};

		/**
		 * Changes the scale attribute to the specified value and animates the change.
		 * @method doScale
		 * @param {Number} scale the new scale value
		 * @param {Boolean} repeat indicates whether the animation is to be repeated
		 * @param {Boolean} bounce indicates whether a repeated animation should be performed in reverse also
		 */
		proto.doScale = function (scale, repeat, bounce) {
			var fromScale = this.getScale();
			if (!repeat) {
				this._scale = scale;
			}
			abstractedMethods.animatedScale(this, fromScale, scale, repeat, bounce);
			return this;
		};

		/**
		 * Sets the duration of the current animation
		 * @method setAnimationDuration
		 * @param {String} duration duration of animation in seconds
		 */
		proto.setAnimationDuration = function (duration) {
			var attribute = {};
			this._animationDuration = duration;
			if (this._moveAnim) {
				this._moveAnim.setDuration(duration);
			}
			if (this._scaleAnim) {
				this._scaleAnim.setDuration(duration);
			}
			if (this._attributeAnim) {
				for (attribute in this._attributeAnim) {
					if (this._attributeAnim.hasOwnProperty(attribute)) {
						this._attributeAnim[attribute].setDuration(duration);
					}
				}
			}
			return this;
		};

		/**
		 * Gets the duration of the current animation
		 * @method getAnimationDuration
		 * @return {String} duration of animation in seconds
		 */
		proto.getAnimationDuration = function () {
			return this._animationDuration;
		};

		/**
		 * Sets the id of the GUIObject
		 * @method setId
		 * @param {String} newId the new id that's to be used
		 */
		proto.setId = function (newId) {
			this._id = newId;
			this._rootElement.setAttribute("id", this._id);
			return this;
		};

		/**
		 * Sets the opacity of the GUIObject in the range of 0 - 1
		 * @method setOpacity
		 * @param {Number} opacity the new value for opacity
		 */
		proto.setOpacity = function (opacity) {
			this._opacity = opacity;
			abstractedMethods.attribute(this, "opacity", opacity);
			return this;
		};

		/**
		 * Sets an attribute of the GUIObject. Note: this applies only
		 * to the root element of the object so is mainly useful for things
		 * like clipping or opacity. This method can be overridden in subclasses
		 * to be more useful
		 * @method setAttribute
		 * @param {String} attribute The attribute to be set
		 * @param {Number} newValue New value of the attribute
		 */
		proto.setAttribute = function (attribute, newValue) {
			switch (attribute) {
			case "opacity":
				this._opacity = newValue;
				break;
			case "width":
				this._width = newValue;
				if (GUIObject.mode === "HTML") {
					newValue += "px";
				}
				break;
			case "height":
				this._height = newValue;
				if (GUIObject.mode === "HTML") {
					newValue += "px";
				}
				break;
			}
			abstractedMethods.attribute(this, attribute, newValue);
			return this;
		};

		/**
		 * Sets the scale of the GUIObject
		 * @method setScale
		 * @param {Number} scale the new value for scale
		 */
		proto.setScale = function (scale) {
			this._scale = scale;
			abstractedMethods.scale(this, scale);
			return this;
		};

		/**
		 * Returns true if this object has been set with an auto alignment position
		 * (such as left, reight, center, top, middle or bottom)
		 * @method isAligned
		 * @param {Boolean} true if the object is aligned
		 */
		proto.isAligned = function () {
			if (this._horizontalAlignment || this._verticalAlignment) {
				return true;
			}
			return false;
		};

		/**
		 * Returns the current x position of the GUIObject in relation to its parent
		 * @method getX
		 * @return {Number} the x coordinate
		 */
		proto.getX = function () {
			return this._x;
		};

		/**
		 * Returns the current y position of the GUIObject in relation to its parent
		 * @method getY
		 * @return {Number} the y coordinate
		 */
		proto.getY = function () {
			return this._y;
		};

		/**
		 * Returns the true x position of the GUIObject in relation to its parent
		 * @method getTrueX
		 * @return {Number} the x coordinate
		 */
		proto.getTrueX = function () {
			return this._trueX;
		};

		/**
		 * Returns the true y position of the GUIObject in relation to its parent
		 * @method getTrueY
		 * @return {Number} the y coordinate
		 */
		proto.getTrueY = function () {
			return this._trueY;
		};

		/**
		 * Return the id of the GUIObject
		 * @method getId
		 * @return {String} the value of the id attribute
		 */
		proto.getId = function () {
			return this._id;
		};

		/**
		 * Returns the current opacity of the GUIObject
		 * @method getOpacity
		 * @return {Number} the opacity attribute value
		 */
		proto.getOpacity = function () {
			return this._opacity;
		};

		/**
		 * Returns the value of the scale property
		 * @method getScale
		 * @return {Number} the scale attribute value
		 */
		proto.getScale = function () {
			return this._scale;
		};

		/**
		 * Returns the reference to the root DOM representation of the GUIObject
		 * @method getRootSVGRef
		 * @deprecated use getRootElement
		 * @return {Object} DOM object
		 */
		proto.getRootSVGRef = function () {
			return this.getRootElement();
		};

		/**
		 * Returns the reference to the root DOM representation of the GUIObject
		 * @method getRootElement
		 * @return {Object} DOM Element
		 */
		proto.getRootElement = function () {
			return this._rootElement;
		};

		/**
		 * Takes an object e.g. {x:5, y:10} and calls the mutator methods
		 * on the GUIObject that correspond to the given attributes
		 * @method configure
		 * @param {Object} confObj The object that contains configuration parameters
		 */
		proto.configure = function (confObj) {
		    var setMethod,
				e = null;

		    for (e in confObj) {
				if (confObj.hasOwnProperty(e)) {
			        setMethod = this["set" + $N.gui.Util.upcaseFirstLetter(e)];
			        if (setMethod) {
			            setMethod.call(this, confObj[e]);
			        } else {
			            throw ("GUIObject configure - no setter method for attribute " + e);
			        }
		        }
		    }
		    return this;
		};

		/**
		 * Sets the parent of this object
		 * @method setParent
		 * @param {Object} parent object to be set as the parent
		 */
		proto._setParent = function (parent) {
			this._parent = parent;
		};

		/**
		 * Adds another GUIObject as a child of the current GUIObject to the DOM
		 * @method addChild
		 * @param {Object} childObj object to be added as child
		 */
		proto.addChild = function (childObj) {
			if (!this._children) {
				this._children = [];
			}
			this._children.push(childObj);
			if (childObj._setParent) {
				childObj._setParent(this);
				if (childObj.isAligned()) {
					this._redrawChild(childObj);
				}
			}
			this.getRootElement().appendChild(childObj.getRootElement());
			return this;
		};

		/**
		 * Repositions all children of this object if they have an aligned psotion
		 * @method _redrawChildren
		 * @private
		 */
		proto._redrawChildren = function () {
			var i,
				childObj,
				length = this._children ? this._children.length : 0;
			for (i = 0; i < length; i++) {
				childObj = this._children[i];
				if (childObj.isAligned && childObj.isAligned()) {
					this._redrawChild(childObj);
				}
			}
		};

		/**
		 * Repositions a child object
		 * @method _redrawChild
		 * @private
		 * @param {Object} childObj A GUIObject
		 */
		proto._redrawChild = function (childObj) {
			if (childObj._horizontalAlignment) {
				childObj.setX(childObj._horizontalAlignment);
			}
			if (childObj._verticalAlignment) {
				childObj.setY(childObj._verticalAlignment);
			}
		};

		/**
		 * Gets the move animation object for the GUIObject
		 * @method getMoveAnimation
		 * @return {Object}
		 */
		proto.getMoveAnimation = function () {
			return this._moveAnim;
		};

		/**
		 * Gets the attribute animation object for the GUIObject
		 * @method getAttributeAnimation
		 * @return {Object}
		 */
		proto.getAttributeAnimation = function (attribute) {
			return this._attributeAnim[attribute];
		};

		/**
		 * Gets the fade animation object for the GUIObject
		 * @method getFadeAnimation
		 * @return {Object}
		 */
		proto.getFadeAnimation = function () {
			return this._attributeAnim.opacity;
		};

		/**
		 * Gets the scale animation object for the GUIObject
		 * @method getScaleAnimation
		 * @return {Object}
		 */
		proto.getScaleAnimation = function () {
			return this._scaleAnim;
		};

		/**
		 * Removes any animations that have been set up for the GUIObject
		 * @method removeAnimations
		 * @chainable
		 */
		proto.removeAnimations = function () {
			var animAttribute,
				anims = ['_scaleAnim', '_moveAnim'],
				i;
			for (animAttribute in this._attributeAnim) {
				if (this._attributeAnim.hasOwnProperty(animAttribute)) {
					this._attributeAnim[animAttribute] = null;
				}
			}
			for (i = anims.length - 1; i >= 0; i--) {
				this[anims[i]] = null;
			}
			return this;
		};

		/**
		 * Gets the reference to the GUIObject's reference from its parent's _children collection.
		 * @method _removeReferenceFromParent
		 * @private
		 */
		proto._removeReferenceFromParent = function () {
			var i,
				childrenOfParent;
			if (this._parent && this._parent._children) {
				childrenOfParent = this._parent._children;
				for (i = childrenOfParent.length - 1; i >= 0; i--) {
					if (this === childrenOfParent[i]) {
						childrenOfParent.splice(i, 1);
					}
				}
			}
		};

		/**
		 * Removes the GUIObject from the DOM, and destroys all references held in the GUIObject. Additionally,
		 * any references of the object in its parent are also removed, thus wiping the memory usage slate clean.
		 * @method destroy
		 */
		proto.destroy = function () {
			this.removeAnimations();
			this._removeReferenceFromParent();
			if (this._rootElement && this._rootElement.parentNode) {
				this._rootElement.parentNode.removeChild(this._rootElement);
			}
			delete this._rootElement;
		};

		/**
		 * Removes the root element from the parent element.
		 * @method removeFromParent
		 */
		proto.removeFromParent = function() {
			this._removeReferenceFromParent();
			if (this._rootElement && this._rootElement.parentNode) {
				this._rootElement.parentNode.removeChild(this._rootElement);
			}
		};

		/**
		 * Given an id of an element in the document, will create a new GUIObject
		 * which references that element
		 * @method createFromExistingSVG
		 * @deprecated use createFromExistingMarkup instead
		 * @param {Object} doc Reference to the DOM document object
		 * @param {Object} svgId Id of the SVG element to add the new object to
		 * @param {Object} Type (optional) Type of SVG element to be added. Defaults to GUIObject
		 * @return {Object} The new GUI Object.
		 */
		GUIObject.createFromExistingSVG = function (doc, svgId, Type) {
			return GUIObject.createFromExistingMarkup(doc, svgId, Type);
		};

		/**
		 * Given an id of an element in the document, will create a new GUIObject
		 * which references that element
		 * @method createFromExistingMarkup
		 * @param {Object} doc Reference to the DOM document object
		 * @param {Object} id Id of the element to add the new object to
		 * @param {Object} Type (optional) Type of gui object to be added. Defaults to GUIObject
		 * @return {Object} The new GUI Object.
		 */
		GUIObject.createFromExistingMarkup = function (doc, id, Type) {
			var newObj;
			newObj = Type ? new Type() : new GUIObject();
			newObj._rootElement = doc.getElementById(id);
			return newObj;
		};

		/**
		 * The mode that the markup is rendered in `HTML` or `SVG`
		 * @property {String} mode
		 */
		GUIObject.mode = mode;

		/**
		 * A set of functions that abstracts the DOM manipluation
		 * @property {Object} abstractedMethods
		 */
		GUIObject.abstractedMethods = abstractedMethods;

		window.$N = $N || {};
		$N.gui = $N.gui || {};
		$N.gui.GUIObject = GUIObject;
		return GUIObject;
	}
);
