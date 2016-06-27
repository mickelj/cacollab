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

function prepareEverything(userId, textId, sectionNum, perm, firstAnn, appRoot, highlightMethod, prevUpdate, groups) {
	this.userId = userId;
	this.textId = textId;
	this.sectionNumber = sectionNum;
	this.permissions = perm;
	this.firstAnnotation = firstAnn;
	this.rootUrl = appRoot;
	this.highlightMethod = highlightMethod;
	this.groups = groups;

	if (permissions.makeComments) {
		defaultTab = "comments";
	} else if (permissions.editTags) {
		defaultTab = "tags";
	} else if (permissions.lookUp) {
		defaultTab = "lookUp";
	} else {
		defaultTab = "permalink";
	}

	setupGroups();

	prepareInterface();
	prepareTextInteraction();

	previousUpdate = prevUpdate;
	lastUpdate = 0;
	updateTimeout = null;
	updateDelay = UPDATE_DELAY_MIN;
	updating = false;
	performUpdate();
}

function doSaveColourLabels(data) {
// 	$.ajax({
// 		url: "ajax/savecolours",
// 		type: "post",
// 		data: data,
// 		dataType: "json",
// 		error: handleError,
// 		success: handleStandardResponse
// 	});
}

function isHidden(annId) {
	return annotations[annId].hidden;
}

function doLookUp(where, search) {
	openInNewWindow(lookUp[where].url.fill("search", encodeURIComponent(search)));
}

function doSaveNewAnnotation(data, posX, posY) {
	$.ajax({
		url: "/notes/save",
		type: "post",
		data: data,
		dataType: "json",
		error: handleError,
		success: function (data) {
			if (data.error) {
				handleReportedError(data.error);
				return;
			}
			newAnnotationIds.push({
				x: posX,
				y: posY
			});
			updateNow();
		}
	});
}

function doSaveComment(data) {
// 	$.ajax({
// 		url: "ajax/savecomment",
// 		type: "post",
// 		data: data,
// 		dataType: "json",
// 		error: handleError,
// 		success: handleStandardResponse
// 	});
}

function doSaveTags(data) {
	// $.ajax({
	// 	url: "ajax/savetags",
	// 	type: "post",
	// 	data: data,
	// 	dataType: "json",
	// 	error: handleError,
	// 	success: handleStandardResponse
	// });
}

function doDeleteAnnotation(annId) {
// 	$.ajax({
// 		url: "ajax/removeannotation",
// 		type: "post",
// 		data: "annId=" + annId,
// 		dataType: "json",
// 		error: handleError,
// 		success: handleStandardResponse
// 	});
}

function doDeleteComment(comId) {
// 	$.ajax({
// 		url: "ajax/removecomment",
// 		type: "post",
// 		data: "comId=" + comId,
// 		dataType: "json",
// 		error: handleError,
// 		success: handleStandardResponse
// 	});
}

function doDeleteTag(annId, tag) {
// 	$.ajax({
// 		url: "ajax/removetag",
// 		type: "post",
// 		data: "annId=" + annId + "&tag=" + encodeURIComponent(tag),
// 		dataType: "json",
// 		error: handleError,
// 		success: handleStandardResponse
// 	});
}

function doChangeColour(annId, colour) {
// 	$.ajax({
// 		url: "ajax/changecolour",
// 		type: "post",
// 		data: "annId=" + annId + "&colour=" + colour,
// 		dataType: "json",
// 		error: handleError,
// 		success: handleStandardResponse
// 	});
}

function handleError(xhr, textStatus, error) {
	alert("Server Error: " + error);
}

function handleUpdateError(xhr, textStatus, error) {
	updating = false;
	//alert("Update error: " + error);
}

function handleReportedError(error) {
	alert("Error: " + error);
}

function handleStandardResponse(data) {
	if (data.error) {
		handleReportedError(data.error);
		return;
	}
	updateNow();
}

function updateNow() {
	if (!updating) {
		updateDelay /= 2;
		performUpdate();
	}
}

function performUpdate() {
// 	if (!updating) {
// 		updating = true;
// 		setLastUpdated("Updating");
//
// 		if (updateTimeout != null) {
// 			clearTimeout(updateTimeout);
// 			updateTimeout = null;
// 		}
//
// 		$.ajax({
// 			url: "ajax/update",
// 			type: "post",
// 			data: "t=" + lastUpdate + "&textId=" + textId + "&sectionNum=" + sectionNumber,
// 			dataType: "json",
// 			error: handleUpdateError,
// 			success: handleUpdate
// 		});
// 	}
}

