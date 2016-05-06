/**
 * Copyright 2012 Research and Development Unit for English Studies,
 *                Birmingham City University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function prepareTextInteraction() {
	this.highlight = {
		active: false,
		customTouch: false
	};

	if (highlightMethod == "d") {

		if (permissions.makeHighlights) {
			$("#textHolder").mousedown(function (event) {
				event.preventDefault();
				doStartSelect(event);

			}).mouseup(function (event) {
				event.preventDefault();

				var now = (new Date).getTime();
				if (highlight.active && mouseDeviated(highlight, event)) {
					// end of drag
					doEndSelect(event);
				} else if (lastMouseUp > now - clickDelay) {
					// double click
					doDoubleClick(event);
				} else {
					// single click
					doSingleClick(event);
				}
				lastMouseUp = now;
				highlight.active = false;
				setTimeout("lastOpened = null", clickDelay);
			})
			.mousemove(function (event) {
				event.preventDefault();

				if (highlight.active) {
					doSelect(event);
				} else {
					doMouseOver(event);
				}
			});

			$("body").mouseup(function (event) {
				// if not in #textHolder
				if (!$(event.target).is("#textHolder") && $(event.target).closest("#textHolder").length == 0) {
					//event.preventDefault(); - breaks text selection
					var now = (new Date).getTime();
					if (highlight.active) {
						removeSelection(event);
					}
					lastMouseUp = now;
					highlight.active = false;
					setTimeout("lastOpened = null", clickDelay);
				}
			})
			.mousemove(function (event) {
				// if not in #textHolder
				if (!$(event.target).is("#textHolder") && $(event.target).closest("#textHolder").length == 0) {
					//event.preventDefault(); - breaks text selection
					if (highlight.active) {
						removeSelection(event);
					}
				}
			});
		}
		else if (permissions.viewHighlights) {
			$("#textHolder").click(function (event) {
				event.preventDefault();
				doSingleClick(event);
			})
			.mousemove(function (event) {
				event.preventDefault();
				doMouseOver(event);
			});
		}

	} else if (highlightMethod == "t") {

		touchMenu = { active: false };
		dragInfo = { active: false };

		if (permissions.makeHighlights) {
			$("#textHolder").click(function (event) {
				if (!dragInfo.active) {
					event.preventDefault();
					doSingleTouch(event);
				}
			});

			$("#pageTouchMenu .openButton").button({
				icons: {
					primary: "ui-icon-eyeopen"
				},
				text: false
			}).click(tmOpenAnnotation);

			$("#pageTouchMenu .addButton").button({
				icons: {
					primary: "ui-icon-plusthick"
				},
				text: false
			}).click(tmAnnotateWord);

			$("#pageTouchMenu .highlightButton").button({
				icons: {
					primary: "ui-icon-continue-highlight"
				},
				text: false
			}).click(tmAnnotateTokenRange);
		}
		else if (permissions.viewHighlights) {
			$("#textHolder").click(function (event) {
				if (!dragInfo.active) {
					event.preventDefault();
					doSingleClick(event);
				}
			});
		}

	} else if (highlightMethod == "t2") {

		if (permissions.makeHighlights) {
			$("#textHolder").bind("touchstart", function (event) {
				var det = touchEventDetails(event);
				if ($(det.touchTarget).is("span[id^=t]")) {
					// don't prevent default to allow multi-touch stuff
					highlight.customTouch = true;
					highlight.scrollTop = $(window).scrollTop();
					highlight.scrollLeft = $(window).scrollLeft();
					highlight.touchStart = (new Date).getTime();
					doStartSelect(det);
				}
			})
			.bind("touchend", function (event) {
				var det = touchEventDetails(event);
				if (highlight.customTouch) {
					event.preventDefault();

					var now = (new Date).getTime();
					if (highlight.active && mouseDeviated(highlight, det) && highlight.touchStart < now - swipeDelay && !scrollDeviated(highlight)) {
						// end of drag
						doEndSelect(det);
					} else if (lastMouseUp > now - clickDelay) {
						// double click
						doDoubleClick(det);
					} else {
						// single click
						doSingleClick(det);
					}
					lastMouseUp = now;
					highlight.active = false;
					highlight.customTouch = false;
					setTimeout("lastOpened = null", clickDelay);
				}
			})
			.bind("touchmove", function (event) {
				var det = touchEventDetails(event);
				if (det.numberOfTouches > 1) {
					stopSelection();
				}

				var now = (new Date).getTime();
				if (highlight.customTouch) {
					event.preventDefault();
					if (highlight.active) {
						doSelect(det);
					}
				}
			});

			$("body").bind("touchend", function (event) {
				var det = touchEventDetails(event);
				if (highlight.customTouch) {
					// if not in #textHolder
					if (!$(det.target).is("#textHolder") && $(det.target).closest("#textHolder").length == 0) {
						event.preventDefault();
						stopSelection();
					}
				}
			})
			.bind("touchmove", function (event) {
				var det = touchEventDetails(event);
				if (det.numberOfTouches > 1) {
					stopSelection();
				}

				if (highlight.customTouch) {
					if (!$(det.target).is("#textHolder") && $(det.target).closest("#textHolder").length == 0) {
						event.preventDefault();
						if (highlight.active) {
							removeSelection();
						}
					}
				}
			})
			.bind("touchcancel", function (event) {
				if (highlight.active) {
					stopSelection();
				}
			});
		}
		else if (permissions.viewHighlights) {
			$("#textHolder").click(function (event) {
				var det = touchEventDetails(event);
				if ($(det.touchTarget).is("span[id^=t]")) {
					event.preventDefault();
					doSingleClick(event);
				}
			});
		}

	}
}

function doSingleClick(event) {
	removeSelection();
	hideAnnotationTips();

	if ($(event.target).is("span[id^=t]")) {
		openAnnotations(event.target, event.pageX, event.pageY);
	}
}

function doDoubleClick(event) {
	closeLastOpenedAnnotations();

	if ($(event.target).is("span[id^=t]")) {
		highlight.start = event.target.id;
		highlight.end = event.target.id;
		highlight.active = false;
		highlight.startMouseX = event.pageX;
		highlight.startMouseY = event.pageY;
		highlight.endMouseX = event.pageX;
		highlight.endMouseY = event.pageY;
		drawTokenRangeSelection();
		newAnnotation();
	}
}

function doStartSelect(event) {
	removeSelection();

	if ($(event.target).is("span[id^=t]")) {
		highlight.start = event.target.id;
		highlight.end = event.target.id;
		highlight.active = true;
		highlight.startMouseX = event.pageX;
		highlight.startMouseY = event.pageY;
	}
}

function doSelect(event) {
	if ($(event.target).is("span[id^=t]")) {
		highlight.end = event.target.id;
		drawTokenRangeSelection();
	} else {
		removeSelection();
	}
}

function stopSelection(event) {
	removeSelection();
	highlight.active = false;
	highlight.customTouch = false;
}

function doEndSelect(event) {
	if ($(event.target).is("span[id^=t]")) {
		highlight.end = event.target.id;
		highlight.endMouseX = event.pageX;
		highlight.endMouseY = event.pageY;
		newAnnotation();
	}
}

function doOtherSelect(event) {
	if (findInt(highlight.start) < 100) {
		highlight.end = "t0";
		drawTokenRangeSelection();
	}
	else if (findInt(highlight.start)) {
		highlight.end = $("#textHolder span[id^=t]:last").prop("id");
		drawTokenRangeSelection();
	}
}

function doOtherEndSelect(event) {
	if (findInt(highlight.start) < 100) {
		highlight.end = "t0";
		drawTokenRangeSelection();
	}
	else if (findInt(highlight.start)) {
		highlight.end = $("#textHolder span[id^=t]:last").prop("id");
		drawTokenRangeSelection();
	}

	highlight.endMouseX = event.pageX;
	highlight.endMouseY = event.pageY;
	newAnnotation();
}

function doMouseOver(event) {
	if ($(event.target).is("span[id^=t]")) {
		showAnnotationTips(event.target, event.pageX, event.pageY);
	} else {
		hideAnnotationTips();
	}
}

function mouseDeviated(hl, event) {
	return (Math.abs(hl.startMouseX - event.pageX) > 2)
		|| (Math.abs(hl.startMouseY - event.pageY) > 2);
}

function scrollDeviated(hl) {
	return (Math.abs(hl.scrollLeft - $(window).scrollLeft()) > 2)
		|| (Math.abs(hl.scrollTop - $(window).scrollTop()) > 2);
}

function drawTokenRangeSelection() {
	if (permissions.makeHighlights) {
		var start = findInt(highlight.start);
		var end = findInt(highlight.end);

		removeSelection();

		if (start < end) {
			var t;
			for (t = start; t <= end; t++) {
				$("#t"+t).addClass("sel");
			}
		} else {
			var t;
			for (t = start; t >= end; t--) {
				$("#t"+t).addClass("sel");
			}
		}
	}
}

function removeSelection() {
	$("#textHolder .sel").removeClass("sel");
}

function tokenRangeToText(start, end) {
	var text = "";
	for (var i = start; i <= end; i++) {
		text += $("#t" + i).text();
	}
	return text;
}

function newAnnotation() {
	var start = findInt(highlight.start);
	var end = findInt(highlight.end);

	if (end < start) {
		start = findInt(highlight.end);
		end = findInt(highlight.start);
	}

	openNewAnnotation(
		tokenRangeToText(start, end),
		{
			type: "tokenRange",
			start: start,
			end: end
		},
		highlight.endMouseX,
		highlight.endMouseY
	);
}

function showAnnotationTips(target, x, y) {
	var token = findInt(target.id);

	if (tipTarget == token) {
		return;
	}

	hideAnnotationTips();

	tipTarget = token;

	var map = tokenMap[token];
	if (map) {
		var annid;
		for (var i = 0; i < map.length; i++) {
			annid = map[i];
			if (!isHidden(annid)) {
				showAnnotationTip(annotations[annid], x, y);
				x += 5;
				y += 20;
			}
		}
	}
}

function openAnnotations(elem, mouseX, mouseY) {
	var token = findInt(elem.id);
	var map = tokenMap[token];
	if (map) {
		lastOpened = [];
		var annid;
		for (var i = 0; i < map.length; i++) {
			annid = map[i];
			if (!isHidden(annid)) {
				openAnnotation(annotations[annid], mouseX, mouseY);
				mouseX += 10;
				mouseY += 10;
				lastOpened.push(annid);
			}
		}
	}
}

function openAndScrollToAnnotation(ann, tab) {
	var x = 0;
	var y = 0;
	if (ann.location.type == "tokenRange") {
		var offset = $("#t" + ann.location.start).offset();
		x = offset.left;
		y = offset.top;
		setTimeout("window.scrollTo(0,"+(y - 20)+");", 500);
	}
	openAnnotation(ann, x, y, tab);
}

function showAllHighlights() {
	hideAllHighlights();
	if (currentGroup == null) {
		showHighlights(annotations);
	} else {
		limitByGroup(currentGroup);
	}
	clearSearch();
}

function hideAllHighlights() {
	$("#textHolder .hl").removeClass("hl hl2 yellowHL greenHL blueHL cyanHL redHL purpleHL");
	for (var a in annotations) {
		annotations[a].hidden = true;
	}
	clearSearch();
}

function showHighlights(anns) {
	if ($.isArray(anns)) {
		var ann;
		for (var i = 0; i < anns.length; i++) {
			ann = annotations[anns[i]];
			addTokenRangeHighlight(ann.location, ann.colour);
			ann.hidden = false;
		}
	} else {
		var ann;
		for (var a in anns) {
			ann = anns[a];
			addTokenRangeHighlight(ann.location, ann.colour);
			ann.hidden = false;
		}
	}
}

function showOnlyMyHighlights() {
	hideAllHighlights();
	showHighlights(searchAnnotations({
		by: userId,
		group: currentGroup
	}));
}

function limitByColour(colour) {
	hideAllHighlights();
	//if (colourMap[colour]) {
	//	showHighlights(colourMap[colour]);
	//}
	showHighlights(searchAnnotations({
		colour: colour,
		group: currentGroup
	}));
	latestColour = colour;
}

function limitByTag(tag) {
	hideAllHighlights();
	//if (tagMap[tag]) {
	//	showHighlights(tagMap[tag]);
	//}
	showHighlights(searchAnnotations({
		tags: tag,
		group: currentGroup
	}));
}

function limitByGroup(group) {
	hideAllHighlights();
	showHighlights(searchAnnotations({
		group: group
	}));
}

function addTokenRangeHighlight(loc, colour) {
	if (permissions.viewHighlights) {
		var span;
		for (var t = loc.start; t <= loc.end; t++) {
			span = jQuery("#t"+t);

			if ($(span).hasClass("hl")) {
				$(span).addClass("hl2");
			} else {
				$(span).addClass("hl");
			}
			$(span).addClass(colour + "HL");
		}
	}
}

function removeTokenRangeHighlight(loc, colour) {
	var span;
	for (var t = loc.start; t <= loc.end; t++) {
		span = $("#t"+t);

		if ($(span).hasClass("hl2")) {
			if (tokenMap[t].length < 2) {
				$(span).removeClass("hl2");
			}

			var removeColour = true;
			for (var i = 0; i < tokenMap[t].length; i++) {
				if (annotations[tokenMap[t][i]].colour == colour) {
					removeColour = false;
					break;
				}
			}
			if (removeColour) {
				$(span).removeClass(colour + "HL");
			}
		}
		else if ($(span).hasClass("hl")) {
			$(span).removeClass("hl");
			$(span).removeClass(colour + "HL");
		}
	}
}

// touch stuff

function doSingleTouch(event) {
	removeSelection();
	hideAnnotationTips();

	if ($(event.target).is("span[id^=t]")) {
		if (highlight.active) {
			highlight.active = false;
			highlight.end = event.target.id;
			highlight.endMouseX = event.pageX;
			highlight.endMouseY = event.pageY;
			drawTokenRangeSelection();
			newAnnotation();
		}
		else {
			removeSelection();
			highlight.start = event.target.id;
			highlight.end = event.target.id;
			highlight.startMouseX = event.pageX;
			highlight.startMouseY = event.pageY;
			highlight.endMouseX = event.pageX;
			highlight.endMouseY = event.pageY;

			touchMenu.active = true;
			touchMenu.x = event.pageX;
			touchMenu.y = event.pageY;
			touchMenu.target = event.target;
			touchMenu.type = "page";

			displayPageTouchMenu();

			showAnnotationTips(event.target, event.pageX, event.pageY);
		}
	} else {
		hidePageTouchMenu();
		touchMenu.active = false;
		highlight.active = false;
	}
}

function displayPageTouchMenu() {
	var div = $("#pageTouchMenu");
	var token = findInt(touchMenu.target.id);
	if (tokenMap[token]) {
		div.find(".openButton").css("display", "inline");
	} else {
		div.find(".openButton").css("display", "none");
	}
	div.css("left", (touchMenu.x + 10) + "px");
	div.css("top", (touchMenu.y - 50) + "px");
	div.css("display", "block");
	touchMenu.active = true;
	drawTokenRangeSelection();
}

function hidePageTouchMenu() {
	touchMenu.active = false;
	$("#pageTouchMenu").css("display", "none");
}

function tmOpenAnnotation() {
	hideAnnotationTips();
	hidePageTouchMenu();
	removeSelection();
	openAnnotations(touchMenu.target, touchMenu.x, touchMenu.y);
}

function tmAnnotateWord() {
	hideAnnotationTips();
	hidePageTouchMenu();

	highlight.active = false;
	highlight.end = touchMenu.target.id;
	highlight.endMouseX = touchMenu.x;
	highlight.endMouseY = touchMenu.y;
	drawTokenRangeSelection();
	newAnnotation();
}

function tmAnnotateTokenRange() {
	hideAnnotationTips();
	hidePageTouchMenu();

	highlight.active = true;
}

prepareEverything(
        1,
        1,
        1,
        {'makeHighlights' : true},
        1,
        "/",
        "d",
        1,
        1
);
