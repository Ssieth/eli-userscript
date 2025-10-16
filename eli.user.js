// ==UserScript==
// @name        Elliquiy Improver
// @namespace   elliquiy.improver.ssieth.co.uk
// @description Adds extra functionality to Elliquiy
// @match       https://elliquiy.com/*
// @exclude     https://elliquiy.com/*.js*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.0/js/jquery.tablesorter.min.js
// @require     https://cdn.jsdelivr.net/npm/ui-contextmenu@1.18.1/jquery.ui-contextmenu.min.js
// @resource    iconTag             https://cabbit.org.uk/pic/elli/tag.png
// @resource    iconTagAuto         https://cabbit.org.uk/pic/elli/tag-auto.png
// @resource    logoMain            https://cabbit.org.uk/pic/elli/logo.png
// @resource    iconFilterDrama     https://cabbit.org.uk/eli/img/drama.png
// @resource    iconFilterGender    https://cabbit.org.uk/eli/img/manwoman.png
// @resource    iconFilterCanon     https://cabbit.org.uk/eli/img/canon.webp
// @resource    iconFilterQuestion  https://cabbit.org.uk/eli/img/question.png
// @resource    iconFilterKink      https://cabbit.org.uk/pic/elli/kink.png
// @resource    iconDelete          https://cabbit.org.uk/pic/elli/deleteicon.png
// @resource    iconFilterLater     https://cabbit.org.uk/pic/elli/latericon.png
// @version     2.11.5
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @license     MIT
// @copyright   2018, Ssieth (https://openuserjs.org//users/Ssieth)
// ==/UserScript==

/*jshint esversion: 6 */
/* jshint -W083 */

// -- What we are logging to the console -- //
var logTags = {};
logTags.startup = true;
logTags.tickfires = false;
logTags.tickactions = false;
logTags.functiontrace = false;
logTags.userdetails = false;
logTags.richtext = true;

// -- No need to edit these but no harm either. If you want to change them you can in the UI --
var config = {};
var config_display = {};

var aryUserNoteOptions = ['Hover Over Name', 'Above Avatar'];
var strExportKey = "";

// -- Not to be Edited --
var urlTopicBase = "https://elliquiy.com/forums/index.php?topic=";
var $forumposts;
var strModal = '<div id="modalpop" title="title"></div>';
var snippets = {};
var draftHistory = {};
var strLastFocus = "textarea#message";
var datUnread = new Date();
var datMail = new Date();
var datAutoSave = new Date();
var objIgnoreReplies = {}; // integer-keyed array of topics that are ignored.
var objReplies = {}; // integer-keyed array of topics with replies.
var user = {};
var blUserDepReady = true;
var blJQueryStuff = true;
var intTick = 0;
var page = {};
var BMTags = {};
var aryBMTags = [];
var aryBMTagsLower = [];
var memberCache = {};
var objFilterTopics = {};
var blTickStarted = false;
var nameNotes = {};
var strPIN = rInt(1000, 9999);
var objSBSubst = {};
var urlScriptThread = 'https://elliquiy.com/forums/index.php?topic=230790.new#new';
var lastVer = '';
var oSessionAuth = {};
var userLists = {};
var currentUserList = {};
var strScriptAdmins = ['Ssieth', 'Outcast'];
var permResult;
var quickLinks = {};

// For Scroll events
let last_known_scroll_position = 0;
let ticking = false;

// For infinity-scroll
let lastPageLoaded = -1;
let loadingPage = false;
let nextURL = "";

// Version control stuff
var verDelDraft = ["1.37.4"];

// CSS
var strCSSTblSorterRemoved = [
  "table.tablesorter { font-family:arial; background-color: #CDCDCD; margin:10px 0pt 15px; font-size: 8pt; width: 100%;   text-align: left; }",
  "table.tablesorter thead tr th, table.tablesorter tfoot tr th { background-color: #e6EEEE; border: 1px solid #FFF; font-size: 8pt; padding: 4px;}",
  "table.tablesorter thead tr .header { background-image: url(bg.gif); background-repeat: no-repeat; background-position: center right; cursor: pointer; }",
  "table.tablesorter tbody td { color: #3D3D3D; padding: 4px; background-color: #FFF; vertical-align: top; }",
  "table.tablesorter tbody tr.odd td { background-color:#F0F0F6; }",
  "table.tablesorter thead tr .headerSortDown, table.tablesorter thead tr .headerSortUp { background-color: #8dbdd8; }"
].join('\n') + '\n';
var strCSSTblSorter = [
  "table.tablesorter thead tr .header { background-image: url(bg.gif); background-repeat: no-repeat; background-position: center right; cursor: pointer; }",
  "table.tablesorter thead tr .headerSortUp { background-image: url(https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.0/css/images/white-asc.gif);  }",
  "table.tablesorter thead tr .headerSortDown { background-image: url(https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.0/css/images/white-desc.gif); }"
].join('\n') + '\n';
var strCSSMenus = ".dropbox li lu { background-color: white; }";
var strCSSPointer = ".pointer {cursor: pointer !important; }";
var strCSSFakeLinks = ".fakelink {color:#039;text-decoration:none;} .fakelink:hover, .fakelink:active {cursor: pointer; text-decoration: underline;} ";
var strCSSFT = ".FTMark {background-color: lightgray; text-decoration: line-through; } .FTHi {background-color: yellow;}  .FTHiSoft {background-color: #BBE4BB;} .FTLater {background-color: aliceblue;}";
var strCSSTagBubble = ".tagbubble { display: inline; background-color: #557ea0; color: white; padding-left: 5px; border-radius: 10px; padding-right: 5px; padding-top: 2px; padding-bottom: 4px; margin-left: 5px;} .tagbubbleAuto { display: inline; background-color: #a85400; color: white; padding-left: 5px; border-radius: 10px; padding-right: 5px; padding-top: 2px; padding-bottom: 4px; margin-left: 5px;}";
var strCSSBodyFont = "body {font-size: 90%; }";

var sort_by = function (field, reverse, primer) {

  var key = primer ?
    function (x) {
      return primer(x[field]);
    } :
    function (x) {
      return x[field];
    };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return a = key(a),
      b = key(b),
      reverse * ((a > b) - (b > a));
  };
};

/* =========================== */
/* Some Very Generic Functions */
/* =========================== */

/**
 * Cancel the default action associated with an html element
 */
function stopDefaultAction(e) {
  // Test if we were passed the
  // event object (e) and if
  // the object
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  if (window.event && window.event.cancelBubble) {
    window.event.cancelBubble = true;
  }

  if (e && e.preventDefault) {
    e.preventDefault();
  }
  if (window.event) {
    window.event.returnValue = false;
  }
}

function cleanInput(input) {
  if (input) {
    let output = input;
    output = output.replaceAll("\'","&apos;");
    output = output.replaceAll("\"","&quot;");
    output = output.replaceAll("&(?![amp;|apos;|quote;])", "&amp;");
    return output;
  } else {
    return input;
  }
}

