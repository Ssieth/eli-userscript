# Elliquiy Improver

This script is designed to add some extra functionality to Elliquiy.com

The specific features are listed below:

## In the last version
1.40.0: Moved hosting of the script to github to allow for easier collaboration.

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
