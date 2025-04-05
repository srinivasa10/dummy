```javascript
/**
* This script is designed to automatically generate a commit message based on the diff of a GitHub commit.
* It waits for the commit input field to be available, extracts the diff, and then sends a request to a local server to generate a commit message.
*/

(async function () {
/**
* Waits for an input element with the specified selector to be available in the DOM.
* @param {string} selector - The CSS selector of the input element to wait for.
* @param {number} [timeout=10000] - The maximum time in milliseconds to wait for the input element.
* @returns {Promise<HTMLInputElement>} A promise that resolves with the input element when it becomes available.
*/
function waitForInput(selector, timeout = 10000) {
return new Promise((resolve, reject) => {
const startTime = Date.now();
const interval = setInterval(() => {
const input = document.querySelector(selector);
console.log("⏳ Looking for input...");
if (input) {
clearInterval(interval);
console.log("✅ Found input:", input);
resolve(input);
} else if (Date.now() - startTime > timeout) {
clearInterval(interval);
console.warn("❌ Still no input. Dumping inputs on page:");
console.log([...document.querySelectorAll('input')]);
reject(new Error("Input not found in time"));
}
}, 500);
});
}

try {
/**
* Gets the commit input element and extracts the diff from the page.
*/
const commitInput = await waitForInput('#commit-message-input');
const diffText = extractDiff();
if (!diffText) {
console.warn("⚠️ No diff extracted.");
return;
}

/**
* Creates a new button element to trigger the auto-generate commit message functionality.
*/
const button = document.createElement('button');
button.textContent = "✍️ Auto Generate Message";
button.style = `
margin-top: 10px;
background-color: #2da44e;
color: white;
padding: 6px 12px;
border: none;
border-radius: 6px;
font-size: 14px;
cursor: pointer;
`;

commitInput.parentElement.appendChild(button);

/**
* Handles the click event of the auto-generate button.
* Generates a commit message based on the diff and updates the commit input field.
*/
button.onclick = async () => {
button.disabled = true;
button.textContent = "⏳ Generating...";
const generatedMessage = await getCommitMessage(diffText);
commitInput.value = generatedMessage;
button.textContent = "✅ Message Generated!";
setTimeout(() => {
button.textContent = "✍️ Auto Generate Message";
button.disabled = false;
}, 2000);
};

} catch (error) {
console.warn("⚠️ Could not find commit input:", error);
}

/**
* Extracts the diff from the page by selecting all added and removed lines.
* @returns {string} The extracted diff as a string.
*/
function extractDiff() {
const added = [...document.querySelectorAll('.blob-code-addition')].map(el => '+ ' + el.textContent.trim());
const removed = [...document.querySelectorAll('.blob-code-deletion')].map(el => '- ' + el.textContent.trim());
return [...added, ...removed].join('\n');
}

/**
* Sends a request to a local server to generate a commit message based on the provided diff.
* @param {string} diffText - The diff to generate a commit message for.
* @returns {Promise<string>} A promise that resolves with the generated commit message.
*/
async function getCommitMessage(diffText) {
try {
const response = await fetch('http://localhost:5000/generate_commit_message', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ diff: diffText })
});
const data = await response.json();
return data.commit_message || "Generated message error.";
} catch (err) {
console.error("❌ Error fetching commit message:", err);
return "Error generating commit message.";
}
}
})();
```