function rInt(min, max) {
  // Returns a random integer between min (included) and max (included)
  // Using Math.round() will give you a non-uniform distribution!
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(strLogTag, strMessage) {
  if (logTags[strLogTag]) {
    var now = new Date();
    if (log.caller === undefined || log.caller === null) {
      console.log(now.toLocaleString() + ":" + strLogTag + ": " + log.caller.name + ": " + JSON.stringify(strMessage));
    }
    else {
      console.log(now.toLocaleString() + ":" + strLogTag + ": -none-: " + JSON.stringify(strMessage));
    }
  }
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

Date.prototype.addDays = function (days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
};

/*
The following function injects code into the parent page.
 */
function inject(source) {
  log("functiontrace", "Start Function");
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();';
  }

  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
  document.body.removeChild(script);
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

String.prototype.containsCount = function (findStr) {
  var str = this;
  var lastIndex = 0;
  var count = 0;
  while (lastIndex != -1) {
    lastIndex = str.indexOf(findStr, lastIndex);
    if (lastIndex != -1) {
      count++;
      lastIndex += findStr.length;
    }
  }
  return count;
};

function confirmDialog(stitle, message, onYes, onNO) {
  $('<div></div>').appendTo('body')
    .html('<div><h6>' + message + '</h6></div>')
    .dialog({
      modal: true,
      title: stitle,
      autoOpen: true,
      width: '720px',
      buttons: {
        Yes: function() {
          //console.log("Yes");
          if (onYes) {
            onYes();
          }

          $(this).dialog("close");
        },
        No: function() {
          //console.log("No");
          if (onNO) {
            onNO();
          }

          $(this).dialog("close");
        }
      },
      close: function(event, ui) {
        $(this).remove();
      }
    });
};

function throwModal(strTitle, strBody, width) {
  log("functiontrace", "Start Function");
  var intHeight;
  let strWidth = "720px";
  if (width) {
    strWidth = width;
  }
  intHeight = Math.floor($(window).height() * 0.8);
  if ($("#modalpop").length === 0) {
    $('body').append($(strModal));
  }
  $('#modalpop').html(strBody).on("dialogopen", function (event, ui) {});
  $('#modalpop').dialog({
    title: strTitle,
    width: strWidth,
    maxHeight: intHeight
  });
}

function getWordCount(strText) {
  log("functiontrace", "Start Function");
  var regex = /\s+/gi;
  var wordCount = strText.trim().replace(regex, ' ').split(' ').length;
  return wordCount;
}

// Average an array
function getAvg(ary) {
  const total = ary.reduce((acc, c) => acc + c, 0);
  return total / ary.length;
}

/* The following function returns an object representing lexical diversity information for a given text */
function lexDiv(strText) {
	var window = 150;
  var regex = /\s+/gi;
  var aryWords = strText.trim().replace(regex, ' ').split(' ');
  var wordCount = aryWords.length;
  var objOut = {};
	var divs = [];

    /* Load the words into an object array with usage counts */
	if (wordCount < (window + 1)) {
		objOut.diversity = -1;
	} else {
		for (var w = 0; w < (wordCount - window); w++) {
			var objWords = {};
			var distinctCount = 0;
			for (var i = 0; i < window; i++) {
				var strWord = aryWords[i + w].toLowerCase();
				if (objWords[strWord] === undefined) {
					objWords[strWord] = 1;
					distinctCount += 1;
				} else {
					objWords[strWord] += 1;
				}
			}
      //console.log(distinctCount/window);
      divs.push(distinctCount/window);
		}
    objOut.diversity = getAvg(divs);
	}

  objOut.wordCount = wordCount;
  //objOut.distinctCount = distinctCount;
  objOut.diversityFixed = objOut.diversity.toFixed(2);
  return objOut;
}

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

// Sort an object's keys either by alpha or by the 'sortOrder' property
function sortKeys(o,bySortOrder) {
    if (bySortOrder) {
      return Object
        .keys(o)
        .sort(function (a, b) { return o[a].sortOrder > o[b].sortOrder;  })
    } else {
      return Object
        .keys(o)
        .sort()
    }
}

function slugify(str) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}
/* =========================== */

/* =========================== */
/* Quick Links                 */
/* =========================== */
function sortQLCats_enableCustom() {
  switch (config.quickLinks.sortType) {
    case "alpha":
      $("#sortable").hide();
      break;
    default:
      $("#sortable").show();
  }
}

function sortQLCats() {
  if (!quickLinks) {
    quickLinks = {};
  }
  if (!config.quickLinks.sortType) {
    config.quickLinks.sortType = "alpha";
    saveConfig();
  }
  let $page = $("#fatal_error div.windowbg");
  $("#fatal_error").css("width","auto");
  $page.css("max-width","initial");
  $("h3.catbg").html("Sort Quicklink Categories");
  document.title = "Sort Quicklink Categories";
  var $help = $("<p>Just grab the category and drag it where you want it in the ordering.</p>");
  var $sortOptions = $("<p></p>");
  var $snippetList = $("<ul id='sortable'></ul>");
  $sortOptions.append("<input class='sortType' type='radio' name='sortType' id='sortTypeAlpha' value='alpha' " + ((config.quickLinks.sortType == "alpha") ? " checked='checked'" : "") + "/>: <label for='sortTypeAlpha'>Alphabetical</label><br />");
  $sortOptions.append("<input class='sortType' type='radio' name='sortType' id='sortTypeCustom' value='custom' " + ((config.quickLinks.sortType == "custom") ? " checked='checked'" : "") + "/>: <label for='sortTypeCustom'>Custom</label><br />");
  GM_addStyle("#sortable { list-style-type: none; margin: 0; padding: 0; width: 60%; list-style-type:none; }");
  GM_addStyle("#sortable li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; cursor: pointer; border: thin solid black;}");
  GM_addStyle("#sortable li span { position: absolute; margin-left: -1.3em; }");
  var aryKeys = sortKeys(quickLinks,config.quickLinks.sortType == "custom");
  for (var i = 0; i < aryKeys.length; i++) {
    let key = aryKeys[i];
    //console.log("KEY: " + key);
    let qlCat = quickLinks[key];
    $snippetList.append($("<li id='" + key + "'>" + key + "</li>"));
  }
  $page.html("");
  $page.append($help);
  $page.append($sortOptions);
  $page.append($snippetList);
  sortQLCats_enableCustom();
  $(".sortType").change(function() {
    config.quickLinks.sortType = $('.sortType:checked').val();
    saveConfig();
    sortQLCats_enableCustom();
    showQuickLinks();
  });
  $( "#sortable" ).sortable({
    cursor: "move",
    deactivate: function( event, ui ) {
      var arySorted = $( "#sortable" ).sortable( "toArray" );
      for (var i = 0; i < arySorted.length; i++) {
        if (!quickLinks[cleanInput(arySorted[i])]) {
          console.log("*** Error finding snippet::" +  arySorted[i] + "::");
        } else {
          quickLinks[cleanInput(arySorted[i])].sortOrder = i;
        }
      }
      //console.log(snippets);
      saveQuickLinks();
      showQuickLinks();
    }
  });
  $( "#sortable" ).disableSelection();
}

function sortQLs(strCat) {
  strCat = strCat.replaceAll("%20"," ");
  //console.log("-+-+ " + strCat);
  if (!config.quickLinks.sortType) {
    config.quickLinks.sortType = "alpha";
    saveConfig();
  }
  let $page = $("#fatal_error div.windowbg");
  $("#fatal_error").css("width","auto");
  $page.css("max-width","initial");
  $("h3.catbg").html("Sort Quicklinks in Category " + strCat);
  document.title = "Sort Quicklinks in Category " + strCat;
  var $help = $("<p>Just grab the link and drag it where you want it in the ordering.</p>");
  var $sortOptions = $("<p></p>");
  var $snippetList = $("<ul id='sortable'></ul>");
  $sortOptions.append("<input class='sortType' type='radio' name='sortType' id='sortTypeAlpha' value='alpha' " + ((config.quickLinks.sortType == "alpha") ? " checked='checked'" : "") + "/>: <label for='sortTypeAlpha'>Alphabetical</label><br />");
  $sortOptions.append("<input class='sortType' type='radio' name='sortType' id='sortTypeCustom' value='custom' " + ((config.quickLinks.sortType == "custom") ? " checked='checked'" : "") + "/>: <label for='sortTypeCustom'>Custom</label><br />");
  GM_addStyle("#sortable { list-style-type: none; margin: 0; padding: 0; width: 60%; list-style-type:none; }");
  GM_addStyle("#sortable li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; cursor: pointer; border: thin solid black;}");
  GM_addStyle("#sortable li span { position: absolute; margin-left: -1.3em; }");
  var aryKeys = sortKeys(quickLinks[strCat].links,config.quickLinks.sortType == "custom");
  for (var i = 0; i < aryKeys.length; i++) {
    let key = aryKeys[i];
    $snippetList.append($("<li id='" + key + "'>" + key + "</li>"));
  }
  $page.html("");
  $page.append($help);
  $page.append($sortOptions);
  $page.append($snippetList);
  sortQLCats_enableCustom();
  $(".sortType").change(function() {
    config.quickLinks.sortType = $('.sortType:checked').val();
    saveConfig();
    sortQLCats_enableCustom();
    showQuickLinks();
  });
  $( "#sortable" ).sortable({
    cursor: "move",
    deactivate: function( event, ui ) {
      var arySorted = $( "#sortable" ).sortable( "toArray" );
      for (var i = 0; i < arySorted.length; i++) {
        if (!quickLinks[cleanInput(strCat)] || !quickLinks[cleanInput(strCat)].links[cleanInput(arySorted[i])]) {
          console.log("*** Error finding snippet::" +  arySorted[i] + "::");
        } else {
          quickLinks[cleanInput(strCat)].links[cleanInput(arySorted[i])].sortOrder = i;
        }
      }
      saveQuickLinks();
      showQuickLinks();
    }
  });
  $( "#sortable" ).disableSelection();
}

function setBMButton() {
	let threadID = page.url.topic.split(".")[0];
	let intID = Number.parseInt(threadID);
	let strURL = "https://elliquiy.com/forums/index.php?action=bookmarks";
	GM_xmlhttpRequest({
	  method: "GET",
	  url: strURL,
	  onload: function (response) {
        let strCheck = "?topic=" + intID + ".";
        if (response.responseText.includes(strCheck)) {
          let $button = $("a.button_strip_bookmark_add");
          $button.css("background-image","linear-gradient(#e2e9f3 0%, #ccc 70%)");
          $button.text("Bookmarked");
  		  }
	  }
	});
}

function quickBMs() {
    if (!config.bookmarks.showQuickMenu) {
      return;
    }
    let strCat = "Quick BMs";
    let slug = slugify(strCat);
    $catMenu = $("<li class='button_QL'><a href='#' id='ql_" + slugify(strCat) + "_click'><span class='main_icons drafts'></span><span class='textmenu'>" + strCat + "</span></a><div id='ql_" +
                 slugify(strCat) + "_menu' class='top_menu' style='display: hidden; min-width: auto;'><div class='profile_user_links'><ol id='ql_ol_" + slugify(strCat) + "' style='column-count: 1'></ol></div></div></li>");
    $ol = $catMenu.find("#ql_ol_" + slugify(strCat));
    $olMeta = $catMenu.find("#ql_ol_" + slugify(strCat) + "_meta");
    let strURL = "https://elliquiy.com/forums/index.php?action=bookmarks";
    GM_xmlhttpRequest({
      method: "GET",
      url: strURL,
      onload: function (response) {
        //console.log("=== Links 1 ===");
        let $page = $(response.responseText);
        let $pageBody = $page.find("#main_content_section form table");
        let $rows = $pageBody.find("tr")
        $rows.each(function () {
          $row = $(this);
          $a = $row.find("td:eq(1) a:eq(0)");
          if ($a.length > 0) {
            let $link = $("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a href='" + $a.attr("href") + "' style='display: inline; padding-left: 0px;'><span>" + $a.text() + "</span></a></li>");
            $ol.append($link);
          }

        });

        var items = $ol.find("li").get();
        items.sort(function(a,b){
          var keyA = $(a).text().toLowerCase();
          var keyB = $(b).text().toLowerCase();

          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
        $.each(items, function(i, li){
          $ol.append(li); /* This removes li from the old spot and moves it */
        });

        $("#mobile_user_menu ul.dropmenu").append($catMenu);
        $catMenu.find("#ql_" + slug + "_click").click(function(e) {
          stopDefaultAction(e);
          let strTog = "#ql_" + slug + "_menu";
          $tog = $(strTog);
          if ($tog.is(":hidden")) {
            $("#mobile_user_menu .top_menu").hide();
          }
          $tog.toggle();
        });
      }
    });
}

function showQuickLinks() {
  //console.log("=== Show Quick Links ===");
  $("#mobile_user_menu ul.dropmenu li.button_QL").remove();
  let bySortOrder = false;
  let aryCats = sortKeys(quickLinks,config.quickLinks.sortType == "custom");
  for (counter = 0; counter < aryCats.length; counter++) {
    let strCat = aryCats[counter];
    let objCat = quickLinks[strCat];
    let slug = slugify(strCat);
    let catDel = "";
    if (quickLinks[strCat] && Object.keys(quickLinks[strCat].links).length === 0) {
      catDel = " <img class='qlcat_delicon' style='height: 1.2em; float: right; margin-top: 6px;' src='" + GM_getResourceURL("iconDelete") + "' />"
    }
    $catMenu = $("<li class='button_QL'><a href='#' id='ql_" + slug + "_click' style='display: inline-block'><span class='main_icons drafts'></span><span class='textmenu'>" + objCat.title + "</span></a>" + catDel + "<div id='ql_" +
                 slug + "_menu' class='top_menu' style='display: hidden; min-width: auto;'><div class='profile_user_links'><ol id='ql_ol_" + slugify(strCat) + "' style='column-count: 1'></ol><hr style='margin-bottom: 1px; margin-top: 5px;' /><ol id='ql_ol_" + slugify(strCat) + "_meta' style='column-count: 1'></ol></div></div></li>");

    $catMenu.find("img.qlcat_delicon").click( function(e) {
      confirmDialog("Delete Quick Link Category","Delete category " + objCat.title + "?",function(){
        deleteQLCat(strCat);
        saveQuickLinks();
        showQuickLinks();
      });
    });
    $ol = $catMenu.find("#ql_ol_" + slugify(strCat));
    $olMeta = $catMenu.find("#ql_ol_" + slugify(strCat) + "_meta");

    let aryLinks = sortKeys(objCat.links,config.quickLinks.sortType == "custom");
    for (counter2 = 0; counter2 < aryLinks.length; counter2++) {
      let strLink = aryLinks[counter2];
      let objLink = objCat.links[strLink];
      let strTarget = "";
      if (config.quickLinks.externalInTab) {
        if (objLink.url.toLowerCase().indexOf("https://elliquiy.com") == -1) {
          strTarget = " target='_blank'";
        }
      }
      let $link = $("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a" + strTarget + " href='" + objLink.url + "' style='display: inline; padding-left: 0px;'><span>" + objLink.title + "</span></a> <img class='ql_delicon' style='height: 1.2em; float: right; margin-top: 6px;' src='" + GM_getResourceURL("iconDelete") + "' /></li>");
      $ol.append($link);
      $link.find("img.ql_delicon").click(function(e) {
        confirmDialog("Delete Quick Link","Delete quick link " + objCat.title + "/" + objLink.title + "?",function(){
          deleteQL(strCat,strLink);
          saveQuickLinks();
          showQuickLinks();
        });
      });
    }

    let $linkAdd = $("<li style='padding-left: 24px; width: auto;'><span style='font-weight: bold; display: inline;padding-left: 2px'>+</span> <a href='#' style='display: inline;padding-left: 13px;'><span>Add</span></a></li>");
    $linkAdd.click(function(e) {
      e.preventDefault();
      $("#mobile_user_menu .top_menu").hide();
      frmQL(strCat);
    });
    $linkAdd.on("contextmenu", function(e) {
      stopDefaultAction(e);
    });
    $olMeta.append($linkAdd);

    let $linkSort = $("<li style='padding-left: 24px; width: auto;'><span style='font-weight: bold; display: inline;padding-left: 3px'>↕</span> <a href='https://elliquiy.com/forums/index.php?action=sortqls&cat=" + strCat + "' style='display: inline;padding-left: 13px;'><span>Sort</span></a></li>");
    $linkSort.on("contextmenu", function(e) {
      stopDefaultAction(e);
    });
    $olMeta.append($linkSort);

    $catMenu.find("#ql_" + slug + "_click").click(function(e) {
      stopDefaultAction(e);
      let strTog = "#ql_" + slug + "_menu";
      $tog = $(strTog);
      if ($tog.is(":hidden")) {
        $("#mobile_user_menu .top_menu").hide();
      }
      $tog.toggle();
    });
    $("#mobile_user_menu ul.dropmenu").append($catMenu);
  }
  $qlAdd = $("<li class='button_QL'><a href='#'><span class='textmenu'>(+)</span></a></li>");
  $qlAdd.click(function(e) {
    e.preventDefault();
    $("#mobile_user_menu .top_menu").hide();
    frmQLCat();
  });
  $("#mobile_user_menu ul.dropmenu").append($qlAdd);

  let $qlSort = $("<li class='button_QL'><a href='https://elliquiy.com/forums/index.php?action=sortqlcats'><span class='textmenu'>(↕)</span></a></li>");
  $("#mobile_user_menu ul.dropmenu").append($qlSort);

  quickBMs();
}

function cleanQuickLinks() {
  for (var cat in quickLinks) {
    if (cat.trim() == '') {
      delete quickLinks[cat]
    } else {
      for (var lnk in quickLinks[cat].links) {
        if (lnk.trim() == "") {
          delete quickLinks[cat].links[lnk];
        }
      }
    }
  }
  saveQuickLinks();
}

function updateQLcatslug() {
  let objNew = {};
  if (GM_getValue("updateQL-catslug","") == "") {
    for (var key in quickLinks) {
      let objCat = quickLinks[key];
      for (var key2 in objCat.links) {
        let objLink = objCat.links[key2];
        let strSlug = slugify(key2);
        if (strSlug != key2) {
          objCat.links[strSlug] = objLink;
          delete objCat.links[key2];
        }
      }
      objNew[slugify(key)] = objCat;
    }
    quickLinks = objNew;
  }
}

function loadQuickLinks() {
  let strQL = GM_getValue("quickLinksNew","");
  if (strQL === "") {
    quickLinks = {};
  } else {
    quickLinks =  JSON.parse(strQL);
    updateQLcatslug();
    cleanQuickLinks();
  }
}

function saveQuickLinks() {
  let strLinks = JSON.stringify(quickLinks);
  //console.log("=== Saving QLs ===");
  //console.log(strLinks);
  GM_setValue("quickLinksNew",strLinks);
}

function saveQLCategory(title, sortOrder, oldTitle) {
  let objQL = {};
  let strTitle = cleanInput(title);
  let strID = slugify(strTitle);
  let strIDOld = slugify(oldTitle);
  objQL.title = strTitle;
  objQL.sortOrder = sortOrder;
  if (oldTitle && quickLinks[slugify(strIDOld)]) {
    objQL.links = quickLinks[strIDOld].links;
    delete objQL[strIDOld];
  } else {
    objQL.links = {};
  }
  quickLinks[strID] = objQL;
}

function saveQL(cat,title,url,sortOrder,oldCat,oldTitle) {
  let objQL = {};
  let strTitle = cleanInput(title);
  let strID = slugify(strTitle);
  let strOldID = slugify(oldTitle);
  objQL.cat = cat;
  objQL.title = strTitle;
  objQL.url = url;
  objQL.sortOrder = sortOrder;
  if (oldCat && oldTitle && quickLinks[oldCat] && quickLinks[oldCat].links[strOldID]) {
    delete quickLinks[oldCat].links[strOldID];
  }
  quickLinks[cat].links[strID] = objQL;
}

function deleteQL(cat,title) {
  if (cat && title && quickLinks[cat] && quickLinks[cat].links[title]) {
    delete quickLinks[cat].links[title];
  }
}

function deleteQLCat(cat) {
  //console.log(quickLinks[cat].links );
  if (cat && quickLinks[cat] && Object.keys(quickLinks[cat].links).length === 0) {
    delete quickLinks[cat];
  }
}


function frmQLBody(cat) {
  log("functiontrace", "Start Function");
  var strBody = "";
  var key;
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Name:</th>";
  strBody += " <td><input type='text' id='qlName' size='50' placeholder='Name Me'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>URL:</th>";
  strBody += " <td><input type='text' id='qlUrl' size='100'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <td colspan=2 style='vertical-align: top; text-align: center;'>";
  strBody += "<center><button type='button' id='qlAdd' class='qlAdd' value='Use'>Add</button></center>";
  strBody += "</td>";
  strBody += "</tr>";
  strBody += "</table>";
  strBody += "<input type='hidden' id='qlCat' value='cat'>";
  return strBody;
}

function frmQLButtons(cat) {
  log("functiontrace", "Start Function");
  var strBody;
  var strID;
  var snippet;
  $('button#qlAdd').click(function (e) {
    e.preventDefault();
    saveQL(cat,$('#qlName').val(),$('#qlUrl').val(),999);
    //console.log(quickLinks);
    saveQuickLinks();
    showQuickLinks();
    $('#modalpop').dialog( "close" );
  });
}

function frmQL(cat) {
  log("functiontrace", "Start Function");
  var strBody = frmQLBody(cat);
  throwModal("Add Quick Link", strBody,"auto");
  $("#qlUrl").val(window.location);
  frmQLButtons(cat);
}

function frmQLCatBody() {
  log("functiontrace", "Start Function");
  var strBody = "";
  var key;
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Name:</th>";
  strBody += " <td><input type='text' id='qlName' size='50' placeholder='Name Me'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <td colspan=2 style='vertical-align: top; text-align: center;'>";
  strBody += "<center><button type='button' id='qlAdd' class='qlAdd' value='Use'>Add</button></center>";
  strBody += "</td>";
  strBody += "</tr>";
  strBody += "</table>";
  return strBody;
}

function frmQLCatButtons() {
  log("functiontrace", "Start Function");
  var strBody;
  var strID;
  var snippet;
  $('button#qlAdd').click(function (e) {
    e.preventDefault();
    saveQLCategory($('#qlName').val(),999);
    //console.log(quickLinks);
    saveQuickLinks();
    showQuickLinks();
    $('#modalpop').dialog( "close" );
  });
}

function frmQLCat(cat) {
  log("functiontrace", "Start Function");
  var strBody = frmQLCatBody(cat);
  throwModal("Add Quick Link Category", strBody,"auto");
  frmQLCatButtons(cat);
}


/* =========================== */
/* New Configuration Stuff     */
/* =========================== */
function initConfigCategory(configCat, catDisplayName, isAdmin) {
  if (!config[configCat]) {
      config[configCat] = {
          loaded: new Date()
      };
  }
  config_display[configCat] = {
      displayName: catDisplayName,
      isAdmin: !!isAdmin,
      loaded: new Date()
  }
}

function initConfigItem(itemCat, itemName, defaultValue, displaySettings) {
  if (config[itemCat]) {
      if (!config[itemCat].hasOwnProperty(itemName)) {
          config[itemCat][itemName] = defaultValue;
      }
  }
  config_display[itemCat][itemName] = displaySettings;
}

function loadConfig(andThen) {
  var blNewConfig;
  var strConf = GM_getValue("config","");
  if (strConf === "") {
      config = {};
      blNewConfig = true;
  } else {
      config = JSON.parse(strConf);
      blNewConfig = false;
  }
  if (andThen) andThen();
  return !blNewConfig;
}



function saveConfig(andThen) {
	config.version = GM_info.script.version;
  config.savedWhen = new Date();
  //console.log("Saving config");
  //console.log(config);
  GM_setValue("config",JSON.stringify(config));
  if (andThen) andThen();
}

function initConfig(andThen) {
  config = {};
  config_display = {};
  loadConfig();
  // Settings categories
  initConfigCategory("general","General Settings");
  initConfigCategory("topicFilters","Topic Filters");
  initConfigCategory("speechStyling","Speech Styling");
  initConfigCategory("userNotes","User Notes");
  initConfigCategory("userTags","User Tags");
  initConfigCategory("bookmarks","Bookmarks");
  initConfigCategory("repage","Repagination");
  initConfigCategory("image","Images");
  initConfigCategory("quickLinks","Quick Links");

  // General Settings
  initConfigItem("general","removePics", false, {text: "Remove pictures?", type: "bool" });
  initConfigItem("general","snippets", false, {text: "Snippets?", type: "bool" });
  initConfigItem("general","snippetscontext", false, {text: "Snippets context menu?", type: "bool" });
  // initConfigItem("general","userLists", false, {text: "User lists?", type: "bool" });
  initConfigItem("general","wordCount", true, {text: "Show wordcounts?", type: "bool" });
  initConfigItem("general","lexDiv", false, {text: "Show lexical diversity?", type: "bool" });
  initConfigItem("general","debugInfo", false, {text: "Debug information?", type: "bool" });
  initConfigItem("general","ajaxButtons", true, {text: "Make buttons AJAX?", type: "bool" });
  initConfigItem("general","freezeGifs", false, {text: "Freeze GIFs ?", type: "bool" });
  initConfigItem("general","freezeGifsDelay", 15, {text: "Play auto-frozen GIFs for (secs):", type: "int", min: 0, max: 9999 });
  initConfigItem("general","bodyFontSize",90,{text: "Font size (%, default 90)", type: "int", min: 30, max: 500 });
  initConfigItem("general","bodyFontFace", "", {text: "Font (blank for default)", type: "text" });
  initConfigItem("general","newButton", true, {text: "New button for threads?", type: "bool" });
  strCSSBodyFont = "body {font-size: " + config.general.bodyFontSize + "%; "
  if (config.general.bodyFontFace.trim() != "") {
    strCSSBodyFont = strCSSBodyFont + " font-family: " + config.general.bodyFontFace;
  }
  strCSSBodyFont = strCSSBodyFont + "}";

  // Topic Filters
  initConfigItem("topicFilters","on", false, {text: "Topic Filters On?", type: "bool" });
  initConfigItem("topicFilters","CSS_Hi", "background-color: yellow;", {text: "Hilight Styling (CSS)", type: "text" });
  initConfigItem("topicFilters","CSS_HiSoft", "background-color: #BBE4BB;", {text: "Soft Hilight Styling (CSS)", type: "text" });
  initConfigItem("topicFilters","CSS_Mark", "background-color: lightgray; text-decoration: line-through;", {text: "Mark Styling (CSS)", type: "text" });
  initConfigItem("topicFilters","CSS_Question", "background-color: cornsilk;" , {text: "Question Styling (CSS)", type: "text" });
  initConfigItem("topicFilters","CSS_Later", "background-color: aliceblue;" , {text: "Later Styling (CSS)", type: "text" });
  strCSSFT = ".FTMark { " + config.topicFilters.CSS_Mark + " } .FTHi { " + config.topicFilters.CSS_Hi + " }  .FTHiSoft { " + config.topicFilters.CSS_HiSoft + " } .FTLater { " + config.topicFilters.CSS_Later + " } .FTQ { " + config.topicFilters.CSS_Question + "}";
  strCSSFT = strCSSFT.replaceAll(";"," !important;")

  // Quick Links
  initConfigItem("quickLinks","on", false, {text: "Enable Quick Links?", type: "bool" });
  initConfigItem("quickLinks","externalInTab", true, {text: "Open External In New Tab?", type: "bool" });

  // Speech Styling
  initConfigItem("speechStyling","on", true, {text: "Style Speech?", type: "bool" });
  initConfigItem("speechStyling","incQuote", true , {text: "Include quotes?", type: "bool" });
  initConfigItem("speechStyling","CSS", "color: blue;", {text: "Speech Styling (CSS)", type: "text" });

  // User Notes
  initConfigItem("userNotes","on", false, {text: "User Notes?", type: "bool" });
  initConfigItem("userNotes","style", "Hover Over Name", {text: "Note Style", type: "select", select: aryUserNoteOptions});

  // User Tags
  initConfigItem("userTags", "on", false, {text: "User Tags?", type: "bool"});

  // Bookmarks
  initConfigItem("bookmarks","tags", true, {text: "Bookmark Tags?", type: "bool" });
  initConfigItem("bookmarks","collapse", true, {text: "Collapsable View?", type: "bool" });
  initConfigItem("bookmarks","collapseOrder", "All,Tags,Autos", {text: "Order of collapsable BM categories?", type: "select", select: ["All,Tags,Autos","Tags,Autos,All"]});
  initConfigItem("bookmarks","collapseOpen", true, {text: "Open selected collapsed category?", type: "bool" });
  initConfigItem("bookmarks","collapseToggle", true, {text: "Clicks toggle collapsed categories?", type: "bool" });
  initConfigItem("bookmarks","allLink", true, {text: "Add &apos;All&apos; link to bookmarks?", type: "bool" });
  initConfigItem("bookmarks","owedTag", true, {text: "Posts Owed Auto-Tag??", type: "bool" });
  initConfigItem("bookmarks","tagOnBM", true, {text: "Add tags when bookmarking?", type: "bool" });
  initConfigItem("bookmarks","repliesTag", true, {text: "Replies Auto-Tag?", type: "bool" });
  initConfigItem("bookmarks","noTagsTag", true, {text: "No Tags Auto-Tag?", type: "bool" });
  initConfigItem("bookmarks","showQuickMenu", false, {text: "Show Quick Menu?", type: "bool" });
  initConfigItem("bookmarks","indicateBMd", true, {text: "Show BM status on button", type: "bool" });

  // Repagination
  initConfigItem("repage","on", false, {text: "Repaginate?", type: "bool" });
  initConfigItem("repage","maxpage", 10, {text: "Max pages (1-100)?", type: "int", min: 1, max: 100 });
  initConfigItem("repage","infinity", false, {text: "Infinity paging?", type: "bool" });

  // Images
  initConfigItem("image","enlarge", true, {text: "Click to Enlarge?", type: "bool" });
  saveConfig();
  if (andThen) andThen();
}

// Returns true if a setting hsa been set, false otherwise
function updateConfig(controlID) {
	var $control = $("div#fatal_error").find("#" + controlID);
	var aID = controlID.split("-");
	var catID = aID[3];
	var settingID = aID[4];
  //console.log("Set: " + settingID);
  //console.log($control);
	if ($control.hasClass("gm-settings-control-bool")) {
		config[catID][settingID] = $control[0].checked;
	} else if ($control.hasClass("gm-settings-control-int")) {
        //console.log("Inty: " + settingID);
        var intVal = parseInt($control.val());
        //console.log(intVal);
        if ($.isNumeric("" + intVal)) {
            if (config_display[catID][settingID].hasOwnProperty("min") && intVal < config_display[catID][settingID].min) {
                //console.log("There's a minimum and " + intVal + " < " + config_display[catID][settingID].min);
                return false;
            }
            if (config_display[catID][settingID].hasOwnProperty("max") && intVal > config_display[catID][settingID].max) {
                //console.log("There's a maximum and " + intVal + " > " + config_display[catID][settingID].max);
                return false;
            }
            config[catID][settingID] = intVal;
        } else {
            //console.log("Not an integer: " + $control.val())
            return false;
        }
	} else {
		config[catID][settingID] = $control.val();
	}
    return true;
}

function editConfig() {
  GM_addStyle(".gm-settings-cat { float: left; display: block; border: thin solid black; padding: 10px; margin: 10px; background-color: #c5c5c5}");
  GM_addStyle(".gm-settings-cat-title { font-weight: bold; font-size: 120%; margin-bottom: 10px; }");
  GM_addStyle(".gm-settings-cat-settings { margin-left: 10px; }");
  GM_addStyle(".gm-settings-setting { margin-bottom: 15px; border-bottom: thin solid gray; width: auto; padding-bottom: 5px; }");
  GM_addStyle(".gm-settings-setting-label { margin-right: 10px; display: inline; font-weight: bold; color: black;}");
  GM_addStyle(".gm-settings-control-int { width: 4rem; }");
  GM_addStyle(".gm-settings-setting-label { max-width: 15rem; display: inline-block; }");
  //var $page = $("div#helpmain");
  $("#fatal_error").css("width","auto");
  let $page = $("#fatal_error div.windowbg");

  $page.css("max-width","initial");
  //var $title = $("<h2>Script Settings (v" + GM_info.script.version + ")</h2>");
  $("h3.catbg").html("Script Settings (v" + GM_info.script.version + ")");
  document.title = "Script Settings (v" + GM_info.script.version + ")";
  $page.html("");
  for (var key in config_display) {
      var confd = config_display[key];
      var $newcat = $("<div class='gm-settings-cat well' id='gm-settings-cat-" + key + "'></div>");
      $newcat.append("<h3 class='gm-settings-cat-title'>" + confd.displayName + "</h3>");
      var $newSettings = $("<div class='gm-settings-cat-settings'></div>");
      for (var key2 in confd) {
          var $newSetting = $("<div class='gm-settings-setting'></div>");
          var setting = confd[key2];
          var val = config[key][key2];
          if (setting.text) {
              $newSetting.append("<label class='gm-settings-setting-label' for='gm-settings-value-" + key + "-" + key2 + "'>" + setting.text + "</label>");
              switch (setting.type) {
                  case "bool":
                      $newSetting.append("<span class='gm-settings-setting-value' style='display: inline' ><input type='checkbox' class='gm-settings-control gm-settings-control-bool' id='gm-settings-value-" + key + "-" + key2 + "'" + ((val) ? ' checked' : '') + "></span>");
                      break;
                  case "int":
                      var min = '';
                      if (setting.hasOwnProperty('min')) {
                          min = " min='" + setting.min + "'";
                      }
                      var max = '';
                      if (setting.hasOwnProperty('max')) {
                          max = " max='" + setting.max + "'";
                      }
                      $newSetting.append("<span class='gm-settings-setting-value'><input type='number' class='gm-settings-control gm-settings-control-int' id='gm-settings-value-" + key + "-" + key2 + "' value='" + val + "'" + min + max + "></span>");
                      break;
                  case "select":
                      var $select;
                      $select = $("<select class='gm-settings-control gm-settings-control-select' id='gm-settings-value-" + key + "-" + key2 + "'>");
                      for (var i = 0; i < setting.select.length; i++) {
                          var selKey = setting.select[i];
                          $select.append("<option value='" + selKey + "'" + ((val === selKey) ? " selected" : "") + ">" + selKey + "</option>");
                      }
                      $newSetting.append($select);
                      break;
                  case "text":
                  default:
                      $newSetting.append("<span class='gm-settings-setting-value'><input type='text' class='gm-settings-control gm-settings-control-text' id='gm-settings-value-" + key + "-" + key2 + "' value='" + val + "'></span>");
                      break;
              }
              $newSettings.append($newSetting);
          }
      }
      $newcat.append($newSettings);
      if (!confd.isAdmin || strScriptAdmins.indexOf(user.id) > -1) {
        $page.append($newcat);
      }
  }
  $page.append("<div style='clear: both;'>&nbsp;</div>");
  $page.find(".gm-settings-control").change($.debounce(500, function(e) {
    if (updateConfig(e.target.id)) {
            saveConfig(loadConfig);
        };
  }));
  $page.find(".gm-settings-control-text, .gm-settings-control-int").keyup($.debounce(500, function(e) {
    if (updateConfig(e.target.id)) {
            saveConfig(loadConfig);
        };
  }));
}
/* =========================== */

/* =========================== */
/* Configuration Options       */
/* =========================== */
function displaySettings() {
  log("functiontrace", "Start Function");
  $("li#button_settings").remove();
  let settingsURL = "https://elliquiy.com/forums/index.php?action=scriptsettings";
  let $menunav = $('ul#top_info');
  let $menuQOuter = $("<li><a href='#' id='script_menu_top'><span class='main_icons maintain'></span> <span class='textmenu'>Script</span></a><div id='script_menu' class='top_menu' style='display: hidden'><div class='profile_user_links'><ol></ol></div><!-- .profile_user_links --></div></li>");
  let $menuQ = $menuQOuter.find("ol");
  if (GM_info.script === undefined) {}
  else {
    $menuQ.append("<li><span class='main_icons maintain'></span> <a href='" + settingsURL + "'>Settings (v" + GM_info.script.version + ")</a></li>")
    if (config.topicFilters.on) {
      $menuQ.append("<li><span class='main_icons frenemy'></span> <a href='#' id='TF_link'>Topic Filters</a></li>")
      $menuQ.find("a#TF_link").click(function (e) {
        e.preventDefault();
        frmFT("", "", "");
      });
    }

    $menuQ.append("<li><span class='main_icons drafts'></span> <a href='#' id='snippets_link_settings'>Snippets</a></li>")
    $menuQ.append("<li><span class='main_icons drafts'></span> <a href='https://elliquiy.com/forums/index.php?action=sortsnippets' id='snippets_sort_settings'>Sort Snippets</a></li>")
    $menuQ.find("a#snippets_link_settings").click(function (e) {
      e.preventDefault();
      frmSnippet();
    });

/*
    $menuQ.append("<li><span class='main_icons people'></span> <a href='#' id='userLists_link_settings'>User Lists</a></li>")
    $menuQ.find("a#userLists_link_settings").click(function (e) {
      e.preventDefault();
      frmUserLists();
    });
*/

    $menuQ.append("<li><span class='main_icons maintain'></span> <a href='#' id='setting_managetags_link'>Manage Tags</a></li>")
    $menuQ.find("a#setting_managetags_link").click(function (e) {
      e.preventDefault();
      frmBMTags();
    });

    $menuQ.append("<li><span class='main_icons features'></span> <a href='#' id='setting_export_link'>Export Settings</a></li>")
    $menuQ.find("a#setting_export_link").click(function (e) {
      e.preventDefault();
      exportValues();
    });

    $menuQ.append("<li><span class='main_icons features'></span> <a href='#' id='setting_import_link'>Import Settings</a></li>")
    $menuQ.find("a#setting_import_link").click(function (e) {
      e.preventDefault();
      frmImport();
    });


    $menuQ.append("<li><span class='main_icons alerts'></span> <a href='#' id='setting_freeze_gif'>Freeze GIFs</a></li>")
   $menuQ.find("ul").append("<li><a href='#' id='setting_freeze_gif'><span class='setting_freeze_gif'>Freeze GIFs</span></a></li>");
    $menuQ.find("a#setting_freeze_gif").click(function (e) {
      e.preventDefault();
      //window.stop();
      freezeGifs();
    });


    $menuQ.append("<li><span class='main_icons maintain'></span> <a href='https://github.com/Ssieth/eli-userscript/raw/master/eli.user.js' id='setting_getlatest'>Get Latest Version</a></li>")

  }
  $menunav.append($menuQOuter);
  $menuQOuter.click(function() {
    $menuQOuter.find("#script_menu").toggle();
  });
}
/* =========================== */

/* =========================== */
/* Freeze Gifs                 */
/* =========================== */
function freezeGifs() {
  [].slice.apply(document.images).filter(is_gif_image).map(freeze_gif);
}

function is_gif_image(i) {
    return /^(?!data:).*\.gif/i.test(i.src);
}

function freeze_gif(i) {
    var c = document.createElement('canvas');
    var w = c.width = i.width;
    var h = c.height = i.height;
    c.getContext('2d').drawImage(i, 0, 0, w, h);
    try {
        i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
    } catch(e) { // cross-domain -- mimic original with all its tag attributes
        for (var j = 0, a; a = i.attributes[j]; j++)
            c.setAttribute(a.name, a.value);
        i.parentNode.replaceChild(c, i);
    }
}
/* =========================== */

/* =========================== */
/* Repaginate                  */
/* =========================== */
function repage_getPage($pageBody0, strURL, stopAt) {
  let strPageBody = 'form#quickModForm';
  loadingPage = true;
  GM_xmlhttpRequest({
    method: "GET",
    url: strURL,
    onload: function (response) {
      loadingPage = false;
      let $page = $(response.responseText);
      let $pageBody = $page.find(strPageBody);
      let iPage = parseInt($page.find("div.pagelinks span.current_page:eq(0)").text());
      let strURLNext = getNextURL($page,iPage);
      if (strURLNext === "") {
        nextURL = "-end-";
      } else {
        nextURL = strURLNext;
      }
      //console.log("repage_gp: page " + iPage + ", stopping at " + stopAt);
      if ($pageBody.length > 0) {
          $pageBody0.append($pageBody.html());
      }
      if (iPage >= stopAt) {
        //console.log("repate: We reached the limit, stopping!")
        return;
      }
      if (strURLNext === "") {
        //console.log("repage: No next, last page?");
      } else {
        // Don't spam too hard
        setTimeout(function() {
          repage_getPage($pageBody0,strURLNext, stopAt);
        },500);
      }
    }
  });
}

function getNextURL($page,iPage) {
  let strNext = 'div.pagelinks a';
  let strPage = "" + (iPage+1);
  //console.log("Looking for " + strPage)
  let $next = $page.find(strNext).filter(function() {return $(this).text() == strPage;})
  if ($next.length > 0) {
    return $next.attr("href");
  } else {
    return "";
  }
}

function repaginate() {
  if (page.type === "topic") {
    if (config.repage.infinity) {
      let iPage = parseInt($("div.pagelinks strong").text());
      lastPageLoaded = iPage;
      loadingPage = false;
    }
    //console.log("/===== Repaginate =====")
  }
}

/* =========================== */
/* Filter Topics               */
/* =========================== */
function frmFTBody(strID, strText, strType) {
  log("functiontrace", "Start Function");
  var strBody = "";
  var key;
  var objFT = objFilterTopics[strID];
  if (objFT) {
    strType = objFT.filterType;
  }
  strBody = "<style>"
  strBody += "table.frmFT th { vertical-align: top; text-align: right; padding-top: 14px; }"
  strBody += "table.frmFT td { vertical-align: top; text-align: left; padding-top: 10px; padding-bottom: 10px; }"
  strBody += "</style>"
  strBody += "<p><strong>Add Topic Filter</strong></p>";
  strBody += "<table class='frmFT'>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>ID:</th>";
  strBody += " <td colspan=2><input type='text' id='topicID' size='10' value='" + strID + "'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Name:</th>";
  strBody += " <td colspan=2><input type='text' id='topicName' size='50' value='" + strText + "'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Filter Type:</th>";
  strBody += " <td>";
  //console.log("Type: " + strType);
  strBody += "<input type='radio' name='filterType' id='filterTypeNone' value='' ";
  if (!strType) {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeNone'>: No Filter</label>";
  strBody += "<br />";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeHide' value='hide' ";
  if (strType == "hide") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeHide'>: Hide<label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeHilight' value='hi' ";
  if (strType == "hi") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeHilight'>: Hilight</label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeHilightSoft' value='hisoft' ";
  if (strType == "hisoft") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeHilightSoft'>: Soft Hilight</label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeLater' value='later' ";
  if (strType == "later") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeLater'>: Later</label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeQuestion' value='question' ";
  if (strType == "question") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeQuestion'>: Question</label>";
  strBody += "</td>";
  strBody += "<td>";
  strBody += "<input type='radio' name='filterType' id='filterTypeMark' value='mark' ";
  if (strType == "mark") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeMark'>: General Mark</label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeGenre' value='mark-genre' ";
  if (strType == "mark-genre") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeGenre'>: Genre</label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeGender' value='mark-gender' ";
  if (strType == "mark-gender") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeGender'>: Gender</label>";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeCanon' value='mark-canon' ";
  if (strType == "mark-canon") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeCanon'>: Canon</label>";
  strBody += "<br />";
      strBody += "<input type='radio' name='filterType' id='filterTypeKink' value='mark-kink' ";
  if (strType == "mark-kink") {
    strBody += "checked='checked' ";
  }
  strBody += "/><label for='filterTypeKink'>: Kink</label>";
  strBody += "</td>";

  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <td colspan='2'><center><button value='Set' id='setFilter'>Set</button></center></td>";
  strBody += "</tr>";
  strBody += "</table>";
  /*
  strBody += "<p><strong>Current Filters</strong></p>";
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='text-align: left;'>Name</th>";
  strBody += " <th style='text-align: left;'>Type</th>";
  strBody += " <th style='text-align: left;'>Actions</th>";
  strBody += "</tr>";
  for (key in objFilterTopics) {
    var objFT = objFilterTopics[key];
    strBody += "<tr id='FTEdit_row_" + key + "'>";
    strBody += " <td>" + objFT.name.replace("'", "&#39;") + "</td>";
    strBody += " <td>" + objFT.filterType + "</td>";
    strBody += " <td>";
    strBody += "<button type='button' id='FTEdit_update_" + key + "' class='FTEdit_updatebutton' value='Edit'>Edit</button> ";
    strBody += "<button type='button' id='FTEdit_delete_" + key + "' class='FTEdit_deletebutton' value='Delete'>Delete</button>";
    strBody += "</td>";
    strBody += "</tr>";
  }
  */

  return strBody;
}

function setTF(strID, strName, filterType) {
  log("functiontrace", "Start Function");
  var objFT = objFilterTopics[strID];
  if (objFT === undefined) {
    objFT = {};
  }
  objFT.id = strID;
  objFT.name = strName;
  objFT.filterType = filterType;
  objFilterTopics[strID] = objFT;
}

function frmFTButtons() {
  log("functiontrace", "Start Function");
  var strBody;
  var strID;
  var objFT;
  $('button#setFilter').click(function (e) {
    e.preventDefault();
    setTF($("#modalpop #topicID").val(), $("#modalpop #topicName").val(), $('#modalpop input[type="radio"]:checked').val());
    saveFilterTopics();
    strBody = frmFTBody("", "");
    $("#modalpop").html(strBody);
    frmFTButtons();
    if (page.type == "board") {
      filterTopics();
    }
    $('#modalpop').dialog("close");
  });
  /*
  $('#modalpop button.FTEdit_updatebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("FTEdit_update_", "");
    objFT = objFilterTopics[strID];
    $("#modalpop #topicName").val(objFT.name);
    $("#modalpop #topicID").val(objFT.id);
    $("#modalpop input[value='" + objFT.filterType + "']").prop("checked", true);
  });
  $('#modalpop button.FTEdit_deletebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("FTEdit_delete_", "");
    delete objFilterTopics[strID];
    saveFilterTopics();
    strBody = frmFTBody("", "");
    $("#modalpop").html(strBody);
    frmFTButtons();
  });
  */
}

function frmFT(strID, strText) {
  log("functiontrace", "Start Function");

  var strBody = frmFTBody(strID, strText);

  throwModal("Filter Topics", strBody);
  frmFTButtons();
}

function addFilterTopicButton() {
  log("functiontrace", "Start Function");
  var $buttonLists = $('div.buttonlist ul');
  var $topicForm = $('form#search_form');
  var intTopicID = -1;
  var strTopicName = $("title").text();
  var $newButton;

  // remove old buttons
  $('li.button_strip_ftopic_li').remove();

  // Trim user names out of the topic name
  var intBracketPos = strTopicName.lastIndexOf('(');
  if (intBracketPos > 0) {
    strTopicName = $.trim(strTopicName.substr(0, intBracketPos));
  }

  if ($topicForm.length > 0) {
    intTopicID = "" + $topicForm.find('input[name="topic"]').val();
    if (intTopicID > 0) {
      if (objFilterTopics[intTopicID] === undefined) {
        $newButton = $("<li class='button_strip_ftopic_li'><a class='button_strip_ftopic' href='#'><span class='last'>Add Filter</span></a></li>");
        $newButton.click(function (e) {
          e.preventDefault();
          frmFT(intTopicID, strTopicName, "mark");
          return false;
        });
      }
      else {
        $newButton = $("<li class='button_strip_ftopic_li'><a class='button_strip_ftopic' href='#'><span class='last'>Remove Filter</span></a></li>");
        $newButton.click(function (e) {
          e.preventDefault();
          delete objFilterTopics[intTopicID];
          saveFilterTopics();
          addFilterTopicButton();
          return false;
        });
      }
      $buttonLists.append($newButton);
    }
  }
}

function filterTopicsSetIcon($row,iconName) {
	var srcImg = GM_getResourceURL("iconFilter" + iconName);
	$row.find("img:eq(0)").attr({
		src: srcImg,
		width: "20px"
	});
}

function filterTopics() {
  log("functiontrace", "Start Function");
  var $row;
  var $url;
  var id;
  var name;
  var blTable = false;
  //console.log("== filter topics ==");
  let $rows = $('#topic_container div.windowbg')
  if ($rows.length == 0) {
    //console.log("= Table =");
    $rows = $('div#main_content_section tr').not(".catbg");
    //console.log($rows);
    blTable = true;
  }
  $rows.each(function () {
      $row = $(this);
      if (!blTable) {
        $url = $row.find("div.info span.preview a");
        if ($url.length==0) {
          $url = $row.find("div.info span a");
        }
      } else {
        $url = $row.find("td:eq(1) a");
      }
      id = "" + $url.attr("href").match(/\d+/)[0];
      name = $url.text();
      if (objFilterTopics[id] === undefined) {}
      else {
        switch (objFilterTopics[id].filterType) {
          case "mark":
            $row.addClass("FTMark");
            break;
          case "mark-genre":
            $row.addClass("FTMark");
            filterTopicsSetIcon($row,"Drama");
            break;
          case "mark-gender":
            $row.addClass("FTMark");
            filterTopicsSetIcon($row,"Gender");
            break;
          case "mark-canon":
            $row.addClass("FTMark");
            filterTopicsSetIcon($row,"Canon");
            break;
          case "mark-kink":
            $row.addClass("FTMark");
            filterTopicsSetIcon($row,"Kink");
            break;
          case "question":
            $row.addClass("FTQ");
            filterTopicsSetIcon($row,"Question");
            break;
          case "hi":
            $row.addClass("FTHi");
            break;
          case "hisoft":
            $row.addClass("FTHiSoft");
            break;
          case "later":
            $row.addClass("FTLater");
            filterTopicsSetIcon($row,"Later");
            break;
          case "hide":
            $row.hide();
            break;
          default:
            break;
        }
        $row.find("td").css("background-color",$row.css("background-color"));
      }
  });
}

function quickFT() {
  log("functiontrace", "Start Function");
  var intRow = 0;
//  console.log("=== qft ===")
  $("#topic_container div.windowbg").each(function () {
    $(this).find("div.board_icon").click(function (e) {
      var strTopicURL = $(this).parent().find("div.info span.preview a");
      if (strTopicURL.length == 0) {
        strTopicURL = $(this).parent().find("div.info span a");
      }
      var strTopicName = strTopicURL.text();
      var strTopicID = strTopicURL.attr("href").match(/\d+/)[0];
      frmFT(strTopicID, strTopicName, "mark");
    }).addClass('pointer');
  });
//  console.log("/=== qft ===")
}

function loadFilterTopics() {
  log("functiontrace", "Start Function");
  var strSnippets = GM_getValue("filterTopics", "");
  if (strSnippets !== "") {
    objFilterTopics = JSON.parse(strSnippets);
  }
}

function saveFilterTopics() {
  log("functiontrace", "Start Function");
  GM_setValue("filterTopics", JSON.stringify(objFilterTopics));
}
/* =========================== */

/* =========================== */
/* User Lists                  */
/* =========================== */
function frmUserListBody() {
  log("functiontrace", "Start Function");
  var strBody = "";
  var key;
  strBody = "<p><strong>User Lists</strong></p>";
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Name:</th>";
  strBody += " <td colspan='3'><input type='text' id='userListName' size='20'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Users:</th>";
  strBody += " <td><textarea id='userListAdd' rows='3' cols='20'></textarea></td>";
  strBody += " <td>&nbsp;<center><button value='Add ->' id='addToUserList'>Add -></button></center>&nbsp;</td>";
  strBody += " <td><div id='userListAdded' style='min-width: 20em; border: thin solid gray; min-height: 5.5em; max-height: 9em; overflow: scroll;'></div>";
  strBody += " </td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <td colspan='4'><center><button value='Save' id='saveUserList'>Save User List</button></center></td>";
  strBody += "</tr>";
  strBody += "</table>";
  strBody += "<p><strong>Current Lists</strong></p>";
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='text-align: left;'>Name</th>";
  strBody += " <th style='text-align: left;'>Actions</th>";
  strBody += "</tr>";
  for (key in userLists) {
    var userList = userLists[key];
    strBody += "<tr id='userListEdit_row_" + userList.id + "'>";
    strBody += " <td>" + userList.name.replace("'", "&#39;") + "</td>";
    strBody += " <td>";
    strBody += "<button type='button' id='userListEdit_update_" + userList.id + "' class='userListEdit_updatebutton' value='Edit'>Edit</button> ";
    strBody += "<button type='button' id='userListEdit_delete_" + userList.id + "' class='userListEdit_deletebutton' value='Delete'>Delete</button> ";
    strBody += "</td>";
    strBody += "</tr>";
  }
  return strBody;
}

function saveUserList() {
  log("functiontrace", "Start Function");
  var strName = $('#userListName').val();
  var strID = strName.replace(/ /g, "-");
  //strID = strName.replace(/'/g,"");
  var userList = {};

  userList.id = strID;
  userList.list = currentUserList;
  userList.name = strName;
  userLists[strID] = userList;

  displayUserLists();
  saveUserLists();
  return false;
}

function loadCurrentList() {
  log("functiontrace", "Start Function");
  $("#modalpop #userListAdded").html("");
  for (var key in currentUserList) {
    var res = currentUserList[key];
    var strAdd = "";
    strAdd += res.name + " (" + res.id + ") ";
    strAdd += "<img src='https://elliquiy.com/forums/Themes/elliquiy2/images/pm_recipient_delete.gif' id='userListRemove-" + res.id + "'>";
    strAdd += "<br />";
    $("#modalpop #userListAdded").append(strAdd);
    $("#modalpop #userListAdded #userListRemove-" + res.id).click(function () {
      var strID = $(this).prop("id");
      var intID;
      strID = strID.replace("userListRemove-", "");
      intID = parseInt(strID);
      delete currentUserList[intID];
      loadCurrentList();
    });
  }
}

function frmUserListButtons() {
  log("functiontrace", "Start Function");
  var strBody;
  var strID;
  $('button#addToUserList').click(function (e) {
    e.preventDefault();
    var strUsers = $("#modalpop #userListAdd").val();
    var lstUsers = strUsers.split("\n");
    var aryFailed = [];
    for (var i = 0; i < lstUsers.length; i++) {
      var strUser = lstUsers[i].trim();
      if (strUser === '') {}
      else {
        var res = getMemberSearch(oSessionAuth, strUser);
        if (res.status == 'ok') {
          if (currentUserList.hasOwnProperty(res.id)) {}
          else {
            currentUserList[res.id] = res;
          }
        }
        else {
          aryFailed.push(strUser);
        }
      }
    }
    loadCurrentList();
    $("#modalpop #userListAdd").val(aryFailed.join("\n"));
  });
  $('button#saveUserList').click(function (e) {
    e.preventDefault();
    saveUserList();
    strBody = frmUserListBody();
    $("#modalpop").html(strBody);
    frmUserListButtons();
    currentUserList = [];
  });
  $('#modalpop button.userListEdit_updatebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("userListEdit_update_", "");
    var userList = userLists[strID];
    $("#modalpop #userListName").val(userList.name);
    currentUserList = userList.list;
    loadCurrentList();

  });
  $('#modalpop button.userListEdit_deletebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("userListEdit_delete_", "");
    delete userLists[strID];
    saveUserLists();
    displayUserLists();
    var strBody = frmUserListBody();
    $("#modalpop").html(strBody);
    frmUserListButtons();
  });
}

function frmUserLists() {
  log("functiontrace", "Start Function");
  currentUserList = {};
  var strBody = frmUserListBody;
  var strID = "";
  throwModal("User Lists", strBody);
  frmUserListButtons();
}

function loadUserLists() {
  log("functiontrace", "Start Function");
  var strUserLists = GM_getValue("userLists", "");
  if (strUserLists !== "") {
    userLists = JSON.parse(strUserLists);
  }
}

function saveUserLists() {
  log("functiontrace", "Start Function");
  GM_setValue("userLists", JSON.stringify(userLists));
}

function pasteUserList($this, pasteType) {
  log("functiontrace", "Start Function");
  var strUserList = $this.prop("id").replace("userList-", "");
  var userList;
  strUserList = strUserList.replace("-bcc", "");
  userList = userLists[strUserList].list;
  insertUsers(userList, pasteType);
}

function displayUserLists() {
  log("functiontrace", "Start Function");
  $("li#button_ul ul").remove();
  var $copyTo = $('div#bbcBox_message div:eq(0)');
  var key;
  var userList;
  if ($copyTo.length > 0) {
    var $menuQ = $('li#button_ul');
    var newMenu = false;
    if ($menuQ.length === 0) {
      newMenu = true;
      $menuQ = $("<li id='button_ul'><a class='firstlevel' href='#'><span class='firstlevel'>Users</span></a></li>");
    }
    var $menuQ_ul = $("<ul style='background-color: white;'></ul>");
    $menuQ.find('a.firstlevel').click(function (e) {
      e.preventDefault();
      frmUserLists();
    });
    var counter;
    var keys = Object.keys(userLists);
    for (counter = 0; counter < keys.length; counter++) {
      //for (key in sortedSnippetKeys) {
      key = keys[counter];
      userList = userLists[key];
      $menuQ_ul.append("<li style='padding-bottom:5px;'><a href='javascript:void(0);' class='userList_link_outer' id='userList-" + userList.id + "' style='display:inline;'><span class='snippet_link' style='display:inline;'>" + userList.name + "</span></a> (<a href='javascript:void(0);' class='userList_link_outer' id='userList-" + userList.id + "-bcc' style='display:inline;'><span class='snippet_link' style='display:inline;'>BCC</span></a>)</li>");
      $menuQ_ul.find('#userList-' + userList.id).click(function (e) {
        pasteUserList($(this), "t");
        stopDefaultAction(e);
        return false;
      });
      $menuQ_ul.find('#userList-' + userList.id + "-bcc").click(function (e) {
        pasteUserList($(this), "b");
        stopDefaultAction(e);
        return false;
      });
    }
    $menuQ.append($menuQ_ul);
    if (newMenu) {
      var $menunav = $("<ul id='bbcBox_userList' class='dropmenu' style='display: inline !important; float: right; z-index: 999 |important; display: inline-block;'></ul>");
      // This should resolve issues with only a limited number of snippets being displayed.
      $copyTo.parents("form").first().removeClass("flow_hidden");
      $menunav.append($menuQ);
      $copyTo.append($menunav);
    }
  }
  // Menu for lists
  $("li#userList").remove();
  for (key in userLists) {
    userList = userLists[key];
    var strList = "<li><a href='https://elliquiy.com/forums/index.php?action=mlist;sa=search#list|" + key + "'><span>UL: " + userList.name + "</span></a></li>";
    $("#button_mlist ul").append(strList);
  }
}

/* =========================== */

/* =========================== */
/* Snippets                    */
/* =========================== */
function sortSnippets_enableCustom() {
  switch (config.snippets.sortType) {
    case "alpha":
      $("#sortable").hide();
      break;
    default:
      $("#sortable").show();
  }
}

function sortSnippets() {
  if (!config.snippets) {
    config.snippets = {}
  }
  if (!config.snippets.sortType) {
    config.snippets.sortType = "alpha";
    saveConfig();
  }
  var $page = $("div#helpmain");
  if ($page.length <= 0) {
    $("#fatal_error").css("width","auto");
    $page = $("#fatal_error div.windowbg")
  }
  $page.css("max-width","initial");
  $("h3.catbg").html("Sort Snippets");
  document.title = "Sort Snippets";
  var $help = $("<p>Just grab the snippet and drag it where you want it in the ordering.</p>");
  var $sortOptions = $("<p></p>");
  var $snippetList = $("<ul id='sortable'></ul>");
  $sortOptions.append("<input class='sortType' type='radio' name='sortType' id='sortTypeAlpha' value='alpha' " + ((config.snippets.sortType == "alpha") ? " checked='checked'" : "") + "/>: <label for='sortTypeAlpha'>Alphabetical</label><br />");
  $sortOptions.append("<input class='sortType' type='radio' name='sortType' id='sortTypeCustom' value='custom' " + ((config.snippets.sortType == "custom") ? " checked='checked'" : "") + "/>: <label for='sortTypeCustom'>Custom</label><br />");
  GM_addStyle("#sortable { list-style-type: none; margin: 0; padding: 0; width: 60%; list-style-type:none; }");
  GM_addStyle("#sortable li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; cursor: pointer; border: thin solid black;}");
  GM_addStyle("#sortable li span { position: absolute; margin-left: -1.3em; }");
  var aryKeys = sortedSnippetKeys();
  for (var i = 0; i < aryKeys.length; i++) {
    var key = aryKeys[i];
    //console.log("KEY: " + key);
    var snippet = snippets[key];
    if (snippet.body.trim() === "") {
      delete snippets[key];
    }
    $snippetList.append($("<li id='" + key + "'>" +  snippets[key].name + "</li>"));
  }
  $page.html("");
  $page.append($help);
  $page.append($sortOptions);
  $page.append($snippetList);
  sortSnippets_enableCustom();
  $(".sortType").change(function() {
    config.snippets.sortType = $('.sortType:checked').val();
    saveConfig();
    sortSnippets_enableCustom();
  });
  $( "#sortable" ).sortable({
    cursor: "move",
    deactivate: function( event, ui ) {
      var arySorted = $( "#sortable" ).sortable( "toArray" );
      for (var i = 0; i < arySorted.length; i++) {
        if (!snippets[arySorted[i]]) {
          console.log("*** Error finding snippet::" +  arySorted[i] + "::");
        } else {
          snippets[arySorted[i]].ordinal = i;
        }
      }
      //console.log(snippets);
      saveSnippets();
    }
  });
  $( "#sortable" ).disableSelection();
}

function cleanSnippets() {
  log("functiontrace", "Start Function");
  var key;
  for (key in snippets) {
    var snippet = snippets[key];
    if (snippet.body.trim() === "") {
      delete snippets[key];
    }
  }
}

function sortedSnippetKeys() {
  log("functiontrace", "Start Function");
  var sortType = "alpha";
  if (config.snippets && config.snippets.sortType) {
    sortType = config.snippets.sortType;
  }
  //console.log("SortType:" + sortType);
  switch (sortType) {
    case "alpha":
      return Object.keys(snippets).sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase());  });
    case "custom":
      return Object.keys(snippets).sort(function compare(aKey, bKey) {
        var a = snippets[aKey];
        var b = snippets[bKey];
        if (a.ordinal < b.ordinal) {
          return -1;
        }
        if (a.ordinal > b.ordinal) {
          return 1;
        }
        return 0;
      });
  }
}

