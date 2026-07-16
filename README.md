<img width="423" height="529" alt="Screenshot 2026-07-17 075156" src="https://github.com/user-attachments/assets/7df99592-4c22-4c3f-b27b-bea57c2c2063" />


# G+ Hider

A powerful, highly customizable Tampermonkey userscript that allows you to take control of your Facebook and Instagram browsing experience. Hide the metrics and buttons that you find distracting to enjoy a cleaner, stress-free social media feed.

## Features

With a sleek, built-in floating control panel, you can independently toggle various elements on and off for both Facebook and Instagram without having to refresh the page:

<img width="688" height="640" alt="Screenshot 2026-07-17 075216" src="https://github.com/user-attachments/assets/4bbc028b-7169-409f-91b1-0786dc508152" />
### Instagram Controls
- **Hide Likes & Counts:** Completely removes the heart button and the "likes" / "views" count on standard posts and Reels.
- **Hide Repost:** Hides the "Repost" button (the circular arrows icon), while safely keeping the Share (paper airplane) button intact.
- **Hide Save:** Hides the "Save" (bookmark) button.
- **Hide Comments:** An extremely thorough hider that completely removes the comment bubble button, "View all comments" links, inline replies on the feed, the "Add a comment..." box, and the comment sections inside pop-up modals.




<img width="297" height="135" alt="Screenshot 2026-07-17 075235" src="https://github.com/user-attachments/assets/cfc1ac4d-e5de-4ff9-8f31-48d5ec972bf5" />

### Facebook Controls
- **Hide Like Buttons:** Removes the main "Like" interaction button beneath posts, while preserving your ability to see the smaller reaction icons (like, heart, care) on the post.
- **Hide Like/Reaction Counts:** Removes the numbers and text summarizing how many people liked or reacted to a post.

## Installation

1. Install a userscript manager extension for your browser, such as [Tampermonkey](https://www.tampermonkey.net/).
2. Click on the raw `fbig_like_hider.user.js` file in this repository and Tampermonkey will automatically prompt you to install it.
3. Visit Facebook or Instagram to see the floating control panel in the bottom-left corner.

## Usage

Once installed, you will see a subtle, draggable floating button (with a settings icon) in the bottom-left corner of Facebook and Instagram. 
- Click the button to open the control panel.
- Use the toggle switches to turn specific hiders on or off.
- The changes apply instantly—no page refresh required!
- Your preferences are automatically saved across sessions.

You can also access the toggles directly from your Tampermonkey extension menu in your browser toolbar.

## Disclaimer

This script relies on CSS selectors and DOM structure patterns specific to Facebook and Instagram. If these platforms significantly update their UI, some features might temporarily stop working until the script is updated.

## License

MIT
