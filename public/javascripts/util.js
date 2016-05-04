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

function openInNewWindow(url) {
	window.open(url);
}

function formatDateTime(date) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	return formatTime(date) + " " + formatDate(date);
}

function formatDate(date) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	dateStr = "";
	if (date.getDate() < 10) {
		dateStr += "0";
	}
	dateStr += date.getDate() + "/";
	if (date.getMonth() < 10) {
		dateStr += "0";
	}
	dateStr += (date.getMonth() + 1) + "/" + date.getFullYear();

	return dateStr;
}

function formatTime(date) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	var dateStr = date.getHours();
	dateStr += ":";
	if (date.getMinutes() < 10) {
		dateStr += "0";
	}
	dateStr += date.getMinutes() + ":";
	if (date.getSeconds() < 10) {
		dateStr += "0";
	}
	dateStr += date.getSeconds();
	return dateStr;
}

var NUM_REGEX = new RegExp('-?\\d+');
function findInt(str) {
	return parseInt(NUM_REGEX.exec(str)[0]);
}

var NOT_EMPTY_REGEX = new RegExp('\\S', 'm');
function notEmpty(str) {
	try {
		str = str.toString();
		if (str == null || str == false || str == "") {
			return false;
		}
		return str.match(NOT_EMPTY_REGEX);
	} catch (e) {
		return false;
	}
}

Array.prototype.contains = function(item) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == item) {
			return true;
		}
	}
	return false;
};

String.prototype.capitalise = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.startsWithCaseInsensitve = function (str){
	return this.toLowerCase().indexOf(str.toLowerCase()) == 0;
};

String.prototype.isASCII = function() {
	for (var i = 0; i < this.length; i++)
        if (this.charCodeAt(i) > 127)
            return false;
	return true;
};

/* String.prototype.brief = function(len) {
	if (typeof len == "undefined") len = 30;
	var span = Math.floor(len / 2);
	var tok = this.split(/\s+/m);
	var text = "";
	for (var i = 0; i < tok.length; i++) {
		text += tok[i];
		if (text.length > span) {
			var endText = "";
			var j;
			for (j = tok.length - 1; j > i; j--) {
				endText = tok[j] + endText;
				if (endText.length > span) {
					break;
				}
				endText = " " + endText;
			}
			if (j != i) {
				text += "...";
			} else {
				text += " ";
			}
			text += endText;
			break;
		}
		text += " ";
	}
	return text;
}; */

String.prototype.brief = function(len) {
	if (typeof len == "undefined") len = 30;
	var tok = this.split(/\s+/m);
	if (tok.length == 1) {
		return tok[0];
	}

	var i = 0;
	var j = tok.length - 1;
	var startText = tok[i++];
	var endText = tok[j];

	while (i < j) {
		if (startText.length + tok[i].length + endText.length < len) {
			startText += " " + tok[i++];
		} else {
			break;
		}
	}

	if (i < j) {
		return startText + "..." + endText;
	} else {
		return startText + " " + endText;
	}
};

function selectText() {
	this.select();
}

function noDefault(event) {
	event.preventDefault();
}

function noop() {}

(function($){
    $.fn.moveTo = function(selector) {
        return this.each(function() {
            var cl = $(this).clone();
            $(cl).appendTo(selector);
            $(this).remove();
        });
    };
})(jQuery);

(function($){
    $.noDefault = function(event) {
        event.preventDefault();
    };
})(jQuery);

(function($){
    $.alwaysFalse = function() {
        return false;
    };

    $.alwaysTrue = function() {
        return true;
    };
})(jQuery);

(function($){
    $.fn.dropdown = function(opt) {
		return this.each(function() {
			var sel = $(this);
			if (typeof opt.autocomplete.source == "undefined") {
				opt.autocomplete.source = [];
				opt.autocomplete.classes = [];
				var n = 0;
				$(sel).find('option[disabled!="disabled"]').each(function() {
					opt.autocomplete.source.push({
						value: this.value,
						label: this.text
					});
					if ($(this).attr("class") != "") {
						opt.autocomplete.classes[n] = $(this).attr("class");
					}
					n++;
				});
			}

			var d = $("<div/>", { 'class': "rdues-ui-dropdown" });

			var i = $("<input/>", { 'type': "text", 'tabindex': "-1" }).appendTo(d);
			i.keyup($.noDefault);
			i.keydown($.noDefault);
			i.css("position", "absolute");
			opt.autocomplete.minLength = 0;
			i.autocomplete(opt.autocomplete);
			i.autocomplete("widget").addClass("rdues-ui-dropdown-autocomplete");

			var b = $("<button/>").appendTo(d);
			b.button(opt.button);
			b.click(function(event) {
				event.preventDefault();
				i.css("position", "static");
				i.focus();
				i.autocomplete("search","");
				i.css("position", "absolute");

				var n = 0;
				i.autocomplete("widget").find(".ui-menu-item a").each(function() {
					$(this).addClass(opt.autocomplete.classes[n++]);
				});
			});

			sel.before(d);
			sel.remove();
		});
    };
})(jQuery);

