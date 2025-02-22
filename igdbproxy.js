export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                status: 204
            });
        }

        try {
            const { query } = await request.json();

            const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: env.IGDB_CLIENT_ID,
                    client_secret: env.IGDB_CLIENT_SECRET,
                    grant_type: 'client_credentials'
                })
            });

            const tokenData = await tokenResponse.json();

            if (!tokenData.access_token) {
                throw new Error('Failed to get access token');
            }

            const igdbResponse = await fetch('https://api.igdb.com/v4/games', {
                method: 'POST',
                headers: {
                    'Client-ID': env.IGDB_CLIENT_ID,
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'text/plain'
                },
                body: query
            });

            if (!igdbResponse.ok) {
                const errorText = await igdbResponse.text();
                throw new Error(`IGDB API error: ${errorText}`);
            }

            const data = await igdbResponse.json();

            return new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
};