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

function prepareInterface() {
	var fontCookie = getCookie("emargin.fontSize");
	if (fontCookie && parseInt(fontCookie) == 12) {
		enlargeText();
	}

	if (window.self !== window.top) {
		var but = $("<button/>", {
			text: "Expand",
			id: "breakOutButton"
		})
			.appendTo("#breakOutHolder")
			.button({
				text: false,
				icons: {
					primary: "ui-icon-extlink"
				}
			})
			.click(function () {
				window.top.location = $("#path").val() + "breakout";
			});
	}

	$(".uiButton").button();
	$(".uiButtonSet").buttonset();
	$(".uiTabs").tabs();
	$(".uiAccordian").accordion({
		collapsible: true,
		autoHeight: false
	});

	$("#hideBanner").button()
		.click(hideBanner);

	$("#logoutButton").abutton({
		'icons': {
			'primary': "ui-icon-locked"
		}
	});
	$("#loginButton").abutton({
		'icons': {
			'primary': "ui-icon-unlocked"
		}
	});
	$("#signupButton").abutton({
		'icons': {
			'primary': "ui-icon-pencil"
		}
	});

	$("#toolbox").mousedown(toolboxMouseDown);
	$("#toolboxPopout").mousedown(toolboxMouseDown);

	$("#toolboxPopoutCloseButton").button({
		icons: {
			primary: "ui-icon-carat-1-e"
		},
		text: false
	}).click(closeToolboxPopout);

	$("#reduceTextButton").click(reduceText);
	$("#enlargeTextButton").click(enlargeText);

	// toolbox buttons

	$("#textAdminButton").button({
		icons: {
			primary: "ui-icon-gear"
		}
	})
	.click(textAdmin);

	$("#openSectionsButton").button({
		icons: {
			primary: "ui-icon-copy"
		}
	})
	.click(showSections);

	$("#printTextButton").button({
		icons: {
			primary: "ui-icon-print"
		},
		text: false
	})
	.click(printText);

	$("#openHistoryButton").button({
		icons: {
			primary: "ui-icon-clock"
		},
		text: false
	})
	.click(showHistory);
	$("#newCount").click(showHistory);


	$("#openPreferencesButton").button({
		icons: {
			primary: "ui-icon-wrench"
		},
		text: false
	})
	.click(showPreferences);

	$("#openColoursButton").button({
		icons: {
			primary: "ui-icon-palette"
		},
		text: false
	})
	.click(showColours);

		$("#editColoursForm").submit(saveColourLabels);

		$("#editColoursForm input[type=text]").change(markDeleted);

		$("#resetColourLabels").click(setColourLabels);

	$("#openTagCloudButton").button({
		icons: {
			primary: "ui-icon-cloud"
		},
		text: false
	})
	.click(showTagCloud);

	$("#openSearchButton").button({
		icons: {
			primary: "ui-icon-search"
		},
		text: false
	})
	.click(showSearch);

		$("#searchForm").submit(search);

		$("#search input[name=from]").datetimepicker({
			dateFormat: "dd/mm/yy",
			addSliderAccess: true,
			sliderAccessArgs: { touchonly: false }
		});

		$("#search input[name=to]").datetimepicker({
			dateFormat: "dd/mm/yy",
			addSliderAccess: true,
			sliderAccessArgs: { touchonly: false }
		});

		setGroupLists();
		setGroupDisplays();

	$("#refreshButton").button({
		icons: {
			primary: "ui-icon-refresh"
		},
		text: false
	})
	.click(updateNow);

	$("#openGroupsButton").button({
		icons: {
			primary: "ui-icon-shuffle"
		}
	})
	.click(showGroups);

	// show / hide

	$("#showMineButton").button({
		icons: {
			primary: "ui-icon-person"
		},
		text: false
	})
	.click(showOnlyMyHighlights);

	$("#showAllButton").button({
		icons: {
			primary: "ui-icon-infinity"
		},
		text: false
	})
	.click(showAllHighlights);

	$("#hideAllButton").button({
		icons: {
			primary: "ui-icon-cancel"
		},
		text: false
	})
	.click(hideAllHighlights);

	// show colours

	$("#showYellowButton").button({
		icons: {
			primary: "ui-icon-blank"
		},
		text: false
	})
	.click(function() { limitByColour("yellow"); });

	$("#showBlueButton").button({
		icons: {
			primary: "ui-icon-blank"
		},
		text: false
	})
	.click(function() { limitByColour("blue"); });

	$("#showGreenButton").button({
		icons: {
			primary: "ui-icon-blank"
		},
		text: false
	})
	.click(function() { limitByColour("green"); });

	$("#showRedButton").button({
		icons: {
			primary: "ui-icon-blank"
		},
		text: false
	})
	.click(function() { limitByColour("red"); });

	$("#showCyanButton").button({
		icons: {
			primary: "ui-icon-blank"
		},
		text: false
	})
	.click(function() { limitByColour("cyan"); });

	$("#showPurpleButton").button({
		icons: {
			primary: "ui-icon-blank"
		},
		text: false
	})
	.click(function() { limitByColour("purple"); });

	hideToolboxContent();

	// touch move

	if (highlightMethod == "t") {
		$("#page").click(touchMoveFinish);
	}
}


