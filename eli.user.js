// ==UserScript==
// @name        Elliquiy Improver
// @namespace   elliquiy.improver.ssieth.co.uk
// @description Adds extra functionality to Elliquiy
// @match       https://elliquiy.com/*
// @exclude     https://elliquiy.com/*.js*
// @require     https://raw.github.com/sizzlemctwizzle/GM_config/master/gm_config.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.0/js/jquery.tablesorter.min.js
// @version     1.42.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
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
logTags.drafts = false;
logTags.functiontrace = false;
logTags.userdetails = false;
logTags.richtext = true;

// -- No need to edit these but no harm either. If you want to change them you can in the UI --
var config = {};
var config_display = {};

var blRemovePics = false;
var blQuickTopics = true;
var blSnippets = true;
var blUnreadReplies = true;
var intUnreadMinutes = 5;
var intMailMinutes = 5;
var blRepliesMenu = true;
var blRepliesNew = false;
var blQuickTopicsGoLast = true;
var blMarkQTNew = true;
var blShoutboxColour = false;
var strShoutboxColour = "black";
var strShoutboxColourApproved = "black";
var strShoutboxSubst = ":h|Hello everyone\n:g|Goodbye all!";
var arySBColours = ['gray', 'silver', 'white', 'red', 'fuchsia', 'purple', 'navy', 'blue', 'aqua', 'teal', 'green', 'olive', 'maroon', 'black'];
var aryUserNoteOptions = ['Hover Over Name', 'Above Avatar'];
var strUserNoteOption = 'Hover Over Name';
var blBMTags = true;
var blBMTagsOwed = true;
var blBMTagsReplies = true;
var blBMTagsNoTags = true;
var blWordCount = true;
var blTagOnBM = true;
var blTidyMenus = true;
var blDebugInfo = false;
var blFilterTopics = true;
var blDrafts = true;
var intAutoSave = 0;
var blAutoLoadDraft = true;
var blAutoClearDraft = false;
var intDraftHistory = 3;
var blNameNotes = true;
var blBMAllLinks = true;
var blAjaxButtons = true;
var blStyleSpeech = true;
var blStyleSpeechIncQuote = true;
var blUserLists = true;
var strStyleSpeechCSS = "color: blue;";
var blNotifications = false;
var strExportKey = "";

// -- These are all for tidying up the header --
var blRemoveShoutbox = false;
var blRemoveStyles = false;
var blRemoveFooter = false;
var blRemoveTopicicons = false;

// -- Not to be Edited --
var urlTopicBase = "https://elliquiy.com/forums/index.php?topic=";
var $forumposts;
var quickTopics = [];
var strModal = '<div id="modalpop" title="title"></div>';
var snippets = {};
var drafts = {};
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
var objFilterTopics = {};
var blTickStarted = false;
var nameNotes = {};
var strPIN = rInt(1000, 9999);
var objSBSubst = {};
var urlScriptThread = 'https://elliquiy.com/forums/index.php?topic=230790.0';
var lastVer = '';
var oSessionAuth = {};
var userLists = {};
var currentUserList = {};
var strScriptAdmins = ['Ssieth', 'Outcast'];
var blRemoveSsiethExtras_banner = false;
var blRemoveSsiethExtras_donate = false;
var blRemoveSsiethExtras_sbbutton = false;
var intMailCount = -1;
var intUnreadCount = GM_getValue("unreadReplies", 0);
var permResult;
const urlImg = "https://cabbit.org.uk/eli/img/";

// Version control stuff
var verDelDraft = ["1.37.4"];

// CSS
var strCSSConfigFrame = "bottom: 0; top: 0; left:0; right: 0; border: 1px solid rgb(0, 0, 0); height: 375px; margin: 0 auto; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 5px; position: fixed; top: 118px; width: 450px; z-index: 999; display: block; ";
var strCSSConfig = [
  "#e_config * { font-family: arial,tahoma,myriad pro,sans-serif; }",
  "#e_config { background: #FFF; }",
  "#e_config input[type='radio'] { margin-right: 8px; }",
  "#e_config input[type='text'] { width: 95%; }",
  "#e_config .indent40 { margin-left: 40%; }",
  "#e_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px;}",
  "#e_config .radio_label { font-size: 12px; }",
  "#e_config .block { display: block; }",
  "#e_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
  "#e_config .reset, #GM_config .reset a," +
  " #e_config_buttons_holder { color: #000; text-align: right; }",
  "#e_config .config_header { font-size: 14pt; padding: 5px; background-color: #eaeaea; margin-bottom: 3px;}",
  "#e_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
  "#e_config .center { text-align: center; }",
  "#e_config .section_header_holder { margin-top: 2px; }",
  "#e_config .config_var { margin: 0 0 4px; }",
  "#e_config input {width: auto; height: auto; display: inline;} ",
  "#e_config label {width: auto; height: auto; display: inline;} ",
  "#e_config .section_header { background: #eaeaea; color: #FFF; font-size: 10pt; margin: 0; text-align: left; color: black; border: 0px; border: 1px solid #CCC; padding: 2px;}",
  "#e_config .section_desc { background: #eaeaea; border: 0px; color: #575757; font-size: 9pt; margin: 0 0 6px; text-align: left; display:none; }"
].join('\n') + '\n';
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
var strCSSFT = ".FTMark {background-color: lightgray; text-decoration: line-through; } .FTHi {background-color: yellow;}";
var strCSSFT_Hi = "background-color: yellow;";
var strCSSFT_Mark = "background-color: lightgray; text-decoration: line-through;";
var strCSSFT_Question = "background-color: cornsilk;";

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

function throwModal(strTitle, strBody) {
  log("functiontrace", "Start Function");
  var intHeight;
  intHeight = Math.floor($(window).height() * 0.8);
  if ($("#modalpop").length === 0) {
    $('body').append($(strModal));
  }
  $('#modalpop').html(strBody).on("dialogopen", function (event, ui) {});
  $('#modalpop').dialog({
    title: strTitle,
    width: "720px",
    maxHeight: intHeight
  });
}

function getWordCount(strText) {
  log("functiontrace", "Start Function");
  var regex = /\s+/gi;
  var wordCount = strText.trim().replace(regex, ' ').split(' ').length;
  return wordCount;
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


/* =========================== */


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
  console.log("Saving config");
  console.log(config);
  GM_setValue("config",JSON.stringify(config));
  if (andThen) andThen();
}