function handleUpdate(data) {
	if (data.error) {
		updating = false;
		handleReportedError(data.error);
		return;
	}

	lastUpdate = data.time;
	newChanges = 0;

	var somethingChanged = false;

	var affectedAnn = {};

	if (data.annotations) {
		if (data.annotations.added && data.annotations.added.length != 0) {
			var ann;

			for (var i = 0; i < data.annotations.added.length; i++) {
				ann = data.annotations.added[i];

				annotations[ann.id] = ann;

				//addToColourMap(ann.colour, ann.id);
				addToTokenRangeMap(ann.location, ann.id);

				ann.tags = [];
				ann.comments = [];
				ann.hidden = true;

				contributors[ann.whoId] = ann.who;

				if (ann.report) {
					addToHistory("annotations", ann.id, ann.when, ann.who, "made a new annotation");
				}

				affectedAnn[ann.id] = ann;

				if (ann.whoId == userId) {
					mustBeVisible[ann.id] = 1;
				}
			}

			somethingChanged = true;
		}

		if (data.annotations.tagsModified && data.annotations.tagsModified.length != 0) {
			var ann;
			var info;

			for (var i = 0; i < data.annotations.tagsModified.length; i++) {
				info = data.annotations.tagsModified[i];
				ann = annotations[info.annId];
				ann.tags = info.tags;

				updateTags(ann.id, ann.tags);

				//addToTagMap(ann.tags, ann.id);

				if (info.report) {
					addToHistory("tags", info.annId, info.when, info.who, "added a tag");
				}

				affectedAnn[ann.id] = ann;
			}

			somethingChanged = true;
		}

		if (data.annotations.colourModified && data.annotations.colourModified.length != 0) {
			var ann;

			for (var i = 0; i < data.annotations.colourModified.length; i++) {
				ann = annotations[data.annotations.colourModified[i].annId];

				//removeFromColourMap(ann.colour, ann.id);

				var oldColour = ann.colour;
				ann.colour = data.annotations.colourModified[i].colour;

				removeTokenRangeHighlight(ann.location, oldColour);
				ann.hidden = true;
				changeColour(ann.id, ann.colour);

				//addToColourMap(ann.colour, ann.id);

				affectedAnn[ann.id] = ann;
			}

			somethingChanged = true;
		}

		if (data.annotations.removed && data.annotations.removed.length != 0) {
			var annId;
			var ann;

			for (var i = 0; i < data.annotations.removed.length; i++) {
				annId = data.annotations.removed[i];
				ann = annotations[annId];

				delete annotations[annId];

				removeFromTokenRangeMap(ann.location, ann.id);
				removeTokenRangeHighlight(ann.location, ann.colour);
				//removeFromColourMap(ann.colour, ann.id);
				//removeFromTagMap(ann.tags, ann.id);

				closeAnnotation(annId);
			}

			somethingChanged = true;
		}
	}

	if (data.comments) {
		if (data.comments.added && data.comments.added.length != 0) {
			var com;
			var ann;

			for (var i= 0; i < data.comments.added.length; i++) {
				com = data.comments.added[i];
				ann = annotations[com.annId];
				ann.comments.push(com);

				addComment(ann.id, com);

				contributors[com.whoId] = com.who;

				if (com.report) {
					addToHistory("comments", com.annId, com.when, com.who, "made a new comment");
				}

				affectedAnn[ann.id] = ann;
			}

			somethingChanged = true;
		}

		if (data.comments.removed && data.comments.removed.length != 0) {
			var comId;
			var annId;
			var ann;

			for (var i = 0; i < data.comments.removed.length; i++) {
				annId = data.comments.removed[i].ann;
				comId = data.comments.removed[i].com;

				ann = annotations[annId];

				if (ann) {
					for (var j = 0; j < ann.comments.length; j++) {
						if (ann.comments[j].id == comId) {
							ann.comments.splice(j,1);
							break;
						}
					}

					removeComment(ann.id, comId);

					affectedAnn[ann.id] = ann;
				}
			}

			somethingChanged = true;
		}
	}

	for (var a in affectedAnn) {
		var ann = affectedAnn[a];

		if (testAnnotation(lastSearch, ann)) {
			if (ann.hidden) {
				addTokenRangeHighlight(ann.location, ann.colour);
				ann.hidden = false;
			}
		} else if (!ann.hidden == false) {
			removeTokenRangeHighlight(ann.location, ann.colour);
			ann.hidden = true;
		}
	}

	for (var a in mustBeVisible) {
		var ann = annotations[a];
		if (ann && ann.hidden) {
			addTokenRangeHighlight(ann.location, ann.colour);
			ann.hidden = false;
		}
	}

	if (data.tags) {
		textTags = data.tags;
		updateTopTags();
		updateTagCloud();
		updateAvailableTags();
	}

	if (data.colourLabels) {
		colourLabels = data.colourLabels;
		setColourLabels();
	}

	setLastUpdated();
	setContributorLists();
	setHistory();

	if (somethingChanged) {
		updateDelay = UPDATE_DELAY_MIN;
	} else {
		if (updateDelay < UPDATE_DELAY_MAX) {
			updateDelay *= 2;
		}
	}
	updateTimeout = setTimeout("performUpdate()", updateDelay);

	updating = false;

	updateInterface();

	previousUpdate = lastUpdate;
}