function setSnippet() {
  log("functiontrace", "Start Function");
  var strName = $('#snippetName').val();
  var strBody = $('#snippetBody').val();
  var strID = strName.replace(/ /g, "-");
  var snippet = {};

  strID = strID.replaceAll("\'","");
  strID = strID.replaceAll('\"',"");
  snippet.id = strID.replaceAll(":","");
  snippet.body = strBody;
  snippet.name = strName.replaceAll(":","");
  snippet.ordinal = Object.keys(snippets).length;
  snippets[strID] = snippet;

  cleanSnippets();
  saveSnippets();
  //displaySnippets();
  //$('#modalpop').dialog( "close" );

  return false;
}

function frmSnippetBody() {
  log("functiontrace", "Start Function");
  var strBody = "";
  var key;
  strBody = "<p><strong>Add Snippet</strong></p>";
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Name:</th>";
  strBody += " <td><input type='text' id='snippetName' size='50'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Snippet:</th>";
  strBody += " <td><textarea id='snippetBody' rows='3' cols='50'></textarea></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <td colspan='2'><center><button value='Set' id='setSnippet'>Set</button></center></td>";
  strBody += "</tr>";
  strBody += "</table>";
  strBody += "<p><strong>Current Snippets</strong></p>";
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='text-align: left;'>Name</th>";
  strBody += " <th style='text-align: left;'>Actions</th>";
  strBody += "</tr>";
  for (key in snippets) {
    var snippet = snippets[key];
    if (snippet.body !== "") {
      strBody += "<tr id='snipEdit_row_" + snippet.id + "'>";
      strBody += " <td>" + snippet.name.replace("'", "&#39;") + "</td>";
      strBody += " <td>";
      strBody += "<button type='button' id='snipEdit_use_" + snippet.id + "' class='snipEdit_usebutton' value='Use'>Use</button> ";
      strBody += "<button type='button' id='snipEdit_update_" + snippet.id + "' class='snipEdit_updatebutton' value='Edit'>Edit</button> ";
      strBody += "<button type='button' id='snipEdit_delete_" + snippet.id + "' class='snipEdit_deletebutton' value='Delete'>Delete</button> ";
      strBody += "</td>";
      strBody += "</tr>";
    }
  }
  return strBody;
}