function initConfig(andThen) {
  var blNewConfig;
  var aryColourConfig = arySBColours;

  config = {};
  config_display = {};
  blNewConfig = !loadConfig();
  if (blNewConfig) {
      initSettings();
  }
  // Settings categories
  initConfigCategory("general","General Settings");
  initConfigCategory("replies","Replies");
  initConfigCategory("topicFilters","Topic Filters");
  initConfigCategory("speechStyling","Speech Styling");
  initConfigCategory("userNotes","User Notes");
  initConfigCategory("quickTopics","Quick Topics");
  initConfigCategory("autoUpdates","Auto-Updates");
  initConfigCategory("removeHeadFoot","Remove Head and Footer Items");
  initConfigCategory("shoutbox","Shoutbox");
  initConfigCategory("drafts","Drafts");
  initConfigCategory("bookmarks","Bookmarks");
  initConfigCategory("admin","Admin",true);
  //initConfigCategory("importExport","Import / Export");
  // General Settings
  initConfigItem("general","removePics", blRemovePics, {text: "Remove pictures?", type: "bool" });
  initConfigItem("general","snippets", blSnippets, {text: "Snippets?", type: "bool" });
  initConfigItem("general","userLists", blUserLists, {text: "User lists?", type: "bool" });
  initConfigItem("general","wordCount", blWordCount, {text: "Show wordcounts?", type: "bool" });
  initConfigItem("general","debugInfo", blDebugInfo, {text: "Debug information?", type: "bool" });
  initConfigItem("general","ajaxButtons", blAjaxButtons, {text: "Make buttons AJAX?", type: "bool" });
  // Replies
  initConfigItem("replies","showCount", blUnreadReplies, {text: "Show unread replies count?", type: "bool" });
  initConfigItem("replies","showMenu", blRepliesMenu, {text: "Show unread replies menu?", type: "bool" });
  initConfigItem("replies","gotoNew", blRepliesNew, {text: "Replies links go to first new post?", type: "bool" });
  // Topic Filters
  initConfigItem("topicFilters","on", blFilterTopics, {text: "Topic Filters On?", type: "bool" });
  initConfigItem("topicFilters","CSS_Hi", strCSSFT_Hi, {text: "Hilight Styling (CSS)", type: "text" });
  initConfigItem("topicFilters","CSS_Mark", strCSSFT_Mark, {text: "Mark Styling (CSS)", type: "text" });
  initConfigItem("topicFilters","CSS_Question", strCSSFT_Question, {text: "Question Styling (CSS)", type: "text" });
  strCSSFT = ".FTMark { " + strCSSFT_Mark + " } .FTHi { " + strCSSFT_Hi + " }  .FTQ { " + strCSSFT_Question + "}";

  // Speech Styling
  initConfigItem("speechStyling","on", blStyleSpeech, {text: "Style Speech?", type: "bool" });
  initConfigItem("speechStyling","incQuote", blStyleSpeechIncQuote, {text: "Include quotes?", type: "bool" });
  initConfigItem("speechStyling","CSS", strStyleSpeechCSS, {text: "Speech Styling (CSS)", type: "text" });
  // User Notes
  initConfigItem("userNotes","on", blNameNotes, {text: "User Notes?", type: "bool" });
  initConfigItem("userNotes","style",strUserNoteOption, {text: "Note Style", type: "select", select: aryUserNoteOptions});
  // Quick Topics
  initConfigItem("quickTopics","on", blQuickTopics, {text: "Quick topics?", type: "bool" });
  initConfigItem("quickTopics","goLast", blQuickTopicsGoLast, {text: "Quick topics goes to last post?", type: "bool" });
  initConfigItem("quickTopics","markNew", blMarkQTNew, {text: "Mark replies to quick topics?", type: "bool" });
  // Auto Updates
  initConfigItem("autoUpdates","unreadMinutes", intUnreadMinutes, {text: "Update replies every X minutes (0=no auto-update)", type: "int", min: 0, max: 999 });
  initConfigItem("autoUpdates","mailMinutes", intMailMinutes, {text: "Update mail count every X minutes (0=no auto-update)", type: "int", min: 0, max: 999 });
  initConfigItem("autoUpdates","desktopNotifications", blNotifications, {text: "Desktop notifications?", type: "bool" });
  // Removing Headers and Footers
  initConfigItem("removeHeadFoot","shoutbox", blRemoveShoutbox, {text: "Remove shoutbox?", type: "bool" });
  initConfigItem("removeHeadFoot","styles", blRemoveStyles, {text: "Remove styles?", type: "bool" });
  initConfigItem("removeHeadFoot","topicIcons", blRemoveTopicicons, {text: "Remove topic icons?", type: "bool" });
  initConfigItem("removeHeadFoot","footer", blRemoveFooter, {text: "Remove footer?", type: "bool" });
  initConfigItem("removeHeadFoot","tidyMenus", blTidyMenus, {text: "Tidy Menus?", type: "bool" });
  // Shoutbox
  initConfigItem("shoutbox","colourOn", blShoutboxColour, {text: "Colour Shoutbox Text?", type: "bool" });
  initConfigItem("shoutbox","publicColour",strShoutboxColour, {text: "Shoutbox Colour (Public)", type: "select", select: aryColourConfig});
  initConfigItem("shoutbox","approvedColour",strShoutboxColourApproved, {text: "Shoutbox Colour (Approved)", type: "select", select: aryColourConfig});
  //initConfigItem("shoutbox","subst", strShoutboxSubst, {text: "Shoutbox Substitutions (use | to separate, leave blank for no substs)", type: "text" });
  //strShoutboxSubst = config.shoutbox.subst;
  // Drafts
  initConfigItem("drafts","on", blDrafts, {text: "Drafts?", type: "bool" });
  initConfigItem("drafts","autoLoad", blAutoLoadDraft, {text: "Auto-load draft?", type: "bool" });
  initConfigItem("drafts","autoSave", intAutoSave, {text: "Auto-save draft every X minutes (0=no auto-save)", type: "int", min: 0, max: 999 });
  initConfigItem("drafts","autoClear", blAutoClearDraft, {text: "Auto-clear draft when you post?", type: "bool" });
  initConfigItem("drafts","historyCount", intDraftHistory, {text: "# of manual drafts to keep (0 = no history kept)", type: "int", min: 0, max: 999 });
  // Bookmarks
  initConfigItem("bookmarks","tags", blBMTags, {text: "Bookmark Tags?", type: "bool" });
  initConfigItem("bookmarks","allLink", blBMAllLinks, {text: "Add &apos;All&apos; link to bookmarks?", type: "bool" });
  initConfigItem("bookmarks","owedTag", blBMTagsOwed, {text: "Posts Owed Auto-Tag??", type: "bool" });
  initConfigItem("bookmarks","tagOnBM", blTagOnBM, {text: "Add tags when bookmarking?", type: "bool" });
  initConfigItem("bookmarks","repliesTag", blBMTagsReplies, {text: "Replies Auto-Tag?", type: "bool" });
  initConfigItem("bookmarks","noTagsTag", blBMTagsNoTags, {text: "No Tags Auto-Tag?", type: "bool" });
  blBMTags = config.bookmarks.tags;
  blBMAllLinks = config.bookmarks.allLink;
  blBMTagsOwed = config.bookmarks.owedTag;
  blTagOnBM = config.bookmarks.tagOnBM;
  blBMTagsReplies = config.bookmarks.repliesTag;
  blBMTagsNoTags = config.bookmarks.noTagsTag;
  // Admin
  initConfigItem("admin","removeNewsbox", blRemoveSsiethExtras_banner, {text: "Remove Newsbox?", type: "bool" });
  initConfigItem("admin","removeDonate", blRemoveSsiethExtras_donate, {text: "Remove Donate?", type: "bool" });
  initConfigItem("admin","removeSsiethStuff", blRemoveSsiethExtras_sbbutton, {text: "Remove Ssieth Stuff?", type: "bool" });
  blRemoveSsiethExtras_banner = config.admin.removeNewsbox;
  blRemoveSsiethExtras_donate = config.admin.removeDonate;
  blRemoveSsiethExtras_sbbutton = config.admin.removeSsiethStuff;

  saveConfig();
  if (andThen) andThen();
}