function addToTokenRangeMap(loc, annId) {
	for (var t = loc.start; t <= loc.end; t++) {
		if (!tokenMap[t]) {
			tokenMap[t] = [];
		}
		tokenMap[t].push(annId);
	}
}

function removeFromTokenRangeMap(loc, annId) {
	for (var t = loc.start; t <= loc.end; t++) {
		for (var i = 0; i < tokenMap[t].length; i++) {
			if (tokenMap[t][i] == annId) {
				tokenMap[t].splice(i, 1);
				break;
			}
		}
	}
}

function addToColourMap(colour, annId) {
	if (!colourMap[colour]) {
		colourMap[colour] = [];
	}
	colourMap[colour].push(annId);
}

function removeFromColourMap(colour, annId) {
	for (var i = 0; i < colourMap[colour].length; i++) {
		if (colourMap[colour][i] == annId) {
			colourMap[colour].splice(i, 1);
			break;
		}
	}
}

function addToTagMap(tags, annId) {
	var tag;
	for (var t = 0; t < tags.length; t++) {
		tag = tags[t];
		if (!tagMap[tag]) {
			tagMap[tag] = [];
		}
		if (!tagMap[tag].contains(annId)) {
			tagMap[tag].push(annId);
		}
	}
}

function removeFromTagMap(tags, annId) {
	var tag;
	for (var t = 0; t < tags.length; t++) {
		tag = tags[t];
		for (var i = 0; i < tagMap[tag].length; i++) {
			if (tagMap[tag][i] == annId) {
				tagMap[tag].splice(i, 1);
				break;
			}
		}
	}
}

function addToHistory(type, annId, when, who, message) {
	if (when > previousUpdate) {
		newChanges++;
	}

	var newHistory = [];
	var ins = -1;
	var mod = 0;

	for (var i = 0; i < textHistory.length; i++) {
		if (ins == -1 && when > textHistory[i].when) {
			ins = i;
			mod = 1;
		}
		newHistory[i + mod] = textHistory[i];
	}

	if (ins != -1) {
		newHistory[ins] = {
			when: when,
			who: who,
			message: message,
			annId: annId,
			type: type
		};
	} else if (textHistory.length < MAX_HISTORY_SIZE) {
		newHistory.push({
			when: when,
			who: who,
			message: message,
			annId: annId,
			type: type
		});
	}

	if (newHistory.length > MAX_HISTORY_SIZE) {
		newHistory.pop();
	}

	textHistory = newHistory;
}

function searchAnnotations(opt) {
	lastSearch = opt;
	mustBeVisible = {};
	return doSearch(opt, annotations);
}

function clearSearch() {
	lastSearch = { group: currentGroup };
	mustBeVisible = {};
}

function testAnnotation(opt, ann) {
	var annList = {};
	annList[ann.id] = ann;

	var matched = doSearch(opt, annList);

	for (var m in matched) {
		return true;
	}
	return false;
}

var MODIFY_QUERY_REGEX = new RegExp('[^\\w\\d]+', 'gi');

function doSearch(opt, annList) {
	//if (opt.where == "section") {
		var matched = annList;

		if (notEmpty(opt.colour)) {
			matched = searchColours(opt.colour, matched);
		}

		if (notEmpty(opt.tags)) {
			var tagList = opt.tags.split(/\s+/);
			matched = searchTags(tagList, matched);
		}

		if (notEmpty(opt.by)) {
			matched = searchUsers(opt.by, matched);
		}

		if (notEmpty(opt.group)) {
			matched = searchGroups(opt.group, matched);
		}

		if (notEmpty(opt.query)) {
			var query = opt.query;
			var regex;

			if (query.isASCII()) {
				regex = new RegExp("\\b" + query.replace(MODIFY_QUERY_REGEX, "[^\\w\\d]+") + "\\b", "im");
			} else {
				regex = new RegExp(query, "m");
			}

			if (opt.what == "highlights") {
				matched = searchHighlights(regex, matched);
			} else {
				matched = searchComments(regex, matched);
			}
		}

		if (notEmpty(opt.from) || notEmpty(opt.to)) {
			var from = 0;
			if (notEmpty(opt.from)) {
				from = dateStringToTimestamp(opt.from);
			}
			var to = Number.MAX_VALUE;
			if (notEmpty(opt.to)) {
				to = dateStringToTimestamp(opt.to);
			}
			matched = searchDates(from, to, matched);
		}
	//}

	return matched;
}

