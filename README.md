# Video Showcase App - Powered by AO and Arweave

This application demonstrates how to build a dynamic video showcase using Arweave for permanent deployment and AO (Arweave Object Model) for decentralized data storage and retrieval. It features a horizontally scrolling video carousel with content links managed by an AO process.

## Features

- 🎞️ **Video Carousel** - Displays videos from Odysee in an infinitely scrolling marquee.
- ↔️ **Manual Controls** - Allows users to manually scroll the carousel left and right, temporarily pausing the automatic animation.
- 🔗 **Decentralized Video Links** - Utilizes an AO process to store and serve video metadata (titles, embed URLs).
- 🌐 **Permanent Deployment** - Designed to be deployed on Arweave's permaweb for lasting availability.
- 👤 **Wallet Integration** - Uses Arweave Wallet Kit for simple wallet connection (primarily for ArNS name display).
- 📝 **ArNS Integration** - Supports displaying user's primary ArNS name in the navigation bar.

## Technology Stack

- **Frontend**: React + Vite
- **UI Components**: Magic UI (Marquee, manually integrated)
- **Deployment**: ArDrive Turbo SDK (for Arweave deployment)
- **Name System**: AR.IO SDK (for ArNS)
- **Backend Data**: AO Process (Lua) for video links
- **Wallet Connection**: Arweave Wallet Kit

## Prerequisites

- Node.js 18+ (or as required by dependencies)
- pnpm (recommended package manager)
- Arweave wallet (JSON keyfile for deployment and ArNS management)
- Turbo credits for Arweave deployment ([purchase here](https://turbo-topup.com))
- $ARIO tokens for ArNS ([purchase here](https://arns.app))
- AOS installed for AO process management ([installation guide](https://cookbook_ao.arweave.dev/guides/aos/installation.html))

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <YOUR_REPOSITORY_URL> video-showcase-app
cd video-showcase-app
pnpm install
```

### 2. Setting Up the AO Backend Process (Video Links)

#### Create or Identify an AO Process

If you don't have an AO process for this app yet:
```bash
# Initialize a new AO process using AOS
aos create
```
This will output a Process ID. **Save this Process ID**.

#### Load the Video Links Process (`videos.lua`)

1.  The `lua/videos.lua` file in this repository contains the Lua script for storing and serving video links.
2.  Load this script into your AO process:

```bash
aos load <YOUR_PROCESS_ID> ./lua/videos.lua
```

This will set up the `GetVideos` handler in your AO process.

### 3. Configure Your Frontend

Update your AO Process ID for video links in the frontend configuration file `src/config.js`:

```javascript
// src/config.js
export const AO_QUIZ_PROCESS_ID = "Yen2fhG9thwVz2xrC6wdCE8RTr-KIcsIcVZtf43WbtU"; // Example, update or remove if not used
export const AO_VIDEOS_PROCESS_ID = "<YOUR_AO_VIDEOS_PROCESS_ID>"; // Replace with your actual Process ID

export const AO_NODES = [
  "https://ao-testnet.arweave.net",
  "https://cu116.ao-testnet.xyz",
  "https://ao.arweave.dev",
  "https://ao.g8way.io"
];
```

Replace `<YOUR_AO_VIDEOS_PROCESS_ID>` with the actual ID of the process where `videos.lua` is loaded.

### 4. Local Development

```bash
pnpm dev
```

Visit `http://localhost:5173` (or the port specified by Vite) to see your app in action.

## Customizing Videos

The video links and metadata are stored in `lua/videos.lua`. You can modify this file to change:

- The list of videos (IDs, titles, Odysee embed URLs)

After making changes to the `videos.lua` file, reload it to your AO process:

```bash
aos load <YOUR_AO_VIDEOS_PROCESS_ID> ./lua/videos.lua
```

## Deployment to Arweave

### 1. Prepare Your Wallet

1.  Export your wallet JSON file (e.g., from Wander, formerly ArConnect).
2.  Place the wallet JSON file in the root of your project.
3.  Rename it to `wallet.json` (this is the default expected by ArDrive Turbo SDK scripts).

### 2. Build and Deploy

```bash
# Build the application for production
pnpm build

# Deploy to Arweave using ArDrive Turbo SDK
pnpm run deploy 
```

(Assuming you have a `deploy` script in your `package.json` configured for ArDrive Turbo. If not, you'll need to set one up or use the Turbo CLI directly.)

After successful deployment, you'll receive a **Transaction ID** (manifest ID). **Save this ID** for setting up ArNS.

> ⚠️ **Note**: You must have sufficient Turbo credits in your wallet for deployment. Purchase them at [turbo-topup.com](https://turbo-topup.com) if needed.

### 3. Setting Up Your ArNS Name (Optional)

Follow the ArNS documentation and the AR.IO SDK guides to point an ArNS name to your deployed application's manifest ID.
Scripts like those previously in this project for `setBaseArns.js` or `setUndername.js` can be adapted if you have them.

## Understanding the Application Architecture

### Frontend (React/Vite)

-   Displays the video carousel on the landing page.
-   Connects to user wallets (primarily for ArNS name display via AR.IO SDK).
-   Fetches video links from the AO process using `@permaweb/aoconnect`.

### Backend Data (AO Process - `videos.lua`)

-   Stores a list of video objects (ID, title, embed URL).
-   Provides a `GetVideos` handler to return this list as JSON.

### Data Flow

1.  User visits the landing page.
2.  The `VideoCarousel` component fetches video data from the AO process specified in `src/config.js`.
3.  The AO process executes the `GetVideos` handler and returns the list of video links.
4.  The frontend renders the videos in the Magic UI Marquee component.
5.  If a user connects their wallet, the `NavBar` attempts to fetch and display their primary ArNS name.

## Scripts Reference (Example)

Your `package.json` might contain scripts like:

-   `pnpm dev` - Run local development server
-   `pnpm build` - Build for production
-   `pnpm lint` - Lint the codebase
-   `pnpm deploy` - Deploy to Arweave (custom script, needs setup with Turbo SDK)

## Important Notes

-   Your `wallet.json` file contains your private keys - **NEVER commit it to version control**. Ensure it's in your `.gitignore`.
-   ArNS updates can take a few minutes to propagate across the network.
-   Always keep your deployment Transaction IDs (manifest IDs) for reference.
-   $ARIO tokens are required for ArNS operations.
-   Turbo credits are required for deployment to Arweave.

## Troubleshooting

-   **Video Carousel Not Loading Videos**: Check the `AO_VIDEOS_PROCESS_ID` in `src/config.js`. Verify the AO process is running and `videos.lua` is loaded correctly. Check browser console for network errors (CORS, rate limiting from AO gateways).
-   **Deployment Fails**: Check your Turbo credit balance and ensure `wallet.json` is correctly configured.
-   **ArNS Issues**: Verify your ArNS ownership, $ARIO balance, and that the manifest ID is correct.
-   **Wallet Connection Issues**: Ensure a compatible Arweave wallet extension (like Wander) is installed and accessible if testing wallet-specific features beyond basic connection.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

-   [Arweave](https://arweave.org) - Permanent storage layer
-   [AO](https://ao.arweave.dev) - Decentralized compute environment
-   [AR.IO](https://ar.io) - Gateway and name system
-   [ArDrive](https://ardrive.io) - Permanent storage solution
-   [Magic UI](https://magicui.design/) - For the Marquee component inspiration.