// Returns true if a setting hsa been set, false otherwise
function updateConfig(controlID) {
	var $control = $("div#helpmain").find("#" + controlID);
	var aID = controlID.split("-");
	var catID = aID[3];
	var settingID = aID[4];
	if ($control.hasClass("gm-settings-control-bool")) {
		config[catID][settingID] = $control[0].checked;
	} else if ($control.hasClass("gm-settings-control-int")) {
        var intVal = parseInt($control.val());
        if ($.isNumeric("" + intVal)) {
            if (config_display[catID][settingID].hasOwnProperty("min") && intVal < config_display[catID][settingID].min) {
                console.log("There's a minimum and " + intVal + " < " + config_display[catID][settingID].min);
                return false;
            }
            if (config_display[catID][settingID].hasOwnProperty("max") && intVal > config_display[catID][settingID].max) {
                console.log("There's a maximum and " + intVal + " > " + config_display[catID][settingID].max);
                return false;
            }
            config[catID][settingID] = intVal;
        } else {
            console.log("Not an integer: " + $control.val())
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
  GM_addStyle(".gm-settings-setting-label { margin-right: 10px; display: inline; font-weight: bold; }");
  GM_addStyle(".gm-settings-control-int { width: 4rem; }");
  GM_addStyle(".gm-settings-setting-label { max-width: 15rem; display: inline-block; }");
  var $page = $("div#helpmain");

  $page.css("max-width","initial");
  //var $title = $("<h2>Script Settings (v" + GM_info.script.version + ")</h2>");
  $("h3.catbg").html("<h2>Script Settings (v" + GM_info.script.version + ")</h2>");
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
function initSettings() {
  log("functiontrace", "Start Function");
  var frame;
  $('body').append("<div id='storium_config_frame' class='storium_config_frame'>");
  frame = document.getElementById('storium_config_frame');
  var aryColourConfig = arySBColours;
  var fields = {
    'RemovePictures': { 'label': 'Remove pictures?', 'type': 'checkbox', 'title': 'Avatars and images in posts', 'default': blRemovePics, 'section': ['General Features', 'Switch basic things on and off'] },
    'Snippets': { 'label': 'Snippets?', 'type': 'checkbox', 'title': 'For storing/pasting', 'default': blSnippets },
    'blUserLists': { 'label': 'User Lists?', 'type': 'checkbox', 'title': 'For quick PMs', 'default': blUserLists },
    'WordCount': { 'label': 'Show wordcounts?', 'type': 'checkbox', 'title': 'Show wordcounts?', 'default': blWordCount },
    'DebugInfo': { 'label': 'Debugging Information?', 'type': 'checkbox', 'title': 'Debugging Information?', 'default': blDebugInfo },
    'blAjaxButtons': { 'label': 'Make buttons AJAX-based?', 'type': 'checkbox', 'title': 'Make buttons AJAX-based?', 'default': blAjaxButtons },
    'UnreadReplies': { 'label': 'Show unread replies count?', 'type': 'checkbox', 'title': 'At the top of the page, on the right', 'default': blUnreadReplies, 'section': ['Replies', 'Replies']  },
    'RepliesMenu': { 'label': 'Show unread replies menu?', 'type': 'checkbox', 'title': 'Show unread replies menu?', 'default': blRepliesMenu },
    'blRepliesNew': { 'label': 'Replies links go to first new post?', 'type': 'checkbox', 'title': 'Replies links go to first new post?', 'default': blRepliesNew },
    'TopicFilters': { 'label': 'Topic Filters On?', 'type': 'checkbox', 'title': 'Topic Filters On?', 'default': blFilterTopics, 'section': ['Topic Filters', 'Topic Filters'] },
    'strCSSFT_Hi': { 'label': 'Hilight Styling (CSS)', 'type': 'text', 'title': 'Hilight Styling (CSS)', 'default': strCSSFT_Hi },
    'strCSSFT_Mark': { 'label': 'Mark Styling (CSS)', 'type': 'text', 'title': 'Mark Styling (CSS)', 'default': strCSSFT_Mark },
    'strCSSFT_Question': { 'label': 'Question Styling (CSS)', 'type': 'text', 'title': 'Question Styling (CSS)', 'default': strCSSFT_Question },
    'blStyleSpeech': { 'label': 'Style Speech?', 'type': 'checkbox', 'title': 'Style Speech?', 'default': blStyleSpeech, 'section': ['Speech Styling', 'Speech Styling'] },
    'blStyleSpeechIncQuote': { 'label': 'Include quotes?', 'type': 'checkbox', 'title': 'Include quotes?', 'default': blStyleSpeechIncQuote },
    'strStyleSpeechCSS': { 'label': 'Speech Styling (CSS)', 'type': 'text', 'title': 'Speech Styling (CSS)', 'default': strStyleSpeechCSS },
    'NameNotes': { 'label': 'User Notes?', 'type': 'checkbox', 'title': 'User Notes?', 'default': blNameNotes, 'section': ['User Notes', 'User Notes'] },
    'UserNoteOption': { 'label': 'Note Style', 'type': 'select', 'options': aryUserNoteOptions, 'title': 'Note Style', 'default': strUserNoteOption, 'size': 10 },
    'QuickTopics': { 'label': 'Quick topics?', 'type': 'checkbox', 'title': 'The bookmarks replacement', 'default': blQuickTopics, 'section': ['Quick Topics', 'Quick Topics'] },
    'QuickTopicsGoLast': { 'label': 'Quick topics goes to last post?', 'type': 'checkbox', 'title': 'The bookmarks replacement', 'default': blQuickTopicsGoLast },
    'MarkQTNew': { 'label': 'Mark replies to quick topics?', 'type': 'checkbox', 'title': 'Mark replies to quick topics', 'default': blMarkQTNew },
    'RepliesMins': { 'label': 'Update replies every X minutes (0=no auto-update)', 'type': 'int', 'title': 'Update replies every X minutes (0=no auto-update)', 'min': 0, 'default': intUnreadMinutes, 'size': 10, 'section': ['Auto-Updates', 'Automatic updates'] },
    'MailMins': { 'label': 'Update mail count every X minutes (0=no auto-update)', 'type': 'int', 'title': 'Update mail count every X minutes (0=no auto-update)', 'min': 0, 'default': intMailMinutes, 'size': 10 },
    'blNotifications': { 'label': 'Desktop notifications?', 'type': 'checkbox', 'title': 'Desktop notifications', 'default': blNotifications },
    'RemoveShoutbox': { 'label': 'Remove shoutbox?', 'type': 'checkbox', 'title': 'Remove shoutbox from header', 'default': blRemoveShoutbox, 'section': ['Remove Header and Footer Items', 'Remove Header and Footer Items'] },
    'RemoveStyles': { 'label': 'Remove styles?', 'type': 'checkbox', 'title': 'Remvoe styles from header', 'default': blRemoveStyles },
    'RemoveTopicicons': { 'label': 'Remove topic icons key?', 'type': 'checkbox', 'title': 'Remove topic icons key', 'default': blRemoveStyles },
    'RemoveFooter': { 'label': 'Remove footer?', 'type': 'checkbox', 'title': 'Remvoe footer', 'default': blRemoveFooter },
    'TidyMenus': { 'label': 'Tidy Menus?', 'type': 'checkbox', 'title': 'Tidy Menus', 'default': blTidyMenus },
    'blShoutboxColour': { 'label': 'Colour Shoutbox Text?', 'type': 'checkbox', 'title': 'Colour Shoutbox Text?', 'default': blShoutboxColour, 'section': ['Shoutbox', 'Shoutbox'] },
    'strShoutboxColour': { 'label': 'Shoutbox Colour','type': 'select','options': aryColourConfig, 'title': 'Shoutbox Colour', 'default': strShoutboxColour, 'size': 10 },
    'strShoutboxColourApproved': { 'label': 'Shoutbox Colour (Approved Box)', 'type': 'select', 'options': aryColourConfig, 'title': 'Shoutbox Colour (Approved Box)', 'default': strShoutboxColourApproved, 'size': 10 },
    'strShoutboxSubst': { 'label': 'Shoutbox Substitutions (use | to separate, leave blank for no substs)', 'type': 'textarea', 'title': 'Use the | character to seperate command and substitution', 'default': strShoutboxSubst, 'size': 10 },
    'Drafts': { 'label': 'Drafts?', 'type': 'checkbox', 'title': 'Drafts?', 'default': blDrafts, 'section': ['Drafts', 'Drafts'] },
    'AutoLoadDraft': { 'label': 'Auto-load draft?', 'type': 'checkbox', 'title': 'Auto-load draft?', 'default': blAutoLoadDraft },
    'AutoSave': { 'label': 'Auto-save draft every X minutes (0=no auto-save)', 'type': 'int', 'title': 'Auto-save draft every X minutes (0=no auto-save)', 'min': 0, 'default': intAutoSave, 'size': 10 },
    'AutoClearDraft': { 'label': 'Auto-clear draft when you post', 'type': 'checkbox', 'title': 'Auto-clear draft when you post', 'default': blAutoClearDraft },
    'DraftHistory': { 'label': '# of manual drafts to keep (0 = no history kept)', 'type': 'int', 'title': '# of manual drafts to keep (0 = no history kept)', 'min': 0, 'default': intDraftHistory, 'size': 10 },
    'BMTags': { 'label': 'Bookmark Tags?', 'type': 'checkbox', 'title': 'Bookmark Tags', 'default': blBMTags, 'section': ['Bookmarks', 'Bookmarks'] },
    'BMAllLinks': { 'label': 'Add &apos;All&apos; link to bookmarks?', 'type': 'checkbox', 'title': 'Add &apos;All&apos; link to bookmarks?', 'default': blBMAllLinks },
    'BMTagsOwed': { 'label': 'Posts Owed Auto-Tag?', 'type': 'checkbox', 'title': 'Posts Owed Auto-Tag', 'default': blBMTagsOwed },
    'TagOnBM': { 'label': 'Add tags when bookmarking?', 'type': 'checkbox', 'title': 'Add tags when bookmarking', 'default': blTagOnBM },
    'BMTagsReplies': { 'label': 'Replies Auto-Tag?', 'type': 'checkbox', 'title': 'Replies Auto-Tag', 'default': blBMTagsReplies },
    'BMTagsNoTags': { 'label': 'No Tags Auto-Tag?', 'type': 'checkbox', 'title': 'No Tags Auto-Tag', 'default': blBMTagsNoTags },
    'strExportKey': { 'label': 'Export Key?', 'type': 'text', 'title': 'Export Key', 'default': strExportKey, 'section': ['Import / Export', 'Import / Export'] }
  };

  if (strScriptAdmins.indexOf(user.id) > -1) {
    fields.blRemoveSsiethExtras_banner = { 'label': 'Remove Newsbox?', 'type': 'checkbox', 'title': 'Remove Newsbox', 'default': blRemoveSsiethExtras_banner, 'section': ['Ssieth', 'Ssieth'] };
    fields.blRemoveSsiethExtras_donate = { 'label': 'Remove Donate?', 'type': 'checkbox', 'title': 'Remove Donate', 'default': blRemoveSsiethExtras_donate };
    fields.blRemoveSsiethExtras_sbbutton = { 'label': 'Remove Ssieth Stuff?', 'type': 'checkbox', 'title': 'Remove Ssieth Stuff', 'default': blRemoveSsiethExtras_sbbutton };
  }

  GM_config.init({
    'id': 'e_config',
    'title': 'Settings',
    'fields': fields,
    'events': {
      'save': function () {
        configSave();
      },
      'open': function () {
        $('#e_config .section_header_holder .config_var').hide();
        $('#e_config .section_header').click(function () {
          $(this).parent().find('.config_var').slideToggle();
        });
      }
    },
    'css': strCSSConfig,
    'frame': frame
  });

  blRemoveShoutbox = GM_config.get("RemoveShoutbox");
  blRemoveStyles = GM_config.get("RemoveStyles");
  blRemoveFooter = GM_config.get("RemoveFooter");
  blRemoveTopicicons = GM_config.get("RemoveTopicicons");
  blBMTags = GM_config.get("BMTags");
  blBMTagsOwed = GM_config.get("BMTagsOwed");
  blWordCount = GM_config.get("WordCount");
  blBMTagsReplies = GM_config.get("BMTagsReplies");
  blBMTagsNoTags = GM_config.get("BMTagsNoTags");
  blTagOnBM = GM_config.get("TagOnBM");
  blBMAllLinks = GM_config.get("BMAllLinks");
  blTidyMenus = GM_config.get("TidyMenus");
  blDebugInfo = GM_config.get("DebugInfo");
  blFilterTopics = GM_config.get("TopicFilters");
  blDrafts = GM_config.get("Drafts");
  blAutoLoadDraft = GM_config.get("AutoLoadDraft");
  intAutoSave = GM_config.get("AutoSave");
  blAutoClearDraft = GM_config.get("AutoClearDraft");
  intDraftHistory = GM_config.get("DraftHistory");
  blNameNotes = GM_config.get("NameNotes");
  blRepliesMenu = GM_config.get("RepliesMenu");
  blRepliesNew = GM_config.get("blRepliesNew");
  strUserNoteOption = GM_config.get("UserNoteOption");
  strCSSFT_Mark = GM_config.get("strCSSFT_Mark");
  strCSSFT_Hi = GM_config.get("strCSSFT_Hi");
  strCSSFT_Question = GM_config.get("strCSSFT_Question");
  strCSSFT = ".FTMark { " + strCSSFT_Mark + " } .FTHi { " + strCSSFT_Hi + " }  .FTQ { " + strCSSFT_Question + "}";

  if (strScriptAdmins.indexOf(user.id) > -1) {
    blRemoveSsiethExtras_banner = GM_config.get("blRemoveSsiethExtras_banner");
    blRemoveSsiethExtras_donate = GM_config.get("blRemoveSsiethExtras_donate");
    blRemoveSsiethExtras_sbbutton = GM_config.get("blRemoveSsiethExtras_sbbutton");
  }
  else {
    blRemoveSsiethExtras_banner = false;
    blRemoveSsiethExtras_donate = false;
    blRemoveSsiethExtras_sbbutton = false;
  }

  blRemovePics = GM_config.get("RemovePictures");
  blQuickTopics = GM_config.get("QuickTopics");
  blQuickTopicsGoLast = GM_config.get("QuickTopicsGoLast");
  blMarkQTNew = GM_config.get("MarkQTNew");
  blSnippets = GM_config.get("Snippets");
  blUnreadReplies = GM_config.get("UnreadReplies");
  intUnreadMinutes = GM_config.get("RepliesMins");
  intMailMinutes = GM_config.get("MailMins");

  blShoutboxColour = GM_config.get("blShoutboxColour");
  strShoutboxColour = GM_config.get("strShoutboxColour");
  strShoutboxColourApproved = GM_config.get("strShoutboxColourApproved");
  blAjaxButtons = GM_config.get("blAjaxButtons");
  blUserLists = GM_config.get("blUserLists");
  blNotifications = GM_config.get("blNotifications");

  strShoutboxSubst = GM_config.get("strShoutboxSubst");
//  buildSBSubst();

  blStyleSpeech = GM_config.get("blStyleSpeech");
  blStyleSpeechIncQuote = GM_config.get("blStyleSpeechIncQuote");
  strStyleSpeechCSS = GM_config.get("strStyleSpeechCSS");
  strExportKey = GM_config.get("strExportKey");
}

function configSave() {
  log("functiontrace", "Start Function");
  GM_config.close();
  location.reload();
}

function displaySettings() {
  log("functiontrace", "Start Function");

  $("li#button_settings").remove();
  var settingsURL = "https://elliquiy.com/forums/index.php?action=help#scriptsettings";
  var $menunav = $('ul#menu_nav');
  var $menuQ = $("<li id='button_settings'></li>");
  var $menuSet = $("<a class='firstlevel' href='" + settingsURL + "'><span class='firstlevel'>Script Settings</span></a>");
  $menuQ.append($menuSet);
  if (GM_info.script === undefined) {}
  else {
    $menuQ.append("<ul><li><a href='" + settingsURL + "' id='script_version'><span class='snippet_link'>Current version: v" + GM_info.script.version + "</span></a></li><li><a href='https://github.com/Ssieth/eli-userscript/raw/master/eli.user.js' id='script_home'><span class='snippet_link'>Get Latest Version</span></a></li></</ul>");
    if (config.topicFilters.on) {
      $menuQ.find("ul").append("<li><a href='#' id='TF_link'><span class='TF_link'>Topic Filters</span></a></li>");
      $menuQ.find("a#TF_link").click(function (e) {
        e.preventDefault();
        frmFT("", "", "");
      });
    }

    $menuQ.find("ul").append("<li><a href='#' id='snippets_link_settings'><span class='setting_export_link'>Snippets</span></a></li>");
    $menuQ.find("a#snippets_link_settings").click(function (e) {
      e.preventDefault();
      frmSnippet();
    });

    $menuQ.find("ul").append("<li><a href='#' id='userLists_link_settings'><span class='setting_export_link'>User Lists</span></a></li>");
    $menuQ.find("a#userLists_link_settings").click(function (e) {
      e.preventDefault();
      frmUserLists();
    });

    $menuQ.find("ul").append("<li><a href='#' id='setting_managetags_link'><span class='setting_managetags_link'>Manage Tags</span></a></li>");
    $menuQ.find("a#setting_managetags_link").click(function (e) {
      e.preventDefault();
      frmBMTags();
    });

    $menuQ.find("ul").append("<li><a href='#' id='setting_cleardrafts_link'><span class='setting_cleardrafts_link'>Clear Drafts</span></a></li>");
    $menuQ.find("a#setting_cleardrafts_link").click(function (e) {
      e.preventDefault();
      checkClearDrafts();
    });

    $menuQ.find("ul").append("<li><a href='#' id='setting_export_link'><span class='setting_export_link'>Export Settings</span></a></li>");
    $menuQ.find("a#setting_export_link").click(function (e) {
      e.preventDefault();
      exportValues();
    });

    $menuQ.find("ul").append("<li><a href='#' id='setting_import_link'><span class='setting_import_link'>Import Settings</span></a></li>");
    $menuQ.find("a#setting_import_link").click(function (e) {
      e.preventDefault();
      frmImport();
    });

    /*
    $menuQ.find("#script_version").click(function (e) {
      e.preventDefault();
      GM_config.open();
      GM_config.frame.setAttribute('style', strCSSConfigFrame);
    });
    */
  }
  $menunav.append($menuQ);
}
/* =========================== */

/* =========================== */
/* Filter Topics               */
/* =========================== */
function frmFTBody(strID, strText, strType) {
  log("functiontrace", "Start Function");
  var strBody = "";
  var key;
  strBody = "<p><strong>Add Topic Filter</strong></p>";
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>ID:</th>";
  strBody += " <td><input type='text' id='topicID' size='10' value='" + strID + "'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Name:</th>";
  strBody += " <td><input type='text' id='topicName' size='50' value='" + strText + "'></td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <th style='vertical-align: top; text-align: right;'>Filter Type:</th>";
  strBody += " <td>";
  strBody += "<input type='radio' name='filterType' id='filterTypeHide' value='hide' ";
  if (strType == "hide") {
    strBody += "checked='checked' ";
  }
  strBody += "/>: Hide";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeMark' value='mark' ";
  if (strType == "mark") {
    strBody += "checked='checked' ";
  }
  strBody += "/>: General Mark";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeMark' value='mark-genre' ";
  if (strType == "mark-genre") {
    strBody += "checked='checked' ";
  }
  strBody += "/>: Genre";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeMark' value='mark-gender' ";
  if (strType == "mark-gender") {
    strBody += "checked='checked' ";
  }
  strBody += "/>: Gender";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeMark' value='question' ";
  if (strType == "question") {
    strBody += "checked='checked' ";
  }
  strBody += "/>: Question";
  strBody += "<br />";
  strBody += "<input type='radio' name='filterType' id='filterTypeMark' value='hi' ";
  if (strType == "hi") {
    strBody += "checked='checked' ";
  }
  strBody += "/>: Hilight";
  strBody += "</td>";
  strBody += "</tr>";
  strBody += "<tr>";
  strBody += " <td colspan='2'><center><button value='Set' id='setFilter'>Set</button></center></td>";
  strBody += "</tr>";
  strBody += "</table>";
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
  });
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
	var srcImg = urlImg + iconName + ".png";
	$row.find("td:eq(0) img").attr({
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
  $('div.main_content form table tbody tr,div#messageindex table tbody tr').each(function () {
    $row = $(this);
    if ($row.attr("class") === undefined) {
      if (page.type == "bookmarks") {
        $url = $row.find("td:eq(1) a:eq(0)");
      }
      else {
        $url = $row.find("td:eq(2) a:eq(0)");
      }
      id = "" + $url.attr("href").match(/\d+/)[0];
      name = $url.text();
      if (objFilterTopics[id] === undefined) {}
      else {
        switch (objFilterTopics[id].filterType) {
          case "mark":
            $row.find("td").addClass("FTMark");
            break;
		  case "mark-genre":
            $row.find("td").addClass("FTMark");
			filterTopicsSetIcon($row,"drama");
            break;
		  case "mark-gender":
            $row.find("td").addClass("FTMark");
			filterTopicsSetIcon($row,"manwoman");
            break;
		  case "question":
            $row.find("td").addClass("FTQ");
			filterTopicsSetIcon($row,"question");
            break;
          case "hi":
            $row.find("td").addClass("FTHi");
            break;
          case "hide":
            $row.hide();
            break;
          default:
            break;
        }
      }
    }
  });
}

function quickFT() {
  log("functiontrace", "Start Function");
  var intRow = 0;
  $("table tr").each(function () {
    intRow++;
    if (intRow > 2) {
      $(this).find("td:eq(0) img").click(function (e) {
        var strTopicURL = $(this).parent().parent().find("td:eq(2) a:eq(0)");
        var strTopicName = strTopicURL.text();
        var strTopicID = strTopicURL.attr("href").match(/\d+/)[0];
        frmFT(strTopicID, strTopicName, "mark");
      }).addClass('pointer');
    }
  });
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
  var keys = [];
  for (var key in snippets) {
    keys.push(key);
  }
  keys.sort();
  return keys;
}

function setSnippet() {
  log("functiontrace", "Start Function");
  var strName = $('#snippetName').val();
  var strBody = $('#snippetBody').val();
  var strID = strName.replace(/ /g, "-");
  var snippet = {};

  snippet.id = strID.replaceAll(":","");
  snippet.body = strBody;
  snippet.name = strName.replaceAll(":","");
  snippets[strID] = snippet;

  displaySnippets();
  //$('#modalpop').dialog( "close" );
  cleanSnippets();
  saveSnippets();
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
    displaySnippets();
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

function loadSnippets() {
  log("functiontrace", "Start Function");
  var strSnippets = GM_getValue("snippets", "");
  if (strSnippets !== "") {
    snippets = JSON.parse(strSnippets);
  }
}

function rawSnippets() {
    return JSON.stringify(snippets);
}

function saveSnippets() {
  log("functiontrace", "Start Function");
  GM_setValue("snippets", JSON.stringify(snippets));
}

function moveCaretToEnd(el) {
  log("functiontrace", "Start Function");
  if (typeof el.selectionStart == "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  }
  else if (typeof el.createTextRange != "undefined") {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}

/* For doing bold, italics etc */
function pasteToDesc(snippet, moveToEnd) {
  log("functiontrace", "Start Function");
  var textArea = $(strLastFocus);
  if (textArea.length > 0) {
    var start = textArea[0].selectionStart;
    var end = textArea[0].selectionEnd;
    var replacement = snippet;
    textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, textArea.val().length));
    if (moveToEnd) {
      moveCaretToEnd(textArea[0]);
    }
  }
}

function pasteSnippet($this) {
  log("functiontrace", "Start Function");
  var strID = $this.attr("id").replace("snip-", "");
  pasteToDesc(snippets[strID].body, false);
  return false;
}

function displaySnippets() {
  log("functiontrace", "Start Function");
  $("li#button_snip ul").remove();
  var $copyTo = $('div#bbcBox_message div:eq(0)');
  var key;
  if ($copyTo.length > 0) {
    var $menuQ = $('li#button_snip');
    var newMenu = false;
    if ($menuQ.length === 0) {
      newMenu = true;
      $menuQ = $("<li id='button_snip'><a class='firstlevel' href='#'><span class='firstlevel'>Snippets</span></a></li>");
    }
    var $menuQ_ul = $("<ul style='background-color: white;'></ul>");
    $menuQ.find('a.firstlevel').click(function (e) {
      e.preventDefault();
      frmSnippet();
    });
    var counter;
    var keys = sortedSnippetKeys();
    for (counter = 0; counter < keys.length; counter++) {
      //for (key in sortedSnippetKeys) {
      key = keys[counter];
      var snippet = snippets[key];
      if (snippet.body !== "") {
        $menuQ_ul.append("<li><a href='javascript:void(0);' class='snippet_link_outer' id='snip-" + snippet.id + "'><span class='snippet_link'>" + snippet.name + "</span></a></li>");
        $menuQ_ul.find('#snip-' + snippet.id).click(function (e) {
          pasteSnippet($(this));
          stopDefaultAction(e);
          return false;
        });
      }
    }
    $menuQ.append($menuQ_ul);
    if (newMenu) {
      var $menunav = $("<ul id='bbcBox_snip' class='dropmenu' style='display: inline !important; float: right; z-index: 999 |important; display: inline-block;'></ul>");
      // This should resolve issues with only a limited number of snippets being displayed.
      $copyTo.parents("form").first().removeClass("flow_hidden");
      $menunav.append($menuQ);
      $copyTo.append($menunav);
    }
  }
}
/* =========================== */

/* =========================== */
/* Drafts                      */
/* =========================== */
function draftMenu(strID) {
  log("functiontrace", "Start Function");
  var $copyTo;
  var draft;
  $("li#button_drafts").remove();
  if (config.drafts.historyCount > 0) {
    var draftsCol = draftHistory[strID];
    if (draftsCol !== undefined) {
      switch (page.type) {
        case "post":
        case "pm-send":
          $copyTo = $('div#bbcBox_message div:eq(0)');
          break;
        case "topic":
          $copyTo = $('div#quickReplyOptions p:eq(0)');
          break;
        default:
          break;
      }
      var key;
      if ($copyTo.length > 0) {
        var $menuQ = $('li#button_drafts');
        var newMenu = false;
        if ($menuQ.length === 0) {
          newMenu = true;
          $menuQ = $("<li id='button_drafts'><a class='firstlevel' href='#'><span class='firstlevel'>Drafts</span></a></li>");
        }
        var $menuQ_ul = $("<ul style='background-color: white;'></ul>");
        if (drafts[strID] !== undefined && draftsCol[draftsCol.length - 1].when != drafts[strID].when) {
          draft = drafts[strID];
          if (draft.body !== "") {
            $menuQ_ul.append("<li><a href='#' class='draft_link_outer' id='drafts-as'><span class='draft_link'>" + draft.when + " (Auto)</span></a></li>");
            $menuQ_ul.find('#drafts-as').click(function (e) {
              e.preventDefault();
              pasteDraft($(this));
            });
          }
        }
        for (var counter = draftsCol.length - 1; counter >= 0; counter--) {
          draft = draftsCol[counter];
          if (draft.body !== "") {
            $menuQ_ul.append("<li><a href='#' class='draft_link_outer' id='drafts-" + counter + "'><span class='draft_link'>" + draft.when + "</span></a></li>");
            $menuQ_ul.find('#drafts-' + counter).click(function (e) {
              e.preventDefault();
              pasteDraft($(this));
            });
          }
        }
        $menuQ.append($menuQ_ul);
        if (newMenu) {
          var $menunav = $("<ul id='bbcBox_drafts' class='dropmenu' style='display: inline !important; float: right;'></ul>");
          $menunav.append($menuQ);
          $copyTo.append($menunav);
        }
      }
    }
  }
}

function pasteDraft($this) {
  log("functiontrace", "Start Function");
  var strNo = $this.prop("id").replace("drafts-", "");
  var strDraft = "";
  var $topicForm = $('form#search_form');
  var strID = $topicForm.find('input[name="topic"]').val();
  if (strNo == "as") {
    strDraft = drafts[strID].body;
  }
  else {
    var draftCol = draftHistory[strID];
    strDraft = draftCol[parseInt(strNo, 10)].body;
  }
  switch (page.type) {
    case "post":
    case "pm-send":
      $('textarea#message').val(strDraft);
      $('iframe#html_message').contents().find('body.rich_editor').html(strDraft);
      break;
    case "topic":
      $('div#quickReplyOptions textarea').val(strDraft);
      $('iframe#html_message').contents().find('body.rich_editor').html(strDraft);
      break;
    default:
      break;
  }
}

function autoLoadDraft() {
  log("functiontrace", "Start Function");
  var $topicForm;
  var strID;
  if (page.type == 'post' || page.type == 'pm-send') {
    $topicForm = $('form#search_form');
    strID = $topicForm.find('input[name="topic"]').val();
    if (drafts[strID] && drafts[strID].body && drafts[strID].body !== "undefined") {
      $('textarea#message').val(drafts[strID].body);
      $('iframe#html_message').contents().find('body.rich_editor').html(drafts[strID].body);
    }
  }
}

function displayDrafts() {
  log("functiontrace", "Start Function");
  var $topicForm;
  var strID;
  var $buttons;
  if (page.type == 'post' || page.type == 'topic' || page.type == 'pm-send') {
    $topicForm = $('form#search_form');
    strID = $topicForm.find('input[name="topic"]').val();
    draftMenu(strID);
    switch (page.type) {
      case "post":
        $buttons = $('p#post_confirm_buttons');
        break;
      case "pm-send":
        $buttons = $('p#post_confirm_strip');
        break;
      case "topic":
        $buttons = $('div#quickReplyOptions div.righttext');
        break;
      default:
        break;
    }
    $buttons.find('button#savedraft').remove();
    $buttons.find('button#loaddraft').remove();
    $buttons.find('button#cleardraft').remove();
    if (drafts[strID] === undefined) {
      $buttons.append("<button id='savedraft' value='Save Draft' class='button_submit'>Save Draft</button>");
    }
    else {
      $buttons.append("<button id='savedraft' value='Save Draft' class='button_submit'>Save Draft</button> ");
      $buttons.append("<button id='cleardraft' value='Clear Draft' class='button_submit'>Clear Draft</button> ");
      $buttons.append("<button id='loaddraft' value='Load Draft' class='button_submit'>Load Draft</button>");
    }
    $buttons.find("button#savedraft").click(function (e) {
      e.preventDefault();
      setDraft(true);
      displayDrafts();
    });
    $buttons.find("button#loaddraft").click(function (e) {
      e.preventDefault();
      switch (page.type) {
        case "post":
        case "pm-send":
          $('textarea#message').val(drafts[strID].body);
          $('iframe#html_message').contents().find('body.rich_editor').html(drafts[strID].body);
          break;
        case "topic":
          $('div#quickReplyOptions textarea').val(drafts[strID].body);
          $('iframe#html_message').contents().find('body.rich_editor').html(drafts[strID].body);
          break;
        default:
          break;
      }
    });
    $buttons.find("button#cleardraft").click(function (e) {
      e.preventDefault();
      delete drafts[strID];
      delete draftHistory[strID];
      saveDrafts();
      displayDrafts();
    });
    if (config.drafts.autoClear) {
      $("p#post_confirm_buttons input:eq(0)").click(function (e) {
        if (drafts[strID]) {
          delete drafts[strID];
          saveDrafts();
        }
      });
    }
  }
}

function loadDrafts() {
  log("functiontrace", "Start Function");
  var strDrafts = GM_getValue("drafts", "");
  if (strDrafts !== "") {
    drafts = JSON.parse(strDrafts);
  }
  var strHistory = GM_getValue("draftHistory", "");
  if (strHistory !== "") {
    draftHistory = JSON.parse(strHistory);
  }
  log("drafts", drafts);
}

function saveDrafts() {
  log("functiontrace", "Start Function");
  log("drafts", "Saving drafts");
  log("drafts", drafts);
  GM_setValue("drafts", JSON.stringify(drafts));
  GM_setValue("draftHistory", JSON.stringify(draftHistory));
}

function setDraft(blHistory) {
  log("functiontrace", "Start Function");
  var $topicForm;
  var strID;
  var draftsCol;
  var strBody;
  var strMessageMode = "0";
  if (page.type == "post" || page.type == "topic" || page.type == "pm-send") {
    $topicForm = $('form#search_form');
    strID = $topicForm.find('input[name="topic"]').val();
  }
  switch (page.type) {
    case "post":
    case "pm-send":
	  strMessageMode = $('input#message_mode').val();
	  if (strMessageMode === "0") {
		strBody = "" + $('textarea#message').val();
	  } else {
		strBody = "" + $('iframe#html_message').contents().find('body.rich_editor').html();
	  }
      break;
    case "topic":
      strBody = "" + $('div#quickReplyOptions textarea').val();
      break;
    default:
      break;
  }
  var draft = {};

  if (strBody && strBody.trim() !== "" && strBody.trim() !== "undefined") {
    draft.id = strID;
    draft.body = strBody;
    draft.when = (new Date()).toLocaleString();
    log("drafts", draft);
    drafts[draft.id] = draft;
    // Save manual draft history if we need to
    if (blHistory && config.drafts.historyCount > 0) {
      if (draftHistory[strID] === undefined) {
        draftsCol = [];
      }
      else {
        draftsCol = draftHistory[strID];
      }
      draftsCol.push(draft);
      if (draftsCol.length > config.drafts.historyCount) {
        draftsCol.remove(0, (draftsCol.length - config.drafts.historyCount) - 1);
      }
      draftHistory[strID] = draftsCol;
    }
    saveDrafts();
    displayDrafts();
  }
  return false;
}

function clearDrafts() {
	drafts ={};
	draftHistory = {};
	saveDrafts();
}

function checkClearDrafts() {
    if (confirm("Clear all drafts?")) {
		clearDrafts();
		alert("Done!");
	}
}
/* =========================== */

/* =========================== */
/* Quick Topics                */
/* =========================== */
function sortQuickTopics() {
  log("functiontrace", "Start Function");
  quickTopics.sort(sort_by('name', false, function (a) {
    return a.toUpperCase();
  }));
}

function loadQuickTopics() {
  log("functiontrace", "Start Function");
  var strQTopics = GM_getValue("qTopics", "");
  if (strQTopics !== "") {
    quickTopics = JSON.parse(strQTopics);
    sortQuickTopics();
  }
}

function saveQuickTopics() {
  log("functiontrace", "Start Function");
  sortQuickTopics();
  GM_setValue("qTopics", JSON.stringify(quickTopics));
}

function hasQuickTopic(intTopicID) {
  log("functiontrace", "Start Function");
  var hasIt = -1;
  var counter;
  forloop: for (counter = 0; counter < quickTopics.length; counter++) {
    var qForum = quickTopics[counter];
    if (qForum.id == intTopicID) {
      hasIt = counter;
      break forloop;
    }
  }
  return hasIt;
}

function addQuickTopic(strName, intID) {
  log("functiontrace", "Start Function");
  var qForum = {};
  qForum.name = strName;
  qForum.url = urlTopicBase + intID;
  qForum.id = intID;
  quickTopics.push(qForum);
}

function displayQuickTopics() {
  log("functiontrace", "Start Function");
  var counter;
  $("li#button_q ul").remove();
  var $menunav = $('ul#menu_nav');
  var $menuQ = $('li#button_q');
  var newMenu = false;
  if ($menuQ.length === 0) {
    newMenu = true;
    $menuQ = $("<li id='button_q'><a class='firstlevel' href='#'><span class='firstlevel'>Quick Topics</span></a></li>");
  }

  $menuQ.find("a").click(function (e) {
    e.preventDefault();
    frmQuickTopics();
  });

  var $menuQ_ul = $("<ul style='background-color: white;'></ul>");
  var strGoLast;
  if (config.quickTopics.goLast) {
    strGoLast = ";all#lastPost";
  }
  else {
    strGoLast = "";
  }
  for (counter = 0; counter < quickTopics.length; counter++) {
    var qForum = quickTopics[counter];
    if (qForum === undefined) {}
    else {
      $menuQ_ul.append("<li id='qTopic_" + qForum.id + "'><a href='" + qForum.url + strGoLast + "'><span>" + qForum.name + "</span></a></li>");
    }
  }
  $menuQ.append($menuQ_ul);
  if (newMenu) {
    $menunav.append($menuQ);
  }
}

function addQuickTopicButton() {
  log("functiontrace", "Start Function");
  var $buttonLists = $('div.buttonlist ul');
  var $topicForm = $('form#search_form');
  var intTopicID = -1;
  var strTopicName = $("title").text();
  var intTopicPos = -1;
  var $newButton;

  // remove old buttons
  $('li.button_strip_qtopic_li').remove();

  // Trim user names out of the topic name
  var intBracketPos = strTopicName.lastIndexOf('(');
  if (intBracketPos > 0) {
    strTopicName = $.trim(strTopicName.substr(0, intBracketPos));
  }

  if ($topicForm.length > 0) {
    intTopicID = $topicForm.find('input[name="topic"]').val();
    if (intTopicID > 0) {
      intTopicPos = hasQuickTopic(intTopicID);
      if (intTopicPos > -1) {
        $newButton = $("<li class='button_strip_qtopic_li'><a class='button_strip_qtopic' href='#'><span class='last'>Remove Quick Topic</span></a></li>");
        $newButton.click(function () {
          quickTopics.remove(intTopicPos, intTopicPos);
          displayQuickTopics();
          saveQuickTopics();
          addQuickTopicButton();
          return false;
        });
      }
      else {
        $newButton = $("<li class='button_strip_qtopic_li'><a class='button_strip_qtopic' href='#'><span class='last'>Add Quick Topic</span></a></li>");
        $newButton.click(function () {
          addQuickTopic(strTopicName, intTopicID);
          displayQuickTopics();
          saveQuickTopics();
          addQuickTopicButton();
          return false;
        });
      }
      $buttonLists.append($newButton);
    }
  }
}

function frmQuickTopicsBody(strMessage) {
  log("functiontrace", "Start Function");
  var strBody = "";
  var counter;
  strBody += "<table>";
  strBody += "<tr>";
  strBody += " <th style='text-align: left;'>#</th>";
  strBody += " <th style='text-align: left;'>Name</th>";
  strBody += " <th style='text-align: left;'>Topic ID</th>";
  strBody += " <th style='text-align: left;'>Actions</th>";
  strBody += "</tr>";
  for (counter = 0; counter < quickTopics.length; counter++) {
    var qForum = quickTopics[counter];
    if (qForum === undefined) {}
    else {
      strBody += "<tr id='snipEdit_row_" + counter + "'>";
      strBody += " <td>" + counter + "</td>";
      strBody += " <td><input type='text' id='snipEdit_name_" + counter + "' value='" + qForum.name.replace("'", "&#39;") + "' style='width: 25em;' /></td>";
      strBody += " <td><input type='text' id='snipEdit_id_" + counter + "' value='" + qForum.id + "' style='width: 5em;'/></td>";
      strBody += " <td>";
      strBody += "<button type='button' id='snipEdit_update_" + counter + "' class='snipEdit_updatebutton' value='Update'>Update</button> ";
      strBody += "<button type='button' id='snipEdit_delete_" + counter + "' class='snipEdit_deletebutton' value='Delete'>Delete</button>";
      strBody += "</td>";
      strBody += "</tr>";
    }
  }
  strBody += "</table>";
  strBody += "<p><span id='snipEdit_message'>" + strMessage + "</span></p>";
  return strBody;
}

function frmQuickTopics() {
  log("functiontrace", "Start Function");
  var strBody = frmQuickTopicsBody("...");
  var strID;
  var intID;
  var qTopic;

  throwModal("Quick Topics", strBody);
  $('#modalpop button.snipEdit_updatebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("snipEdit_update_", "");
    intID = parseInt(strID, 10);
    qTopic = quickTopics[intID];
    qTopic.id = $('#snipEdit_id_' + intID).val();
    qTopic.name = $('#snipEdit_name_' + intID).val();
    qTopic.url = urlTopicBase + qTopic.id;
    saveQuickTopics();
    displayQuickTopics();
    $('#modalpop span#snipEdit_message').html("Entry #" + intID + " updated");
  });
  $('#modalpop button.snipEdit_deletebutton').click(function (e) {
    strID = $(this).attr("id");
    strID = strID.replace("snipEdit_delete_", "");
    intID = parseInt(strID, 10);
    quickTopics.remove(intID, intID);
    saveQuickTopics();
    displayQuickTopics();
    //$('#modalpop tr#snipEdit_row_' + intID).remove();
    //$('#modalpop span#snipEdit_message').html("Entry #" + intID + " removed");
    strBody = frmQuickTopicsBody("Entry #" + intID + " removed");
    $("#modalpop").html(strBody);
  });
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

function getUnreadReplies() {
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
      if (config.quickTopics.markNew) {
        var strLinkText = $('#qTopic_' + intTopicID).find("a span").text();
        if (strLinkText.substring(0, 1) != "*") {
          $('#qTopic_' + intTopicID).find("a span").text("*** " + strLinkText + " ***");
        }
      }
      objReplies[intTopicID] = true;
      if (objIgnoreReplies[intTopicID] === true) {}
      else {
        if (config.replies.showMenu) {
          var lasturl = $(this).find("td.lastpost a:eq(0)").attr("href");
          if (config.replies.gotoNew) {
            lasturl = url2new(lasturl);
          }
          $thisa = $(this).find("a:eq(0)").attr("href", lasturl);
          aryReplies.push($thisa.parent().html());
        }
        intCount++;
      }
    });
    if (config.autoUpdates.desktopNotications) {
      askPermission();
      if (intCount > intUnreadCount) {
        intUnreadCount = intCount;
        GM_setValue("unreadReplies", intCount);
        sendNotification("Elliquiy Replies", "You have new unread replies to your Elliquiy posts").onclick = function (e) {
          e.preventDefault();
          window.open("https://elliquiy.com/forums/index.php?action=unreadreplies", "_blank");
        };
      }
    }
    if (config.replies.showCount) {
      var $appendTo;
      if (config.removeHeadFoot.shoutbox) {
        $appendTo = $("div.main_header div.floatright a:eq(1)");
      }
      else {
        $appendTo = $("div.main_header div.floatright a:eq(2)");
      }
      var strText = "New replies to your posts" + " (" + intCount + ")";
      if (intCount > 0) {
        strText = "<span style='color:red;'>" + strText + "</span>";
      }
      $appendTo.html(strText);
    }
    if (config.replies.showMenu) {
      displayReplies(aryReplies);
    }
  });
  return intCount;
}
/* =========================== */

