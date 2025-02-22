console.log("Content script is running");

function getGameTitle() {
    // Try Prime Gaming specific title format first
    const title = document.querySelector("title")?.innerText || '';
    const primeMatch = title.match(/Prime Gaming - (.+)/);
    if (primeMatch) return primeMatch[1];

    // Try Amazon Gaming page format
    const gameTitle = document.querySelector('h1')?.innerText || '';
    if (gameTitle) return gameTitle;

    // Try product title format
    const productTitle = document.querySelector('#productTitle')?.innerText?.trim() || '';
    if (productTitle) return productTitle;

    return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTitle") {
        const title = getGameTitle();
        console.log("Found game title:", title);
        sendResponse({ title });
    }
    return true;
});