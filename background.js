chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchGameRatings") {
        const { clientId, clientSecret, gameTitle } = message.payload;

        const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

        // Step 1: Fetch Access Token
        fetch(tokenUrl, { method: "POST" })
            .then((response) => response.json())
            .then((tokenData) => {
                if (!tokenData.access_token) {
                    throw new Error("Failed to retrieve access token.");
                }

                // Step 2: Use Cloudflare Worker Proxy with improved query
                return fetch("", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clientId,
                        accessToken: tokenData.access_token,
                        query: `search "${gameTitle}"; fields name,aggregated_rating,rating;`  // Send as raw query string
                    }),
                });
            })
            .then((response) => response.json())
            .then((gameData) => {
                console.log("Response from IGDB API:", gameData);

                if (!Array.isArray(gameData) || gameData.length === 0) {
                    console.warn("No data returned from IGDB API.");
                    sendResponse({
                        success: true,
                        data: {
                            name: gameTitle,
                            aggregated_rating: null,
                            rating: null,
                        },
                    });
                    return;
                }

                // Find the best matching game using fuzzy matching
                const matchedGame = gameData.reduce((best, game) => {
                    if (!game?.name) return best;

                    // Convert both titles to lowercase and remove special characters
                    const normalizedGameTitle = gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const normalizedCurrentTitle = game.name.toLowerCase().replace(/[^a-z0-9]/g, '');

                    // Calculate similarity (simple contains check for now)
                    const isMatch = normalizedCurrentTitle.includes(normalizedGameTitle) ||
                        normalizedGameTitle.includes(normalizedCurrentTitle);

                    // If this game has ratings and is a match, prefer it
                    if (isMatch && (game.aggregated_rating || game.rating)) {
                        if (!best || !best.rating) return game;
                        // If both have ratings, prefer the one with both types of ratings
                        if ((game.aggregated_rating && game.rating) && (!best.aggregated_rating || !best.rating)) {
                            return game;
                        }
                    }
                    return best;
                }, null);

                if (!matchedGame) {
                    console.warn("No matching game with ratings found in IGDB.");
                    sendResponse({
                        success: true,
                        data: {
                            name: gameTitle,
                            aggregated_rating: null,
                            rating: null,
                        },
                    });
                } else {
                    console.log("Matched game:", matchedGame);
                    sendResponse({ success: true, data: matchedGame });
                }
            })
            .catch((error) => {
                console.error("Error fetching game ratings:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});