/* =========================== */
/* Registering Focus           */
/* =========================== */
function registerLastFocus(strSelect) {
  log("functiontrace", "Start Function");
  var $sel;
  $sel = $(strSelect);
  if ($sel.length > 0) {
    $sel.focus(function () {
      strLastFocus = strSelect;
    });
  }
}

function registerFocuses() {
  log("functiontrace", "Start Function");
  registerLastFocus("textarea#message");
  registerLastFocus("input#to_control");
  registerLastFocus("input[name='subject']");
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
/* Header/Footer Removal       */
/* =========================== */
function removeHeaderStuff(blUserDep) {
  log("functiontrace", "Start Function");
  if (blUserDep) {
    /*
    No longer used
     */
  }
  else {
    if (config.removeHeadFoot.shoutbox) {
      // remove shoutbox stuff
      $("#shoutBoxContainer").remove(); // main container
      $(".shouttabcontainer").remove(); // channel tabs
      $(".main_header .floatright:eq(1)").remove(); // Disable shoutbox button
    }

    if (config.removeHeadFoot.styles) {
      // Finally everything else at the bottom of the box (alternative site styles etc)
      $(".main_header hr").nextAll().remove();
    }

    if (config.removeHeadFoot.footer) {
      $("div#topic_icons").remove();
    }

    if (config.removeHeadFoot.topicIcons) {
      // Finally everything else at the bottom of the box (alternative site styles etc)
      $("div.main_footer").remove();
    }
  }
}
/* =========================== */

/* =========================== */
/* Tick Engine                 */
/* =========================== */
function fireJQueryStuff() {
  log("functiontrace", "Start Function");
  if (config.shoutbox.colourOn) {
    shoutBoxColor();
  }
}

function tick() {
  log("functiontrace", "Start Function");
  // If we are doing anything that requires ticks then we fire them roughly every second.
  var datNow = new Date();
  var intSpan = datNow.getTime() - datUnread.getTime();
  var intSpanSave = datNow.getTime() - datAutoSave.getTime();

  intTick += 1;
  log("tickfires", "Tick fired: " + intTick);

  if (config.replies.showCount && config.autoUpdates.unreadMinutes > 0) {
    if (datNow.getTime() - datUnread.getTime() > 1000 * 60 * config.autoUpdates.unreadMinutes) {
      datUnread = new Date();
      log("tickactions", "  Tick: Getting unread replies");
      getUnreadReplies();
    }
  }
  if (config.autoUpdates.mailMinutes > 0) {
    intSpan = datNow.getTime() - datMail.getTime();
    if (datNow.getTime() - datMail.getTime() > 1000 * 60 * config.autoUpdates.mailMinutes) {
      datMail = new Date();
      log("tickactions", "  Tick: Getting mail count");
      updateMailCount();
    }
  }
  if (config.drafts.autoSave > 0) {
    if (intSpanSave > 1000 * 60 * config.drafts.autoSave) {
      datAutoSave = new Date();
      log("tickactions", "  Tick: Auto-save");
      setDraft(false);
      displayDrafts();
    }
  }
  if (blUserDepReady) {
    blUserDepReady = false;
    log("tickactions", "  Tick: User-dependent stuff");
    userDep();

    // Nested in here to provide a bit of a delay ;)
    if (!blJQueryStuff) {
      log("tickactions", "  Tick: injecting code into base page");
      blJQueryStuff = true;
      fireJQueryStuff();
    }
  }
}
/* =========================== */

/* =========================== */
/* Mail Counts                 */
/* =========================== */
function getUnreadMailCount() {
  var $ele = $("span.greeting a");
  var txt = $ele.text();
  var ary = txt.split(",");
  var strCount;
  var intCount = 0;
  ary = ary[1].split(" ");
  strCount = ary[1];
  if (strCount !== "none") {
    intCount = parseInt(strCount);
  }
  GM_setValue("unreadMail", intCount);
  return intCount;
}

function updateMailCount() {
  log("functiontrace", "Start Function");
  var strURL = "https://elliquiy.com/forums/index.php?action=search";
  var intNewMail = 0;
  askPermission();

  if (intMailCount === -1) {
    intMailCount = GM_getValue("unreadMail", 0);
  }

  $.get(strURL, function (data) {
    var $reportTo = $("span.greeting a");
    var $mailCountLink = $(data).find("span.greeting a");
    $reportTo.html($mailCountLink.html());
    intNewMail = getUnreadMailCount();
    if (intMailCount < intNewMail) {
      sendNotification("New Elliquiy PMs", "You have new PMs (" + intNewMail + " unread)").onclick = function (e) {
        e.preventDefault();
        window.open("https://elliquiy.com/forums/index.php?action=pm", "_blank");
      };
      console.log("Mail count increased from " + intMailCount + " to " + intNewMail);
    }
  });
}
/* =========================== */

/* =========================== */
/* Notifications               */
/* =========================== */
function askPermission() {
  log("functiontrace", "Start Function");
  if (config.autoUpdates.desktopNotications && permResult !== "granted" && permResult !== "denied") {
    Notification.requestPermission(function (permission) {
      permResult = permission;
    });
  }
}

function sendNotification(strTitle, strBody ) {
  log("functiontrace", "Start Function");
  if (config.autoUpdates.desktopNotications) {
    var options = {
      body: strBody,
      requireInteraction: true,
      icon: "https://elliquiy.com/favicon.ico"
    };
    var notification = new Notification(strTitle, options);
    return notification;
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
      }, 1000);
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

  // Remove header stuff that is dependent on user level
  //removeHeaderStuff(true);

  if (blBMTags && page.type == "bookmarks") {
    reformatBMs();
  }

  if (config.general.debugInfo) {
    debugUserInfo();
  }
}
/* =========================== */

