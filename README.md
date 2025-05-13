# Prime Gaming Ratings Chrome Extension

## Overview

This Chrome extension enhances your Amazon Prime Gaming experience by displaying game ratings on the Prime Gaming website. It fetches and displays ratings from the IGDB (Internet Games Database) for each game available on Prime Gaming, helping users make informed decisions about which games to claim and play.

## Features

- **Automatic Detection**: Identifies game titles on the Prime Gaming website and fetches their corresponding ratings from IGDB.  
- **Rating Display**: Shows the IGDB rating prominently next to each game title.  
- **User-Friendly Interface**: Seamlessly integrates with the existing Prime Gaming layout for a native feel.  

## Installation

1. **Clone or Download**: Clone this repository or download the source code as a ZIP file.  
2. **Open Chrome Extensions**: Open Chrome and navigate to `chrome://extensions/`.  
3. **Enable Developer Mode**: Toggle the "Developer mode" switch in the top right corner.  
4. **Load Unpacked Extension**: Click "Load unpacked" and select the directory containing the extension files.  

## Configuration

Before using the extension, you need to set up an API proxy to access IGDB data:

1. **Set Up IGDB Proxy**: Due to CORS restrictions, a server-side proxy is required to fetch data from IGDB. The provided `igdbproxy.js` script is designed to be deployed as a Cloudflare Worker.  
2. **Obtain IGDB API Credentials**: Sign up on [IGDB](https://api.igdb.com/) to get your API credentials.  
3. **Deploy the Cloudflare Worker**:  
   - Log into your [Cloudflare Workers dashboard](https://workers.cloudflare.com/).  
   - Create a new Worker and replace the default script with the contents of `igdbproxy.js`.  
   - Deploy the Worker and copy the provided URL.  
4. **Set Environment Variables**: Configure the following environment variables for your Cloudflare Worker to authenticate with the IGDB API:  
   - `IGDB_CLIENT_ID`  
   - `IGDB_CLIENT_SECRET`  

5. **Update Extension Configuration**:  
   Modify the following files to point to your deployed Cloudflare Worker URL:  
   - `popup.js`  
   - `manifest.json`  

## Usage

1. **Navigate to Prime Gaming**: Go to the [Prime Gaming website](https://gaming.amazon.com/).  
2. **View Game Ratings**: As you browse available games, the extension will display IGDB ratings.  

## Files Description

- `manifest.json`: Defines the extension's properties, permissions, and scripts.  
- `popup.js`: Manages the logic for the popup, including communication with the IGDB proxy.  
- `content.js`: Injects scripts into the Prime Gaming page to extract game titles and display ratings.  
- `igdbproxy.js`: JavaScript code designed to be deployed as a Cloudflare Worker for IGDB API communication.  
- `popup.html`: The HTML structure for the extension's popup interface.  
- `styles.css`: Contains styling rules for the extension's UI elements.  

## Dependencies

- [IGDB API](https://api.igdb.com/): Provides game ratings and information.  
- [Cloudflare Workers](https://workers.cloudflare.com/): Required to run the IGDB proxy.  

## Privacy

This extension does not collect or store any personal data. It processes the current page's game titles to fetch publicly available ratings from IGDB.  

## Disclaimer

This extension is not affiliated with or endorsed by Amazon, Prime Gaming, or IGDB.  

## Support

For issues, feature requests, or contributions, please open an issue or pull request in this repository.
