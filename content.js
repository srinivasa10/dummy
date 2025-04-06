```javascript
// Function to inject the GitLens panel into the current GitHub repository page
// This function is responsible for creating and appending the iframe that contains the GitLens panel
function injectGitLensPanel() {
// Remove any existing GitLens panel to prevent duplicate panels
removeGitLensPanel();

// Add a class to the body element to enable layout adjustments for the GitLens panel
document.body.classList.add('gitlens-enabled');

// Create a new iframe element to serve as the container for the GitLens panel
const iframe = document.createElement('iframe');
iframe.id = 'gitlens-panel-frame';
// Set the source of the iframe to the GitLens panel HTML page
iframe.src = chrome.runtime.getURL('pages/gitlens-panel.html');
// Define the styles for the iframe, including its position, size, and background
iframe.style.cssText = `
position: fixed;
top: 0;
right: 0;
width: 35%;
height: 100vh;
border: none;
z-index: 100;
background: var(--primary-bg, #0d1117);
box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
`;

// Append the iframe to the body element, making it visible on the page
document.body.appendChild(iframe);

// Adjust the layout of the GitHub page to accommodate the GitLens panel
const layout = document.querySelector('.Layout');
if (layout) {
// Set the width of the layout to 65% to make room for the GitLens panel
layout.style.cssText = `
width: 65% !important;
margin-right: 0 !important;
`;
}

// Adjust the header of the GitHub page to fit within the new layout
const header = document.querySelector('.Header');
if (header) {
// Set the width of the header to 65% and reset its left margin
header.style.cssText = `
width: 65% !important;
left: 0 !important;
`;
}
}

// Function to check if the current page is a GitHub repository page
// This function is used to determine whether to inject the GitLens panel
function isGitHubRepoPage() {
// Check if the current hostname is 'github.com' and if the repository content element exists
return window.location.hostname === 'github.com' &&
document.querySelector('.repository-content') !== null;
}

// Function to remove the GitLens panel from the page
// This function is used to clean up when the panel is no longer needed
function removeGitLensPanel() {
// Get a reference to the iframe that contains the GitLens panel
const iframe = document.getElementById('gitlens-panel-frame');
// If the iframe exists, remove it from the page
if (iframe) {
iframe.remove();
}
// Remove the class that enables layout adjustments for the GitLens panel
document.body.classList.remove('gitlens-enabled');

// Reset the layout of the GitHub page to its original state
const layout = document.querySelector('.Layout');
if (layout) {
// Reset the width and margin-right styles of the layout
layout.style.width = '';
layout.style.marginRight = '';
}
}

// Function to initialize the extension
// This function is called when the extension is first loaded
function initialize() {
// Check if the current page is a GitHub repository page
if (isGitHubRepoPage()) {
// If it is, inject the GitLens panel
injectGitLensPanel();
}
}

// Set up a MutationObserver to listen for changes to the page
// This is used to detect when the user navigates to a new page within the GitHub repository
let lastUrl = location.href;
new MutationObserver(() => {
// Get the current URL
const url = location.href;
// If the URL has changed, update the last URL and check if the new page is a GitHub repository page
if (url !== lastUrl) {
lastUrl = url;
// Remove the GitLens panel to clean up
removeGitLensPanel();
// If the new page is a GitHub repository page, inject the GitLens panel
if (isGitHubRepoPage()) {
injectGitLensPanel();
}
}
// Observe the entire document for changes, including subtree and childList changes
}).observe(document, { subtree: true, childList: true });

// Call the initialize function to set up the extension on the initial load
initialize();
```