/* =========================== */
/* Shoutbox Stuff  */
/* =========================== */
function injectJQuery() {
  log("functiontrace", "Start Function");
  var strSrc = "";
  strSrc += "var newscript = document.createElement('script');";
  strSrc += "newscript.type = 'text/javascript';";
  strSrc += "newscript.async = true;";
  strSrc += "newscript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';";
  strSrc += "(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);";
  inject(strSrc);
}

function sbColour(strText, strCol) {
  if (strText.substr(0, 1) == '/') {
    return strText.substr(0, strText.indexOf(' ') + 1) + '[color=' + strCol + ']' + strText.substr(strText.indexOf(" ")) + '[/color]';
  }
  else {
    return '[color=' + strCol + ']' + strText + '[/color]';
  }
}

function sbFunctions(strControlPostFix, strCol) {
  log("functiontrace", "Start Function");
  // remove old click behaviour
  inject("$('#shoutChatInputFieldButton" + strControlPostFix + "').prop('onclick',null).off('click');");
  // Add new click behaviour
  inject("$('#shoutChatInputFieldButton" + strControlPostFix + "').click( function(e) { e.preventDefault(); var strText = $('#shoutChatInputField" + strControlPostFix + "').val(); ajaxChat.sendMessage(sbColour(strText,'" + strCol + "')); return false;});");
  // remove old enter/return key behaviour
  inject("$('#shoutChatInputField" + strControlPostFix + "').prop('onkeypress',null).off('keypress');");
  // add new enter/return key behaviour
  inject("$('#shoutChatInputField" + strControlPostFix + "').keypress(function(event) {var strText = $('#shoutChatInputField" + strControlPostFix + "').val(); if(event.keyCode === 13 && !event.shiftKey) {ajaxChat.sendMessage(sbColour(strText,'" + strCol + "')); try { event.preventDefault();  } catch(e) { event.returnValue = false; } return false; } return true; });");
}