function frmSnippetButtons() {
  log("functiontrace", "Start Function");
  var strBody;
  var strID;
  var snippet;
  $('button#setSnippet').click(function (e) {
    e.preventDefault();
    setSnippet();
    strBody = frmSnippetBody();
    $("#modalpop").html(strBody);
    frmSnippetButtons();
  });
  $('#modalpop button.snipEdit_updatebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("snipEdit_update_", "");
    snippet = snippets[strID];
    $("#modalpop #snippetName").val(snippet.name);
    $("#modalpop #snippetBody").val(snippet.body);
  });
  $('#modalpop button.snipEdit_usebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("snipEdit_use_", "");
    snippet = snippets[strID];
    pasteToDesc(snippets[strID].body, false);
  });
  $('#modalpop button.snipEdit_deletebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("snipEdit_delete_", "");
    delete snippets[strID];
    saveSnippets();
    //displaySnippets();
    strBody = frmSnippetBody();
    $("#modalpop").html(strBody);
    frmSnippetButtons();
  });
}

function frmSnippet() {
  log("functiontrace", "Start Function");
  var strBody = frmSnippetBody;
  var strID = "";
  throwModal("Add Snippet", strBody);
  frmSnippetButtons();
}

function cleanSnippetKeys() {
  var tmp = {};
  for (var key in snippets) {
    var snip = snippets[key];
    var newKey = key;
    newKey = newKey.replaceAll("\'","");
    newKey = newKey.replaceAll("\&","");
    newKey = newKey.replaceAll('\"',"");
    snip.id = newKey;
    tmp[newKey] = snip;
  }
  snippets = tmp;
}