String.prototype.fill = function(item, str) {
	return this.replace(new RegExp("@\\{" + item + "\\}", "gm"), str);
};

(function($){
	var TEMPLATE_REGEX = new RegExp("@\\{#([^\\}]+)\\}", "m");
	var TEXT_NODE = 3;

	function fillTree(node, regex, rep) {
		if (node.nodeType == TEXT_NODE) {
			if (regex.test(node.nodeValue)) {
				var par = node.parentNode;
				var nodes = fillString(node.nodeValue, regex, rep);
				for (var i = 0; i < nodes.length; i++) {
					par.insertBefore(nodes[i], node);
				}
				par.removeChild(node);
			}
		} else {
			for (var i = 0; i < node.attributes.length; i++) {
				if (node.attributes[i].specified || (node.nodeName.toLowerCase() == "input" && node.attributes[i].nodeName.toLowerCase() == "value")) {
					try {
						node.attributes[i].nodeValue = node.attributes[i].nodeValue.replace(regex, rep.str);
					} catch (e) {}
				}
			}
			for (var i = 0; i < node.childNodes.length; ++i) {
				fillTree(node.childNodes[i], regex, rep);
			}
		}
	}

	function fillString(text, regex, rep) {
		var match;
		var nodes = [];
		while (match = regex.exec(text)) {
			nodes.push(document.createTextNode(text.substring(0, match.index)));
			for (var i = 0; i < rep.nodes.length; i++) {
				nodes.push(rep.nodes[i].cloneNode(true));
			}
			text = text.substring(match.index + match[0].length);
		}
		nodes.push(document.createTextNode(text));
		return nodes;
	}

	$.fn.fill = function(item, str) {
		var n = document.createElement("span");
		n.innerHTML = str;
		var rep = {
			str: str,
			nodes: n.childNodes
		};

		return this.each(function() {
			fillTree(this, new RegExp("@\\{" + item + "\\}", "m"), rep);
		});
	};

	function fromTemplate(id) {
		var tNode = fillTreeTemplates(document.getElementById(id));
		tNode.id = "";
		return tNode;
	}

	function fillTreeTemplates(node) {
		var retNode = node.cloneNode(false);
		var child;
		for (var i = 0; i < node.childNodes.length; i++) {
			child = node.childNodes[i];
			if (child.nodeType == TEXT_NODE) {
				fillStringTemplates(child.nodeValue, retNode);
			} else {
				retNode.appendChild(fillTreeTemplates(child));
			}
		}
		return retNode;
	}

	function fillStringTemplates(text, retNode) {
		var match;
		while (match = TEMPLATE_REGEX.exec(text)) {
			retNode.appendChild(document.createTextNode(text.substring(0, match.index)));
			retNode.appendChild(fromTemplate(match[1]));
			text = text.substring(match.index + match[0].length);
		}
		retNode.appendChild(document.createTextNode(text));
	}

	$.fromTemplate = function(id) {
		return $(fromTemplate(id));
	};
})(jQuery);

(function($){
    $.fn.abutton = function(opts) {
    	return this.each(function() {
			var $this = $(this);
			var href = $this.attr("href");
			var but = $("<button/>");
			but.attr("id", $this.attr("id"));
			but.attr("class", $this.attr("class"));
			but.attr("style", $this.attr("style"));
			but.attr("title", $this.attr("title"));
			but.append($this.contents());

			$this.replaceWith(but);

			but
				.button(opts)
				.click(function() {
					window.location = href;
				});
		});
    };
})(jQuery);


function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) return unescape(y);
	}
}

function eraseCookie(c_name) {
	setCookie(c_name,"",-1);
}

function touchEventDetails(e) {
	var first = e.originalEvent.changedTouches[0];
	var te = {
		pageX: first.pageX,
		pageY: first.pageY,
		target: document.elementFromPoint(first.clientX, first.clientY),
		touchTarget: first.target,
		numberOfTouches: e.originalEvent.touches.length
	};
	return te;
}

function dump(a) {
	var str = dump_r(a, "");
	str = str.replace(/\&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	return str;
}

function dump_r(a, indent) {
	var str = "";
	if (a instanceof Array) {
		str += "[\n";
		indent += "  ";
		for (var i = 0; i < a.length; i++) {
			str += indent + dump_r(a[i], indent) + ",\n";
		}
		str = str.substr(0, str.length - 2);
		indent = indent.substr(0, indent.length - 2);
		str += "\n" + indent + "]";
	}
	else if (typeof a == 'object') {
		str += "{\n";
		indent += "  ";
		for (var i in a) {
			str += indent + i + ": " + dump_r(a[i], indent) + ",\n";
		}
		str = str.substr(0, str.length - 2);
		indent = indent.substr(0, indent.length - 2);
		str += "\n" + indent + "}";
	}
	else {
		str += a;
	}
	return str;
}

if (!window.console) {
	window.console = {
		log: function () {
			var div = $("#console");
			for (var i = 0; i < arguments.length; i++) {
				div.html( div.html() + "\n" + arguments[i] );
			}
		}
	};
}
