# Elliquiy Improver

This script is designed to add some extra functionality to Elliquiy.com

It requires a userscript plugin for your browser.  I use TamperMonkey (https://www.tampermonkey.net/) but there are other alternatives.

The specific features are listed below:

## In the last version
2.11.6: 

* Added new %sel%[default text]%/sel% syntax for snippets that can take a default subsitution when used with no selection to be replaced.

2.11.5:

* Emergency fix for 2.11.4 - ignore the User Tags setting - it won't do anything for now but also won't break anything.

2.11.4:

* A bit of work done in prep for "user tags"
* Changed how snippets are inserted to put them in the Undo chain.

2.11.3:

* Fixed 'tag bubbles' in bookmarks

2.11.2:

* Added some functionality to show if a topic is already bookmarked (on by default)
* Fixed the "Add tags when bookmarking?" option
* Removed user lists functionality as it was no longer working. Added to longer-term to-do to look at.

2.11.1 (what happened to 2.11.0?  Nobody knows, least of all me):

* Added a new filter topic option - Later, to show topics/threads you want to look at later.

2.10.0:

* Improved interface for deletion of quick links and quick link categories

2.9.1:

* Added a GotoNew button to topics.  Disable with the "New button for threads" setting under general settings.

2.8.1:

* Performance improvement - added a 1s debounce to word count on edit box.

2.8.0:

* Added option to show a quick menu of bookmarks.  It is off by default and available in the settings under bookmarks

2.7.3:

* Some fixes for quick links with various breaking characters in their names such as & and even spaces for some browsers.

2.7.2:

* Checks for and removes quick links and quick link categories that are blank.

2.7.1:

* Improved debug info display
* Quick links sorting now works for cetagories with spaces in 

2.7.0:

* Quick Links are now sortable.

2.6.5:

* Topic filters reorganized

2.6.5:

* Topic filters now has a kink option

2.6.4:

* No Filter is now an option for topic filters.
* Removed long, awkward list of of topic filters on the set filter form.
* Topic filter form reorganized and tidied.
* Topic filter form now closes when filter is set.

2.6.3:

* Topic filters now viewable in bookmarks screen

2.6.2:

* Topic filters now viewable and available in more places.

2.6.0:

* Snippets should now work on quick replies box.

2.5.3:

* You can now have apostrophes, quotes and ampersands in the names of Quick Links and Quick Link Categories
* Deleting quick links or quick link categories now has a yes/no confirmation.

2.5.1:

* Added option (on by default) for external quick links to open in new tab

2.5.0:

* New version of Quick Links implemented

2.4.1:

* Fixed deletion of bookmarks.

2.4.0:

* Fixed icons on filter topics
* Started to fetch external images and icons via @resource rather than directly

2.3.2:

* Added icons for tags and auto-tags onto the bookmarks list

2.3.0:

* Added font size and font face as options to general settings.
* Fixed saving of settings

2.2.9:

* Changed colourscheme of tag-bubbles to fit in with site colour scheme

2.2.8:

* Added owed auto-tag to tag-bubbles

2.2.6:

* First release of tag-bubbles on bookmarks

2.1.5:

* Minor tidy-up to have ScriptSettings use action rather than bookmark hash

2.1.4:

* Addressing a bug when moving between script settings and snippet sorting pages

2.1.1:

* Fixed editing bookmark tags

2.1.0: 

* Replace SMF logo with Elliquiy one

2.0.17: 

* Removed unsupported settings
* Fixed User Notes

2.0.15: 

* Topic filters are back.

2.0.9: 

* Bookmarks menu is back

2.0.7: 

* Repagination and infinity paging are now working again (I think)

2.0.5:

* Word counts should now be fixed.

2.0.1: 

* Minor bug fix to allow snippets to be used in PMs

2.0.0: Post Elli-Crash

* Drafts are gone entirely from the script as this functionality looks like it will be suppported natively by Elli
* Bookmarks tags are back and working as best I can tell.  I can't test creation as Elli doesn't have that back, yet.
* Snippets are back and working as best I can tell.
* The script settings menu is back and at the very top of the screen: "Scripts".  I think everything on it should be working.

1.54.0 

* Stopped editing of snippets updating the snippets menu sas it is bugged.  Will fix it properly later.
* Added code to allow a %sel% selection replacement in snippets

1.53.1 Fixed a minor bug so that user notes now appear correctly in PM page.

1.53.0 A couple of new things:

* Added image resize toggling.
* Added option for context menu for snippts (only for code view of editing, not rich text. At the moment)

1.52.0 Reworked snippets menu to allow categories to be added.

1.51.2 Removed redundant console.log stuff.

1.51.1 Fixed a problem with the replies auto-tag not functioning correctly due to a race condition

1.50.0 Added a new option to replies (on by default): "Hide unwatched replies in list".  This, as it suggests hides unwatched replies in the replies list.

1.49.0 A couple of improvements to deleting bookmarks:

* Ticking the toggle-all checkbox on a given list of BMs now only toggles the checkboxes for that list, not all of the lists.
* When deleting bookmarks, the page should remember which lists you had open and keep those open.

1.48.2 Fixed a small bug with the label for the new soft highlight for topic filters not being linked to its respective radio button.

1.48.1 OK - idiot that I am, I have been forgetting to update this file.  Changes since last version:

* Added new view of bookmarks as a set of collapsible lists.  Works with the current bookmark tags.
* Tidied up speech styling to make it a bit more smart about spotting paragraph ends

1.46.2 Fixed an error where blank bookmark tags cause visual weirdness in BMs menu

1.46.1 Fixed GIF-freezing by using HTML5 canvas

1.46.0 Added GIF-freezing options

1.45.3 Some under-the-hood fixes in how snippets are handled.

1.45.2 Added some comments for debugging

1.45.1 Fixed snippets label on editor

1.45.0 Custom sorting now available for snippets

1.44.4 Corrected text for setting Repagination / Max Pages

1.44.3 New script notifications should go to new posts

1.44.2 Fixed code that identifies the type of topic filter when editing one.

1.44.1 Added canon to filter topics selection.

1.44.0 Added snippet replacement so that [0], [1] etc can be replaced by snippets in the editor

1.43.5 Slight tweak to topic filters to make the labels for the radio buttons actual labels.

1.43.4 Usernotes should now work for users with spaces in their usernames

1.43.3 Remove autoload draft option (it causes too many problems)

1.43.2 A little bit of tidy-up of some array processing.

1.43.1 Added repagination and infinity paging options for topic pages

1.42.6 Added bookmark data to debug info

1.42.5 Added speech-styling support for smart quotes.

1.42.4 settings page CSS improved for other themes

1.42.3 Removed gm_config and fully moved over to the new config system

1.42.1 a little bugfix around new config stuff. Removed SB substitutions

1.42.0 changes to settings to usher out GM_config

1.41.1 Added code to remove colons from snippet names and IDs

1.41.0 replies settings split into own settings section, added option to head to first new item in replies topics

1.40.0: Moved hosting of the script to github to allow for easier collaboration. Not necessarily live.

1.39.0: A fix for those users who have changed their display name.

1.38.1: Bugfix for last update... oops!

1.38.0: First update in a good while.  I've added some new topic filter options.

1.37.7: Updated tablesorter to use the cdnjs version.  This should avoid phishing alerts and hopefully fix bugs some folks are encountering.

1.37.6: (skipping versions is the new black).  Updated reference to JQuery and JQueryUI libraries to the latest versions.  Updated match and exclude references to try and avoid js files

1.37.4: (yes, skipped a few versions in test) Anther drafts fix.  Added a menu option to clear drafts.

1.37.1: Fix for 'undefined' bug in drafts.  Numerous implied global variables made local.

1.36.2: Added export key for additional security of settings export

1.36.1: Topic filters now work on bookmark pages

1.36.0: Topic filters now have their own section in settings.  You can specify the CSS applied to filtered topics.  Settings popup increased in size.

1.35.3: A few bug fixes and the export of settings to cabbit.org no longer includes drafts as that was quite unwieldy

1.35.0: Added options to export and import settings via cabbit.org

1.34.0: Added desktop notifications for new PMs.  Setting under auto-update and off by default.


**User Notes**
Switch it on or off (default on) in its own settings category.  You can add notes to a user in their profile.  It will show up (only to you) there and when you hover over their name in topics.  The names in topics change to green to show there are notes against a user.

You can also opt to have the note out in the open above the user's avatar if you prefer.

**Drafts**
Got half way through a post before RL interrupts?  With the new drafts feature you can save a draft for each topic for later retrieval.  It's on by default and can be disabled in the usual place.  The buttons to save/load and clear drafts are are the bottom of the post box.

As of v1.20.0 - draft settings have their own category in the settings UI.  In addition you can now set to auto-load drafts when you go to post a reply and to auto-save a draft every X minutes.  Default for auto-load is on.  Default of auto-save is 0 (off).

As of v1.21.0 you can now opt to keep a number of manually-created drafts (the default is 3).  If you opt to keep them then there is a new Drafts menu added next to the Snippets one above the post box.  That menu will let you select any of the manually saved drafts as well as the auto-save one.  The Load Draft button will still load the latest draft and the auto-load will still load the latest and the auto-clear will still prevent the last draft being loaded the next time you come to the topic.  However, the auto-clear doesn't clear the history.  For that you need to use the "Clear Draft" button.  It's not as confusing as it sounds when you use it, I promise :)