function loadSnippets() {
  log("functiontrace", "Start Function");
  var strSnippets = GM_getValue("snippets", "");
  if (strSnippets !== "") {
    snippets = JSON.parse(strSnippets);
    cleanSnippetKeys();
  }
}

function rawSnippets() {
    return JSON.stringify(snippets);
}

function saveSnippets() {
  log("functiontrace", "Start Function");
  cleanSnippetKeys();
  GM_setValue("snippets", JSON.stringify(snippets));
}

/* For doing bold, italics etc */
function pasteToDesc(snippet, moveToEnd) {
  log("functiontrace", "Start Function");
  var textArea = $(strLastFocus);
  if (textArea.length > 0) {
    var start = textArea[0].selectionStart;
    var end = textArea[0].selectionEnd;
    let iPos = snippet.indexOf("%sel%");

    if (iPos > -1) {
      let strSel = "";
      if (end > start) {
        strSel = textArea.val().substring(start, end);
      }
      snippet = snippet.replace("%sel%",strSel);
    }

    var replacement = snippet;
    //textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, textArea.val().length));
    document.execCommand("insertText", false, replacement);

  }
}

function pasteSnippet($this) {
  log("functiontrace", "Start Function");
  var strID = $this.attr("id").replace("snip-", "");
  pasteToDesc(snippets[strID].body, false);
  return false;
}

function pasteSnippetNew($this) {
  log("functiontrace", "Start Function");
  var strID = $this.attr("id").replace("snipNew-", "");
  pasteToDesc(snippets[strID].body, false);
  return false;
}

function replaceSnippetsTags() {
  var aryKeys = sortedSnippetKeys();
  var textArea = $(strLastFocus);
  if (textArea.length > 0) {
    //console.log("RST: Got textarea");
    //textArea = textArea[0];
    var strText = textArea.val();
    for (var i = 0; i < aryKeys.length; i++) {
      var strKey = aryKeys[i];
      strText = strText.replaceAll("\\[" + i + "\\]", snippets[strKey].body);
      //console.log("RST: replaced: " + strKey);
    }
    textArea.val(strText);
  }
}

function getSnipCats() {
  let keys = sortedSnippetKeys();
  let cats = [];
  for (const key of keys) {
    let iPos = key.indexOf("__");
    if (iPos > -1) {
      let strCat = key.substring(0,iPos);
      if (!cats.includes(strCat)) {
        cats.push(strCat);
      }
    }
  }
  return cats;
}

function buildSnipMenu() {
  let $snipNew = $("<ul id='snipMenu' style='width: 8rem; float: right; margin-right: 15rem; z-index: 999; margin-top: 9px;'><li><div id='snipNewTop'>Snippets</div><ul id='snipMenuInner' style='width: 12rem'></ul></li></ul>")
  let $snipInner = $snipNew.find("#snipMenuInner");
  $snipNew.find('#snipNewTop').click(function (e) {
    //e.preventDefault();
    frmSnippet();
    if (config.general.snippetscontext) {
      $("#snipMenu").hide();
    }
  });
  var keys = sortedSnippetKeys();
  let cats = getSnipCats();
  for (const catName of cats) {
    let $catLi = $("<li><div>" + catName + "</div><ul id='snipCat-" + catName + "'></ul></li>");
    $snipInner.append($catLi);
  }
  for (const key of keys) {
    var snippet = snippets[key];
    var snipName = "";
    let iPos = key.indexOf("__");
    if (snippet.body !== "") {
      if (iPos > -1) {
        snipName = snippet.name.substring(iPos+2);
      } else {
        snipName = snippet.name;
      }
      let $snip = $("<li id='snipNew-" + snippet.id + "'><div>" + snipName + "</div></li>");
      $snip.click(function (e) {
        pasteSnippetNew($(this));
        if (config.general.snippetscontext) {
          $("#snipMenu").hide();
        }
        //stopDefaultAction(e);
        return false;
      });
      if (iPos > -1) {
        let strCat = key.substring(0,iPos);
        $snipInner.find("#snipCat-" + strCat).append($snip);
      } else {
        $snipInner.append($snip);
      }
    }
  }

  $snipNew.menu();
  return $snipNew;
}


function setSnipMenu(strSel, copyTo) {
  var $copyTo = $(copyTo);
  if ($copyTo.length > 0) {
    $copyTo.find("#snipMenu").remove();
    $copyTo.before(buildSnipMenu());
  }

  if (config.general.snippetscontext) {
    $(document).contextmenu({
      delegate: strSel,
      closeOnWindowBlur: false,
      menu: "#snipMenu",
      select: function(event, ui) {
        alert("select " );
      }
    });

    $( document.body ).click( function() {
      $("#snipMenu").hide();
    } );
  }
}

function displaySnippets() {
  log("functiontrace", "Start Function");
  // console.log("Display Snippets");

  setTimeout(function() {
    //console.log("== dS ==")
    if ($("#post_area textarea").length > 0) {
      strLastFocus ="#post_area textarea";
      setSnipMenu("#post_area textarea","#post_header");
    } else if ($("#postmodify textarea").length > 0) {
      strLastFocus ="#postmodify textarea";
      setSnipMenu("#postmodify textarea","#postmodify .sceditor-container");
    }
  },500);

}
/* =========================== */

/* =========================== */
/* Replies                     */
/* =========================== */
function loadIgnoredReplies() {
  log("functiontrace", "Start Function");
  var strSnippets = GM_getValue("ignoredreplies", "");
  if (strSnippets !== "") {
    objIgnoreReplies = JSON.parse(strSnippets);
  }
}

function saveIgnoredReplies() {
  log("functiontrace", "Start Function");
  GM_setValue("ignoredreplies", JSON.stringify(objIgnoreReplies));
}

function addIgnoreRepliesButton() {
  log("functiontrace", "Start Function");
  var $buttonLists = $('div.buttonlist ul');
  var $topicForm = $('form#search_form');
  var intTopicID = -1;
  var strTopicName = $("title").text();
  var intTopicPos = -1;
  var $newButton;

  // remove old buttons
  $('li.button_strip_ignoretopic_li').remove();

  // Trim user names out of the topic name
  var intBracketPos = strTopicName.lastIndexOf('(');
  if (intBracketPos > 0) {
    strTopicName = $.trim(strTopicName.substr(0, intBracketPos));
  }

  if ($topicForm.length > 0) {
    intTopicID = $topicForm.find('input[name="topic"]').val();
    if (intTopicID > 0) {
      if (objIgnoreReplies[intTopicID] === true) {
        $newButton = $("<li class='button_strip_ignoretopic_li'><a class='button_strip_ignoretopic' href='#'><span class='last'>Watch Replies</span></a></li>");
        $newButton.click(function (e) {
          objIgnoreReplies[intTopicID] = false;
          saveIgnoredReplies();
          addIgnoreRepliesButton();
        });
      }
      else {
        $newButton = $("<li class='button_strip_ignoretopic_li'><a class='button_strip_ignoretopic' href='#'><span class='last'>Ignore Replies</span></a></li>");
        $newButton.click(function (e) {
          objIgnoreReplies[intTopicID] = true;
          saveIgnoredReplies();
          addIgnoreRepliesButton();
        });
      }
      $buttonLists.append($newButton);
    }
  }
}

function displayReplies(aryReplies) {
  log("functiontrace", "Start Function");
  var intReps = aryReplies.length;
  $("li#button_rep ul").remove();
  var $menunav = $('ul#menu_nav');
  var strReplies = "Replies";
  var newMenu = false;
  var counter;
  if (intReps > 0) {
    strReplies += " [<b>" + intReps + "</b>]";
  }
  var $menuQ = $('li#button_rep');
  if ($menuQ.length === 0) {
    newMenu = true;
    $menuQ = $("<li id='button_rep'><a class='firstlevel' href='https://elliquiy.com/forums/index.php?action=unreadreplies'><span class='firstlevel'>" + strReplies + "</span></a></li>");
  }
  else {
    $menuQ.find('a.firstlevel span.firstlevel').html(strReplies);
  }
  var $menuQ_ul = $("<ul></ul>");
  for (counter = 0; counter < aryReplies.length; counter++) {
    var $toAppend = $("<li>" + aryReplies[counter] + "</li>");
    var strHTML = $toAppend.find("a").html();
    $toAppend.find("a").html("<span>" + strHTML + "</span>");
    $menuQ_ul.append($toAppend);
  }
  $menuQ.append($menuQ_ul);
  if (newMenu) {
    $menunav.append($menuQ);
  }
}

function url2new(strUrl) {
    var iPos = strUrl.lastIndexOf(".");
    return strUrl.substr(0,iPos+1) + "new#new";
}

function getUnreadReplies(callback) {
  log("functiontrace", "Start Function");
  var strURL = "https://elliquiy.com/forums/index.php?action=unreadreplies";
  var blDone = false;
  var intCount = 0;
  var aryReplies = [];
  var $thisa;
  var intTopicID = 0;
  $.get(strURL, function (data) {
    blDone = false;
    intCount = 0;
    objReplies = {};
    $(data).find('div#unreadreplies table tbody tr').each(function () {
      var strTopicID = $(this).find("a:eq(0)").attr("href").match(/\d+/)[0];
      intTopicID = parseInt(strTopicID, 10);
      objReplies[intTopicID] = true;
      if (objIgnoreReplies[intTopicID] === true) {}
      else {
        intCount++;
      }
    });
    if (callback) {
      callback();
    }
  });
  return intCount;
}
/* =========================== */

/* =========================== */
/* Removing images             */
/* =========================== */
function blankImg(objImg) {
  log("functiontrace", "Start Function");
  if (objImg.parent().hasClass("spoiler_body")) {
    var $head = objImg.parent().parent().find(".spoiler_header");
    var strText = $head.text();
    if ($head.text().containsCount("(contains picture") > 0) {
      $head.text(strText.replace("(contains picture)", "(contains pictures)"));
    }
    else {
      $head.text(strText + " (contains picture)");
    }
  }
  else {
    objImg.prop("width", objImg.width());
    objImg.prop("height", objImg.height());
    objImg.prop("src", "http://stisrv13.epfl.ch/img/white_pixel.jpg");
  }
}

function removeAllImages() {
  log("functiontrace", "Start Function");
  var counter;
  var aryToRemove = ['li.avatar img', 'div.postarea div.post img', 'div.signature img', 'div#recent .core_posts img', 'img.avatar'];
  for (counter = 0; counter < aryToRemove.length; counter++) {
    $(aryToRemove[counter]).each(function () {
      blankImg($(this));
    });
  }
}
/* =========================== */

/* =========================== */
/* Tick Engine                 */
/* =========================== */
function tick() {
  log("functiontrace", "Start Function");
  // If we are doing anything that requires ticks then we fire them roughly every second.
  var datNow = new Date();
  var intSpan = datNow.getTime() - datUnread.getTime();
  var intSpanSave = datNow.getTime() - datAutoSave.getTime();

  intTick += 1;
  log("tickfires", "Tick fired: " + intTick);

  if (blUserDepReady) {
    blUserDepReady = false;
    log("tickactions", "  Tick: User-dependent stuff");
    userDep();

    // Nested in here to provide a bit of a delay ;)
    if (!blJQueryStuff) {
      log("tickactions", "  Tick: injecting code into base page");
      blJQueryStuff = true;
    }
  }
}
/* =========================== */


/* =========================== */
/* User Details                */
/* =========================== */
function userLevel() {
  log("functiontrace", "Start Function");
  var intLevel = -1;
  if (user.position === undefined) {}
  else {
    switch (user.position.trim().toLowerCase()) {
      case "knight":
      case "dame":
      case "champion":
        intLevel = 5;
        break;
      case "god":
      case "goddess":
      case "genie":
      case "oracle":
        intLevel = 10;
        break;
      default:
        intLevel = 0;
        break;
    }
  }
  return intLevel;
}

function getUserDetails(callback) {
  log("functiontrace", "Start Function");
  log("userdetails", "Start Function");
  var strURL = "https://elliquiy.com/forums/index.php?action=profile";
  $.get(strURL, function (data) {
    var $basicInfo = $(data).find("div#basicinfo");
    var $detailedInfo = $(data).find("div#detailedinfo");
    user.name = $(data).find("div.username h4").clone().children().remove().end().text().trim();
    user.id = $detailedInfo.find("dd:eq(0)").text().trim();
    user.position = $basicInfo.find("span.position").text().trim();
    user.posts = $detailedInfo.find("dd:eq(1)").text().trim();
    user.title = $detailedInfo.find("dd:eq(2)").text().trim();
    user.personalText = $detailedInfo.find("dd:eq(3)").text().trim();
    user.referrals = $detailedInfo.find("dd:eq(4)").text().trim();
    user.gender = $detailedInfo.find("dd:eq(6)").text().trim();
    user.age = $detailedInfo.find("dd:eq(7)").text().trim();
    user.location = $detailedInfo.find("dd:eq(8)").text().trim();
    user.dateReg = $detailedInfo.find("dd:eq(9)").text().trim();
    user.dateLocal = $detailedInfo.find("dd:eq(10)").text().trim();
    user.dateLast = $detailedInfo.find("dd:eq(11)").text().trim();

    if (strScriptAdmins.indexOf(user.id) > -1) {
      user.level = 100;
      user.position = "Cabbit";
    }
    else {
      user.level = userLevel();
    }
    // Defer processing this to the tick engint to ensure that the menus get produced in the right order.
    blUserDepReady = true;
    //userDep();
    // Fire the tick engine here now.  we know we need it and we know that it can do everything at this stage.
    if (!blTickStarted) {
      blTickStarted = true;
      setInterval(function () {
        tick();
      }, 100);
    }
    //user.id = "persephone325";
    if (callback) {
      callback(user);
    }
  });
}

function userDep() {
  log("functiontrace", "Start Function");
  // Functions that are dependent on user details

  if (config.bookmarks.tags && page.type == "bookmarks") {
    reformatBMs();
  }

  if (config.general.debugInfo) {
    debugUserInfo();
  }
}
/* =========================== */


/* =========================== */
/* Bookmarks                   */
/* =========================== */
function rawBMs() {
  return JSON.stringify(BMTags);
}

function BMAllLinks() {
  // Show an 'all' link against each BM
  log("functiontrace", "Start Function");
  var intRow = 0;
  $("table tr").each(function () {
    intRow++;
    if (intRow > 1) {
      var $currLink = $(this).find("td:eq(1) a:eq(0)");
      var strTopicURL = $currLink.attr("href");
      $currLink.after(" [<a href='" + strTopicURL + ";all'>All</a>]");
    }
  });
}

