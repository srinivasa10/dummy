(function() {
    // Create and style the Comment button
    const commentCard = document.querySelector('[data-feature="comment-generator"]');
    // Create modal container for the comment result
    let modal = document.createElement("div");
    modal.id = "analysisModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "100vw";
    modal.style.maxWidth = "600px";
    modal.style.backgroundColor = "#0d1117";
    modal.style.border = "1px solid #30363d";
    modal.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.5)";
    modal.style.padding = "20px";
    modal.style.zIndex = "10001";
    modal.style.display = "none";
//document.body.style.overflow = "hidden";
    modal.style.overflowY = "auto";
    modal.style.maxHeight = "100%";
    modal.style.color = "#c9d1d9";
    // Create close button for modal
    let closeButton = document.createElement("span");
    closeButton.innerText = "✖";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "15px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "20px";
    modal.appendChild(closeButton);

    // Create content container inside modal for the comment text
    let commentContent = document.createElement("div");
    commentContent.id = "commentContent";
    commentContent.style.fontSize = "1.2rem";
commentContent.style.lineHeight = "1.6";
commentContent.style.fontWeight = "500";
    modal.appendChild(commentContent);
    document.body.appendChild(modal);

    // Close modal when clicking the close button
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
    let pushButton = document.createElement("button");
pushButton.innerText = "🚀 Push to Repo";
pushButton.style = `margin-top: 12px; background-color: #238636; color: white; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer;`;
modal.appendChild(pushButton);

pushButton.addEventListener("click", async () => {
    //const accessToken = prompt("🔐 Enter your GitHub Access Token:");
    //const filePath = prompt("📄 Enter the path to the file you want to update (e.g., src/index.js):");
    //const branch = prompt("🌿 Enter the branch name (e.g., main):");
    const res = await fetch("http://localhost:5000/get_token", {
        method: "GET",
        credentials: "include"
    });

    if (res.status !== 200) {
        // Not authenticated, redirect to login with current tab as return URL
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `http://localhost:5000/login?next=${returnUrl}`;
        return;
    }
    getGitHubRepoDetailsFromTab2(async (repoData) => {
// ✨ Extract owner and repo from URL
const urlParts = repoData;
const owner1 = urlParts[1];
const repo1 = urlParts[2];
const branch = repoData[4];

        // Join remaining parts as file path
        const filePath = repoData.slice(5).join("/");

        if (!owner1 || !repo1 || !branch || !filePath) {
            alert("❌ Failed to extract repo details.");
            return;
        }

    const payload = {
        owner:owner1,
        repo: repo1,
        file_path: filePath,
        branch,    
        new_content: commentContent.innerText
    };

    const res = await fetch("http://localhost:5000/push_to_repo", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await res.json();
    alert(result.message || "Pushed!");
});
});


    // When the Comment button is clicked
    commentCard.addEventListener("click", async () => {
        commentContent.innerText = "Generating inline comments...";
        modal.style.display = "block";

        // Extract repository details from the page
        getGitHubRepoDetailsFromTab(async (repoData) => {
            if (repoData.error) {
                commentContent.innerText = repoData.error;
                return;
            }
    
        
        console.log("Extracted Repo Data:", repoData);    
        // Send extracted data to backend for comment generation
        try {
            let response = await fetch("http://localhost:5000/generate_comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(repoData)
            });
            let result = await response.json();
            commentContent.innerText = result.output || "No comments generated.";
        } catch (error) {
            commentContent.innerText = "Error contacting backend: " + error.message;
        }
    });
    });

    // Function to extract repository details
    function scrapeRepoDetails() {
        let repoData = {};

        if (!document.location.hostname.includes("github.com")) {
            console.log(document.location.hostname);
            return { error: "This does not appear to be a GitHub repository page." };
        }

        let repoNameElem = document.querySelector('strong[itemprop="name"] a');
        repoData.name = repoNameElem ? repoNameElem.innerText.trim() : "Unknown Repo";
        let descElem = document.querySelector('meta[name="description"]');
        repoData.description = descElem ? descElem.content.trim() : "No description available.";
        repoData.fullText = document.body.innerText;

        return repoData;
    }
    function getGitHubRepoDetailsFromTab(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { action: "scrapeRepoDetails" }, function(response) {
                callback(response);
            });
        });
    }
    
})();
function getGitHubRepoDetailsFromTab2(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "autocomments" }, function(response) {
            callback(response);
        });
    });
}
