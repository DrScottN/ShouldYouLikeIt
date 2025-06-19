// contentScript.js
(function () {
  //CHANGE THESE TO TASTE
  const CHECK_INTERVAL_MS = 10000; // check every 10 seconds

  // Identifies which youtube elements should be valid querySelector argument strings. If you never get interrupted, this is what broke.
  let buttonQueries = ['button[title="Share"]:not([aria-haspopup])', 'button[title="I like this"]', 'button[aria-label="Comment"]'];
  
  // Choose the probability of getting a popup.
  let probabilityInterrupt = 1.0;

  // Possible prompts for an interaction. Taken from: https://yalebooks.yale.edu/2019/03/15/six-tips-for-avoiding-misinformation-on-social-media/
  //    https://ethicalleadership.nd.edu/thought-leadership/how-to-stop-the-spreadof-misinformation
  //    https://youtu.be/rR7j11Wpjiw?si=tKVDebm13OtDEIUP
  //    https://youtu.be/Be-A-sCIMpg?si=gy_zMkcOcGtYwykA
  //    
  // phrased so that yes means 'go ahead and engage with it'
  let likePrompts = ["Did you really enjoy this video?", 
    "Do you know who was the source of the main information in this video, and do you trust them?",
    "Have you already seen a second perspective on the main topic?",
    "Do you know why the source of the main information in this video found/made that information?"
    "Did they provide evidence for their claims, and if so was that evidence relevant?"
    "Did this video challenge your existing beliefs?",
    "If the video contained new scientific results, have they been replicated?",
    "If the video contained scientific content, were the main points backed by more than one study?",
    "Are you confident the information in this video is true?",
    "Are you familiar with common misinformation about this topic?",
    "If there are other relevant stories about these characters, is the story in this video equally important?",
    "Were you paying attention for the whole video?",
    "Has there been enough time to verify this story carefully?"];
  
  // We use a flag to avoid infinite loops when we re-trigger the click
  let skipNextClick = false;

  // empty lists for button management. Prevents multiple popups on one button press.
  let buttonList = Array.apply(null, Array(buttonQueries.length));
  let lastButtonList = Array.apply(null, Array(buttonQueries.length));


  function checkLiteracy (thisButton) { return (event) => {
      // If we’re skipping this click because the user already confirmed, do nothing
      if (skipNextClick) {
        skipNextClick = false;
        // console.log("skip");
        return;
      }
      // console.log("interrupt function called on" + thisButton);
  
      // Otherwise, stop the default action and show a confirmation dialog
      // console.log(event.cancelable)
      event.preventDefault();
      event.stopPropagation();
  

      const randomPrompt = likePrompts[Math.floor(Math.random() * likePrompts.length)];

      const userConfirmed = confirm(randomPrompt); //("Are you sure you want to Engage with this video?");
      if (userConfirmed) {
        // Allow the next click to go through
        // console.log("pushed");
        skipNextClick = true;
        thisButton.click(); // seems to fire twice?
        return;
      }
      else {
        // console.log("no push");
        return;
      }
    }
  }

  function addEngageInterceptor() { // Example selector that often matches the like/share/comment button in YouTube's layout// (You may need to adjust this if YouTube changes their markup.)
    // const likeButton = document.querySelector('ytd-toggle-button-renderer[is-icon-button][class^="style-scope"] button');
    for (let i = 0; i < buttonQueries.length; i++){
      const thisButton = document.querySelector(buttonQueries[i]);
      const lastThisButton = lastButtonList[i];
      if (thisButton && thisButton !== lastThisButton && Math.random() <= probabilityInterrupt) {
        lastButtonList[i] = thisButton;
        console.log("new button found " + buttonQueries[i]);
        thisButton.addEventListener("click", checkLiteracy(thisButton), true); //this last 'true' sets the listener to capture, so events don't get bubbled from child elements.
      }
    }
  }
  // Periodically check if the Like button exists (helpful on pages where
  // YouTube dynamically updates the DOM).
  setInterval(() => {addEngageInterceptor();}, CHECK_INTERVAL_MS);
})();