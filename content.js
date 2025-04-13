```javascript
(async function () {
/**
* Waits for a selector to be available in the DOM, with an optional timeout.
* @param {string} selector - The CSS selector to wait for.
* @param {number} [timeout=10000] - The maximum time to wait in milliseconds.
* @returns {Promise<Element>} A promise that resolves with the selected element.
*/
async function waitForSelector(selector, timeout = 10000) {
return new Promise((resolve, reject) => {
const startTime = Date.now();
const interval = setInterval(() => {
const element = document.querySelector(selector);
if (element) {
clearInterval(interval);
resolve(element);
} else if (Date.now() - startTime > timeout) {
clearInterval(interval);
console.warn(`❌ Could not find selector: ${selector}`);
reject(new Error(`${selector} not found in time`));
}
}, 500);
});
}

try {
const titleInput = await waitForSelector('#pull_request_title');
const bodyTextarea = await waitForSelector('#pull_request_body');

/**
* Extracts the diff text from the current PR.
* @returns {string} The extracted diff text.
*/
const diffText = extractPRDiff();
if (!diffText) {
console.warn("⚠️ No diff extracted for PR.");
return;
}

const button = document.createElement('button');
button.textContent = "✨ Auto Fill PR";
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
titleInput.parentElement.appendChild(button);

button.onclick = async () => {
button.disabled = true;
button.textContent = "⏳ Generating...";
const { title, description } = await getPRDetails(diffText);
titleInput.value = title;
bodyTextarea.value = description;
button.textContent = "✅ Auto Filled!";
setTimeout(() => {
button.textContent = "✨ Auto Fill PR";
button.disabled = false;
}, 2000);
};

} catch (err) {
console.error("💥 Error in auto-fill script:", err);
}

/**
* Extracts the diff text from the current PR by concatenating additions and deletions.
* @returns {string} The extracted diff text.
*/
function extractPRDiff() {
const additions = [...document.querySelectorAll('.blob-code-addition')].map(el => '+ ' + el.textContent.trim());
const deletions = [...document.querySelectorAll('.blob-code-deletion')].map(el => '- ' + el.textContent.trim());
return [...additions, ...deletions].join('\n');
}

/**
* Generates PR details (title and description) based on the provided diff text.
* @param {string} diffText - The diff text to generate PR details from.
* @returns {Promise<{title: string, description: string}>} A promise that resolves with the generated PR details.
*/
async function getPRDetails(diffText){
try {
const response = await fetch('http://localhost:5000/generate_pr_details', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ diff: diffText })
});
const data = await response.json();
return {
title: data.title || "Update PR Title",
description: data.description || "No description generated."
};
} catch (err) {
console.error("❌ Error generating PR details:", err);
return {
title: "Error generating title",
description: "Could not fetch description"
};
}
}
})();
```