As of v1.26.0 drafts are now enabled on PMs and should work the same there as posts.

**Quick Filter**
You can now filter topics from the list of topics for a given forum.  Click the leftmost image on the row for the topic.

**Topic Filters**
Another of Nowherewoman's ideas.  This should allow you to either mark, highlight or hide topics that you, for some reason, know that you're not interested in.  In particular it is useful for marking ideas topics as not of you for whatever reason.  There's a new menu item in the Script Settings menu to edit the filters you create and a button at the top/bottom of each topic to add or remove filters.

**Tidy Menus**
A new setting (under "Remove Header and Footer Items") that folds a number of menu items under the 'Home' menu to leave space for more features later on :)

**Add tags when bookmarking**
A new setting (that is on by default).  When you click the bookmark button, this now pops up the tagging box so you can tag the bookmark as you create it.

**Replies Auto-Tag**
This will only work if you have "Show unread replies count?" switched on as well.  What it does is a create a tag that only shows bookmarks with replies.

**Wordcounts for posts**
You can see these in when viewing a topic or when posting a new reply to a topic. You can switch the counts off in the settings.  You will also see a wordcount beneath the box where you type your post (it should update as you type).

**Bookmark Tags**
A new concept.  Trim that bookmark list down to size by applying and using tags :)  Switch it on in the settings menu.

