export default {
    async fetch(request) {
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        const { headers } = request;
        const body = await request.json();

        if (!body.clientId || !body.accessToken || !body.query) {
            return new Response(JSON.stringify({ error: "Invalid request payload" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID": body.clientId,
                "Authorization": `Bearer ${body.accessToken}`,
                "Content-Type": "text/plain"
            },
            body: body.query
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({ error: "Error from IGDB API", details: errorText }), {
                status: response.status,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    },
};