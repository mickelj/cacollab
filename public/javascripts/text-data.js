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

var mode = 'c';

var textId = 0;
var sectionNumber = 0;
var permissions;
var rootUrl;
var firstAnnotation = 0;

var highestZIndex = 5;

var highlightMethod = "d";
var highlight = {};
var touchMenu = {};
var dragInfo = {};
var clickDelay = 500;
var lastMouseUp = 0;
var lastOpened = [];
var swipeDelay = 250;

var tipTarget = null;
var openTips = [];

var newAnnotationIds = [];
var newAnnotationCount = 0;

var colours = ["yellow", "blue", "green", "red", "cyan", "purple"];
var latestColour = "yellow";
var colourLabels = {};

var lookUp = {
	"oed": {
		label: "Oxford English Dictionary",
		url: "http://www.oed.com/search?q=@{search}"
	},
	"etymology": {
		label: "Online Etymology Dictionary",
		url: "http://www.etymonline.com/index.php?search=@{search}"
	},
	"dictionary": {
		label: "Dictionary.com",
		url: "http://dictionary.reference.com/dic?q=@{search}"
	},
	"wikipedia": {
		label: "Wikipedia",
		url: "http://en.wikipedia.org/wiki/@{search}"
	},
	"google": {
		label: "Google",
		url: "http://www.google.com/search?q=%22@{search}%22"
	},
	"webcorp": {
		label: "WebCorp Live",
		url: "http://www.webcorp.org.uk/live/search.jsp?info=on&i=on&search=@{search}"
	}
};

var annotations = {};
var tokenMap = {};
var contributors = {};
//var colourMap = {};
//var tagMap = {};

var textTags = [];

var availableTags = [];

var newChanges = 0;
var previousUpdate;
var lastUpdate;
var updateTimeout;
var updateDelay;
var UPDATE_DELAY_MIN = 60000;
var UPDATE_DELAY_MAX = 3600000;
var updating;

var textHistory = [];
var MAX_HISTORY_SIZE = 20;

var tipTarget = 0;

var DEFAULT_TAB = 0;
var COMMENTS_TAB = 0;
var TAGS_TAB = 1;

var groups = {};
var currentGroup = null;

var lastSearch = {};
var mustBeVisible = {};