function hideBanner() {
	var path = $("#path").val();
	$.ajax({
		url: path + "ajax/hidebanner",
		type: "get"
	});
	$("#banner").remove();
}

function enlargeText() {
	$("body").css("font-size","12pt");
	$("#page").css("margin-right","170px");
	$("#toolbox").css("width","150px");
	$("#toolboxPopout").css("right","170px");
	$("#textBody").css("max-width", "810px");
	setCookie("emargin.fontSize", 12, 365);
}

function reduceText() {
	$("body").css("font-size","10pt");
	$("#page").css("margin-right","140px");
	$("#toolbox").css("width","120px");
	$("#toolboxPopout").css("right","140px");
	$("#textBody").css("max-width", "710px");
	setCookie("emargin.fontSize", 10, 365);
}

function toTop() {
	$(window).scrollTop(0);
}


// toolbox

function textAdmin() {
	window.location = "textadmin?id=" + textId;
}

function printText() {
	window.location = "printtext?id=" + textId + "&s=" + sectionNumber;
}

function openToolboxPopout(width) {
	if (typeof width == "undefined") width = 500;
	if ($("#toolboxPopout").is(":hidden")) {
		$("#toolboxPopout").children().show();
		$("#toolboxPopout").show();
		$("#toolboxPopout").css({
			visibility: "hidden",
			width: width + "px",
			height: "auto"
		});
		var height = $("#toolboxPopout").height() + "px";
		$("#toolboxPopout").css({
			visibility: "visible",
			width: "0px",
			height: height
		});
	}
	$("#toolboxPopout").animate({
			width: width + "px"
		},
		"medium",
		showToolboxPopout
	);
}

function showToolboxPopout() {
	$("#toolboxPopout").css("height", "auto");
}

function closeToolboxPopout() {
	$("#toolboxPopout").children().fadeOut("medium");
	$("#toolboxPopout").animate({
			width: "0px",
			height: $("#toolboxPopout").height()
		},
		"medium",
		hideToolboxPopout
	);
}

function hideToolboxPopout() {
	hideToolboxContent();
	$("#toolboxPopout").hide();
}

function showToolboxContent(id, width) {
	if ($("#" + id).is(":hidden")) {
		hideToolboxContent();
		$("#" + id).show();
		openToolboxPopout(width);
	} else {
		closeToolboxPopout();
	}
}

function hideToolboxContent() {
	$("#sections").hide();
	$("#preferences").hide();
	$("#history").hide();
	$("#colourLabels").hide();
	$("#tagCloud").hide();
	$("#search").hide();
	$("#groups").hide();
}

function showSections() {
	showToolboxContent("sections", 200);
}

function showGroups() {
	showToolboxContent("groups");
}

function showHistory() {
	showToolboxContent("history");
}

function setHistory() {
	$("#historyContent").empty();
	var str = "";
	var hist;

	for (var i = 0; i < textHistory.length; i++) {
		hist = textHistory[i];

		var tab = DEFAULT_TAB;
		if (hist.type == "tags") {
			tab = TAGS_TAB;
		}
		str += '<a href="javascript:goToAnn(' + hist.annId + ', ' + tab + ')">';
		if (previousUpdate < hist.when) {
			str += '<b>';
		}
		str += 'At ' + formatDateTime(hist.when) + ' ' + hist.who + ' ' + hist.message;
		if (previousUpdate < hist.when) {
			str += '</b>';
		}
		str += '</a><br>';
	}
	$("#historyContent").html(str);

	$("#newCount").text(newChanges);
	if (newChanges == 0) {
		$("#newCount").css("visibility", "hidden");
	} else {
		$("#newCount").css("visibility", "visible");
	}
}