/*
function buildSBSubst() {
  log("functiontrace", "Start Function");
  objSBSubst = {};
  if (strShoutboxSubst && strShoutboxSubst.length > 0) {
    var arySBSubst = strShoutboxSubst.split("\n");
    for (var i = 0; i < arySBSubst.length; i++) {
      if (arySBSubst[i].indexOf("|") !== -1) {
        var ary = arySBSubst[i].split("|");
        objSBSubst[ary[0]] = ary[1];
      }
    }
  }
}
*/

function shoutBoxColor() {
  log("functiontrace", "Start Function");
  // Inject array of subsitutions
  //var objSBSubst = {":1": "/me peers at some test code and wonders if it is working", ":2": "Looks to be working"};
  var strSBSubst = JSON.stringify(objSBSubst);
  inject("var objSBSubst=" + strSBSubst + ";");
  //inject("function sbSubst(strIn) { var strOut=strIn; for (var property in objSBSubst) { if (objSBSubst.hasOwnProperty(property)) { strOut = strOut.replace(property,objSBSubst[property]); } } return strOut; }");
  inject("function sbSubst(strIn) { return strIn; }");  // Hopefully not needed any more but just to be sure...
  // Inject function to produce colour text
  inject("function sbColour(strText,strCol) { if (strText.substr(0,1) == '/') { return strText.substr(0,strText.indexOf(' ')+1) + '[color=' + strCol + ']' + strText.substr(strText.indexOf(' ')) + '[/color]'; } else { return '[color=' + strCol + ']' + strText + '[/color]'; } }");
  sbFunctions("", config.shoutbox.publicColour);
  sbFunctions("ApprovedBox", config.shoutbox.approvedColour);
}
/* =========================== */

