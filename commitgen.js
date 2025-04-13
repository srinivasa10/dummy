```javascript
(async function () {
/**
* Waits for an input element to be available in the DOM,
* polls the DOM at regular intervals until the input is found or a timeout is reached.
* @param {string} selector - The CSS selector to use to find the input element.
* @param {number} timeout - The maximum time to wait for the input element to be available.
* @returns {Promise<HTMLInputElement>} A promise that resolves with the input element when it is found.
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
const commitInput = await waitForInput('#commit-message-input');
const diffText = extractDiff();
if (!diffText) {
console.warn("⚠️ No diff extracted.");
return;
}

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
* Handles the click event of the auto generate message button,
* generates a commit message based on the diff text and updates the commit input field.
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
* Extracts the diff text from the page,
* including added and removed lines of code.
* @returns {string} The extracted diff text.
*/
function extractDiff() {
const added = [...document.querySelectorAll('.blob-code-addition')].map(el => '+ ' + el.textContent.trim());
const removed = [...document.querySelectorAll('.blob-code-deletion')].map(el => '- ' + el.textContent.trim());
return [...added, ...removed].join('\n');
}

/**
* Sends a request to the server to generate a commit message based on the provided diff text.
* @param {string} diffText - The diff text to use to generate the commit message.
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