function showPreferences() {
	showToolboxContent("preferences");
}

function showColours() {
	showToolboxContent("colourLabels");
}

function saveColourLabels(event) {
	event.preventDefault();
	var data = $(this).serialize();
	$("#saveColourLabelsButton").button("option", "disbaled", true);
	doSaveColourLabels(data);
}

function setColourLabels() {
	for (var c = 0; c < colours.length; c++) {
		var colour = colours[c];
		var label = colourLabels[colour];
		if (label) {
			$("#editColoursForm input[name=" + colour + "]").val(label);
			$("#limitColours ." + colour).attr("title", "Show " + colour.capitalise() + ": " + label);
		} else {
			$("#editColoursForm input[name=" + colour + "]").val("");
			$("#limitColours ." + colour).attr("title", "Show " + colour.capitalise());
		}
	}
}

function markDeleted(event) {
	if ($(this).val() == "") {
		$(this).val("[deleted]");
	}
}

function showTagCloud() {
	showToolboxContent("tagCloud");
}

function updateTopTags() {
	var div = $("#topTags");
	div.empty();

	textTags.sort(tagFreqComparator);

	var tag;
	for (var t = 0; t < textTags.length; t++) {
		tag = textTags[t];
		$("<a/>", {
			href: "javascript:limitByTag(\"" + tag.tag + "\")",
			text: tag.tag,
			title: tag.freq
		}).appendTo(div);
		$("<br/>").appendTo(div);
	}
}

function updateTagCloud() {
	var div = $("#tagCloud");
	div.empty();

	textTags.sort(tagComparator);

	var tag;
	var maxFreq = 1;
	for (var t = 0; t < textTags.length; t++) {
		tag = textTags[t];
		if (tag.freq > maxFreq) {
			maxFreq = tag.freq;
		}
	}

	for (var t = 0; t < textTags.length; t++) {
		tag = textTags[t];
		$("<a/>", {
			href: "javascript:limitByTag(\"" + tag.tag + "\")",
			text: tag.tag,
			style: "font-size:" + Math.floor(((tag.freq / maxFreq) * 22) + 8) + "pt",
			title: tag.freq
		}).appendTo(div);
		div.append(" ");
	}
}

function updateAvailableTags() {
	availableTags = [];
	for (var t = 0; t < textTags.length; t++) {
		availableTags.push(textTags[t].tag);
	}
}

function showSearch() {
	showToolboxContent("search");
}

function setContributorLists() {
	var select = $("#searchForm select[name=by]");
	var val = select.val();
	select.empty();
	$("<option/>", { value: "", text: "anybody" }).appendTo(select);
	for (var c in contributors) {
		$("<option/>", { value: c, text: contributors[c] }).appendTo(select);
	}
	select.val(val);
}

function setGroupLists() {
	var select = $("#searchForm select[name=group]");
	var val = select.val();
	select.empty();
	$("<option/>", { value: "", text: "any group" }).appendTo(select);

	var list = $("#groupList");
	list.empty();

	var count = 0;

	for (var g in groups) {
		$("<option/>", { value: g, text: groups[g].name }).appendTo(select);

		$("<a/>", {
			text: groups[g].name,
			href: "javascript:chooseGroup(" + g + ")",
			id: "group" + g
		}).appendTo(list);
		$("<br/>").appendTo(list);

		count++;
	}

	if (count == 0) {
		$("#groups").remove();
		$("#groupOptions").remove();
	}

	select.val(val);
}

function setGroupDisplays() {
	if (currentGroup == null) {
		$("#currentGroup").text("All Groups");
		$("#searchForm select[name=group]").val("");
		$("#groupList a").css("font-weight", "normal");
	} else {
		$("#currentGroup").html(groups[currentGroup].name.replace(/ - /g, " -<br>"));
		$("#searchForm select[name=group]").val(currentGroup);
		$("#groupList a").css("font-weight", "normal");
		$("#groupList #group" + currentGroup).css("font-weight", "bold");
	}
}

function clearGroup() {
	forgetGroup();
	setGroupDisplays();
	showAllHighlights();
}