function getBMsFromTable(bmType) {
  log("getBMsFromTable", "Start Function");
  var intRow = 0;

  //console.log("===== getBMsFromTable:" + bmType + "=====")
  var $tNew = $("table").clone();

  switch (bmType) {
    case "all":
      // Don't do any trimming
      break;
    case "unwatch":
      $tNew.find("tr").each(function () {
        intRow++;
        if (intRow > 1) {
          let strTopicURL = $(this).find("td:eq(2) a:eq(0)").attr("href");
          let strTopicID = strTopicURL.match(/\d+/)[0];
          let intTopicID = parseInt(strTopicID);
          if (objIgnoreReplies[intTopicID]) {
            $(this).remove();
          }
        }
      });
      break;
    case "replies":
      getUnreadReplies(function() {
        //console.log("=== Replies ===")
        //console.log(objReplies);
        $tNew.find("tr").each(function () {
          intRow++;
          if (intRow > 1) {
            var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
            var strTopicID = strTopicURL.match(/\d+/)[0];
            if (objReplies[strTopicID] === undefined || hasTag(strTopicID, "notreplied")) {
              $(this).remove();
            }
          }
        });
      });
      break;
      //          blBMTagsReplies
    case "owe":
      $tNew.find("tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];
          var strLastUser = $(this).find("td:eq(5) a:eq(1)").html();
          if (strLastUser == user.name || hasTag(strTopicID, "notowed")) {
            $(this).remove();
          }
        }
      });
      break;
    case "no-tags":
      $tNew.find("tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];
          var aryTags = BMTags[strTopicID];
          if (aryTags !== undefined) {
            if (aryTags.length > 0) {
              $(this).remove();
            }
          }
        }
      });
      break;
    default:
      $tNew.find("tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];

          if (!hasTag(strTopicID, bmType)) {
            $(this).remove();
          }
        }
      });
      break;
  }
  //console.log($tNew);
  //console.log("/===== getBMsFromTable 2 =====")
  $tNew.addClass("bmHideable");
  return $tNew;
}

function showTagBubbles() {
  $("thead tr").not(".catbg").each( function () {
    let $row = $(this);
    let strTopicURL = $row.find("td:eq(1) a:eq(0)").attr("href");
    let strTopicID = strTopicURL.match(/\d+/)[0];
    let strLastUser = $(this).find("td:eq(5) a:eq(1)").html();
    let topicID = parseInt(strTopicID);
    if (BMTags[topicID]) {
      let aryTags = BMTags[topicID].sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase());  });
      for (counter = 0; counter < aryTags.length; counter++) {
        console.log("TB 4");
        let strTag = aryTags[counter].trim();
        let $bubble = $("<div class='tagbubble fakelink' id='" + topicID + "-tagbubble-" + strTag + "'>" + strTag + "</div> ");
        $row.find("td:eq(1)").append($bubble);
        $bubble.click(function() {
          let $tableOpen = $("table#tblBM" + strTag.toLowerCase());
          $tableOpen.toggle();
        });
      }
    }
    if (config.bookmarks.owedTag) {
      if (strLastUser !== user.name && !hasTag(strTopicID, "notowed")) {
        let strTag = "Owe";
        let $bubble = $("<div class='tagbubbleAuto fakelink' id='" + topicID + "-tagbubble-owe'>Owed</div> ");
        $row.find("td:eq(1)").append($bubble);
        $bubble.click(function() {
          let $tableOpen = $("table#tblBMowe");
          $tableOpen.toggle();
        });
      }
    }
  });
  /*
  */
}

function showBMTable($t,title,id, allFirst) {
  if ($t.find("tr").length > 1) {
    $t.attr("id","tblBM" + id.toLowerCase() );
    $("#main_content_section form").append("<div class='cat_bar bmCatName' style='cursor: pointer;'><h3 class='catbg'>" + title + "</h3></div>")
    $("#main_content_section form").append($t);
    let $tog = $t.find('input:checkbox:first');

    // Make the toggle-all checkboxes work only on their own tables.
    $tog.attr("onclick","");
    $tog.click(function(){
      let checked = $(this).is(':checked');
      $(this).parents("table").find("input:checkbox").each(function() {
        $(this).prop('checked', checked);
      });
    });
  }
}

function reformatBMsCollapse() {
  // Lood up all of the possible BM tables
  let $tAll = getBMsFromTable("all");
  //let $tRep = getBMsFromTable("replies");
  let $tOwe = getBMsFromTable("owe");
  let $tNoTags = getBMsFromTable("no-tags");
  let $tTags = {};
  for (counter = 0; counter < aryBMTags.length; counter++) {
    let strTag = aryBMTags[counter];
    // console.log("=> Tag: " + strTag);
    $tTags[strTag] = getBMsFromTable(strTag);
  }

  // Remove the old 'all table' and title
  $("h3:first").parent().remove();
  $("table:first").remove();

  let aryOrder = config.bookmarks.collapseOrder.split(",");
  for (i = 0; i < aryOrder.length; i++) {
    switch (aryOrder[i].toLowerCase()) {
      case "all":
        showBMTable($tAll,"All Bookmarks","");
        break;
      case "autos":
        if (config.bookmarks.noTagsTag) {
          showBMTable($tNoTags,"<img src='" + GM_getResourceURL("iconTagAuto") + "' style='height:20px; top: 4px;position: relative;'> No Tags","no-tags");
        }
        if (config.bookmarks.owedTag) {
          showBMTable($tOwe,"<img src='" + GM_getResourceURL("iconTagAuto") + "' style='height:20px; top: 4px;position: relative;'> Post Owed","owe");
        }
        /*
        if (config.bookmarks.repliesTag) {
          showBMTable($tRep,"Auto: Replies","replies");
        }
        */
        break;
      case "tags":
        for (counter = 0; counter < aryBMTags.length; counter++) {
          let strTag = aryBMTags[counter];
          showBMTable($tTags[strTag],"<img src='" + GM_getResourceURL("iconTag") + "' style='height:20px; top: 4px;position: relative;'> " + strTag,strTag);
        }
        break;
    }
  }


  $(".bmHideable").hide();
  if (config.bookmarks.collapseOpen) {
    setTimeout(function() {
      let tags = page.url.tag.split(",");
      tags.forEach(function(tag) {
        //console.log("Showing: #tblBM" + tag.trim());
        $("#tblBM" + tag.trim()).show();
      });
    },100);
  }

  $(".bmCatName").click(function() {
    if (config.bookmarks.collapseToggle) {
      $(this).next().toggle();
    } else {
      $(".bmHideable").hide();
      $(this).next().show();
    }
    let tags = [];
    $(".bmHideable:visible").each(function(){
      let tag = $(this).prop("id").replace("tblBM","");
      tags.push(tag);
    });
    let $form = $(this).parents("form:first");
    let url = $form.prop("action").split("&")[0];
    url = url + "&tag=" + tags.toString();
    $form.prop("action",url);
  });

  $("table tr").each(function () {
      $(this).find("td:eq(0) img").click(function (e) {
        var strTopicURL = $(this).parent().parent().find("td:eq(1) a:eq(0)").attr("href");
        var strTopicID = strTopicURL.match(/\d+/)[0];
        frmBMs(strTopicID, "");
      }).addClass('pointer');
  });

  showTagBubbles();
}

function reformatBMs() {
  if (config.bookmarks.collapse) {
    reformatBMsCollapse();
    return;
  }

  log("functiontrace", "Start Function");
  var intRow = 0;

  switch (page.url.tag) {
    case "":
      break;
    case "replies":
      $("table tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];
          if (objReplies[strTopicID] === undefined || hasTag(strTopicID, "notreplied")) {
            $(this).remove();
          }
        }
      });
      break;
      //          blBMTagsReplies
    case "owe":
      $("table tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];
          var strLastUser = $(this).find("td:eq(5) a:eq(1)").html();
          if (strLastUser == user.name || hasTag(strTopicID, "notowed")) {
            $(this).remove();
          }
        }
      });
      break;
    case "no-tags":
      $("table tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];
          var aryTags = BMTags[strTopicID];
          if (aryTags !== undefined) {
            if (aryTags.length > 0) {
              $(this).remove();
            }
          }
        }
      });
      break;
    default:
      $("table tr").each(function () {
        intRow++;
        if (intRow > 1) {
          var strTopicURL = $(this).find("td:eq(1) a:eq(0)").attr("href");
          var strTopicID = strTopicURL.match(/\d+/)[0];

          if (!hasTag(strTopicID, page.url.tag)) {
            $(this).remove();
          }
        }
      });
      break;
  }
  intRow = 0;
  $("table tr").each(function () {
    intRow++;
    if (intRow > 1) {
      $(this).find("td:eq(0) img").click(function (e) {
        var strTopicURL = $(this).parent().parent().find("td:eq(1) a:eq(0)").attr("href");
        var strTopicID = strTopicURL.match(/\d+/)[0];
        frmBMs(strTopicID, "");
      }).addClass('pointer');
    }
  });
}

function hasTag(strID, strTag) {
  log("functiontrace", "Start Function");
  var blHas = false;
  var aryTags = BMTags[strID];
  var counter;
  if (aryTags === undefined) {}
  else {
    for (counter = 0; counter < aryTags.length; counter++) {
      var strTag2 = aryTags[counter].trim();
      if (strTag2.toLowerCase() == strTag.toLowerCase()) {
        blHas = true;
      }
    }
  }
  return blHas;
}

function displayBMMenu() {
  log("functiontrace", "Start Function");
  var counter;
  var strBase = "https://elliquiy.com/forums/index.php?action=bookmarks";
  $("#bm_menu").remove();

  let $menunav = $('li.button_bookmarks');
  let $menuQOuter = $("<div id='bm_menu' class='top_menu' style='display: hidden; min-width: auto;'><div class='profile_user_links'><ol style='column-count: 1'></ol></div>");
  let $menuQ = $menuQOuter.find("ol");

  $menuQ.append("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a href='" + strBase + "&tag=' id='bm-all' style='display: inline; padding-left: 0px;'><span>All</span></a></li>")
  if (config.bookmarks.owedTag) {
    $menuQ.append("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a href='" + strBase + "&tag=owe' id='bm-owe' style='display: inline; padding-left: 0px;'><span>Posts Owed</span></a></li>")
  }
  if (config.bookmarks.repliesTag) {
    $menuQ.append("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a href='" + strBase + "&tag=replies' id='bm-replies' style='display: inline; padding-left: 0px;'><span>Replies</span></a></li>")
  }
  if (config.bookmarks.noTagsTag) {
    $menuQ.append("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a href='" + strBase + "&tag=no-tags' id='bm-no-tags' style='display: inline; padding-left: 0px;'><span>No Tags</span></a></li>")
  }
  for (counter = 0; counter < aryBMTags.length; counter++) {
    var strTag = aryBMTags[counter];
    $menuQ.append("<li style='padding-left: 24px; width: auto;'><span class='main_icons drafts'></span> <a href='" + strBase + "&tag=" + strTag + "' id='bm-" + strTag + "' style='display: inline; padding-left: 0px;'><span>" + strTag + "</span></a></li>")
  }
  $menunav.append($menuQOuter);
  $menunav.find("a:eq(0)").click(function(e){
    e.preventDefault();
      let $tog = $menuQOuter
      if ($tog.is(":hidden")) {
        $("#mobile_user_menu .top_menu").hide();
      }
      $tog.toggle();

//    $menuQOuter.toggle();
  });
  $menunav.find("a:eq(0) .textmenu").html("Bookmarks");
}

function reCaseBMTag(strTag) {
  log("functiontrace", "Start Function");
  var counter;
  var strTagLower = ("" + strTag).trim().toLowerCase();
  var intLoc = $.inArray(strTagLower, aryBMTagsLower);

  if (intLoc == -1) {
    return strTag;
  }
  else {
    return aryBMTags[intLoc];
  }
}

function reCaseBMTags(aryTags) {
  log("functiontrace", "Start Function");
  for (var counter = 0; counter < aryTags.length; counter++) {
    var strTag = aryTags[counter];
    aryTags[counter] = reCaseBMTag(strTag);
  }
  return aryTags;
}

function setBMTag(strID, strTags) {
  log("functiontrace", "Start Function");
  if (("" + strTags).trim() === "") {
    delete BMTags[strID];
  }
  else {
    var aryTags = ("" + strTags).split(",");
    BMTags[strID] = reCaseBMTags(aryTags);
  }
  saveBMTags();
}

function loadBMTags() {
  log("functiontrace", "Start Function");
  var counter;
  var strBMTags = GM_getValue("BMTags", "");
  var strTag;
  var aryTags;
  aryBMTags = [];
  aryBMTagsLower = [];
  if (strBMTags !== "") {
    BMTags = JSON.parse(strBMTags);
  }
  for (var key in BMTags) {
    aryTags = BMTags[key];
    for (counter = 0; counter < aryTags.length; counter++) {
      strTag = aryTags[counter];
      if ($.inArray(strTag, aryBMTags) > -1) {}
      else {
        // Ignore blank tags... where did they come from?  Who know's but ignore them
        if (strTag.trim().length > 0) {
          aryBMTags.push(strTag.trim());
        }
      }
    }
  }
  aryBMTags.sort();
  for (counter = 0; counter < aryBMTags.length; counter++) {
    strTag = aryBMTags[counter];
    aryBMTagsLower.push(strTag.trim().toLowerCase());
  }
  if (config.bookmarks.owedTag) {
    if ($.inArray("notowed", aryBMTagsLower) == -1) {
      aryBMTagsLower.push("notowed");
      aryBMTags.push("NotOwed");
    }
  }
  if (config.bookmarks.repliesTag) {
    if ($.inArray("notreplied", aryBMTagsLower) == -1) {
      aryBMTagsLower.push("notreplied");
      aryBMTags.push("NotReplied");
    }
  }
}

function saveBMTags() {
  log("functiontrace", "Start Function");
  GM_setValue("BMTags", JSON.stringify(BMTags));
}

function frmBMTagsBody() {
  log("functiontrace", "Start Function");
  var counter;
  var strBody = "";
  strBody += "<p>You can use this form as a shortcut to delete tags completely:</p>";
  for (counter = 0; counter < aryBMTags.length; counter++) {
    var strTag = aryBMTags[counter];
    strBody += "<span class='BMTagClick pointer' style='display: block; margin-bottom: 5px; margin-left: 10px;'>" + aryBMTags[counter] + "</span>";
  }
  return strBody;
}

function deleteTag(strTag) {
  log("functiontrace", "Start Function");
  var key;
  var counter;
  for (key in BMTags) {
    var aryTags = BMTags[key];
    for (counter = 0; counter < aryTags.length; counter++) {
      if (aryTags[counter].toLowerCase().trim() == strTag.toLowerCase().trim()) {
        aryTags.remove(counter, counter);
      }
    }
    BMTags[key] = aryTags;
  }
}

function frmBMTagsActivate() {
  $('#modalpop span.BMTagClick').click(function (e) {
    var strVal = $(this).text();
    if (confirm("Delete '" + strVal + "' tag?")) {
      deleteTag(strVal);
      saveBMTags();
      loadBMTags();
      let strBody = frmBMTagsBody();
      $("#modalpop").html(strBody);
      frmBMTagsActivate();
    }
  });
}

function frmBMTags() {
  log("functiontrace", "Start Function");
  var strBody = frmBMTagsBody();
  throwModal("Tags", strBody);
  frmBMTagsActivate();
}

function frmBMsBody(strID) {
  log("functiontrace", "Start Function");
  var counter;
  var strBody = "";
  var strTags = "";
  var strTag;
  strTags = BMTags[strID];
  if (strTags === undefined) {
    strTags = "";
  }
  else {
    strTags = "" + strTags;
    strTags = strTags.replace(/ /g, "");
    strTags = strTags.replace(/,/g, "\r\n");
  }
  strBody += "<p>Please enter your tags (one per line) below.  Use spaces, quotes, apostrophes etc at your peril.  Doing so might anger the script bunneh.  Beware the script bunneh!</p>";
  strBody += "<table>";
  strBody += "<tbody><tr>";
  strBody += "<td style='vertical-align: top'><textarea cols='20' rows='5' id='BMTagsEdit'>" + strTags + "</textarea></td>";
  strBody += "<td style='vertical-align: top; padding-right: 15px; padding-left: 15px;'>";
  for (counter = 0; counter < aryBMTags.length && counter < 6; counter++) {
    strTag = aryBMTags[counter];
    strBody += "<span class='BMTagClick pointer' style='display: block; margin-bottom: 2px;'>" + aryBMTags[counter] + "</span>";
  }
  strBody += "</td>";
  strBody += "<td style='vertical-align: top; padding-right: 15px;'>";
  for (counter = 6; counter < aryBMTags.length && counter < 12; counter++) {
    strTag = aryBMTags[counter];
    strBody += "<span class='BMTagClick pointer' style='display: block; margin-bottom: 2px;'>" + aryBMTags[counter] + "</span>";
  }
  strBody += "</td>";
  strBody += "<td style='vertical-align: top'>";
  for (counter = 12; counter < aryBMTags.length; counter++) {
    strTag = aryBMTags[counter];
    strBody += "<span class='BMTagClick pointer' style='display: block; margin-bottom: 2px;'>" + aryBMTags[counter] + "</span>";
  }
  strBody += "</td>";
  strBody += "</tr>";
  strBody += "</tbody>";
  strBody += "</table>";
  strBody += "<div style='margin-top:5px;'><button type='button' id='snipEdit_update_" + counter + "' class='snipEdit_updatebutton' value='Update'>Update</button></div> ";
  return strBody;
}

function frmBMs(strID, strBookMarkURL) {
  log("functiontrace", "Start Function");
  var strBody = frmBMsBody(strID);

  throwModal("Tags", strBody);
  $('#modalpop button.snipEdit_updatebutton').click(function (e) {
    var strTags = "" + $('#BMTagsEdit').val();
    if (strTags.trim() === "") {
      strTags = "";
    }
    else {
      strTags = strTags.replace(/ /g, "-");
      strTags = strTags.replace(/\r\n/g, ",");
      strTags = strTags.replace(/\n/g, ",");
      strTags = strTags.replace(/\r/g, ",");
    }
    setBMTag(strID, strTags);
    loadBMTags();
    displayBMMenu();
    if (strBookMarkURL === "") {
      $('#modalpop').dialog("close");
    }
    else {
      window.location = strBookMarkURL;
    }
  });
  $('#modalpop span.BMTagClick').click(function (e) {
    var strVal = "" + $('#BMTagsEdit').val();
    if (strVal.trim() === "" || strVal.substr(strVal.length - 1) == "\r" || strVal.substr(strVal.length - 1) == "\n") {
      // No need to add a new line
    }
    else {
      strVal += "\r\n";
    }
    strVal += $(this).text();
    $('#BMTagsEdit').val(strVal);
  });
}

