```javascript
// Create and style the floating Analyze Code button
(function() {
// Create and style the floating Analyze Code button
let analysisButton = document.querySelector('[data-feature="repo-summary"]');
console.log(analysisButton);

// Create modal container for the code analysis result and controls
let modal = document.createElement("div");
modal.id = "analysisModal";
modal.style.position = "fixed";
modal.style.top = "50%";
modal.style.left = "50%";
modal.style.transform = "translate(-50%, -50%)";
modal.style.width = "100%";
modal.style.maxWidth = "600px";
modal.style.backgroundColor = "#0d1117";
modal.style.border = "1px solid #30363d";
modal.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.5";
modal.style.padding = "20px";
modal.style.zIndex = "10001";
modal.style.display = "none";
// document.body.style.overflow = "hidden";
modal.style.overflowY = "auto";
modal.style.maxHeight = "100%";
modal.style.color = " #c9d1d9";

// Create close button for modal
let closeButton = document.createElement("span");
closeButton.innerText = "✖";
closeButton.style.position = "absolute";
closeButton.style.top = "10px";
closeButton.style.right = "15px";
closeButton.style.cursor = "pointer";
closeButton.style.fontSize = "20px";
modal.appendChild(closeButton);

// Create language selector
let languageSelect = document.createElement("select");
languageSelect.id = "codeLanguageSelect";
languageSelect.style.marginBottom = "10px";
languageSelect.style.padding = "5px";
// Define available languages (expand as needed)
const LANGUAGES = {
"en": "English",
"hi": "Hindi",
"te": "telugu",
"ta": "Tamil",
"ml": "Malayalam"
};
for (const code in LANGUAGES) {
let option = document.createElement("option");
option.value = code;
option.innerText = LANGUAGES[code];
languageSelect.appendChild(option);
}
modal.appendChild(languageSelect);

// Create Generate Code Analysis button
let generateButton = document.createElement("button");
generateButton.innerText = "Generate Code Analysis";
generateButton.style.marginBottom = "10px";
generateButton.style.padding = "8px 12px";
generateButton.style.cursor = "pointer";
modal.appendChild(generateButton);

// Create content container inside modal for the analysis text
let analysisContent = document.createElement("div");
analysisContent.id = "analysisContent";
modal.appendChild(analysisContent);

document.body.appendChild(modal);

// Function to close modal when clicking the close button
closeButton.addEventListener("click", function() {
// Hide the modal when the close button is clicked
modal.style.display = "none";
});

// Function to show modal when Analyze Code button is clicked
analysisButton.addEventListener("click", () => {
// Clear previous content and display the modal
document.getElementById("analysisContent").innerText = "";
analysisContent.style.fontSize = "1.2rem";
analysisContent.style.lineHeight = "1.6";
analysisContent.style.fontWeight = "500";
modal.style.display = "block";
});

// Function to handle Generate Code Analysis button click
generateButton.addEventListener("click", async () => {
// Display a message while generating code analysis
analysisContent.innerText = "Generating code analysis...";

// Get selected language
let selectedLang = document.getElementById("codeLanguageSelect").value;

// Function to extract code from the page
getGitHubRepoDetailsFromTab(async (codeText) => {
if (codeText.error) {
// Display error message if code extraction fails
commentContent.innerText = data.error;
return;
}

// Prepare data for code analysis
let data = {
code: codeText,
language: selectedLang
};

console.log("Extracted Code for Analysis:", data);

try {
// Send request to backend for code analysis
let response = await fetch("http://localhost:5000/analyze_code", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data)
});
// Get result from backend and display it
let result = await response.json();
analysisContent.innerHTML = result.summary;
} catch (error) {
// Display error message if backend request fails
analysisContent.innerText = "Error contacting backend: " + error.message;
}
});
});
})();
```