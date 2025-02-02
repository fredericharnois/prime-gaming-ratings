console.log("Content script is running");

function getGameTitle() {
    const title = document.querySelector("title")?.innerText || '';
    const match = title.match(/Prime Gaming - (.+)/);
    return match ? match[1] : null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTitle") {
        const title = getGameTitle();
        console.log("Found game title:", title);
        sendResponse({ title });
    }
    return true;
});