function tagOnBM() {
  log("functiontrace", "Start Function");
  $('a.button_strip_bookmark_add').click(function (e) {
    var strURL = $(this).attr("href");
    var strID = strURL.match(/\d+/)[0];
    e.preventDefault();
    frmBMs(strID, strURL);
  });
}
/* =========================== */

/* =========================== */
/* Page details                */
/* =========================== */
function getPageDetails() {
  log("functiontrace", "Start Function");
  page.url = {};
  page.url.full = window.location.href;
  page.url.page = window.location.pathname.split('/')[2].replace(".php", "").toLowerCase();
  page.url.query = window.location.search;
  page.url.hash = window.location.hash;
  page.scroll = -1;
  page.type = "other";
  if (page.url.full.toLowerCase().indexOf("action=unreadreplies") > 0) {
    page.type = "replies";
  }
  if (page.url.full.toLowerCase().indexOf("action=bookmarks") > 0) {
    page.type = "bookmarks";
  }
  else if (page.url.full.toLowerCase().indexOf("action=post") > 0) {
    page.type = "post";
  }
  else if (page.url.full.toLowerCase().indexOf("action=profile") > 0) {
    page.type = "profile";
  }
  else if (page.url.full.toLowerCase().indexOf("action=sortsnippets") > 0) {
    page.type = "sortsnippets";
  }
  else if (page.url.full.toLowerCase().indexOf("action=sortqlcats") > 0) {
    page.type = "sortqlcats";
  }
  else if (page.url.full.toLowerCase().indexOf("action=sortqls") > 0) {
    page.type = "sortqls";
  }
  else if (page.url.full.toLowerCase().indexOf("action=scriptsettings") > 0) {
    page.type = "scriptsettings";
  }
  else if (page.url.full.toLowerCase().indexOf("action=help") > 0) {
    switch (page.url.hash.toLowerCase()) {
      case  "#scriptsettings":
        page.type = "scriptsettings";
        break;
      case "#sortsnippets":
        page.type = "sortsnippets";
        break;
      default:
        page.type = "help";
    }
/*
    if (page.url.hash.toLowerCase() == "#scriptsettings") {
      page.type = "scriptsettings";
    } else {
      page.type = "help";
    }
*/
  }
  else if (page.url.full.toLowerCase().indexOf("?topic=") > 0) {
    page.type = "topic";
    page.url.topic = page.url.full.substr(page.url.full.toLowerCase().indexOf("?topic=")+7).split("&")[0];
  }
  else if (page.url.full.toLowerCase().indexOf("?board=") > 0) {
    page.type = "board";
  }
  else if (page.url.full.toLowerCase().indexOf("?action=unread") > 0) {
    page.type = "unread";
  }
  else if (page.url.full.toLowerCase().indexOf("?action=pm;sa=send") > 0) {
    page.type = "pm-send";
  }
  else if (page.url.full.toLowerCase().indexOf("?action=pm") > 0) {
    page.type = "pm";
  }
  else if (page.url.full.toLowerCase().indexOf("?action=mlist;sa=search") > 0) {
    page.type = "member-search";
  }
  if (page.url.full.toLowerCase().indexOf("&tag=") > 0) {
    page.url.tag = page.url.full.substr(page.url.full.toLowerCase().lastIndexOf("&tag=") + 5).toLowerCase();
  }
  else {
    page.url.tag = "";
  }
  //console.log("Page:");
  //console.log(page);
}
/* =========================== */

/* =========================== */
/* CSS Fixes                   */
/* =========================== */
function applyCSS() {
  log("functiontrace", "Start Function");
  GM_addStyle(strCSSPointer);
  GM_addStyle(strCSSFT);
  GM_addStyle(strCSSFakeLinks);
  GM_addStyle(strCSSTblSorter);
  GM_addStyle(strCSSTagBubble);
  GM_addStyle(strCSSBodyFont);
}
/* =========================== */

/* =========================== */
/* Wordcount                   */
/* =========================== */
function setWordCount() {
  log("functiontrace", "Start Function");
  let objWC = {}
  switch (page.type) {
    case "post":
      $('#recent div.windowbg').each(function () {
        var $wcLoc = $(this).find('span.smalltext');
        var strText = $(this).find('div.list_posts').text();
        objWC = lexDiv(strText);
        let strLexDiv = "";
        if (config.general.lexDiv) {
          if (objWC.diversityFixed > 0) {
            strLexDiv = ", LexDiv: " + objWC.diversityFixed;
          }
        }

        $wcLoc.append(" <span class='wordcountExt' style='float: right; margin-right: 10px;'>(<span class='wordcountInt'>Word count: " + objWC.wordCount + strLexDiv + "</span>)</span>");
      });
      $("#post_confirm_buttons span.smalltext").after("<div id='wordcountPost' style='margin-right: 10px;'>Wordcount: <span id='wordcountPostCount'>0</span><div class='lexDivOuter' style='display: none;'>, LexDiv: <span id='wordcountPostCountLD'>0</span></div></div>");
      let $wys =  $("iframe").contents().find("body");
      let dbFun = $.debounce(1000, function(e) {
          objWC = lexDiv($("textarea").val());
          $("span#wordcountPostCount").text(objWC.wordCount);
          if (config.general.lexDiv) {
            if (objWC.diversityFixed > 0) {
              $("span#wordcountPostCountLD").text(objWC.diversityFixed);
              $("div.lexDivOuter").css("display","inline");
            }
          }
        });
      let dbFunWys = $.debounce(1000, function(e) {
        //console.log($wys.html().replace(/(<([^>]+)>)/gi, " "));
          objWC = lexDiv($wys.html().replace(/(<([^>]+)>)/gi, " "));
          $("span#wordcountPostCount").text(objWC.wordCount);
          if (config.general.lexDiv) {
            if (objWC.diversityFixed > 0) {
              $("span#wordcountPostCountLD").text(objWC.diversityFixed);
              $("div.lexDivOuter").css("display","inline");
            }
          }
        });
      $wys.keypress(dbFunWys);
      $("textarea").keypress(dbFun);
      break;
    case "topic":
      $('div.postarea').each(function () {
        var $wcLoc = $(this).find('div.keyinfo');
        var strText = $(this).find('div.post').text();
        objWC = lexDiv(strText);
        let strLexDiv = "";
        if (config.general.lexDiv) {
          if (objWC.diversityFixed > 0) {
            strLexDiv = ", LexDiv: " + objWC.diversityFixed;
          }
        }
        $wcLoc.find("div.postinfo").append(" <span class='wordcountExt' style='margin-right: 10px; margin-top: 3px;'>(<span class='wordcountInt'>Word count: "+ objWC.wordCount + strLexDiv + "</span>)</span>");
      });
      break;
    default:
      break;
  }
}
/* =========================== */

/* =========================== */
/* Menu Manipulation           */
/* =========================== */
function tidyMenus() {
  log("functiontrace", "Start Function");
  // Add menu options to "Home"
  var $home = $("li#button_home");
  var $home_ul = $("<ul style='background-color: white;'></ul>");
  $home_ul.append("<li><a href='https://elliquiy.com/forums/index.php?action=help'><span>Help</span></a></li>");
  $home_ul.append("<li><a href='https://elliquiy.com/forums/index.php?action=search'><span>Search</span></a></li>");
  $home_ul.append("<li><a href='https://elliquiy.com/forums/index.php?action=calendar'><span>Calendar</span></a></li>");
  $home_ul.append("<li id='gm_button_logout'><a href='" + $('li#button_logout a').attr('href') + "'><span>Logout</span></a></li>");
  $home.append($home_ul);
  // Remove menu options that have been moved.
  $('li#button_help').remove();
  $('li#button_search').remove();
  $('li#button_calendar').remove();
  $('li#button_logout').remove();
  // Rename menus to shoten a little.
  $('li#button_pm span.firstlevel').text('PMs');
  $('li#button_bookmarks span.firstlevel').text('BMs');
}
/* =========================== */

/* =========================== */
/* New Version Information     */
/* =========================== */
function createNewVer() {
  log("functiontrace", "Start Function");
  $("div.navigate_section").after("<div style='padding: 10px; background-color: cornsilk; margin-left: auto; margin-right: auto; width: 90%; margin-bottom: 10px; color: black;' id='newVer'><p style='font-size: 120%; font-weight: bold;'>Elliquiy Improver Script - New Version</p></div>");
}

function newVerInfo() {
  log("functiontrace", "Start Function");
  loadLastVer();
  if (lastVer !== GM_info.script.version) {
    createNewVer();
    var $displayAt = $("div#newVer");
    var strVerInfo = "";
    strVerInfo += "<p>A new version has been downloaded and installed (v" + GM_info.script.version + ")</p>";
	if (verDelDraft.includes(GM_info.script.version)) {
		strVerInfo += "<p style='color:red;'>There have been changes to the way that drafts work.  I recommend selecting the 'Clear Drafts' option from the settings menu.</p>";
	}
    strVerInfo += "<p>For full details of changes, see <a href='" + urlScriptThread + "'>This Thread</a></p>";
    strVerInfo += "<p>To make this notification go away, <span class='fakelink' id='saveVersion'>Click Here</span></p>";
    var $verInfo = $(strVerInfo);
    $verInfo.find("#saveVersion").click(function (e) {
      saveLastVer();
      $('div#newVer').hide();
    });
    $displayAt.append($verInfo);
  }
}

function loadLastVer() {
  log("functiontrace", "Start Function");
  lastVer = GM_getValue("lastVer", "");
}

function saveLastVer() {
  log("functiontrace", "Start Function");
  GM_setValue("lastVer", GM_info.script.version);
}
/* =========================== */

/* =========================== */
/* Debug Information           */
/* =========================== */
function createDebug() {
  log("functiontrace", "Start Function");
  $("body").append("<div style='padding: 10px; background-color: yellow; margin-left: auto; margin-right: auto; width: 90%;' id='debug'><p style='font-size: 120%; font-weight: bold;'>Debug Info</p><ul></ul></div>");
}

function debugUserInfo() {
  log("functiontrace", "Start Function");
  var $displayAt = $("div#debug ul");
  var $userInfo = $("<li><b>User Info:</b> <ul></ul></li>");
  var $userInfo_ul = $userInfo.find("ul");
  var $snippets = $("<li><b>Snippets:</b> <ul><li><textbox width='100' height='3'>" + rawBMs() + "</textbox></li></ul></li>");
  var $snippets_ul = $snippets.find("ul");
  var $bms = $("<li><b>Bookmarks:</b> <ul><li><textbox width='100' height='3'>" + rawSnippets() + "</textbox></li></ul></li>");
  var $qls = $("<li><b>Quick Links:</b> <ul><li><textbox width='100' height='3'>" + JSON.stringify(quickLinks) + "</textbox></li></ul></li>");
  $userInfo_ul.append("<li><b>ID:</b> " + user.id + "</li>");
  $userInfo_ul.append("<li><b>UserName:</b> " + user.name + "</li>");
  $userInfo_ul.append("<li><b>Position:</b> " + user.position + "</li>");
  $userInfo_ul.append("<li><b>Level:</b> " + user.level + "</li>");
  $displayAt.append($userInfo);
  $displayAt.append($snippets);
  $displayAt.append($bms);
  $displayAt.append($qls);
}
/* =========================== */

/* =========================== */
/* Import/Export               */
/* =========================== */
function getSettingsForExport(excludeDrafts) {
  log("functiontrace", "Start Function");
  excludeDrafts = true;
  var strVals = "";
  var objExport = {};
  var lstValues = GM_listValues();
  var val;
  for (var counter = 0; counter < lstValues.length; counter++) {
    val = lstValues[counter];
    if (excludeDrafts && (val == "drafts" || val == "draftHistory")) {}
    else {
      if (val !== undefined) {
        objExport[val] = GM_getValue(val);
      }
    }
  }
  strVals = JSON.stringify(objExport);
  return strVals;
}

function exportValues() {
  log("functiontrace", "Start Function");
  var counter;
  var strVals = "";
  var strBody = "";
  strVals = getSettingsForExport();
  strBody = "<p>The settings should have been copied to the clipboard but just in case they haven't, they are presented below:</p><textarea rows='15' cols='60'>" + strVals + "</textarea>";
  GM_setClipboard(strVals);
  throwModal("Export Settings", strBody);
}

function frmImport() {
  log("functiontrace", "Start Function");
  var strBody = "";
  var aryPairs = [];
  var aryPair = [];
  var strVal = "";
  var objImport = {};
  strBody += "<p>Copy the settings into the box below:</p><textarea rows='15' cols='60' id='import_settings'></textarea><br /><button id='import_button' type='button' value='import'>Import</button>";
  strBody += "<p style='color: red; font-weight: bold'>Warning: this can mess up your settings and prevent the script from running... use at your own risk</p>";
  throwModal("Import Settings", strBody);

  $('#modalpop #import_button').click(function (e) {
    e.preventDefault();
    strVal = $('#modalpop #import_settings').val();
    objImport = JSON.parse(strVal);
    for (var key in objImport) {
      GM_setValue(key, objImport[key]);
    }
    window.location.reload(true);
  });
}
/* =========================== */

/* =========================== */
/* Name annotation             */
/* =========================== */
function addNameNote(strName, strNote) {
  log("functiontrace", "Start Function");
  if (strNote.trim() === "") {
    delete nameNotes[strName];
  }
  else {
    var nameNote = {};
    nameNote.id = strName;
    nameNote.note = strNote;
    nameNotes[strName] = nameNote;
  }
}