function chooseGroup(group) {
	setGroup(group);
	setGroupDisplays();
	showAllHighlights();
}

function search(event) {
	var where = $(this).find("input[name='where']:checked").val();

	if (where == "section") {
		event.preventDefault();

		$(this).find("#searchButton").button("disable");

		hideAllHighlights();

		var matched = searchAnnotations({
			query: this.query.value,
			what: this.what.value,
			colour: this.colour.value,
			tags: this.tags.value,
			by: this.by.value,
			group: this.group.value,
			from: this.from.value,
			to: this.to.value
		});

		if (notEmpty(this.group.value)) {
			setGroup(this.group.value);
			setGroupDisplays();
		} else {
			forgetGroup();
			setGroupDisplays();
		}

		showHighlights(matched);

		$(this).find("#searchButton").button("enable");
	}
	// else form will submit to /textsearch
}

function setLastUpdated(val) {
	if (val) {
		$("#lastUpdate").text(val);
	} else {
		$("#lastUpdate").text(formatTime(new Date()));
	}
}

function updateInterface() {
	if (firstAnnotation != 0) {
		var ann = annotations[firstAnnotation];
		if (ann) {
			openAndScrollToAnnotation(ann);
		}

		firstAnnotation = 0;
	}

	var awaitingNew = [];
	var newAnn;
	while (newAnnotationIds.length > 0) {
		newAnn = newAnnotationIds.shift();
		if (annotations[newAnn.id]) {
			closeNewAnnotationById(newAnn.newId);
			openAnnotation(annotations[newAnn.id], newAnn.x, newAnn.y);
		} else {
			awaitingNew.push(newAnn);
		}
	}
	newAnnotationIds = awaitingNew;

	$(".annotationDialog .saveCommentButton").button("option", "disabled", false);
	$(".annotationDialog .saveTagsButton").button("option", "disabled", false);
	$("#saveColourLabelsButton").button("option", "disbaled", false);
}



// dialogs

function dialogClose(event) {
	$(this).find(".ui-autocomplete-input").autocomplete("destroy");
	$(this).dialog("destroy");
	$(this).remove();
}

function dialogMouseDown(event) {
	$(this).css("z-index", ++highestZIndex);
}

function toolboxMouseDown() {
	$("#toolbox").css("z-index", ++highestZIndex);
	$("#toolboxPopout").css("z-index", highestZIndex);
}

function dialogResizeStart(event) {
	$(this).find(".commentList").css("max-height", "none");
}



// existing annotations

function showAnnotationTip(ann, x, y) {
	var tipDiv = $.fromTemplate("tipTemplate");
	tipDiv.css("left", (x + 5) + "px");
	tipDiv.css("top", (y + 10) + "px");
	tipDiv.addClass("activeTip");
	tipDiv.addClass(ann.colour + "Tip");

	tipDiv.find(".tipCommentText").text(ann.comments.length);

	tipDiv.find(".tipColourText").text(ann.colour.capitalise());
	if (colourLabels[ann.colour]) {
		tipDiv.find(".tipColourText").text(tipDiv.find(".tipColourText").text() + ": " + colourLabels[ann.colour]);
	}

	if (ann.tags.length > 0) {
		tipDiv.find(".tipTagText").text(ann.tags.join(" "));
	} else {
		tipDiv.find(".tipTagText").remove();
		tipDiv.find(".tipTagIcon").remove();
	}

	$("body").append(tipDiv);
}

function hideAnnotationTips() {
	$(".activeTip").remove();
	tipTarget = 0;
}

