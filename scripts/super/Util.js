/**
 * Helper class containing a set of common functions
 * @class $N.gui.Util
 *
 * @static
 */

/*global alert */
define('jsfw/gui/helpers/Util',
    [],
    function () {
    	window.$N = $N || {};
		$N.gui = $N.gui || {};
		$N.gui.Util = {
			/**
			 * Alerts the given text, wrapping the line onto multiple lines if it has more than
			 * the specified number of characters.
			 *
			 * This function is useful for long strings: "alert" accommodates a finite number of
			 * characters with most JS interpreters, and this limit varies between interpreters.
			 * Any strings longer than this limit, and the remainder characters are usually
			 * thrown away (although this behaviour is also interpreter-specific). This number
			 * includes the characters it prepends to your alerted message, and is,
			 * unfortunately, variable.
			 *
			 * The last character to be displayed on a line before wrapping is referred to, here,
			 * as the "maximum character".
			 *
			 * If no maximum number of characters is given, then it defaults to 90 (a comfortable
			 * number for Putty windows).
			 *
			 * If an `indent` is supplied, then this added to the start of any
			 * wrapped lines (i.e. every line after the first one). The number of characters
			 * in the indent is taken into account if subsequent line-wraps are needed.
			 *
			 * If `wrapAtSpace` is true, then lines are wrapped after the last
			 * space character that appears before the maximum character. If there are no such
			 * spaces, or if `wrapAtSpace` is false, then the line is wrapped
			 * immediately after the maximum character. Note that `wrapAtSpace` only
			 * applies to space characters, and not any other whitespace characters.
			 *
			 * Note that newline characters will be replaced with spaces before any line-wrap
			 * calculations are made.
			 *
			 * TODO Other browsers may have different limits, modify this function to cater for them.
			 * TODO Accommodate all whitespace characters for "wrapAtSpace".
			 * TODO Take into account newlines in a way that doesn't replace them with spaces.
			 *
			 * @method alertWithLineWrap
			 * @param {String}  text         the text to alert, and wrap onto new lines if necessary.
			 * @param {String}  indent       (optional) the indent to prepend to wrapped lines.
			 * @param {Boolean} wrapAtSpace (optional, default = false) if true, wraps the line at
			 *                               the last printable space char. If false, wraps after the
			 *                               maximum char.
			 * @param {Number}  maxNumChars  (optional, default = 90) the maximum number of chars
			 *                               to display on any given line.
			 */
			alertWithLineWrap: function (text, indent, wrapAtSpace, maxNumChars) {
				var wrapped = false,
					endpoint;
		
				maxNumChars = maxNumChars || 90;
				endpoint = maxNumChars;
				text = text || "";
				text = text.replace("\n", " ");
				indent = indent || "";
				wrapAtSpace = (wrapAtSpace && (wrapAtSpace === true || wrapAtSpace === "true")) ? true : false;
		
				while (text.length > maxNumChars) {
					if (wrapped) {
						text = indent + text;
					}
					if (wrapAtSpace) {
						endpoint = text.lastIndexOf(" ", maxNumChars);
						if (endpoint === -1 || endpoint <= indent.length) {
							endpoint = maxNumChars;
						}
					}
					alert(text.substring(0, endpoint));
					text = text.substring(endpoint);
					wrapped = true;
				}
		
				if (wrapped) {
					text = indent + text;
				}
				alert(text);
			},
		
			/**
			 * Given a string, the same string is returned but with the first letter of each word
			 * capitalised
			 * @method upcaseFirstLetter
			 * @param {Object} str
			 * @return {String}
			 */
			upcaseFirstLetter: function (str) {
				var i,
				returnString = "",
				array = str.split(" ");
	
				for ( i = 0; i < array.length; i++) {
					returnString += array[i].substr(0, 1).toUpperCase() + array[i].substr(1);
					if (i < array.length - 1) {
						returnString += " ";
					}
				}
				return returnString;
			},
		
			/**
			 * A coordinate object
			 * @method coord
			 * @param {Number} x
			 * @param {Number} y
			 */
			coord: function (x, y) {
				return {
					x: x,
					y: y
				};
			},
		
			/**
			 * An object that allows a point or series to be got from
			 * a Bezier curve.
			 * @property {Object} bezier
			 */
			bezier: (function () {
		
				var B1 = function (t) {
						return t * t * t;
					},
					B2 = function (t) {
						return 3 * t * t * (1 - t);
					},
					B3 = function (t) {
						return 3 * t * (1 - t) * (1 - t);
					},
					B4 = function (t) {
						return (1 - t) * (1 - t) * (1 - t);
					};
		
				return {
					getPoint: function (percent, C1, C2, C3, C4) {
						var x = C1.x * B1(percent) + C2.x * B2(percent) + C3.x * B3(percent) + C4.x * B4(percent),
							y = C1.y * B1(percent) + C2.y * B2(percent) + C3.y * B3(percent) + C4.y * B4(percent);
						return $N.gui.Util.coord(x, y);
					},
					getSeries: function (count, C1, C2, C3, C4) {
						var points = [],
							percent,
							i;
						for (i = 0; i < count; i++) {
							percent = i / (count - 1);
							points.push(this.getPoint(percent, C1, C2, C3, C4));
						}
						return points;
					}
				};
		
			}()),
		
			/**
			 * Extends the given subclass with the functions of the superclass
			 * @method extend
			 * @param {Object} subClass
			 * @param {Object} superClass
			 */
			extend: function (subClass, superClass) {
				var F = function () {};
				F.prototype = superClass.prototype;
		
				subClass.prototype = new F();
				subClass.prototype.constructor = subClass;
				subClass.superConstructor = superClass;
				subClass.superClass = superClass.prototype;
			},
		
			/**
			 * used for printObject method
			 * @method getClass
			 * @param {Object} object
			 * @return {String}
			 */
			getClass: function (object) {
				try {
					return Object.prototype.toString.call(object).slice(8, -1);
				} catch (err) {
					return '';
				}
			},
		
			/**
			 * Alerts the contents of a given object to the console
			 * @method printObject
			 * @param {Object} obj
			 * @param {Object} objName
			 * @param {Object} skipList
			 * @param {Object} previous
			 * @param {Object} level
			 */
			printObject: function (obj, objName, skipList, previous, level) {
				var a,
					index,
					params,
					skip;
		
				if (!level) {
					level = 0;
				}
				if (!objName) {
					objName = 'obj';
				}
				if (!previous) {
					previous = objName;
				}
				if (typeof obj !== 'object' || level > 3) {
					return;
				}
		
				for (a in obj) {
					if (obj.hasOwnProperty(a)) {
						skip = false;
						if ($N.gui.Util.getClass(skipList) === 'Array') {
							for (index = 0; index < skipList.length; index++) {
								if (a === skipList[index]) {
									skip = true;
									break;
								}
							}
						}
						if (!skip) {
							if (typeof obj[a] === 'function') {
								params = /\([\^\)]*\)/.exec(obj[a])[1];
								if (params === undefined) {
									params = '()';
								}
							} else {
								$N.gui.Util.printObject(obj[a], objName, skipList, previous + "[" + a + "]", level + 1);
							}
						}
					}
				}
			},
		
			/**
			 * Prints to the screen, recursively, the DOM tree. This includes the root element, its
			 * inner nodes and their attributes, recursively. The DOM tree is printed to the screen as
			 * if it were markup source, with a few exceptions:
			 *
			 * If a node is a DOM text node, then the node value will be printed within `tnode`
			 * pseudo-tags. For example, a text node containing the text "hello, world" (without quotes)
			 * will be printed as: `[tnode]hello, world[/tnode]`
			 *
			 * If the node is not a DOM text node, but has no children and a non-empty `nodeValue`,
			 * then the node value will be printed within `val` pseudo-tags. Ditto for a non-empty
			 * `textContent` (printed within `con` pseudo-tags) and non-empty
			 * `innerHTML` (printed within `inn` pseudo-tags). If such a node contains
			 * two or more of the above, then they will all printed, in the above order.
			 *
			 * If the root element is `null` or `undefined`, then one of those two
			 * terms will be printed inside square brackets.
			 *
			 * Notes:
			 * <ol>
			 * <li>This function wraps long lines onto new lines. This is done at a space character if
			 *     there is one, in order to aid readability. However, if a single node (such as an
			 *     attribute) contains spaces, the line may be wrapped at this point. This means the
			 *     output is not necessarily valid SVG, as it is displayed on screen.</li>
			 * <li>The output of this function is only <i>representative</i> of the underlying DOM. No
			 *     guarantees are made that it matches exactly the contents of the markup file that the DOM
			 *     was built from, if any.</li>
			 * <li>If the markup conforms to the W3C DOM standard, this method will probably work with DOMs
			 * built from other mark-up languages. However, this is untested.</li>
			 * </ol>
			 *
			 * @method printSVGDOM
			 * @param {Object} rootElement the root element to print out (recursively).
			 * @param {Number} level       this is set internally. Do not set this parameter.
			 */
			printSVGDOM: function (rootElement, level) {
				if (!rootElement) {
					alert("[" + rootElement + "]");
					return;
				}
		
				var children = rootElement.childNodes,
					indent = "";
		
				var len,
					i,
					tagString,
					rootAttributes,
					rootAttribute,
					wrapIndent;
		
				level = level || 0;
		
				for (i = 0; i < level; i++) {
					indent += "  ";
				}
				wrapIndent = indent + "    ";
		
				if (rootElement.nodeType === 3) {
					// Text node: Just print its value
					this.alertWithLineWrap(indent + "[tnode]" + rootElement.nodeValue + "[/tnode]", wrapIndent, true);
				} else {
					// Create open tag with attributes
					tagString = indent + "<" + rootElement.nodeName;
					if (rootElement.attributes) {
						rootAttributes = rootElement.attributes;
						for (i = 0; i < rootAttributes.length; i++) {
							rootAttribute = rootAttributes[i];
							tagString += " " + rootAttribute.nodeName + "=\"" + rootAttribute.nodeValue + "\"";
						}
					}
		
					if (children && children.length !== 0) {
						// Node with children - display tag and children, recursively
						this.alertWithLineWrap(tagString + ">", wrapIndent, true);
						// Process the node's child nodes
						len = children.length;
						for (i = 0; i < len; i++) {
							this.printSVGDOM(children[i], level + 1);
						}
						// Close tag
						this.alertWithLineWrap(indent + "</" + rootElement.nodeName + ">", wrapIndent, true);
					} else if ((rootElement.nodeValue && rootElement.nodeValue !== "") ||
							(rootElement.textContent && rootElement.textContent !== "") ||
							(rootElement.innerHTML && rootElement.innerHTML !== "")) {
						// Not a text node, but contains text - display tag and text
						this.alertWithLineWrap(tagString + ">", wrapIndent, true);
						// Node as no children: Just print its value
						if (rootElement.nodeValue && rootElement.nodeValue !== "") {
							this.alertWithLineWrap(indent + "  [val]" + rootElement.nodeValue + "[/val]", wrapIndent, true);
						}
						if (rootElement.textContent && rootElement.textContent !== "") {
							this.alertWithLineWrap(indent + "  [con]" + rootElement.textContent + "[/con]", wrapIndent, true);
						}
						if (rootElement.innerHTML && rootElement.innerHTML !== "") {
							this.alertWithLineWrap(indent + "  [inn]" + rootElement.textContent + "[/inn]", wrapIndent, true);
						}
						// Close tag
						this.alertWithLineWrap(indent + "</" + rootElement.nodeName + ">", wrapIndent, true);
					} else {
						// Empty tag - show entire tag on one line
						this.alertWithLineWrap(tagString + "/>", wrapIndent, true);
					}
				}
			},
		
			/**
			 * Converts a given XML string to JSON
			 * @method xml2Json
			 * @param {Object} xml
			 * @return {Object}
			 */
			xml2Json: function (xml) {
				var obj = {},
					j,
					i,
					old;
		
				if (xml.nodeType === 1) { // element
					// do attributes
					if (xml.attributes.length > 0) {
						obj['@attributes'] = {};
						for (j = 0; j < xml.attributes.length; j++) {
							obj['@attributes'][xml.attributes[j].nodeName] = xml.attributes[j].nodeValue;
						}
					}
				}
		
				// do children
				if (xml.hasChildNodes && xml.hasChildNodes()) {
					for (i = 0; i < xml.childNodes.length; i++) {
						if (xml.childNodes[i].nodeType === 1 ||
								(xml.childNodes[i].nodeType === 3 && xml.childNodes[i].nodeValue.trim() !== "")) {
							if (typeof obj[xml.childNodes[i].nodeName] === 'undefined') {
								if (xml.childNodes[i].nodeType === 3) {
									obj = xml.childNodes[i].nodeValue;
								} else {
									obj[xml.childNodes[i].nodeName] = $N.gui.Util.xml2Json(xml.childNodes[i]);
								}
							} else {
								if (typeof obj[xml.childNodes[i].nodeName].length === 'undefined') {
									old = obj[xml.childNodes[i].nodeName];
									obj[xml.childNodes[i].nodeName] = [];
		
									obj[xml.childNodes[i].nodeName].push(old);
								}
								obj[xml.childNodes[i].nodeName].push($N.gui.Util.xml2Json(xml.childNodes[i]));
							}
						}
					}
				}
				return obj;
			},
		
			/**
			 * Given the path of the root app, sub application and file path relative to the
			 * root application will return the file path relative to the sub application
			 * @method remapRelativeFilePath
			 * @param {String} mainPagePath
			 * @param {String} subPagePath
			 * @param {String} filePath
			 * @return {string}
			 */
			remapRelativeFilePath: function (mainPagePath, subPagePath, filePath) {
				var lastSlash = mainPagePath.lastIndexOf("/"),
					trimmedSubPagePath = subPagePath.substring(lastSlash + 1),
					subPageArray = trimmedSubPagePath.split("/"),
					filePathArray = filePath.split("/"),
					newPathArray = [],
					returnPath,
					i,
					loopLength = Math.max(subPageArray.length, filePathArray.length),
					lastItemIsFolder = filePath.indexOf(".") < 0;
		
				for (i = 0; i < loopLength - 1; i++) {
					if (filePathArray[i] !== subPageArray[i]) {
						if (i < subPageArray.length - 1) {
							newPathArray.unshift("..");
						}
						if (i < filePathArray.length  - 1 || (i === filePathArray.length  - 1 && lastItemIsFolder)) {
							newPathArray.push(filePathArray[i]);
						}
					}
				}
				newPathArray.push(filePathArray[filePathArray.length - 1]);
				returnPath = newPathArray.join("/");
				return returnPath;
			}
		};

		return $N.gui.Util;
	}
);