/* =========================== */
/* Bookmarks                   */
/* =========================== */
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

function addTBody(strTableSel, ignoreFirstRow) {
  var $table = $(strTableSel);
  var $tbody = $("<tbody></tbody>");
  if (ignoreFirstRow) {
    $(strTableSel + " tr:not(:first-child)").appendTo($tbody);
  }
  $table.append($tbody);
  var trs = $table[0].getElementsByTagName("tr");
}

function reformatBMs() {
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
  $("li#button_bookmarks ul").remove();
  var $menunav = $('ul#menu_nav');
  var $menuQ = $('li#button_bookmarks');
  var $menuQ_ul = $("<ul style='background-color: white;'></ul>");

  if (blBMTagsOwed) {
    $menuQ_ul.append("<li><a href='" + strBase + "&tag=owe' id='bm-owe'><span class='bm_link'>Posts Owed</span></a></li>");
  }
  if (blBMTagsReplies) {
    $menuQ_ul.append("<li><a href='" + strBase + "&tag=replies' id='bm-replies'><span class='bm_link'>Replies</span></a></li>");
  }
  if (blBMTagsNoTags) {
    $menuQ_ul.append("<li><a href='" + strBase + "&tag=no-tags' id='bm-no-tags'><span class='bm_link'>No Tags</span></a></li>");
  }
  for (counter = 0; counter < aryBMTags.length; counter++) {
    var strTag = aryBMTags[counter];
    $menuQ_ul.append("<li><a href='" + strBase + "&tag=" + strTag + "' id='bm-" + strTag + "'><span class='bm_link'>" + strTag + "</span></a></li>");
  }
  $menuQ.append($menuQ_ul);
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
        aryBMTags.push(strTag.trim());
      }
    }
  }
  aryBMTags.sort();
  for (counter = 0; counter < aryBMTags.length; counter++) {
    strTag = aryBMTags[counter];
    aryBMTagsLower.push(strTag.trim().toLowerCase());
  }
  if (blBMTagsOwed) {
    if ($.inArray("notowed", aryBMTagsLower) == -1) {
      aryBMTagsLower.push("notowed");
      aryBMTags.push("NotOwed");
    }
  }
  if (blBMTagsReplies) {
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

function frmBMTags() {
  log("functiontrace", "Start Function");
  var strBody = frmBMTagsBody();
  throwModal("Tags", strBody);
  $('#modalpop span.BMTagClick').click(function (e) {
    var strVal = $(this).text();
    if (confirm("Delete '" + strVal + "' tag?")) {
      deleteTag(strVal);
      saveBMTags();
      loadBMTags();
      strBody = frmBMTagsBody();
      $("#modalpop").html(strBody);
    }
  });
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
  $('a.button_strip_bookmark').click(function (e) {
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
  page.type = "other";
  if (page.url.full.toLowerCase().indexOf("action=bookmarks") > 0) {
    page.type = "bookmarks";
  }
  else if (page.url.full.toLowerCase().indexOf("action=post") > 0) {
    page.type = "post";
  }
  else if (page.url.full.toLowerCase().indexOf("action=profile") > 0) {
    page.type = "profile";
  }
  else if (page.url.full.toLowerCase().indexOf("action=help") > 0) {
    if (page.url.hash.toLowerCase() == "#scriptsettings") {
      page.type = "scriptsettings";
    } else {
      page.type = "help";
    }
  }
  else if (page.url.full.toLowerCase().indexOf("?topic=") > 0) {
    page.type = "topic";
  }
  else if (page.url.full.toLowerCase().indexOf("?board=") > 0) {
    page.type = "board";
  }
  else if (page.url.full.toLowerCase().indexOf("?action=pm;sa=send") > 0) {
    page.type = "pm-send";
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
  console.log("Page:");
  console.log(page);
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
}
/* =========================== */

/* =========================== */
/* Wordcount                   */
/* =========================== */
function setWordCount() {
  log("functiontrace", "Start Function");
  switch (page.type) {
    case "post":
      $('div.content').each(function () {
        var $wcLoc = $(this).find('div:eq(0)');
        var strText = $(this).find('div.list_posts').text();
        $wcLoc.append(" <span class='wordcountExt' style='font-size: 80%; margin-left: 10px;'>(<span class='wordcountInt'>Word count: " + getWordCount(strText) + "</span>)</span>");
      });
      $("p#shortcuts").after("<div id='wordcountPost' style='font-size: 80%;'>Wordcount: <span id='wordcountPostCount'>0</span></div>");
      $("textarea#message").keypress(function (event) {
        $("span#wordcountPostCount").text(getWordCount($("textarea#message").val()));
      });
      break;
    case "topic":
      $('div.postarea').each(function () {
        var $wcLoc = $(this).find('div.keyinfo');
        var strText = $(this).find('div.post').text();
        $wcLoc.find("div.smalltext").append(" <span class='wordcountExt' style='font-size: 80%; margin-left: 10px;'>(<span class='wordcountInt'>Word count: " + getWordCount(strText) + "</span>)</span>");
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
  $("div.navigate_section").after("<div style='padding: 10px; background-color: cornsilk; margin-left: auto; margin-right: auto; width: 90%; margin-bottom: 10px;' id='newVer'><p style='font-size: 120%; font-weight: bold;'>Elliquiy Improver Script - New Version</p></div>");
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
  $("body").append("<div style='padding: 10px; background-color: yellow; margin-left: auto; margin-right: auto; width: 90%;' id='debug'><p>Debug Info</p><ul></ul></div>");
}

function debugUserInfo() {
  log("functiontrace", "Start Function");
  var $displayAt = $("div#debug ul");
  var $userInfo = $("<li>User Info: <ul></ul></li>");
  var $userInfo_ul = $userInfo.find("ul");
  var $snippets = $("<li>Snippets: <ul></ul></li>");
  var $snippets_ul = $snippets.find("ul");
  $userInfo_ul.append("<li>ID: " + user.id + "</li>");
  $userInfo_ul.append("<li>UserName: " + user.name + "</li>");
  $userInfo_ul.append("<li>Position: " + user.position + "</li>");
  $userInfo_ul.append("<li>Level: " + user.level + "</li>");
  $displayAt.append($userInfo);
  $snippets_ul.append("<li><pre>" + rawSnippets() + "</pre></li>");
  $displayAt.append($snippets);
}
/* =========================== */

/* =========================== */
/* Import/Export               */
/* =========================== */
function getSettingsForExport(excludeDrafts) {
  log("functiontrace", "Start Function");
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
  strBody = "<p>You can <span class='fakelink' id='exportToCabbitLink'>copy settings to cabbit.org.uk by clicking here</span>.</p><p>The settings should have been copied to the clipboard but just in case they haven't, they are presented below:</p><textarea rows='15' cols='60'>" + strVals + "</textarea>";
  throwModal("Export Settings", strBody);
  $('#exportToCabbitLink').click(function (e) {
    e.preventDefault();
    cabbitSaveSettings(function (response) {
      if (response.status == "ok") {
        alert("Settings successfully exported to cabbit.org");
      }
      else {
        alert("An error occurred: " + response.errorMsg);
      }
    });
  });
  GM_setClipboard(strVals);
}

function frmImport() {
  log("functiontrace", "Start Function");
  var strBody = "";
  var aryPairs = [];
  var aryPair = [];
  var strVal = "";
  var objImport = {};
  strBody += "<p><span class='fakelink' id='cabbitLoadSettingsLink'>Load settings from cabbit.org.uk</span></p>";
  strBody += "<p>Or copy the settings into the box below:</p><textarea rows='15' cols='60' id='import_settings'></textarea><br /><button id='import_button' type='button' value='import'>Import</button>";
  strBody += "<p style='color: red; font-weight: bold'>Warning: this can mess up your settings and prevent the script from running... use at your own risk</p>";
  throwModal("Import Settings", strBody);
  $('#cabbitLoadSettingsLink').click(function (e) {
    cabbitLoadSettings(function (response) {
      if (response.status == "ok") {
        alert("Settings successfully imported from cabbit.org");
        window.location.reload(true);
      }
      else {
        alert("An error occurred: " + response.errorMsg);
      }
    });
  });

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

  // addNameNote("Nowherewoman","Storium: Ev");
  switch (page.type) {
    case "topic":
      $("div.poster h4").each(function () {
        $name = $(this).find("a:eq(1)");
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
      var strUserID = $basicInfo.find("div.username h4").text().split(" ")[0].trim();
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
  log("drafts", drafts);
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
  var $butLog = $("#button_logout a");
  var href = $butLog.prop("href");
  var aryHref = href.split(";");
  var aryHref2 = aryHref[1].split("=");

  auth.sId = aryHref2[1];
  auth.sVar = aryHref2[0];
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

function main() {
  log("functiontrace", "Start Function");
  log("startup", "Starting " + GM_info.script.name + " v" + GM_info.script.version);
  getUserDetails(function () {
    initConfig();

    getPageDetails();
    applyCSS();
    removeHeaderStuff(false);

    if (user.id == "Ssieth") {
      if (blRemoveSsiethExtras_banner) {
        $("div.main_newsbox").remove();
      }
      if (blRemoveSsiethExtras_donate) {
        $(".main_header .donorbanner").remove(); // Disable donorbanner
      }
      if (blRemoveSsiethExtras_sbbutton) {
        $(".main_header .floatright:eq(2)").remove(); // Disable shoutbox button
      }
    }

    if (config.general.debugInfo) {
      createDebug();
    }

    // Inject JQuery for any functions that need it.
    if (config.shoutbox.colourOn) {
      injectJQuery();
      blJQueryStuff = false;
    }

    // Get the sessionAuth object.  This lets us do some under-the-hood stuff :)
    oSessionAuth = getSessionAuth();

    if (config.removeHeadFoot.tidyMenus) {
      tidyMenus();
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
      if (page.type == "board" || page.type == "bookmarks") {
        if (page.type == "bookmarks") {
          addTBody("table", true);
        }

        filterTopics();
      }
    }

    if (config.general.removePics) {
      removeAllImages();
    }

    if (config.quickTopics.on) {
      loadQuickTopics();
      displayQuickTopics();
      addQuickTopicButton();
    }

    if (config.general.ajaxButtons) {
      ajaxButtons();
    }

    if (config.general.snippets || config.drafts.on) {
      registerFocuses();
    }

    if (config.general.snippets) {
      loadSnippets();
      displaySnippets();
    }

    if (config.general.userLists) {
      loadUserLists();
      displayUserLists();
      if (page.type == "member-search") {
        if (window.location.hash !== "") {
          handleMemberListVariant();
        }
      }
    }

    if (config.drafts.on) {
      loadDrafts();
      if (config.drafts.autoLoad) {
        autoLoadDraft();
      }
      displayDrafts();
    }

    if (config.replies.showCount || config.quickTopics.markNew) {
      loadIgnoredReplies();
      addIgnoreRepliesButton();
      getUnreadReplies();
    }

    if (blBMTags) {
      loadBMTags();
      if (page.type == "board") {
        quickFT();
      }
      displayBMMenu();
    }

    if (config.general.wordCount && (page.type == "post" || page.type == "topic")) {
      setWordCount();
    }

    if (blTagOnBM && (page.type == "topic")) {
      tagOnBM();
    }

    if (config.autoUpdates.unreadMinutes > 0 || config.autoUpdates.mailMinutes > 0) {
      if (config.autoUpdates.mailMinutes > 0) {
        updateMailCount();
      }
    }

    if (blBMAllLinks && page.type == "bookmarks") {
      BMAllLinks();
    }

    if (config.speechStyling.on) {
      StyleSpeech();
    }

    if (page.type == 'pm-send') {
      //frmUserList();
    }

    if (page.type == "scriptsettings") {
      console.log("Editing config");
      editConfig();
    }

    newVerInfo();

    log("startup", "Completed load " + GM_info.script.name + " v" + GM_info.script.version);
  });
}

if ($('body.rich_editor').length > 0) {}
else {
  main();
}