function openAnnotation(ann, x, y, tab) {
	if (!isOpen(ann.id)) {
		var annDiv = $.fromTemplate("annotationTemplate");

		annDiv.dialog({
			title: ann.text.brief(),
			position: [0, 0],
			minWidth: 250,
			minHeight: 28,
			width: 350,
			draggable: highlightMethod != "t",
			resizable: "se",
			resizeStart: dialogResizeStart,
			stack: false,
			zIndex: ++highestZIndex,
			close: dialogClose
		});
		annDiv.closest(".ui-dialog")
			.css("left", (x + 10) + "px")
			.css("top", (y + 10) + "px")
			.addClass("annotationDialog")
			.addClass(ann.colour)
			.attr("id", "ann" + ann.id)
			.mousedown(dialogMouseDown)
			.resizable("option", "alsoResize", $(annDiv).find(".commentList"));

		annDiv.closest(".ui-dialog").find(".ui-dialog-title").attr("title", ann.text);

		if (!tab) {
			tab = DEFAULT_TAB;
		}
		var newTabs = $("<div/>");
		annDiv.before(newTabs);
		annDiv.find("#tabs-nav").moveTo(newTabs);
		annDiv.closest(".ui-dialog").tabs({
			collapsible: true,
			selected: tab
		});

		if (highlightMethod == "t") {
			annDiv.closest(".ui-dialog").find(".ui-dialog-titlebar").click(touchMove);
		}

		annDiv.find(".saveCommentButton").button({
			icons: {
				primary: "ui-icon-check"
			},
			text: false
		});
		annDiv.find(".newCommentForm").submit(saveComment);

		annDiv.find(".saveTagsButton").button({
			icons: {
				primary: "ui-icon-check"
			},
			text: false
		});
		annDiv.find("input[name=tags]").autocomplete({
			minLength: 0,
			source: autoCompleteTagResults,
			focus: $.alwaysFalse,
			select: autoCompleteTagSelect
		});
		annDiv.find(".newTagsForm").submit(saveTags);

		annDiv.find(".lookUpDropDown").dropdown({
			autocomplete: {
				select: lookUpSelect
			},
			button: {
				icons: {
					primary: "ui-icon-search",
					secondary: "ui-icon-carat-1-s"
				},
				label: "Look up on external website..."
			}
		});

		annDiv.find(".permalink textarea").click(selectText);

		annDiv.find(".deleteAnnotationButton").button({
			icons: {
				primary: "ui-icon-trash"
			}
		})
		.click(deleteAnnotation);
		annDiv.find(".colourDropDown").dropdown({
			autocomplete: {
				select: colourSelect
			},
			button: {
				icons: {
					primary: "ui-icon-palette",
					secondary: "ui-icon-carat-1-s"
				},
				label: "Change Colour"
			}
		});

		populateAnnotation(annDiv, ann);

		if (highlightMethod != "d") {
			annDiv.closest(".ui-dialog").find(".ui-dialog-titlebar-close").focus();
		}
	}
}

function populateAnnotation(annDiv, ann) {
	annDiv.fill("annId", ann.id);
	annDiv.find(".annotationInfo").text("Annotation made by " + ann.who + " at " + formatDateTime(ann.when));
	populateComments(annDiv, ann.comments);
	populateTags(annDiv, ann.tags);
}

function populateComments(annDiv, comments) {
	annDiv.find(".commentList").empty();
	for (var i = 0; i < comments.length; i++) {
		appendComment(annDiv, comments[i]);
	}
}

function appendComment(annDiv, com) {
	var comDiv = $.fromTemplate("commentTemplate");
	comDiv.attr("id", "com" + com.id);
	comDiv.fill("date", formatDate(com.when));
	comDiv.fill("time", formatTime(com.when));
	comDiv.fill("user", com.who);
	comDiv.fill("message", linksToHrefs(com.message));

	comDiv.hover(showCommentInfo, hideCommentInfo);
	comDiv.find(".deleteCommentButton").button({
		icons: {
			primary: "ui-icon-trash"
		},
		text: false
	})
	.click(deleteComment);
	annDiv.find(".commentList").append(comDiv);
}

function populateTags(annDiv, tags) {
	annDiv.find(".tagList").empty();
	for (var i = 0; i < tags.length; i++) {
		appendTag(annDiv, tags[i]);
	}
}

function appendTag(annDiv, tag) {
	var tagDiv = $.fromTemplate("tagTemplate");
	tagDiv.fill("tag", tag);

	tagDiv.hover(showTagInfo, hideTagInfo);
	tagDiv.find(".deleteTagButton").button({
		icons: {
			primary: "ui-icon-trash"
		},
		text: false
	})
	.click(deleteTag);
	annDiv.find(".tagList").append(tagDiv);
}

function getAnnotationId(elem) {
	return findInt($(elem).closest(".annotationDialog").attr("id"));
}

function getCommentId(elem) {
	return findInt($(elem).closest(".comment").attr("id"));
}

function getTagString(elem) {
	return $(elem).closest(".tag").find("a").text();
}

