# ShouldYouLikeIt

A browser extension for practicing and teaching social media literacy.

> [!IMPORTANT]
> (Upload in progress) This project is a proof of concept, and is unlikely to be maintained. Currently only alters YouTube engagement buttons (excluding shorts).

# Introduction

ShouldYouLikeIt is an open-source lightweight chromium browser extension that aims to teach media literacy skills directly on the social media sites you use.
Its main intervention is to prompt you to think about the social media content that you like, share, or interact with.
Prompts are taken from social media literacy campaigns and related psychology research.
With a little practice, hopefully you'll find yourself automatically thinking about these prompts without the extension.

This extension collects no data about you (unlike social media).

# Installation

The folder ShouldYouLikeItExtension is an unpacked extension, and so you can install it on chrome via the instructions [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
Specifically:
- download this folder (or the whole repo!);
- go to chrome://extensions in chrome;
- enable developer mode (a toggle somewhere towards the top of your screen);
- click 'load unpacked';
- navigate to the ShouldYouLikeItExtension folder that you downloaded (possibly inside the repo folder) and select it.

Similar instructions apply to most (?) chromium based browsers.

A notable exception is Firefox. Firefox extensions must be signed. 
You can try this extension temporarily by following the instructions [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing), however it will be removed on restart.
You may also attempt the instructions from [this SO post](https://stackoverflow.com/questions/62237202/firefox-add-ons-how-to-install-my-own-local-add-on-extension-permanently-in-f).

# Configuration

As this is open software (running on fairly simple javascript), you can change how it works!
You can open the file ShouldYouLikeItExtension/youtubeContentScript.js in your favorite text editor (for example, notepad, vscode, or nano).
There are several `let ...` commands at the top of the script, these are the easiest settings to change.

## Changing prompts

One command is `let likePrompts = ["Did you really enjoy this video?", `, which is followed by many more lines of text in quotes followed by commas.
You can delete any of these to remove a prompt from the rotation, or change the text of the prompt to a new prompt.
You can also duplicate one of the middle lines (those not including a `[` or `]`), and edit those to create additional prompts.
These prompts are chosen uniformly at random when you engage with YouTube content.
By default, all prompts will stop you from doing a click if you respond 'cancel' and allow a click to go through if you respond 'ok'.

## Reducing prompt frequency

Another command is `let probabilityInterrupt = 1.0;`. This controls how likely an engagement form is to be interrupted.
A few seconds after you load a social media webpage (and then every few seconds thereafter, see next section), each new engagement button on the page will pick a random number between 0 and 1. If that number is less than probabilityInterrupt, then clicking it (at any future time) will be redirected to a random prompt before it does any social media action.

## Changing listener update frequency

This extension aims to be lightweight. Social media sites are often not; they load slowly and dynamically.
ShouldYouLikeIt checks the social media site every so often to attach 'listeners' to engagement buttons, which then add a confirmation box using the prompts.
The setting `let CHECK_INTERVAL_MS = 10000;` tells the extension how often to look for engagement buttons, the current value corresponds to 10 seconds.
Increase this if the extension is slowing down your experience, decrease it if you are reaching for the interactions before the extension has time to work.

## Adding additional sites

Currently this extension is a proof of concept, with support only for YouTube.
But you can add your own site relatively easily! 
There are three broad steps:
- Find the engagement buttons using your browsers inspector;
- Create a new content script, `XXsocialmediaXXContentScript.js`;
- Update the manifest.json to include your new site.

### Find the engagement buttons

Navigate to a typical content page in your preferred browser (I'll be using chrome). 
Make a list of the engagement buttons you want prompts for.
For each button, right click it on the page and select 'inspect'.
This should open a window panel with far too much information. We're looking for an html element like

`<button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" title="Share" aria-label="Share" aria-disabled="false" style="">`

(This is the YouTube share button.) Note that what you selected may highlight something slightly below (or nested inside of) the button.
We don't need to parse all of this. 
I note that important engagement elements will have an `aria-label` and `aria-disabled="false"` and/or a title (why? These are [common accessability attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)).
Take note of these.

#### Did I find good attributes?

You can test the attributes by using the console in the inspector. 
For the example above, typing `document.querySelector('button[aria-label="Share"]')` should display the html element (the `<button...` stuff) we found earlier.
If it's different, there's a second engagement element somewhere. You could iterate through all matches, pick a different tag to match, or do something fancy with [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).
You can also call `document.querySelector('button[aria-label="Share"]').click()`; if this does something different than when you click on the element in the webpage, then you also need to do something clever with querySelector.

### Create a new content script

Copy youtubeContentScript.js and rename it.
Inside the new file, you need to replace the line ` let buttonQueries = [...`.
Currently it is a list of attribute queries that match youtube engagement buttons (share, like, and comment).
Simple queries should look like `button` followed by `[` and the tag you want to match (with specified value), followed by a `]`. 
Remember all of this should be in single quotes.

You can also change the other configuration settings, as discussed earlier.

### Update manifest

In the manifest file, add a variation of
```
	{
		"matches": ["*://www.SITE.com/*"],
		"js": ["SITEContentScript.js"]
	}
```
to the list of content scripts towards the bottom. Note you need a comma between entries.

### (bonus) Share! 

Make a pull request for your script here, or reach out to tell me how it went!

# Possible future work

This extension is still in early alpha (and may not get much development time). 
Still, there are a few things that would be good to add:
- Support more social media platforms.
- Different prompts for different engagement forms.
- Option for prompts that require a written response, and provide the written response log to the user somehow.
- Automatically replace emotionally charged words in content with more neutral synonyms.
- Ways to intercept or alert the user regarding 'passive' forms of engagement (watch time, mouse-over thumbnails, etc.).
- Add a version to the chrome extension store.
- Add a version to the firefox store.
- Create a version for safari (and other non-chromium based browsers).
- Add an icon.
- Investiage making the configuration options available in browser (seems to require broad file permissions).
- Expand the related materials below.

It may be possible to use NLP to automatically identify which prompts most are relevant for a given content; this would likely not be so lightweight.


# Media literacy (and other related) material

We collect a few of the media literacy resources we've seen and used in building the extension:

[The NY DHSES 2025 literacy toolkit](https://www.dhses.ny.gov/system/files/documents/2025/01/2025-media-literacy-toolkit.pdf)

A teaching resource. Basic definitions, an overview of the problem, and its own list of resources suitable for lesson planning and teaching K-12. 
(Speaking personally, some of the lessons are also fun for adults.)

[Crash Course Media Literacy](https://youtu.be/sPwJ0obJya0?si=fsxB5YvOKSs3iFjM)

A teaching resource. The Crash Course series has created brief videos on a dizzying array of topics, all suitable for classroom use or for self-education. The media literacy series (from 2018) in particular helped inspire this project. Note additional sources in the comments of these videos. 

[Edutopia: evaluating information online](https://www.edutopia.org/blog/evaluating-quality-of-online-info-julie-coiro)

A teaching resource. Basic definitions, lesson outlines, and proposed interventions.

[Cambridge Social Decision-Making Lab](https://www.sdmlab.psychol.cam.ac.uk/]

Research lab webpage. Collects the research products (from videos and op-eds to papers and demos).

[The Triple Check](https://thetriplecheck.org/)

This is a (2020) social media literacy awareness campaign. They produced short videos, tweets targetting misinformation, and collected some news stories from the time.

[Paper: Shifting attention to accuracy can reduce misinformation online](https://osf.io/preprints/psyarxiv/3n9u8_v1)

A research paper finding that nudging people to care about truth, instead of social media metrics, can reduce the odds of them sharing misinformation. Of note, people seem able to tell when a headline is dubious, but that's not the question we ask first when reaching for the share button. See also the (1000+) papers citing this one. (I note in particular [Using LLMs in psych](https://static1.squarespace.com/static/53d29678e4b04e06965e9423/t/6566e06ac95b0b61f8810a99/1701240942374/2023+--+LLMs+psychology.pdf), which suggests using LLMs to create and evaluate mis/disinformation interventions.)

[Article: The chronic growing pains of communicating science online](http://www.science.org/doi/10.1126/science.abo0668?adobe_mc=MCMID%3D80545623092060248759220651474905468684%7CMCORGID%3D242B6472541199F70A4C98A6%2540AdobeOrg%7CTS%3D1644539670)

An opinion piece on accurate scientific reporting online. In particular, arguing that spreading true information requires a change in social media; (science) communicators can't fix this themselves.

[Article: Six tips for avoiding misinformation](https://yalebooks.yale.edu/2019/03/15/six-tips-for-avoiding-misinformation-on-social-media/)

A brief article. Describes several techniques and questions to improve social media literacy. The source of many of the prompts.

[Reel-control on micro-video](https://github.com/darajava/reel-control)

Software. While not explicitly targetted at media literacy, this is another project that aims to directly change how social media interacts with you. Reel-control adds playback features and a progress bar to common micro-media content. (Note: not tested or endorsed.)

#### Acknowledgements
Thanks to OpenAI's o1 model for help with an early version and debugging. 
Code generated from the model was used as a first draft for the extension.
