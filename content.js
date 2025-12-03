console.log("Content script is running");

function getGameTitle() {
    const title = document.querySelector("title")?.innerText || '';
    const primeMatch = title.match(/Amazon Luna - (.+)/);
    if (primeMatch) return primeMatch[1];

    const gameTitle = document.querySelector('h1')?.innerText || '';
    if (gameTitle) return gameTitle;

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