function showCommentInfo(event) {
	$(this).find(".commentDate").show();
	$(this).find(".deleteCommentButton").show();
}

function hideCommentInfo(event) {
	$(this).find(".commentDate").hide();
	$(this).find(".deleteCommentButton").hide();
}

function showTagInfo(event) {
	$(this).find(".deleteTagButton").show();
}

function hideTagInfo(event) {
	$(this).find(".deleteTagButton").hide();
}

function saveComment(event) {
	event.preventDefault();
	var data = $(this).serialize();
	this.comment.value = "";
	$(this).find(".saveCommentButton").button("option", "disabled", true);
	doSaveComment(data);

	mustBeVisible[getAnnotationId(this)] = 1;
}

function deleteComment(event) {
	event.preventDefault();
	if (confirm("Are you sure you wish to delete this comment?")) {
		var comId = getCommentId(this);
		doDeleteComment(comId);

		mustBeVisible[getAnnotationId(this)] = 1;
	}
}

function saveTags(event) {
	event.preventDefault();
	var data = $(this).serialize();
	this.tags.value = "";
	$(this).find(".saveTagsButton").button("option", "disabled", true);
	doSaveTags(data);

	mustBeVisible[getAnnotationId(this)] = 1;
}

function deleteTag(event) {
	event.preventDefault();
	if (confirm("Are you sure you wish to delete this tag?")) {
		var annId = getAnnotationId(this);
		var tag = getTagString(this);
		doDeleteTag(annId, tag);

		mustBeVisible[annId] = 1;
	}
}

function lookUpSelect(event, ui) {
	doLookUp(ui.item.value, annotations[getAnnotationId(this)].text);
}

function colourSelect(event, ui) {
	event.preventDefault();

	var annId = getAnnotationId(this);
	doChangeColour(annId, ui.item.value);

	mustBeVisible[annId] = 1;

	latestColour = ui.item.value;
}

function deleteAnnotation(event) {
	event.preventDefault();
	if (confirm("Are you sure you wish to delete this annotation?")) {
		var annId = getAnnotationId(this);
		closeAnnotation(annId);
		doDeleteAnnotation(annId);
	}
}

function isOpen(annId) {
	return $("#ann" + annId).length != 0;
}

function closeAnnotation(annId) {
	$("#ann" + annId).find(".ui-dialog-content").dialog("close");
}

function closeLastOpenedAnnotations() {
	if (lastOpened != null) {
		for (var i = 0; i < lastOpened.length; i++) {
			$("#ann" + lastOpened[i]).remove();
		}
		lastOpened = null;
	}
}

function addComment(annId, com) {
	if (isOpen(annId)) {
		appendComment($("#ann" + annId), com);
	}
}

function removeComment(annId, comId) {
	if (isOpen(annId)) {
		$("#com" + comId).remove();
	}
}

function updateTags(annId, tags) {
	if (isOpen(annId)) {
		populateTags($("#ann" + annId), tags);
	}
}

function changeColour(annId, colour) {
	$("#ann" + annId).closest(".ui-dialog").removeClass(colours.join(" "));
	$("#ann" + annId).closest(".ui-dialog").addClass(colour);
}

function goToAnn(id, tab) {
	if (annotations[id]) {
		openAndScrollToAnnotation(annotations[id], tab);
	}
}



// new annotations

