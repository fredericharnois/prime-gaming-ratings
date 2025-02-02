document.getElementById("scrape").addEventListener("click", async () => {
    const output = document.getElementById("output");
    output.innerHTML = "<p>Loading...</p>";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            output.innerHTML = "<p>No active tab detected.</p>";
            return;
        }

        const titleResponse = await new Promise((resolve) => {
            chrome.tabs.sendMessage(tab.id, { action: "getTitle" }, (response) => {
                if (chrome.runtime.lastError) {
                    resolve({ title: null });
                } else {
                    resolve(response);
                }
            });
        });

        if (!titleResponse?.title) {
            output.innerHTML = "<p>No game title found on this page.</p>";
            return;
        }

        console.log("Found game title:", titleResponse.title);

        const response = await fetchGameRatings(titleResponse.title);

        if (response.success) {
            const { data: ratings } = response;
            const userRating = ratings.rating ? `${ratings.rating.toFixed(1)}/100` : "Not Available";
            const criticRating = ratings.aggregated_rating ?
                `${ratings.aggregated_rating.toFixed(1)}/100` : "Not Available";

            output.innerHTML = `
                <h2>${titleResponse.title}</h2>
                <p><strong>User Rating:</strong> ${userRating}</p>
                <p><strong>Critic Rating:</strong> ${criticRating}</p>`;
        } else {
            output.innerHTML = `<p>Error: ${response.error || "Unknown error occurred."}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        output.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

async function fetchGameRatings(gameTitle) {
    const clientId = "";
    const clientSecret = "";

    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            {
                action: "fetchGameRatings",
                payload: { clientId, clientSecret, gameTitle },
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    resolve({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    resolve(response);
                }
            }
        );
    });
}