function renderHTML(strPlain) {
  log("functiontrace", "Start Function");
  var strOut = strPlain;
  strOut = strOut.replace(/\'/g, "&#39;");
  strOut = strOut.replace(/\n/g, "<br />");
  return strOut;
}

function annotateNames() {
  log("functiontrace", "Start Function");
  var nameNote;
  var strName;
  var $name;

  // console.log("== annotateNames ==");
  // addNameNote("Nowherewoman","Storium: Ev");
  switch (page.type) {
    case "topic":
    case "pm":
      $("div.poster h4").each(function () {
        if (page.type=="pm") {
          $name = $(this).find("a:eq(0)");
        } else {
          $name = $(this).find("a:eq(1)");
        }
        strName = $name.text();
        if (nameNotes[strName] !== undefined) {
          switch (config.userNotes.style.toLowerCase()) {
            case "hover over name":
              $name.tooltip({
                content: renderHTML(nameNotes[strName].note)
              });
              $name.css("color", "green");
              break;
            case "above avatar":
              $(this).parent().find("li.avatar").before("<li class='charnotes' style='border: thin solid green; padding: 5px;'>" + renderHTML(nameNotes[strName].note) + "</li>");
              break;
            default:
              break;
          }
        }
      });
      break;
    case "profile":
      var $basicInfo = $("div#basicinfo");
      var $detailedInfo = $("div#detailedinfo");
      var strUserBlock = $basicInfo.find("div.username h4").html();
      var $basicInfo = $("div#basicinfo");
      var $detailedInfo = $("div#detailedinfo");
      var strUserBlock = $basicInfo.find("div.username h4").html();
      if (strUserBlock) {
        var userBlockEnd = strUserBlock.indexOf("<");
        var strUserID = "";
        if (userBlockEnd == -1) {
          strUserID = $basicInfo.find("div.username h4").text().trim();
        } else {
          strUserID = $basicInfo.find("div.username h4").html().substr(0,userBlockEnd).trim();
        }
        var $nameNotes = $("<div class='nameNotes'></div>");
        var strNote = "";
        if (nameNotes[strUserID] !== undefined) {
          strNote = nameNotes[strUserID].note;
        }
        $nameNotes.append("<p style='font-weight: bold;'>Notes for this user:</p>");
        $nameNotes.append("<textarea id='nameNotesText' cols='60' rows='5'>" + strNote + "</textArea>");
        $nameNotes.append("<br />");
        $nameNotes.append("<button type='button' value='Update Notes' id='btnNameNotes'>Update Notes</button>");
        $nameNotes.append("<p id='nameNotesMsg' style='display: none;'></p>");
        $("div#detailedinfo dl:last").after($nameNotes);
        $('button#btnNameNotes').click(function (e) {
          e.preventDefault();
          addNameNote(strUserID, $('textarea#nameNotesText').val());
          $('p#nameNotesMsg').text("Notes saved at " + (new Date()).toLocaleString()).show();
          saveNameNotes();
        });
      }
      break;
    default:
      break;
  }
}

function loadNameNotes() {
  log("functiontrace", "Start Function");
  var strSnippets = GM_getValue("nameNotes", "");
  if (strSnippets !== "") {
    nameNotes = JSON.parse(strSnippets);
  }
}

function saveNameNotes() {
  log("functiontrace", "Start Function");
  GM_setValue("nameNotes", JSON.stringify(nameNotes));
}
/* =========================== */

/* =========================== */
/* Set up buttons to make AJAX calls rather than page refreshes */
/* =========================== */
function ajaxButtons_Notify() {
  log("functiontrace", "Start Function");
  $("a.button_strip_notify").each(function () {
    var $notify = $(this);
    if ($notify) {
      // remove existing behaviour
      $notify.prop('onclick', null).off('click');
      // add new click behaviour
      $notify.click(function (e) {
        var blOn = false;
        var $notify = $(this);
        var url = $notify.prop("href");
        url = url.replace("https://elliquiy.com/forums/", "");
        blOn = ($(this).text().trim().toLowerCase() == "notify");
        stopDefaultAction(e);
        $.ajax({
          url: url
        }).done(function (data) {
          if (blOn) {
            $notify.html("<span>Unnotify</span>");
            url = $notify.prop("href").replace("sa=on", "sa=off");
            $notify.prop("href", url);
          }
          else {
            $notify.html("<span>Notify</span>");
            url = $notify.prop("href").replace("sa=off", "sa=on");
            $notify.prop("href", url);
          }
        }).fail(function (data) {
          alert("Something went wrong... er... try again?");
        });
      });
    }
  });
}

function ajaxButtons() {
  log("functiontrace", "ajaxButtons");
  ajaxButtons_Notify();
}
/* =========================== */

/* =========================== */
/* Speech Styling              */
/* =========================== */
function StyleSpeechElement($el) {
  log("functiontrace", "Start Function");
  var blInTag = false;
  var blInSpeech = false;
  var htmlOut;
  var incQuote = "";
  var excQuote = "";
  if (config.speechStyling.incQuote) {
    incQuote = '"';
  }
  else {
    excQuote = '"';
  }
  var $post = $el;
  var html = $post.html();
  htmlOut = "";
  for (var i = 0; i < html.length; i++) {
    switch (html.charAt(i)) {
      case "“":
      case "”":
      case '"':
      case '"':
      case '"':
        if (blInTag) {
          htmlOut += '"';
        }
        else {
          if (blInSpeech) {
            htmlOut += incQuote + '</span>' + excQuote;
          }
          else {
            htmlOut += excQuote + '<span style=\'' + config.speechStyling.CSS.replaceAll("'", '"') + '\'>' + incQuote;
          }
          blInSpeech = !blInSpeech;
        }
        break;
      case "<":
        blInTag = true;
        if ((i+3)<html.length) {
          if (blInSpeech && html.charAt(i+1) == "/" && html.charAt(i+2) == "p") {
            htmlOut += "</span>";
            blInSpeech = false;
          }
          if (blInSpeech && html.charAt(i+1) == "b" && html.charAt(i+2) == "r"  && html.charAt(i+3) == ">") {
            htmlOut += "</span>";
            blInSpeech = false;
          }
        }
        htmlOut += "<";
        break;
      case ">":
        blInTag = false;
        htmlOut += ">";
        break;
      default:
        htmlOut += html.charAt(i);
        break;
    }
  }
  $post.html(htmlOut);
}

function StyleSpeech() {
  log("functiontrace", "Start Function");
  $('div.post,div.list_posts').each(function () {
    StyleSpeechElement($(this));
  });
}
/* =========================== */

/* =========================== */
/* To/BBC List stuff           */
/* =========================== */
function insertUser_To(userName, userID) {
  log("functiontrace", "Start Function");
  var strTemplate = '<div id="suggest_to_suggest_%userID%"><input name="recipient_to[]" value="%userID%" type="hidden">%userName%&nbsp;<img src="https://elliquiy.com/forums/Themes/elliquiy2/images/pm_recipient_delete.gif" alt="Delete Item" title="Delete Item" onclick="return oPersonalMessageSend.oToAutoSuggest.deleteAddedItem(%userID%);"></div>';
  strTemplate = strTemplate.replaceAll("%userID%", userID);
  strTemplate = strTemplate.replaceAll("%userName%", userName);
  $("div#to_item_list_container").append(strTemplate);
}

function insertUser_BCC(userName, userID) {
  log("functiontrace", "Start Function");
  var strTemplate = '<div id="suggest_bcc_suggest_%userID%"><input name="recipient_bcc[]" value="%userID%" type="hidden">%userName%&nbsp;<img src="https://elliquiy.com/forums/Themes/elliquiy2/images/pm_recipient_delete.gif" alt="Delete Item" title="Delete Item" onclick="return oPersonalMessageSend.oBccAutoSuggest.deleteAddedItem(%userID%);"></div>';
  strTemplate = strTemplate.replaceAll("%userID%", userID);
  strTemplate = strTemplate.replaceAll("%userName%", userName);
  $("div#bcc_item_list_container").append(strTemplate);
}

function insertUsers(userList, toType) {
  log("functiontrace", "Start Function");
  switch (toType.trim().toLowerCase()) {
    case "t":
    case "to":
      for (var i in userList) {
        var usr = userList[i];
        insertUser_To(usr.name, usr.id);
      }
      break;
    case "b":
    case "bcc":
      for (var i2 in userList) {
        var usr2 = userList[i2];
        insertUser_BCC(usr2.name, usr2.id);
      }
      break;
    default:
      console.log("toType not recognized: " + toType.trim().toLowerCase());
      break;
  }
}

function getMemberSearch(auth, strSearch) {
  log("functiontrace", "Start Function");
  var strUrl = auth.memberSearchURL;
  var searchString = strSearch.trim().toLowerCase();
  var objReturn = {
    status: "fail"
  };
  strUrl = strUrl.replace("%search%", searchString);

  $.ajax({
    url: strUrl,
    success: function (response) {
      var $src = $(response);
      $src.find("item").each(function (index) {
        var $this = $(this);
        if ($this.text().trim().toLowerCase() == searchString) {
          var strID = $this.attr("id");
          objReturn.id = strID;
          objReturn.name = $this.text().trim();
          objReturn.status = "ok";
        }
      });
    },
    failure: function (response) {
      console.log("Member search fail");
      console.log(response);
      canReturn = true;
    },
    async: false
  });
  return objReturn;
}

function getSessionAuth() {
  log("functiontrace", "Start Function");
  var auth = {};

  auth.sId = unsafeWindow.smf_member_id; //aryHref2[1];
  auth.sVar = unsafeWindow.smf_session_id; //aryHref2[0];
  auth.memberSearchURL = "/forums/index.php?action=suggest;suggest_type=member;search=%search%;" + auth.sVar + "=" + auth.sId + ";xml;";
  return auth;
}
/* =========================== */

function handleMemberListVariant() {
  log("functiontrace", "Start Function");
  // Get writeable area
  var $output = $("#memberlist_search .roundframe");
  // Find the variant type
  var strHashData = window.location.hash.substr(1);
  var aryHashData = strHashData.split("|");

  switch (aryHashData[0].trim().toLowerCase()) {
    case "list":
      // Clear down what is there already.
      $("#memberlist .pagesection .buttonlist").remove();
      // Build our user table
      var $tbl;
      var $tblBody = $("<tbody></tbody>");
      var strTblHead = "";
      var userList = userLists[aryHashData[1]];
      // Set title
      $("#memberlist .ie6_header").html("User List: " + userList.name);
      if (userList) {
        for (var key in userList.list) {
          var listUser = userList.list[key];
          var searchData = {
            search: listUser.name,
            "fields[]": ["name"]
          };
          $.ajax({
            url: "https://elliquiy.com/forums/index.php?action=mlist;sa=search",
            method: "POST",
            data: searchData,
            async: false
          }).done(function (data) {
            var $data = $(data);
            var $dataTbl = $data.find("#mlist table");
            var $dataBody = $dataTbl.find("tbody");
            if (!$tbl) {
              $dataTbl.find("tbody").remove();
              $tbl = $dataTbl;
            }
            // Get the correct row from the dataBody
            $dataBody.find("tr").each(function () {
              if ($(this).find("td:eq(1)").text().trim().toLowerCase() == listUser.name.trim().toLowerCase()) {
                $tblBody.append($(this));
              }
            });

          }).fail(function (data) {});
        }
        $output.html("");
        $tbl.append($tblBody);
        $tbl.addClass("tablesorter");
        $output.append($tbl);
        $("table.tablesorter").tablesorter();
      }
      break;
    default:
      break;
  }
}


/* =========================== */
/* Image Stuff                 */
/* =========================== */
function setupImageEnlarge() {
  let $toEnlarge = $("img.resized");
  $toEnlarge.each(function () {
    let $img = $(this);
    let imgWidth = $img.attr("width");
    let imgHeight = $img.attr("height");
    if (imgWidth) {
      $img.attr("orig-width",imgWidth);
    }
    if (imgHeight) {
      $img.attr("orig-height",imgHeight);
    }
    $(this).click(function(){
      if ($(this).hasClass("enlarged")) {
        if ($img.attr("orig-width")) {
          $img.attr("width",$img.attr("orig-width"));
        }
        if ($img.attr("orig-height")) {
          $img.attr("height",$img.attr("orig-height"));
        }
        $img.removeClass("enlarged");
      } else {
        $(this).removeAttr("height").removeAttr("width");
        $img.addClass("enlarged");
      }
    });
  });
}

/* =========================== */

/* =========================== */
/* Member Cache and Tags       */
/* =========================== */

function getUserDetail($el,matchText) {
  let value = "";
  let $dt = $el.find(`dt:contains('${matchText}')`);
  if ($dt.length>0) {
    let $dd = $dt.next();
    value = $dd.text();
  }
  return value;
}

function getUserProfileDetails() {
  if (page.type !== "profile") return;
  let $basicInfo = $("div#basicinfo");
  let $detailedInfo = $("div#detailedinfo");
  let aryURL = location.href.split("=");
  let usr = {};
  usr.id = Number.parseInt(aryURL[aryURL.length-1]);

  if (memberCache[usr.id]) {
    usr = memberCache[usr.id];
  }

  usr.name = $("div.username h4").clone().children().remove().end().text().trim();
  usr.personalText = getUserDetail($detailedInfo,'Personal text:');
  usr.customTitle = getUserDetail($detailedInfo,'Custom title:');
  usr.position = $basicInfo.find("span.position").text().trim();
  usr.posts = getUserDetail($detailedInfo,"Posts:");
  usr.title = $detailedInfo.find("dd:eq(2)").text().trim();
  usr.referrals = $detailedInfo.find("dd:eq(4)").text().trim();
  usr.gender =getUserDetail($detailedInfo,"Gender:");
  usr.age = getUserDetail($detailedInfo,"Age:");
  usr.location = $detailedInfo.find("dd:eq(8)").text().trim();
  usr.dateReg = getUserDetail($detailedInfo,"Date registered:");
  usr.dateLocal = getUserDetail($detailedInfo,"Local Time:");
  usr.dateLast = getUserDetail($detailedInfo,"Last active:");

  return usr;
}

function cacheMember() {
  if (page.type !== "profile") return;
  if (location.href.includes("area=")) {
    if (!location.href.includes("area=summary")) return
  }
  let usr = getUserProfileDetails();
  if (usr) {
    memberCache[usr.id] = usr;
  }
  console.log(memberCache);
  saveMemberCache();
}

function saveMemberCache() {
  log("functiontrace", "Start Function");
  GM_setValue("memberCache", JSON.stringify(memberCache));
}

function loadMemberCache() {
  var strMemCache = GM_getValue("memberCache", "");
  if (strMemCache !== "") {
    memberCache = JSON.parse(strMemCache);
  }
}

/* =========================== */
/* Settings on cabbit          */
/* =========================== */
function sha256(str) {
  // We transform the string into an arraybuffer.
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    return hex(hash);
  });
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i);
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16);
    // We use concatenation and slice for padding
    var padding = '00000000';
    var paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }
  // Join all the hex strings into one
  return hexCodes.join("");
}

function cabbitSaveSettings2(hash, callback) {
  var strData = getSettingsForExport(true);
  var strURL = "https://cabbit.org.uk/eli/?site=eli&user=" + user.id + "&hash=" + hash;
  GM_xmlhttpRequest({
    method: "POST",
    url: strURL,
    data: strData,
    headers: {
      "Content-Type": "application/json"
    },
    onload: function (response) {
      if (callback) {
        var data = JSON.parse(response.responseText);
        callback(data);
      }
    }
  });
}

function cabbitSaveSettings(callback) {
  if (strExportKey == "") {
    cabbitSaveSettings2("", callback);
  }
  else {
    sha256('eli|' + user.id + "|" + strExportKey).then(function (digest) {
      cabbitSaveSettings2(digest, callback);
    });
  }
}

function cabbitLoadSettings2(hash, callback) {
  var strData = '';
  var strURL = "https://cabbit.org.uk/eli/?site=eli&user=" + user.id + "&hash=" + hash;
  GM_xmlhttpRequest({
    method: "GET",
    url: strURL,
    headers: {
      "Content-Type": "application/json"
    },
    onload: function (response) {
      var data = JSON.parse(response.responseText);
      if (data.status == 'ok') {
        var settingsData = JSON.parse(data.settings);
        for (var key in settingsData) {
          GM_setValue(key, settingsData[key]);
        }
      }
      if (callback) {
        callback(data);
      }
    }
  });
}

function cabbitLoadSettings(callback) {
  if (strExportKey == "") {
    cabbitLoadSettings2("", callback);
  }
  else {
    sha256('eli|' + user.id + "|" + strExportKey).then(function (digest) {
      cabbitLoadSettings2(digest, callback);
    });
  }
}
/* =========================== */

function scrollEvents(scroll) {
  // Scroll events here

  // Infinity paging
  if (config.repage.infinity && page.type === 'topic') {
    var element = $("div.post_wrapper").last()[0]; //document.getElementById("lastPost");
    var rect = element.getBoundingClientRect();
    if ($(window).height() > rect.top && !loadingPage) {
      let strPageBody = 'form#quickModForm';
      let $pageBody0 = $(strPageBody);
      let iPage = lastPageLoaded;
      let stopAt = iPage + config.repage.maxpage;
      let strURL;
      if (nextURL === "") {
        strURL = getNextURL($("body"),iPage);
      } else if (nextURL === "-end-") {
        console.log("infiPage: end!");
      } else {
        strURL = nextURL;
      }
      if (strURL === "") {
        console.log("infiPage: No next, last page?");
        return;
      }
      if ($pageBody0.length <= 0) {
        console.log("infiPage: No page body? That's odd... what are you doing?");
        return;
      }
      repage_getPage($pageBody0,strURL, iPage+1);
    }
  }
}

function addElliLogo() {
  $("#smflogo").attr("src",GM_getResourceURL("logoMain"));
  $("#smflogo").attr("alt","Elliquiy - Write with us");
  $("#smflogo").attr("title","Elliquiy");
  $("#smflogo").css("height","75px")
}

// Add 'Goto New' button to topics
function addNewButton() {
  let $newButton = $("a.button button_strip_new");
  if ($newButton.length <= 0) {
    let url = page.url.full;
    console.log(page.url.topic);
    url = url.replace(page.url.topic,page.url.topic.split(".")[0].split("#")[0] + '.new#new');
    $newButton = $("<a href='" + url + "' class='button button_strip_new'>GoTo New</a>");
    let $buttonLoc = $("div.top div.buttonlist");
    $buttonLoc.append($newButton);
  }
}

function main() {
  log("functiontrace", "Start Function");
  log("startup", "Starting " + GM_info.script.name + " v" + GM_info.script.version);
  getUserDetails(function () {
    initConfig();

    getPageDetails();
    applyCSS();

    addElliLogo();

    if (config.general.debugInfo) {
      createDebug();
    }

    // Get the sessionAuth object.  This lets us do some under-the-hood stuff :)
    oSessionAuth = getSessionAuth();

    if (config.userTags.on) {
      console.log("Loading member cache");
      loadMemberCache();
    }

    if (config.userNotes.on) {
      loadNameNotes();
      annotateNames();
    }

    $('head').append('<link rel="stylesheet" type="text/css" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">');
    $forumposts = $('div#forumposts');

    displaySettings();

    if (page.type == "profile") {
      $("#personal_picture").append(" (150 x 200px)");
    }

    if (config.topicFilters.on) {
      loadFilterTopics();
      addFilterTopicButton();
      if (page.type == "board" || page.type == "bookmarks" || page.type == "unread") {
        quickFT();
        filterTopics();
      }
    }

    if (config.general.removePics) {
      removeAllImages();
    }

    if (config.general.ajaxButtons) {
      ajaxButtons();
    }

    if (config.general.snippets) {
      //  console.log("Snips");
      loadSnippets();
      displaySnippets();
    }

    cacheMember();
/*
    if (config.general.userLists) {
      loadUserLists();
      displayUserLists();
      if (page.type == "member-search") {
        if (window.location.hash !== "") {
          handleMemberListVariant();
        }
      }
    }
*/



    if (config.bookmarks.tags) {
      loadBMTags();
      if (page.type == "board") {
        quickFT();
      }
      displayBMMenu();
    }

    if (config.quickLinks.on) {
      //console.log("=== Quick Links ===");
      loadQuickLinks();
      //console.log(quickLinks);
      showQuickLinks();
    }

    if (config.general.wordCount && (page.type == "post" || page.type == "topic")) {
      setWordCount();
    }

    if (config.bookmarks.tagOnBM && (page.type == "topic")) {
      tagOnBM();
    }

    if (config.bookmarks.allLink && page.type == "bookmarks") {
      BMAllLinks();
    }

	if (config.bookmarks.indicateBMd && page.type == "topic") {
	  setBMButton();
	}


    if (page.type == "topic") {
      if  (config.general.newButton) {
        addNewButton();
      }
    }

    if (config.speechStyling.on) {
      StyleSpeech();
    }

    if (page.type == 'pm-send') {
      //frmUserList();
    }

    // images
    if (config.image.enlarge) {
      setupImageEnlarge();
    }

    if (page.type == "scriptsettings") {
      editConfig();
    } else if (page.type == "sortsnippets") {
      sortSnippets();
    }

    if (page.type == "sortqlcats") {
      sortQLCats()
    }

    if (page.type == "sortqls") {
      let iPos = window.location.href.indexOf("&cat=");
      if (iPos === -1) {
        sortQLs("*");
      } else {
        sortQLs(window.location.href.substr(iPos+5));
      }
    }

    repaginate();

    newVerInfo();

    window.addEventListener('scroll', function(e) {
      last_known_scroll_position = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(function() {
          scrollEvents(last_known_scroll_position);
          ticking = false;
        });

        ticking = true;
      }
    });

    // GIF Freezing
    if (config.general.freezeGifs) {
        setTimeout(function() {
            freezeGifs();
            //window.stop();
        },config.general.freezeGifsDelay * 1000);
    }

    log("startup", "Completed load " + GM_info.script.name + " v" + GM_info.script.version);
  });
}

if ($('body.rich_editor').length > 0) {}
else {
  main();
}
