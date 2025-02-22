chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchGameRatings") {
        const { proxyUrl, query } = message.payload;
        const gameTitle = query.split('"')[1]; // Extract game title from query

        fetch(proxyUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ query })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((gameData) => {
                if (!Array.isArray(gameData) || gameData.length === 0) {
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

                const matchedGame = gameData.reduce((best, game) => {
                    if (!game?.name) return best;
                    const normalizedGameTitle = gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const normalizedCurrentTitle = game.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const isMatch = normalizedCurrentTitle.includes(normalizedGameTitle) ||
                        normalizedGameTitle.includes(normalizedCurrentTitle);

                    if (isMatch && (game.aggregated_rating || game.rating)) {
                        if (!best || !best.rating) return game;
                        if ((game.aggregated_rating && game.rating) && (!best.aggregated_rating || !best.rating)) {
                            return game;
                        }
                    }
                    return best;
                }, null);

                if (!matchedGame) {
                    sendResponse({
                        success: true,
                        data: {
                            name: gameTitle,
                            aggregated_rating: null,
                            rating: null,
                        },
                    });
                } else {
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