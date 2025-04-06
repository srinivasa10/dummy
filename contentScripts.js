```javascript
// contentScript.js (runs in actual GitHub tab)

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
/**
* Handle the "scrapeRepoDetails" action.
* This function scrapes the repository details from the current GitHub page.
* It extracts the repository name, description, and full page text.
*/
if (message.action === "scrapeRepoDetails") {
let repoData = {};

// Check if the current page is a GitHub repository page
if (!document.location.hostname.includes("github.com")) {
// If not, send an error response and return
sendResponse({ error: "This is not a GitHub repository page." });
return true;
}

// Extract the repository name from the page
let repoNameElem = document.querySelector('strong[itemprop="name"] a');
repoData.name = repoNameElem ? repoNameElem.innerText.trim() : "Unknown Repo";

// Extract the repository description from the page
let descElem = document.querySelector('meta[name="description"]');
repoData.description = descElem ? descElem.content.trim() : "No description available.";

// Extract the full page text
repoData.fullText = document.body.innerText;

// Send the extracted repository data as a response
sendResponse(repoData);
}

/**
* Handle the "codesummarize" action.
* This function extracts the code from the current GitHub page.
*/
if (message.action === "codesummarize") {
// Initialize an array to store the code lines
let codeLines = [];

// Extract the code lines from the page
document.querySelectorAll(".application-main ").forEach(line => {
codeLines.push(line.innerText);
});

// Join the code lines into a single string
let codeText = codeLines.join("\n");

// Check if any code was found
if (!codeText) {
// If not, display a message indicating no code was found
analysisContent.innerText = "No code found on this page.";
return;
}

// Send the extracted code as a response
sendResponse(codeText);
}

/**
* Handle the "aihuman" action.
* This function is similar to the "scrapeRepoDetails" action.
* It extracts the repository details from the current GitHub page.
*/
if (message.action === "aihuman") {
let repoData = {};

// Check if the current page is a GitHub repository page
if (!document.location.hostname.includes("github.com")) {
// If not, send an error response and return
sendResponse({ error: "This is not a GitHub repository page." });
return true;
}

// Extract the repository name from the page
let repoNameElem = document.querySelector('strong[itemprop="name"] a');
repoData.name = repoNameElem ? repoNameElem.innerText.trim() : "Unknown Repo";

// Extract the repository description from the page
let descElem = document.querySelector('meta[name="description"]');
repoData.description = descElem ? descElem.content.trim() : "No description available.";

// Extract the full page text
repoData.fullText = document.body.innerText;

// Send the extracted repository data as a response
sendResponse(repoData);
}

/**
* Handle the "pr_analysis" action.
* This function extracts the repository URL from the current GitHub page.
*/
if (message.action === "pr_analysis") {
// Extract the repository information from the page URL
const repoInfo = window.location.pathname.split("/");

// Check if the repository information was extracted successfully
if (repoInfo.length < 3) {
// If not, display an alert indicating the repository details could not be detected
alert("Unable to detect repository details.");
return;
}

// Extract the repository owner and name
const owner = repoInfo[1];
const repo = repoInfo[2];

// Construct the repository URL
const repoUrl = `https://github.com/${owner}/${repo}`;

// Send the repository URL as a response
sendResponse(repoUrl);
}

/**
* Handle the "autocomments" action.
* This function extracts the repository information from the current GitHub page.
*/
if (message.action === "autocomments") {
// Extract the repository information from the page URL
const repoInfo = window.location.pathname.split("/");

// Check if the repository information was extracted successfully
if (repoInfo.length < 3) {
// If not, display an alert indicating the repository details could not be detected
alert("Unable to detect repository details.");
return;
}

// Send the repository information as a response
sendResponse(repoInfo);
}
});
```