function dateStringToTimestamp(string) {
	var elem = string.split(/[\/\ \:]+/);
	for (var e = 0; e < elem.length; e++) {
		elem[e] = elem[e].replace(/^0/, '');
		if (elem[e]) {
			elem[e] = parseInt(elem[e]);
		} else {
			elem[e] = 0;
		}
	}
	var date = new Date(elem[2], elem[1] - 1, elem[0], elem[3], elem[4]);
	return date.getTime();
}

function searchHighlights(regex, annList) {
	var matched = {};
	var ann;
	for (var id in annList) {
		ann = annList[id];
		if (regex.test(ann.text)) {
			matched[ann.id] = ann;
		}
	}
	return matched;
}

function searchComments(regex, annList) {
	var matched = {};
	var ann;
	var com;
	for (var id in annList) {
		ann = annList[id];
		for (var c = 0; c < ann.comments.length; c++) {
			com = ann.comments[c];
			if (regex.test(com.message)) {
				matched[ann.id] = ann;
				break;
			}
		}
	}
	return matched;
}

function searchTags(tagList, annList) {
	var matched = {};
	var ann;
	var tag;
	var matchCount;
	for (var id in annList) {
		ann = annList[id];
		matchCount = 0;
		for (var i = 0; i < ann.tags.length; i++) {
			tag = ann.tags[i];
			for (var t = 0; t < tagList.length; t++) {
				if (tag == tagList[t]) {
					matchCount++;
					break;
				}
			}
		}
		if (matchCount == tagList.length) {
			matched[ann.id] = ann;
		}
	}
	return matched;
}

function searchColours(colour, annList) {
	var matched = {};
	var ann;
	for (var id in annList) {
		ann = annList[id];
		if (ann.colour == colour) {
			matched[ann.id] = ann;
		}
	}
	return matched;
}

function searchDates(from, to, annList) {
	var matched = {};
	var ann;
	var com;
	for (var id in annList) {
		ann = annList[id];
		if (ann.when >= from && ann.when <= to) {
			matched[ann.id] = ann;
		} else {
			for (var c = 0; c < ann.comments.length; c++) {
				com = ann.comments[c];
				if (com.when >= from && com.when <= to) {
					matched[ann.id] = ann;
					break;
				}
			}
		}
	}
	return matched;
}

function searchUsers(userId, annList) {
	var matched = {};
	var ann;
	var com;
	for (var id in annList) {
		ann = annList[id];
		if (ann.whoId == userId) {
			matched[ann.id] = ann;
		} else {
			for (var c = 0; c < ann.comments.length; c++) {
				com = ann.comments[c];
				if (com.whoId == userId) {
					matched[ann.id] = ann;
					break;
				}
			}
		}
	}
	return matched;
}

function searchGroups(groupId, annList) {
	var matched = {};
	if (groups[groupId]) {
		var ann;
		var com;
		var users = groups[groupId].users;
		var match;

		for (var id in annList) {
			ann = annList[id];

			match = false;

			for (var u = 0; u < users.length; u++) {
				if (ann.whoId == users[u]) {
					matched[ann.id] = ann;
					match = true;
					break;
				}
			}
			if (!match) {
				for (var c = 0; c < ann.comments.length; c++) {
					com = ann.comments[c];
					for (var u = 0; u < users.length; u++) {
						if (com.whoId == users[u]) {
							matched[ann.id] = ann;
							match = true;
							break;
						}
					}
					if (match) {
						break;
					}
				}
			}
		}
	}
	return matched;
}

function setupGroups() {
	if (getCookie("emargin.group")) {
		currentGroup = parseInt(getCookie("emargin.group"));
		if (!groups[currentGroup]) {
			forgetGroup();
		} else {
			lastSearch = {group: currentGroup};
		}
	} else {
		currentGroup = null;
	}
}

function setGroup(id) {
	currentGroup = id;
	setCookie("emargin.group", id, 1);
}

function forgetGroup() {
	currentGroup = null;
	eraseCookie("emargin.group");
}

function tagFreqComparator(a, b) {
	return b.freq - a.freq || a.tag.localeCompare(b.tag);
}

function tagComparator(a, b) {
	return a.tag.localeCompare(b.tag);
}

var LINK_REGEX = new RegExp('(https?\\:\\/\\/\\S+)', 'gi');
var ANN_LINK_REGEX = new RegExp('\\/ann\\?id\\=(\\d+)');
function linksToHrefs(str) {
	return str.replace(LINK_REGEX, function(url) {
		var res = ANN_LINK_REGEX.exec(url);
		if (res && res[1]) {
			var annId = parseInt(res[1]);
			if (annotations[annId]) {
				return '<a href="javascript:goToAnn(\'' + annId + '\');">[' + annId + ']</a>';
			}
		}
		return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}