function openNewAnnotation(text, location, x, y) {
	var id = ++newAnnotationCount;

	var newAnnDiv = $.fromTemplate("newAnnotationTemplate");

	var $dialog = newAnnDiv.dialog({
		title: "New Annotation",
		minWidth: 250,
		minHeight: 28,
		width: 450,
		draggable: true,
		resizable: false,
		stack: false,
		zIndex: ++highestZIndex,
		close: closeNewAnnotation,
		modal: true
	});

	newAnnDiv.find("#tokenStart").val(location.start);
	newAnnDiv.find("#tokenEnd").val(location.end);
	newAnnDiv.find("#notetext").text('"' + text.brief() + '"');

	newAnnDiv.find("#closeNewAnn").click(function () {
		$dialog.dialog( "close" );
	});

	newAnnDiv.closest(".ui-dialog").find(".ui-dialog-title").attr("title", text);

	newAnnDiv.find("input[name=text]").val(text);

	newAnnDiv.on('submit', function (e) {
		e.preventDefault();
		var data = newAnnDiv.find("#newAnnForm").serializeArray();
		$.post('/note/save', data, function(data) {
			newAnnDiv.html(data);
			setTimeout(function() {
				$dialog.dialog("close");
			}, 3000);
		});
	});

	newAnnDiv.find("input[name=tags]").autocomplete({
		minLength: 0,
		source: autoCompleteTagResults,
		focus: $.alwaysFalse,
		select: autoCompleteTagSelect
	});
	newAnnDiv.find(".lookUpDropDown").dropdown({
		autocomplete: {
			select: newLookUpSelect
		},
		button: {
			icons: {
				primary: "ui-icon-search",
				secondary: "ui-icon-carat-1-s"
			},
			text: false,
			label: "Look up..."
		}
	});
	newAnnDiv.find(".colourDropDown").dropdown({
		autocomplete: {
			select: newColourSelect
		},
		button: {
			icons: {
				primary: "ui-icon-palette",
				secondary: "ui-icon-carat-1-s"
			},
			text: false,
			label: "Choose colour..."
		}
	});
	newAnnDiv.find("input[name=colour]").val(latestColour);
	if (colourLabels[latestColour]) {
		newAnnDiv.find(".colourName").text(colourLabels[latestColour]);
		newAnnDiv.find(".colourName").attr("title", latestColour.capitalise());
	} else {
		newAnnDiv.find(".colourName").text(latestColour.capitalise());
	}

	if (highlightMethod != "d") {
		$(window).scrollLeft(x);
		$(window).scrollTop(y - 30);
	}
}

function newLookUpSelect(event, ui) {
	doLookUp(ui.item.value, $(this).closest(".newAnnotationForm").find("input[name=text]").val());
}

function newColourSelect(event, ui) {
	$(this).closest(".newAnnotationForm").find("input[name=colour]").val(ui.item.value);
	$(this).closest(".ui-dialog")
		.removeClass(colours.join(" "))
		.addClass(ui.item.value);

	if (colourLabels[ui.item.value]) {
		$(this).closest(".ui-dialog").find(".colourName")
			.text(colourLabels[ui.item.value])
			.attr("title", ui.item.value.capitalise());
	} else {
		$(this).closest(".ui-dialog").find(".colourName")
			.text(ui.item.value.capitalise())
			.attr("title", null);
	}

	latestColour = ui.item.value;
}

function closeNewAnnotation(event) {
	removeSelection();
	$(this).find(".ui-autocomplete-input").autocomplete("destroy");
	$(this).dialog("destroy");
	$(this).remove();
}

function closeNewAnnotationById(id) {
	var div = $("#newAnn" + id);
	removeSelection();
	$(div).find(".ui-autocomplete-input").autocomplete("destroy");
	$(div).dialog("destroy");
	$(div).remove();
}

function saveNewAnnotation(e, location) {
	e.preventDefault();

	var data = $(this).closest("form").serialize();

	//doSaveNewAnnotation(data, location.start, location.end);

	//$(this).closest(".ui-dialog-content").dialog("close");
	$(this).find(".saveAnnotationButton").button("option", "disabled", true);
}




// general annotation stuff

function autoCompleteTagResults(request, response) {
	response($.ui.autocomplete.filter(availableTags, request.term.split(/\s+/).pop()));
}

function autoCompleteTagSelect(event, ui) {
	var terms = this.value.split(/\s+/);
	terms.pop();
	terms.push( ui.item.value );
	terms.push("");
	this.value = terms.join(" ");
	return false;
}

function touchMove(event) {
	if ($(event.target).closest(".ui-dialog-titlebar-close").length == 0) {
		event.stopPropagation();
		event.preventDefault();

		var div = $(event.target).closest(".ui-dialog");

		var offset = div.offset();
		dragInfo.dx = event.pageX - offset.left;
		dragInfo.dy = event.pageY - offset.top;

		dragInfo.div = div;
		dragInfo.active = true;

		$("#page").css("cursor", "move");
	}
}

function touchMoveFinish(event) {
	if (dragInfo.active) {
		event.preventDefault();
		$(dragInfo.div).css("left", (event.pageX - dragInfo.dx) + "px");
		$(dragInfo.div).css("top", (event.pageY - dragInfo.dy) + "px");
		dragInfo.active = false;
		$("#page").css("cursor", "auto");
	}
}