To edit tags for a bookmark, simply click the topic icon on the left of the name of the topic in the bookmarks list.

Tags automatically appear as menu items under the Bookmarks menu.  Click them to see only those bookmarks that have the tag.  

There is an "auto-tag" that allows you to see only topics that you did not post in last (useful for me for 1-on-1 games to see who I owe moves to).  Thus auto-tag can be switched on/off in the settings because I know that there are lots of folks who are more into group games.

**Menu Styling**
v1.9.2 changes the backround of drop-down menus from transparent to white. This is due to longer menus (such as quick topics or snippets if they get long) looking wrong on pages.
v1.9.2 unfortunately broke the snippets menu which is fixed in v1.9.3

**Shoutbox Settings**
It's now possible to select a shoutbox colour to apply to all your shoutbox messages.  The feature is a bit experimental at the moment so treat it with a bit of caution.  One of the options for colour is "random" which selects from a set of random colours (suitable for the default style) every 30 seconds.

In v1.9.1 there is another SB colour setting for the approved box.  You can have both colours the same or different as per your choice :)

**Quick Topic Reply Indicator**
You can now select to see whether one of your quick topics has replies since your last visit to the topic.  That topic will appear with three asterix on either side of it's name in the quick topic menu.  The quick topics settings have now been split off into their own section of the settings.  This feature is on by default.

**Header and Footer Customization**
You can now remove various areas of the header and footer to display things a bit more nicely on short screens (like my laptop).

**Unread PM Link Auto-update**
Similar to the auto-update for the unread replies menu.  The link at the top of the page that displays your mail count (read and unread) can now be set to auto-update.  The default interval is 5 minutes and setting it to 0 switches of the auto-update.

**Unread Replies Menu**
A list of unread replies.. in a menu.  See the title was meaningful.
Unread replies counts and menus are also updated periodically (every 5 minutes by default but you can change that or switch it off in the settings).
As of v1.2.0, the links in this menu go straight to the last post rather than the first.
As of v1.3.0, there is now a button in the button bar at the top of each topic that allows you to ignore replies for that topic such that they will no longer appear in the unread replies menu.  You can select to watch for replies by clicking a button in the same location.

**Unread Replies Count**
New in v1.1.0 - this shows the count of unread replies to your post alongside the link to unread replies in the top right of the screen.  So you don't have to click it to know if you have any :D

**Hide Pictures**
This hides avatars and images in posts.  Why?  I wanted the script to be able to hide them at work so I could use Elliquiy without fear of anyone glancing over and getting too interested in what I was doing.  This now (as of 1.16.0) replaces the images with a white image rather than removing it.  Spoilers containing images don't have the images removed/replaced but rather have a note added to say that they contain images.

**Quick Topics**
Bookmarks by another name... this is a drop-down menu that has links to specific topics.  You can set/remove topics with a new button on the topic button bar.

To be honest I created this before I was aware of the bookmarks feature but I like it better as I like my navigation to be all up there in that menu bar.

**Snippets**
As of version 1.27.1 there's a fix that stops the bottom half of the snippets menu disappearing when there are a lot of entries.

As of version 1.27.0, snippets are now sorted in the menu.  You can also use snippets from within the snippets form (for those folks with so many that they don't fit on the menu).

The ability to store frequently used bits of bbcode/text to be pasted into posts/PMs.  I created this to make it easier to post with a standard character header.  

The UI for managing snippes is improved in v1.8.0 and you can add/edit/delete snippets by clicking on the top level 'Snippets' menu.

The UI has further improvements in v1.17.0 with the snippets menu being moved to the right of the edit box toolbar.  An additional Snippets entry has been added to the Script Settings menu to allow quick access to edit/add/delete snippets.
